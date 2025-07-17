import type { Scene } from "../type";
import { saveScene, saveState } from "./storage";

export async function writeInitialData(): Promise<void> {
    const intro: Scene = {
        id: "intro", steps: [
            {
                type: "music",
				id: "intro_music",
                value: "/birds-ambience.mp3",
            },
            {
                type: "narration",
                id: "intro_1",
                text: "On a random, unremarkable day..."
            },
            {
                type: "dialog",
                id: "intro_2",
                text: "...",
                speakerId: "Jesus",
                speakerExpression: "neutral"
            },
            {
                type: "dialog",
                id: "intro_3",
                text: "Ayo Jessee!",
                speakerId: "Lucifer",
                speakerExpression: "happy",
                listenerId: "Jesus",
                listenerExpression: "neutral"
            },
            {
                type: "choice",
                id: "intro_4_choice",
                options: [
                    {
                        text: "Lucie my brother!",
                        nextSceneId: "intro_wacky"
                    }
                ]
            }
        ]
    };
    const intro_wacky: Scene = {
        id: "intro_wacky", steps: [
            {
                type: "dialog",
                id: "intro_4",
                text: "Lucie my brother! How you been?",
                speakerId: "Jesus",
                speakerExpression: "happy",
                listenerId: "Lucifer",
                listenerExpression: "happy"
            },
            {
                type: "action",
                id: "intro_5",
                text: "You exchange a fist bumb with Lucifer",
                actorId: "Jesus",
                actorExpression: "happy",
                targetId: "Lucifer",
                targetExpression: "happy"
            },
            {
                type: "dialog",
                id: "intro_6",
                text: "So, what brings you here today? Is it because of the chick winning 2 lotteries back to back the other day? Cause I wouldn't know nothing about that.",
                speakerId: "Jesus",
                speakerExpression: "happy",
                listenerId: "Lucifer",
                listenerExpression: "happy"
            },
            {
                type: "dialog",
                id: "intro_7",
                text: "Nah mate, nothing serious like that.",
                speakerId: "Lucifer",
                speakerExpression: "happy",
                listenerId: "Jesus",
                listenerExpression: "happy"
            },
        ]
    }
    try {
        await saveScene(intro);
        await saveScene(intro_wacky);
        saveState({ currentSceneId: intro.id, currentStepIndex: 0 });
    } catch (error) {
        alert("Error writing game to storage: " + error);
    }
}

