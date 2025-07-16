import {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
	type ReactNode,
} from "react";
import type { SaveState, Scene } from "../type";
import { loadScene, loadState, saveScene, saveState } from "./storage";
import { writeInitialData } from "./writeInitialData";

// main game logic, private helper hook
function useGameHelper() {
	const [isFetchingResponse, setIsFetchingResponse] = useState(false);
	const [isGameInitiating, setIsGameInitLoading] = useState(true);
	const [currentSaveState, setCurrentSaveState] = useState<SaveState | null>(
		null,
	);
	const [currentScene, setCurrentScene] = useState<Scene | null>(null);
	const [isActingCharacterLeft, setIsActingCharacterLeft] = useState(false);
	const prevSpeaker = useRef<string | null>(null);

	// start the game and load the initial game state info
	useEffect(() => {
		async function init() {
			try {
				await writeInitialData();
				const currentSaveState = loadState();
				if (!currentSaveState) {
					alert(
						"Failed to initialise game: save state not found. Please refresh the page.",
					);
					return;
				}
				setCurrentSaveState(currentSaveState);
				const currentScene = await loadScene(
					currentSaveState.currentSceneId,
				);
				setCurrentScene(currentScene);
				setIsGameInitLoading(false);
			} catch (error) {
				alert("Error initialising game: " + error);
				console.error(error);
			}
		}
		init();
	}, []);

	useEffect(() => {
		// Don't do anything if the save state hasn't been loaded yet.
		if (!currentSaveState) return;

		const fetchScene = async () => {
			// Only load a new scene if the ID in the save state is different
			// from the one we currently have in our `currentScene` state.
			if (currentScene?.id !== currentSaveState.currentSceneId) {
				setIsFetchingResponse(true); // Show loading indicator while fetching
				const newScene = await loadScene(
					currentSaveState.currentSceneId,
				);
				setCurrentScene(newScene);
				setIsFetchingResponse(false);
			}
		};

		fetchScene();
		// This effect depends on currentSaveState. It runs whenever it changes.
	}, [currentSaveState]);

	function advanceStory() {
		if (!currentSaveState || !currentScene) return;

		const nextIndex = currentSaveState.currentStepIndex + 1;

		if (nextIndex < currentScene.steps.length) {
			const newSaveState = {
				...currentSaveState,
				currentStepIndex: nextIndex,
			};
			setCurrentSaveState(newSaveState);
			saveState(newSaveState);
		} else {
			const newSaveState = { currentSceneId: "intro", currentStepIndex: 0 };
			setCurrentSaveState(newSaveState);
			saveState(newSaveState);
		}
	}

	async function submitPlayerAction() {
		if (!saveState || !currentScene) return;

		setIsFetchingResponse(true);

		const newScene: Scene = {
			id: "test_scene",
			steps: [
				{
					type: "narration",
					id: "test_1",
					text: "This is a test step.",
				},
			],
		};
		try {
			await saveScene(newScene);
		} catch (error) {
			alert("Error writing game to storage: " + error);
		}

		setCurrentScene(newScene);
		setCurrentSaveState({
			currentSceneId: newScene.id,
			currentStepIndex: 0,
		});
		saveState({ currentSceneId: newScene.id, currentStepIndex: 0 });

		setIsFetchingResponse(false);
	}

	const currentStep =
		currentScene && currentSaveState
			? currentScene.steps[currentSaveState.currentStepIndex]
			: null;
	const currentSpeakerId =
		currentStep?.type === "dialog" ? currentStep?.speakerId : null;

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
	};
}

// provider pattern
type GameManagerContextType = ReturnType<typeof useGameHelper>;

const GameContext = createContext<GameManagerContextType | null>(null);

export function GameManagerProvider({ children }: { children: ReactNode }) {
	const gameManager = useGameHelper();
	return (
		<GameContext.Provider value={gameManager}>
			{children}
		</GameContext.Provider>
	);
}

export function useGameManager() {
	const context = useContext(GameContext);
	if (!context) {
		throw new Error("useGame must be used within a GameManagerProvider");
	}
	return context;
}
