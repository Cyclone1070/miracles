import { useCallback, useEffect, useRef, useState } from "react";
import { writeInitialData } from "../data/writeInitialData";
import type { Action, SaveState, Turn } from "../types";
import { loadState, loadTurn, saveState } from "./storage";

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
	// states to determine side to render the acting character in the action
	const [isActingCharacterLeft, setIsActingCharacterLeft] = useState(false);
	const prevSpeaker = useRef<string | null>(null);
	// convenience derived variables
	const currentStep =
		currentTurn && currentTurn.type === "game"
			? currentTurn.steps[currentStepIndex]
			: null;
	const currentSpeakerId =
		currentStep?.type === "dialog" ? currentStep?.speakerId : null;
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

	// handle admin turns since they need to auto advance
	useEffect(() => {
		if (currentTurn?.type === "music") {
			const newMusic = currentTurn.newMusic;

			// If a new music file is specified in 'value', play it.
			if (newMusic && newMusic !== musicPlayer.current.src) {
				musicPlayer.current.pause();
				musicPlayer.current.src = newMusic;
				musicPlayer.current.play();
				setCurrentMusic(newMusic);
			}

			advanceTurn();
		} else if (currentTurn?.type === "map") {
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
	}, [advanceTurn, currentTurn]);

	// function to load next turn
	// can only advance story if there is a next step, return true if the player action is needed to advance the story
	function advanceStory() {
		if (!currentTurn || currentTurn.type !== "game") return false;

		const nextIndex = currentStepIndex + 1;

		if (nextIndex < currentTurn.steps.length) {
			setCurrentStepIndex(nextIndex);
			return false;
		} else {
			loadTurn(1).then((firstTurn) => {
				setCurrentTurn(firstTurn);
			});
			return true;
		}
	}

	async function submitPlayerAction() {
		setIsFetchingResponse(true);

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
	// handle character images position changes
	useEffect(() => {
		if (
			currentStep?.type === "dialog" &&
			currentSpeakerId &&
			currentSpeakerId !== prevSpeaker.current
		) {
			prevSpeaker.current = currentSpeakerId;
			setIsActingCharacterLeft((prev) => !prev);
		}
	}, [currentSpeakerId, currentStep?.type]);

	return {
		currentRoomId,
		currentTurn,
		currentStepIndex,
		currentMapId,
		currentDay,
		currentTurnsLeft,
		currentMusic,
		isActingCharacterLeft,
		isGameInitiating,
		isFetchingResponse,
		currentStep,
		advanceTurn,
		advanceStory,
		submitPlayerAction,
		playerActions,
		setPlayerActions,
	};
}
