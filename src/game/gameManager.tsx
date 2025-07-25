import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { writeInitialData } from "../data/writeInitialData";
import type { Action, Character, Item, Room, SaveState, Turn, WorldState } from "../types";
import { getNextTurn } from "../utils/gemini";
import { getAllObjectsFromStore, getObject, putObject } from "../utils/indexedDb";
import {
    deleteItem,
    findCharacterWithItem,
    findRoomWithCharacter,
    findRoomWithItem,
    getAllTurns,
    getCurrentProcessedRooms,
    loadCharacter,
    loadItem,
    loadRoom,
    loadState,
    loadTurn,
    saveCharacter,
    saveItem,
    saveRoom,
    saveState,
    saveTurn,
} from "./storage";

// main game logic, helper hook for context provider
export function useGameHelper() {
	// states to manage the game state
	const [currentTurn, setCurrentTurn] = useState<Turn>();
	const [currentStepIndex, setCurrentStepIndex] = useState(0);
	const [currentMapId, setCurrentMapId] = useState<string>();
	const [currentDay, setCurrentDay] = useState<number>();
	const [currentMusic, setCurrentMusic] = useState<string>();
	const [currentTurnsLeft, setCurrentTurnsLeft] = useState<number>();
	const [currentRoomId, setCurrentRoom] = useState<string>();

	const [isFetchingResponse, setIsFetchingResponse] = useState(false);
	const [isGameInitiating, setIsGameInitLoading] = useState(true);
	const [playerActions, setPlayerActions] = useState<Action[]>([]);
	const [isTurnEnd, setIsTurnEnd] = useState(false);
	const [isTurnEndHandling, setIsTurnEndHandling] = useState(false);
	const [npcActions, setNpcActions] = useState<Record<string, string>>();
	const [eventSummary, setLastTurnEventSummary] =
		useState<Record<string, string>>();
	const [lastProcessedTurnId, setLastProcessedTurnId] = useState<number>(0);
	const [isGameOver, setIsGameOver] = useState(false);
	// convenience derived variables
	const currentStep =
		currentTurn && currentTurn.type === "game"
			? currentTurn.steps[currentStepIndex]
			: null;
	// music related
	const musicPlayer = useRef(new Audio());

	// start the game and load the initial game state info
	useEffect(() => {
		async function init() {
			try {
				// If no save state exists, create an initial one.
				if (!loadState()) {
					await writeInitialData();
				}

				// Load the current save state on game load
				const currentSaveState = loadState();
				if (!currentSaveState || !currentSaveState.currentTurnId) {
					alert(
						"Failed to initialise game: save state not found. Please refresh the page.",
					);
					return;
				}
				setCurrentStepIndex(currentSaveState.currentStepIndex);
				setCurrentMapId(currentSaveState.currentMapId);
				setCurrentDay(currentSaveState.currentDay);
				setCurrentTurnsLeft(currentSaveState.currentTurnsLeft);
				setCurrentMusic(currentSaveState.currentMusic);
				setCurrentRoom(currentSaveState.currentRoomId);
				setLastProcessedTurnId(
					currentSaveState.lastProcessedTurnId || 0,
				);
				if (currentSaveState.currentMusic) {
					musicPlayer.current.loop = true;
					musicPlayer.current.src = currentSaveState.currentMusic;
					musicPlayer.current.play();
				}
				setIsGameInitLoading(false);

				const currentTurn = await loadTurn(
					currentSaveState.currentTurnId,
				);
				setCurrentTurn(currentTurn);
			} catch (error) {
				alert("Error initialising game: " + error);
				console.error(error);
			}
		}
		init();
		return () => {
			// Cleanup: stop any music that might be playing when the component unmounts.
			if (musicPlayer.current) {
				musicPlayer.current.pause();
			}
		};
	}, []);

	const advanceTurn = useCallback(async () => {
		if (!currentTurn) return;
		const nextTurn = await loadTurn(currentTurn.id + 1);
		if (!nextTurn) {
			alert("No next turn found. Please check your game data.");
			return;
		}
		setIsTurnEnd(false);
		setCurrentTurn(nextTurn);
		setCurrentStepIndex(0);
	}, [currentTurn]);

	async function saveDailyState(day: number) {
		const rooms = await getAllObjectsFromStore("rooms");
		const characters = await getAllObjectsFromStore("characters");
		const items = await getAllObjectsFromStore("items");
		const saveState = loadState();
		if (!saveState) return;

		const dailySave = {
			id: day,
			rooms,
			characters,
			items,
			saveState: { ...saveState, lastProcessedTurnId: 0 },
		};

		await putObject("dailySaves", dailySave);
	}

	async function retryFromLastSave() {
		if (!currentDay) return;
		const dailySave = await getObject<{
			id: number,
			rooms: Room[],
			characters: Character[],
			items: Item[],
			saveState: SaveState
		}>("dailySaves", currentDay);

		if (!dailySave) {
			alert("No save found for the current day.");
			return;
		}

		await Promise.all(dailySave.rooms.map(room => saveRoom(room)));
		await Promise.all(dailySave.characters.map(char => saveCharacter(char)));
		await Promise.all(dailySave.items.map(item => saveItem(item)));
		saveState(dailySave.saveState);

		window.location.reload();
	}

	// handle turns
	useEffect(() => {
		if (currentTurn?.type === "map") {
			setCurrentMapId(currentTurn.newMapId);

			advanceTurn();
		} else if (currentTurn?.type === "time") {
			if (currentTurn.newDay) {
				setCurrentDay(currentTurn.newDay);
				saveDailyState(currentTurn.newDay);
			}
			if (currentTurn.newTurnLimit) {
				setCurrentTurnsLeft(currentTurn.newTurnLimit);
			}

			advanceTurn();
		} else if (currentTurn?.type === "game") {
			setCurrentTurnsLeft((prev) => {
				if (!prev) return prev;
				return prev - 1;
			});
			setLastTurnEventSummary(currentTurn.roomsEventSummary);
		}
	}, [advanceTurn, currentTurn]);

	useEffect(() => {
		if (
			currentTurn?.type === "game" &&
			currentStepIndex === currentTurn?.steps.length - 1
		) {
			setIsTurnEnd(true);
		} else {
			setIsTurnEnd(false);
		}
	}, [currentTurn, currentStepIndex, currentStep?.type]);

	// play music based on location
	useEffect(() => {
		if (currentMapId === "Heaven") {
			if (currentMusic !== "birds-ambience.mp3") {
				musicPlayer.current.src = "/birds-ambience.mp3";
				musicPlayer.current.play();
				setCurrentMusic("birds-ambience.mp3");
			}
		}
	}, [currentMapId, currentMusic]);

	const handleTurnEnd = useCallback(async () => {
		if (!currentTurn || currentTurn.type !== "game") return;
		if (currentTurn.id <= lastProcessedTurnId) return;
		setIsTurnEndHandling(true);


		if (currentTurn.charactersMove) {
			// handle character movement
			for (const move of currentTurn.charactersMove) {
				// Find the original room of the character
				try {
					const originalRoom = await findRoomWithCharacter(move.id);
					// Update the character's room
					originalRoom.charactersIdList =
						originalRoom.charactersIdList?.filter(
							(id) => id !== move.id,
						);
					// Load the new room where the character is moving
					const newRoom = await loadRoom(move.newRoomId);
					// Add the character to the new room
					newRoom.charactersIdList = [
						...(newRoom.charactersIdList || []),
						move.id,
					];
					// Update the character's grid position if specified
					if (move.newGridPosition) {
						const character = await loadCharacter(move.id);
						if (character) {
							character.gridPosition = move.newGridPosition;
						}
					}
					// Save the updated rooms
					await saveRoom(originalRoom);
					await saveRoom(newRoom);
				} catch (error) {
					console.log(error);
				}
			}
		}
		if (currentTurn.charactersChanges) {
			// handle character changes
			for (const newCharacter of currentTurn.charactersChanges) {
				try {
					const character = await loadCharacter(newCharacter.id);
					// Update the character's properties
					await saveCharacter({
						...newCharacter,
						itemsIdList: character.itemsIdList,
					});
				} catch (error) {
					console.log(error);
				}
			}
		}
		if (currentTurn.itemsMove) {
			for (const move of currentTurn.itemsMove) {
				// Find the original room of the character
				let originalRoom;
				let originalCharacter;
				try {
					originalRoom = await findRoomWithItem(move.id);
					if (originalRoom) {
						// Update the item's room
						originalRoom.itemsIdList =
							originalRoom.itemsIdList?.filter(
								(id) => id !== move.id,
							);
					}
				} catch (error) {
					console.log("false alarm: " + error);
				}

				try {
					originalCharacter = await findCharacterWithItem(move.id);
					if (originalCharacter) {
						// Remove the item from the character's items list
						originalCharacter.itemsIdList =
							originalCharacter.itemsIdList?.filter(
								(id) => id !== move.id,
							);
						await saveCharacter(originalCharacter);
					}
				} catch (error) {
					console.log("false alarm: " + error);
				}

				let newRoom;
				let newCharacter;

				if (move.newRoomId) {
					newRoom = await loadRoom(move.newRoomId);
					// Add the items to the new room
					newRoom.itemsIdList = [
						...(newRoom.charactersIdList || []),
						move.id,
					];
				}
				if (move.newCharacterId) {
					newCharacter = await loadCharacter(move.newCharacterId);
					// Add the item to the new character's items list
					newCharacter.itemsIdList = [
						...(newCharacter.itemsIdList || []),
						move.id,
					];
					await saveCharacter(newCharacter);
				}
				// Update the character's grid position if specified
				if (move.newGridPosition) {
					const item = await loadItem(move.id);
					if (item) {
						item.gridPosition = move.newGridPosition;
					}
				}
				// Save the updated rooms
				if (originalRoom) {
					await saveRoom(originalRoom);
				}
				if (originalCharacter) {
					await saveCharacter(originalCharacter);
				}
				if (newCharacter) {
					await saveCharacter(newCharacter);
				} else if (newRoom) {
					await saveRoom(newRoom);
				}
			}
		}
		if (currentTurn.itemsChanges) {
			// handle item changes
			for (const newItem of currentTurn.itemsChanges) {
				const { newRoomId, newCharacterId, ...newItemCleaned } =
					newItem;

				if (newCharacterId) {
					// If the item is moving to a new character, find the character and update it
					try {
						const character = await loadCharacter(newCharacterId);
						character.itemsIdList = [
							...(character.itemsIdList || []),
							newItemCleaned.id,
						];
						await saveCharacter(character);
					} catch (error) {
						console.log(
							"Error updating item in character: " + error,
						);
					}
				} else if (newRoomId) {
					// If the item is moving to a new room, find the room and update it
					try {
						const room = await loadRoom(newRoomId);
						room.itemsIdList = [
							...(room.itemsIdList || []),
							newItemCleaned.id,
						];
						await saveRoom(room);
					} catch (error) {
						console.log("Error updating item in room: " + error);
					}
				}
				// Update the item's properties
				await saveItem({
					...newItem,
				});
			}
		}
		if (currentTurn.itemsDeleted) {
			// handle item deletions
			for (const itemId of currentTurn.itemsDeleted) {
				try {
					const item = await loadItem(itemId);
					console.log("Deleting item: ", item);
				} catch (error) {
					console.log("Item not found: " + error);
					continue; // Skip to the next item if not found
				}
				await deleteItem(itemId);
				try {
					const character = await findCharacterWithItem(itemId);
					character.itemsIdList = character.itemsIdList?.filter(
						(id) => id !== itemId,
					);
					await saveCharacter(character);
				} catch (error) {
					console.log(error);
				}
				try {
					const room = await findRoomWithItem(itemId);
					room.itemsIdList = room.itemsIdList?.filter(
						(id) => id !== itemId,
					);
					await saveRoom(room);
				} catch (error) {
					console.log(error);
				}
			}
		}

		setNpcActions(currentTurn.nextTurnNpcActions);

		setLastProcessedTurnId(currentTurn.id);
		setIsTurnEndHandling(false);
	}, [currentTurn, lastProcessedTurnId]);

	useEffect(() => {
		if (isTurnEnd) {
			console.log("called");
			handleTurnEnd();
		}
	}, [isTurnEnd, handleTurnEnd]);

	// function to load next turn
	// can only advance story if there is a next step, return true if the player action is needed to advance the story
	async function advanceStory() {
		if (!currentTurn || currentTurn.type !== "game") return;

		const nextIndex = currentStepIndex + 1;

		if (nextIndex < currentTurn.steps.length) {
			setCurrentStepIndex(nextIndex);
			return;
		} 
	}

	async function submitPlayerAction() {
		if (!currentMapId || !currentRoomId || !currentTurn) return;
		setIsFetchingResponse(true);

		const processedRooms = await getCurrentProcessedRooms(currentMapId);
		const turnHistory = await getAllTurns();
		const excludedStepTypes = ["animation", "choice"];
		const cleanTurnHistory = turnHistory.map((turn) => {
			// If it's not a game turn, we don't need to change it at all
			if (turn.type !== "game") {
				return turn;
			}

			// For game turns, transform the steps
			const transformedSteps = turn.steps
				// 1. First, filter out the unwanted step types
				.filter((step) => !excludedStepTypes.includes(step.type))
				// 2. THEN, map over the remaining steps to strip the 'id'
				.map((step) => {
					// Use destructuring to pull out the 'id' and collect the 'rest' of the properties.
					// 'id: _' tells TypeScript/ESLint that we are intentionally not using the 'id' variable.
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const { id: _, ...stepWithoutId } = step;
					return stepWithoutId;
				});

			// Return a new turn object with the transformed steps
			return {
				...turn,
				steps: transformedSteps,
			};
		});
		console.log("Cleaned turn history:", cleanTurnHistory);

		const worldState: WorldState = {
			mapId: currentMapId,
			day: currentDay || 1,
			turnsLeft: currentTurnsLeft || 0,
			rooms: processedRooms,
			currentRoomId,
			npcActions: npcActions || {},
		};
		const isSus =
			currentTurn.type === "game" &&
			currentTurn.steps.some(
				(step) =>
					step.type === "animation" && step.animationId === "hold-it",
			);
		const nextTurn = await getNextTurn(
			worldState,
			cleanTurnHistory,
			playerActions,
			isSus,
		);
		if (nextTurn.type === "game") {
			nextTurn.id = currentTurn.id + 1; // Ensure the next turn has the correct ID
			nextTurn.steps.forEach((step) => {
				step.id = uuidv4();
			});
		}
		console.log("Next turn:", nextTurn);
		saveTurn(nextTurn);

		setIsFetchingResponse(false);
		advanceTurn();
	}

	// handle save state on exit
	const latestSaveState = useRef<SaveState>({
		currentTurnId: currentTurn?.id,
		currentStepIndex,
		currentMapId,
		currentDay,
		currentTurnsLeft,
		currentMusic,
		lastProcessedTurnId,
	});
	useEffect(() => {
		latestSaveState.current = {
			currentTurnId: currentTurn?.id,
			currentStepIndex,
			currentMapId,
			currentDay,
			currentTurnsLeft,
			currentMusic,
			currentRoomId: currentRoomId,
			lastProcessedTurnId,
		};
	});

	useEffect(() => {
		function saveOnExit() {
			if (!latestSaveState.current.currentTurnId) return;
			saveState(latestSaveState.current);
		}
		// handle save state on exit
		window.addEventListener("pagehide", saveOnExit);
		return () => {
			saveOnExit();
			window.removeEventListener("pagehide", saveOnExit);
		};
	}, []);

	return {
		currentRoomId,
		currentTurn,
		currentStepIndex,
		currentMapId,
		currentDay,
		currentTurnsLeft,
		currentMusic,
		isGameInitiating,
		isFetchingResponse,
		currentStep,
		advanceTurn,
		advanceStory,
		submitPlayerAction,
		playerActions,
		setPlayerActions,
		isTurnEnd,
		isTurnEndHandling,
		npcActions,
		eventSummary,
		isGameOver,
		setIsGameOver,
	};
}
