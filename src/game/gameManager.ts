import { useCallback, useEffect, useState } from "react";
import type { SaveState, Scene } from "../type";
import { loadScene, loadState, saveScene, saveState } from "./storage";

export function useGameManager() {
    const [isLoading, setIsLoading] = useState(true);
    const [currentSaveState, setCurrentSaveState] = useState<SaveState | null>(null)
    const [currentScene, setCurrentScene] = useState<Scene | null>(null);

    // start the game and load the initial game state info
    useEffect(() => {
        async function init() {
            try {
                await initialiseGame();
                const currentSaveState = loadState();
                if (!currentSaveState) {
                    alert("Failed to initialise game: save state not found. Please refresh the page.");
                    return;
                }
                setCurrentSaveState(currentSaveState);
                const currentScene = await loadScene(currentSaveState.currentSceneId);
                setCurrentScene(currentScene);
                setIsLoading(false);
            } catch (error) {
                alert("Error initialising game: " + error);
                console.error(error);
            }
        }
        init();
    }, [])

    function advanceStory() {
        if (!currentSaveState || !currentScene) return;

        const nextIndex = currentSaveState.currentStepIndex + 1;

        if (nextIndex < currentScene.steps.length) {
            const newSaveState = { ...currentSaveState, currentStepIndex: nextIndex };
            setCurrentSaveState(newSaveState);
            saveState(newSaveState);
        } else {
			const newSaveState = { ...currentSaveState, currentStepIndex: 0 };
			setCurrentSaveState(newSaveState);
			saveState(newSaveState);
        }
    }

    async function submitPlayerAction() {
        if (!saveState || !currentScene) return;

        setIsLoading(true);

        const newScene: Scene = { id: "test_scene", steps: [{ type: "narration", id: "test_1", displayText: "This is a test step." }] };
        try {
            await saveScene(newScene);
        } catch (error) {
            alert("Error writing game to storage: " + error);
        }

        setCurrentScene(newScene);
        setCurrentSaveState({ currentSceneId: newScene.id, currentStepIndex: 0 });
        saveState({ currentSceneId: newScene.id, currentStepIndex: 0 });

        setIsLoading(false);
    }

    const currentStep = currentScene && currentSaveState ? currentScene.steps[currentSaveState.currentStepIndex] : null;

    return { isLoading, currentStep, advanceStory, submitPlayerAction };
}

export async function initialiseGame(): Promise<void> {
    const currentSaveState = loadState();
    if (currentSaveState) {
        return
    }
    const intro: Scene = { id: "intro", steps: [{ type: "narration", id: "intro_1", displayText: "Welcome to the game! This is the introduction scene. lorem ipsum ios ioasfjio aidfojafo aoief oasd fia fjsdaiof ewoinfao fifjaoijf iwio " }, { type: "narration", id: "intro_2", displayText: "This is step 2 of the intro!" }] };
    try {
        await saveScene(intro);
        saveState({ currentSceneId: intro.id, currentStepIndex: 0 });
    } catch (error) {
        alert("Error writing game to storage: " + error);
    }
}
