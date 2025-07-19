import { useEffect, useRef, useState } from "react";
import { writeInitialData } from "../data/writeInitialData";
import type { Action, SaveState, Turn } from "../type";
import {
	loadMusic,
	loadState,
	loadTurn,
	saveMusic,
	saveState,
} from "./storage";

// main game logic, helper hook for context provider
export function useGameHelper() {
	// states to manage the game state
	const [isFetchingResponse, setIsFetchingResponse] = useState(false);
	const [isGameInitiating, setIsGameInitLoading] = useState(true);
	const [currentSaveState, setCurrentSaveState] = useState<SaveState | null>(
		null,
	);
	const [playerActions, setPlayerActions] = useState<Action[]>([]);
	const [currentTurn, setCurrentTurn] = useState<Turn | null>(null);
	// states to determine side to render the acting character in the action
	const [isActingCharacterLeft, setIsActingCharacterLeft] = useState(false);
	const prevSpeaker = useRef<string | null>(null);
	// convenience derived variables
	const currentStep =
		currentTurn &&
		currentTurn.type === "game" &&
		currentSaveState &&
		currentSaveState.currentTurnId === currentTurn.id
			? currentTurn.steps[currentSaveState.currentStepIndex]
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

				const currentSaveState = loadState();
				if (!currentSaveState) {
					alert(
						"Failed to initialise game: save state not found. Please refresh the page.",
					);
					return;
				}
				setCurrentSaveState(currentSaveState);
				const currentTurn = await loadTurn(
					currentSaveState.currentTurnId,
				);
				setCurrentTurn(currentTurn);
				// load music
				const currentMusicTrack = loadMusic();
				if (currentMusicTrack) {
					musicPlayer.current.loop = true;
					musicPlayer.current.src = currentMusicTrack;
					musicPlayer.current.play();
				}
				setIsGameInitLoading(false);
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

	// Load the correct turn accroding to currentSaveState
	useEffect(() => {
		// Don't do anything if the save state hasn't been loaded yet.
		if (!currentSaveState) return;

		const fetchTurn = async () => {
			// Only load a new turn if the ID in the save state is different
			// from the one we currently have in our `currentTurn` state.
			if (currentTurn?.id !== currentSaveState.currentTurnId) {
				setIsFetchingResponse(true); // Show loading indicator while fetching
				const newTurn = await loadTurn(currentSaveState.currentTurnId);
				setCurrentTurn(newTurn);
				setIsFetchingResponse(false);
			}
		};

		fetchTurn();
		// This effect depends on currentSaveState. It runs whenever it changes.
	}, [currentSaveState]);

	// handle admin turn since they need to auto advance
	useEffect(() => {
		// handle music player
		if (currentTurn?.type === "music") {
			const newTrack = currentTurn.value;

			// If a new music file is specified in 'value', play it.
			if (newTrack && newTrack !== musicPlayer.current.src) {
				musicPlayer.current.pause();
				musicPlayer.current.src = newTrack;
				musicPlayer.current.play();
				saveMusic(newTrack);
			}

			advanceTurn();
		} else if (currentTurn?.type === "map") {
			advanceTurn();
		} else if (currentTurn?.type === "time") {
			advanceTurn();
		}
	}, [currentTurn, advanceTurn]);
	// handle time turn

	// function to increment turn
	function advanceTurn() {
		if (!currentSaveState || !currentTurn) return;
		const newSaveState: SaveState = {
			...currentSaveState,
			currentTurnId: currentTurn.id + 1,
			currentStepIndex: 0, // Reset step index to 0 for the new turn
		};
		setCurrentSaveState(newSaveState);
		saveState(newSaveState);
	}
	// can only advance story if there is a next step, return true if the player action is needed to advance the story
	function advanceStory() {
		if (
			!currentSaveState ||
			!currentTurn ||
			currentTurn.type !== "game"
		)
			return false;

		const nextIndex = currentSaveState.currentStepIndex + 1;

		if (nextIndex < currentTurn.steps.length) {
			const newSaveState = {
				...currentSaveState,
				currentStepIndex: nextIndex,
			};
			setCurrentSaveState(newSaveState);
			saveState(newSaveState);
			return false;
		} else {
			const newSaveState: SaveState = {
				currentTurnId: 1,
				currentStepIndex: 0,
			};
			setCurrentSaveState(newSaveState);
			saveState(newSaveState);
			return true;
		}
	}

	async function submitPlayerAction() {
		setIsFetchingResponse(true);

		setIsFetchingResponse(false);
	}

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
	}, [currentSpeakerId]);

	return {
		isActingCharacterLeft,
		isGameInitiating,
		isFetchingResponse,
		currentStep,
		advanceTurn,
		advanceStory,
		submitPlayerAction,
		setCurrentSaveState,
		playerActions,
		setPlayerActions,
		currentTurn,
	};
}
