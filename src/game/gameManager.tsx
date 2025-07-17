import {
    useEffect,
    useRef,
    useState
} from "react";
import { writeInitialData } from "../data/writeInitialData";
import type { Action, SaveState, Turn } from "../type";
import {
    loadMusic,
    loadState,
    loadTurn,
    saveMusic,
    saveState
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
				const newTurn = await loadTurn(
					currentSaveState.currentTurnId,
				);
				setCurrentTurn(newTurn);
				setIsFetchingResponse(false);
			}
		};

		fetchTurn();
		// This effect depends on currentSaveState. It runs whenever it changes.
	}, [currentSaveState]);

	// handle music player
	useEffect(() => {
		if (currentStep?.type === "music") {
			const newTrack = currentStep.value;

			// If a new music file is specified in 'value', play it.
			if (newTrack && newTrack !== musicPlayer.current.src) {
				musicPlayer.current.pause();
				musicPlayer.current.src = newTrack;
				musicPlayer.current.play();
				saveMusic(newTrack);
			}

			// A music step is instant. After processing it, advance the story.
			advanceStory();
		}
	}, [currentStep, advanceStory]);

	function advanceStory() {
		if (!currentSaveState || !currentTurn) return;

		const nextIndex = currentSaveState.currentStepIndex + 1;

		if (nextIndex < currentTurn.steps.length) {
			const newSaveState = {
				...currentSaveState,
				currentStepIndex: nextIndex,
			};
			setCurrentSaveState(newSaveState);
			saveState(newSaveState);
		} else {
			const newSaveState: SaveState = {
				currentTurnId: "0",
				currentStepIndex: 0,
				currentMapId: currentSaveState.currentMapId,
				currentDay: currentSaveState.currentDay,
				turnsLeft: currentSaveState.turnsLeft,
			};
			setCurrentSaveState(newSaveState);
			saveState(newSaveState);
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
		advanceStory,
		submitPlayerAction,
		setCurrentSaveState,
		playerActions,
		setPlayerActions,
	};
}

