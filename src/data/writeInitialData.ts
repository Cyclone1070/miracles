import { saveCharacter, saveItem, saveMap, saveRoom, saveState, saveTurn } from "../game/storage";
import type { GameTurn, MapTurn, TimeTurn } from "../types";
import { characters } from "./characters";
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
    const opening: MapTurn = {
        type: "map",
        id: 2,
        newMapId: "Heaven",
    }
    const intro: GameTurn = {
        type: "game",
        id: 3,
        roomsEventSummary: {
            "Heaven Courtyard": "A normal day in heaven, Lucifer appears to greet Jesus.",
            "History Hall": "Nothing happened."
        },
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
                type: "animation",
                id: "intro_2_animation",
                animationId: "lucifer-appears",
                characterId: "Lucifer",
                characterExpression: "happy",
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
                    }, {
						text: "What do you need?",
						nextTurnId: "intro_serious"
					}
                ]
            }
        ],
        charactersMove: [{
            id: "Lucifer",
            newRoomId: "Heaven Courtyard",
            newGridPosition: { x: 7, y: 4}
        }]
    };
    try {
        await Promise.all(gameMaps.map(map => saveMap(map)));
        await Promise.all(heavenRooms.map(room => saveRoom(room)));
        await Promise.all(heavenItems.map(item => saveItem(item)));
        await Promise.all(characters.map(character => saveCharacter(character)));

        await saveTurn(day0);
        await saveTurn(opening);
        await saveTurn(intro);
        saveState({
            currentTurnId: day0.id,
            currentStepIndex: 0,
            currentRoomId: "Heaven Courtyard",
        });
    } catch (error) {
        alert("Error writing game to storage: " + error);
    }
}

