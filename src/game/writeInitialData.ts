import type { Scene } from "../type";
import { loadState, saveScene, saveState } from "./storage";

export async function writeInitialData(): Promise<void> {
    const currentSaveState = loadState();
    if (currentSaveState) {
        return
    }
    const intro: Scene = {
        id: "intro", steps: [
            { type: "narration", id: "intro_1", displayText: "On a random, unremarkable day..." },
            { type: "dialog", id: "intro_2", displayText: "...", speakerId: "Jesus", speakerExpression: "neutral" },
            { type: "dialog", id: "intro_3", displayText: "Ayo Jessee!", speakerId: "Lucifer", speakerExpression: "happy", listenerId: "Jesus", listenerExpression: "neutral" },
            { type: "dialog", id: "intro_4", displayText: "Lucie my brother! How you been?", speakerId: "Jesus", speakerExpression: "happy", listenerId: "Lucifer", listenerExpression: "happy" },
            { type: "action", id: "intro_5", displayText: "You exchange a fist bumb with Lucifer", actorId: "Jesus", actorExpression: "happy", targetId: "Lucifer", targetExpression: "happy" },
            { type: "dialog", id: "intro_6", displayText: "So, what brings you here today?", speakerId: "Jesus", speakerExpression: "happy", listenerId: "Lucifer", listenerExpression: "happy" },
        ]
    };
    try {
        await saveScene(intro);
        saveState({ currentSceneId: intro.id, currentStepIndex: 0 });
    } catch (error) {
        alert("Error writing game to storage: " + error);
    }
}

