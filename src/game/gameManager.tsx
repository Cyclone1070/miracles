import { useCallback, useEffect, useRef, useState } from "react";
import { writeInitialData } from "../data/writeInitialData";
import type { Action, SaveState, Turn, WorldState } from "../types";
import { getNextTurn } from "../utils/gemini";
import {
	findRoomWithCharacter,
	getAllTurns,
	getCurrentProcessedRooms,
	loadCharacter,
	loadRoom,
	loadState,
	loadTurn,
	saveRoom,
	saveState,
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
		setCurrentTurn(nextTurn);
		setCurrentStepIndex(0);
	}, [currentTurn]);

	// handle turns
	useEffect(() => {
		if (currentTurn?.type === "map") {
			setCurrentMapId(currentTurn.newMapId);

			advanceTurn();
		} else if (currentTurn?.type === "time") {
			if (currentTurn.newDay) {
				setCurrentDay(currentTurn.newDay);
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
		}
		setIsTurnEnd(false);
	}, [advanceTurn, currentTurn]);

	// play music based on location
	useEffect(() => {
		if (currentMapId === "Heaven") {
			if (currentMusic !== "birds-ambience.mp3") {
				musicPlayer.current.src = "/music/heaven-music.mp3";
				musicPlayer.current.play();
				setCurrentMusic("birds-ambience.mp3");
			}
		}
	}, [currentMapId, currentMusic]);

	const handleTurnEnd = useCallback(async () => {
		setIsTurnEndHandling(true);
		if (!currentTurn || currentTurn.type !== "game") return;

		if (currentTurn.charactersMove) {
			console.log(
				"Handling character movement for turn:",
				currentTurn.id,
			);
			// handle character movement
			for (const move of currentTurn.charactersMove) {
				// Find the original room of the character
				const originalRoom = await findRoomWithCharacter(move.id);
				if (originalRoom) {
					// Update the character's room
					originalRoom.charactersIdList =
						originalRoom.charactersIdList?.filter(
							(id) => id !== move.id,
						);
				}
				// Load the new room where the character is moving
				const newRoom = await loadRoom(move.newRoomId);
				if (newRoom) {
					// Add the character to the new room
					newRoom.charactersIdList = [
						...(newRoom.charactersIdList || []),
						move.id,
					];
				}
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
			}
		}

		setNpcActions(currentTurn.nextTurnNpcActions);

		setIsTurnEndHandling(false);
	}, [currentTurn]);
	useEffect(() => {
		if (isTurnEnd) {
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
			if (nextIndex === currentTurn.steps.length - 1) {
				setIsTurnEnd(true);
			}
			return;
		}
	}

	async function submitPlayerAction() {
		if (!currentMapId || !currentRoomId) return;
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
		const nextTurn = await getNextTurn(
			worldState,
			cleanTurnHistory,
			playerActions,
		);
		console.log("Next turn:", nextTurn);

		setIsFetchingResponse(false);
	}

	// handle save state on exit
	const latestSaveState = useRef<SaveState>({
		currentTurnId: currentTurn?.id,
		currentStepIndex,
		currentMapId,
		currentDay,
		currentTurnsLeft,
		currentMusic,
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
	};
}
