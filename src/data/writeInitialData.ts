import { saveMap, saveRoom, saveState, saveTurn } from "../game/storage";
import type { GameTurn, MapTurn, MusicTurn, TimeTurn } from "../type";
import { gameMaps } from "./maps/gameMaps";
import { heavenRooms } from "./maps/heavenRooms";

export async function writeInitialData(): Promise<void> {
    const day0: TimeTurn = {
        type: "time",
        id: 1,
        newDay: 0,
        turnLimit: 0, // Set a limit for the number of turns in this day
    }
    const music: MusicTurn = {
        type: "music",
        id: 2,
        value: "/birds-ambience.mp3",
    };
    const opening: MapTurn = {
        type: "map",
        id: 3,
        newMapId: "heaven",
    }
    const intro: GameTurn = {
        type: "game",
        id: 4,
        summary: [{
            roomId: "heaven",
            eventSummary: "A normal day in heaven, Lucifer appears to greet Jesus."
        }],
        steps: [
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
    try {
        gameMaps.forEach(async (map) => {
            await saveMap(map);
        })
        heavenRooms.forEach(async (room) => {
            await saveRoom(room);
        });
		await saveTurn(day0);
        await saveTurn(music);
        await saveTurn(opening);
        await saveTurn(intro);
        saveState({
            currentTurnId: day0.id,
			currentStepIndex: 0,
        });
    } catch (error) {
        alert("Error writing game to storage: " + error);
    }
}

