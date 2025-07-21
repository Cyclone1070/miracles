import { saveCharacter, saveFurniture, saveItem, saveMap, saveRoom, saveState, saveTurn } from "../game/storage";
import type { GameTurn, MapTurn, MusicTurn, TimeTurn } from "../types";
import { characters } from "./characters";
import { heavenFurnitures } from "./furnitures/heavenFurnitures";
import { heavenItems } from "./items/heavenItems";
import { gameMaps } from "./maps/gameMaps";
import { heavenRooms } from "./maps/heavenRooms";

export async function writeInitialData(): Promise<void> {
    const day0: TimeTurn = {
        type: "time",
        id: 1,
        newDay: 0,
        newTurnLimit: 0, // Set a limit for the number of turns in this day
    }
    const music: MusicTurn = {
        type: "music",
        id: 2,
        newMusic: "/birds-ambience.mp3",
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
        await Promise.all(gameMaps.map(map => saveMap(map)));
        await Promise.all(heavenRooms.map(room => saveRoom(room)));
        await Promise.all(heavenFurnitures.map(furniture => saveFurniture(furniture)));
        await Promise.all(heavenItems.map(item => saveItem(item)));
        await Promise.all(characters.map(character => saveCharacter(character)));

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

