import { saveState, saveTurn } from "../game/storage";
import type { Turn } from "../type";

export async function writeInitialData(): Promise<void> {
    const intro: Turn = {
        id: "intro",
        summary: [{
            roomId: "heaven",
            eventSummary: "A normal day in heaven, Lucifer appears to greet Jesus."
        }],
        steps: [
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
                        nextTurnId: "intro_wacky"
                    }
                ]
            }
        ]
    };
    const intro_wacky: Turn = {
        id: "intro_wacky",
        summary: [{
            roomId: "heaven",
            eventSummary: "Jesus and Lucifer exchange greetings in a wacky manner."
        }],
        steps: [
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
                text: "You exchange a fist bumb with Lucifer.",
                characterId: "Jesus",
                characterExpression: "happy",
                targetId: "Lucifer",
                targetExpression: "happy"
            },
            {
                type: "dialog",
                id: "intro_6",
                text: "So, what brings you here today? Is it about the chick winning 2 lotteries back to back the other day? Cause I wouldn't know nothing about it.",
                speakerId: "Jesus",
                speakerExpression: "neutral",
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
        await saveTurn(intro);
        await saveTurn(intro_wacky);
        saveState({
            currentTurnId: intro.id,
            currentStepIndex: 0,
            currentMapId: "heaven",
            currentDay: 1,
            turnsLeft: 10
        });
    } catch (error) {
        alert("Error writing game to storage: " + error);
    }
}

