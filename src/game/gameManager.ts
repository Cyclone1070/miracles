import type { Scene } from "../type";
import { loadScene, loadState, saveScene, saveState } from "./storage";

export async function initialiseGame(): Promise<void> {
    const currentSaveState = loadState();
    if (currentSaveState) {
        return
    }
    const intro: Scene = { id: "intro", steps: [{ type: "narration", id: "intro_1", displayText: "Welcome to the game! This is the introduction scene. lorem ipsum ios ioasfjio aidfojafo aoief oasd fia fjsdaiof ewoinfao fifjaoijf iwio " }] };
    try {
        await saveScene(intro);
        saveState({ currentSceneId: intro.id, currentStepIndex: 0 });
    } catch (error) {
        alert("Error writing game to storage: " + error);
    }
}

export async function nextStep() {
    const currentSaveState = loadState();
    if (!currentSaveState) {
        alert("Game not initialised.");
        return null;
    }
    try {
        const currentScene = await loadScene(currentSaveState.currentSceneId);
        // If the current step index is out of bounds, return null, else increment the index and return the next step
        if (currentSaveState.currentStepIndex >= currentScene.steps.length - 1) {
            return null
        } else {
            currentSaveState.currentStepIndex++;
            saveState(currentSaveState);
            return currentScene.steps[currentSaveState.currentStepIndex];
        }
    } catch (error) {
        alert("Game files were corrupted. Don't touch the game files dude. Error in log");
        console.log(error)
        return null;
    }
}


export async function submitAction(): Promise<void> {
    const newScene: Scene = { id: "test_scene", steps: [{ type: "narration", id: "test_1", narration: "This is a test step." }] };
    try {
        await saveScene(newScene);
    } catch (error) {
        alert("Error writing game to storage: " + error);
    }
    saveState({ currentSceneId: newScene.id, currentStepIndex: 0 });
}
