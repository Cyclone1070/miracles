import type { Action, Turn, WorldState } from '../types';

// In a Vite/Next.js project, get the key from environment variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error("VITE_GEMINI_API_KEY is not defined. Please set it in your .env.local file.");
}

const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Constructs the prompt for the Gemini API call.
 * @param worldState - The current state of the world.
 * @param history - The history of previous turns.
 * @param playerActions - The actions taken by the player in the current turn.
 * @returns The complete prompt string.
 */
export function constructPrompt(
    worldState: WorldState,
    history: Turn[],
    playerActions: Action[]
): string {
    const worldStateJson = JSON.stringify(worldState, null, 2);
    const historyJson = JSON.stringify(history, null, 2);
    const playerActionsJson = JSON.stringify(playerActions, null, 2);
    const currentPlayerCharacterId = worldState.mapId === "Heaven" ? "Jesus" : "Big Shot";

    return `
You are the "Game Master" for a text-based adventure game called "Miracles". Your primary role is to create an engaging, narrative-driven experience. The current player character is ${currentPlayerCharacterId}, they will give you their character actions and you will generate the next game turn based on the current world state, history, and character actions.

### OUTPUT REQUIREMENTS
- You MUST respond with a single, valid JSON object.
- The JSON object must strictly adhere to the provided JSON schema. Do NOT include any text, pleasantries, or explanations outside of the JSON object.

### GAME RULES & TONE
- The narrative tone should be witty, humorous, and slightly surreal.
- Characters must act according to their established personalities
- Events should logically follow from the characters' actions and the current state of the world.
- Only modify the state of characters and items that are directly involved in or affected by the turn's events. Do not change things arbitrarily.
- **Schema Adherence is Absolute:** Every single field marked as "required" in the schema MUST be present in your response. This is not optional.

---

### INPUT DATA & DEFINITIONS
The following sections contain the data for the current turn.

**1. CURRENT WORLD STATE:**
This JSON object describes the player's current environment.
\`\`\`json
${worldStateJson}
\`\`\`

**2. GAME HISTORY:**
This is a JSON array containing the full details of previous turns, in chronological order. It provides the complete narrative and event context for the game so far. Each object in the array is a "Turn" object, which has a \`type\` field that determines its structure:
\`\`\`json
${historyJson}
\`\`\`

**3. CHARACTERS ACTIONS FOR THIS TURN:**
This is a JSON array of actions characters (including the player) are planning to do this turn. Treat these as attempts to perform actions, which may or may not succeed based on the game state and other characters actions. Each action object has:
\`\`\`json
${playerActionsJson}
\`\`\`

---

### YOUR TASK
Based on all the information above, generate the next game turn as a JSON object.
2.  Determine the consequences and outcomes of the characters' actions interacting together with the current world state.
3.  Describe all events in a sequence of narrative steps ("dialog", "action", "narration").
4.  Define the changes to any characters or items that occurred during the turn.
5.  Output this all as a single JSON object that validates against the schema.
1.  Decide on the next turn actions for all Non-Player Characters (NPCs).
`;
}

export async function getNextTurn(
    worldState: WorldState,
    history: Turn[],
    playerActions: Action[]
) {
    if (!GEMINI_API_KEY) {
        throw new Error("Gemini API key is not configured.");
    }

    const promptText = constructPrompt(worldState, history, playerActions);
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

    const allRoomIds = worldState.rooms.map(room => room.id);
    const playerCharacterId = worldState.mapId === "Heaven" ? "Jesus" : "Big Shot";
    const allNpcIds = worldState.rooms
        .flatMap(room => room.characters)
        .filter(char => char.id !== playerCharacterId)
        .map(npc => npc.id);

    // 2. Build the entire, final schema from scratch.
    const finalSchema = buildFinalSchema(allRoomIds, allNpcIds);

    console.log(finalSchema)

    const token = await countTokens(promptText + JSON.stringify(finalSchema))
    console.log("Token count for prompt and schema:", token);

    const requestBody = {
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: finalSchema,
        },
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error("Gemini API Error Response:", responseData);
            throw new Error(`API error: ${response.status} - ${responseData.error?.message || 'Unknown error'}`);
        }

        if (responseData.candidates?.[0]?.content?.parts?.[0]?.text) {
            const responseText = responseData.candidates[0].content.parts[0].text;
            try {
                return JSON.parse(responseText);
            } catch (parseError) {
                console.error("Failed to parse JSON from response text:", responseText, parseError);
                throw new Error("Gemini response was not valid JSON.");
            }
        }

        throw new Error("No valid content found in Gemini response.");

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
}

/**
 * Creates a schema for the 'roomsEventSummary' object from a list of room IDs.
 * @param roomIds A list of room IDs that must be included as required keys.
 * @returns A valid Gemini API JSON schema object.
 */
export function createRoomsEventSummarySchema(roomIds: string[]): object {
    const singleSummarySchema = {
        type: "string",
        description: "A concise, past-tense summary of what happened in this specific room. If nothing of note occurred, explicitly state that."
    };

    const roomsSummarySchema = {
        type: "object",
        description: "An object containing a required summary for EVERY room on the map.",
        properties: {} as Record<string, object>,
        required: roomIds
    };

    roomIds.forEach(id => {
        roomsSummarySchema.properties[id] = singleSummarySchema;
    });

    return roomsSummarySchema;
}

/**
 * Creates a schema for the 'nextTurnNpcActions' object from a list of NPC IDs.
 * @param npcIds A list of NPC IDs that must be included as required keys.
 * @returns A valid Gemini API JSON schema object.
 */
export function createNextTurnNpcActionsSchema(npcIds: string[]): object {
    const singleNpcActionSchema = {
		type: "string",
        description: "A single planned action for an NPC for the next turn."
    };

    const npcActionsSchema = {
        type: "object",
        description: "An object containing the required next turn action for EVERY NPC.",
        properties: {} as Record<string, object>,
        required: npcIds
    };

    npcIds.forEach(id => {
        npcActionsSchema.properties[id] = singleNpcActionSchema;
    });

    return npcActionsSchema;
}

export function buildFinalSchema(roomIds: string[], npcIds: string[]): object {
    // This object contains all the static definitions from your schema.
    const staticProperties = {
        "type": {
            "description": "The type of the turn. For this schema, it must always be 'game'.",
            "type": "string", "enum": ["game"]
        },
        "steps": {
            "description": "A chronological array of narrative events. These should pick up directly from the very last step from the previous turn like a continuous story with smooth conversation flow. Do not repeat the text or events from the previous turn, not even part of it. All text fields should be plain text. You should try to generate 8 to 10 new steps per turn.",
            "type": "array",
            "items": {
                "description": "A single narrative event. Must be one of DialogStep, ActionStep, or NarrationStep.",
                "oneOf": [
                    {
                        "title": "DialogStep", "type": "object",
                        "properties": {
                            "type": { "type": "string", "enum": ["dialog"] },
                            "id": { "type": "string", "description": "A unique ID for this step." },
                            "text": { "type": "string", "description": "The exact words spoken by the character." },
                            "speakerId": { "type": "string", "description": "The ID of the character who is speaking." },
                            "speakerExpression": { "type": "string", "enum": ["neutral", "happy", "annoyed"], "description": "The emotional expression of the speaker." },
                            "listenerId": { "type": "string", "description": "Optional ID of the character being spoken to." },
                            "listenerExpression": { "type": "string", "enum": ["neutral", "happy", "annoyed"], "description": "Optional emotional expression of the listener." }
                        },
                        "required": ["type", "id", "text", "speakerId", "speakerExpression"]
                    },
                    {
                        "title": "ActionStep", "type": "object",
                        "properties": {
                            "type": { "type": "string", "enum": ["action"] },
                            "id": { "type": "string", "description": "A unique ID for this step." },
                            "text": { "type": "string", "description": "A narrative description of the character's action." },
                            "characterId": { "type": "string", "description": "The ID of the character performing the action." },
                            "characterExpression": { "type": "string", "enum": ["neutral", "happy", "annoyed"], "description": "The emotional expression of the character performing the action." },
                            "targetId": { "type": "string", "description": "Optional ID of the item or character being acted upon." },
                            "targetExpression": { "type": "string", "enum": ["neutral", "happy", "annoyed"], "description": "Optional emotional expression of the target." }
                        },
                        "required": ["type", "id", "text", "characterId", "characterExpression"]
                    },
                    {
                        "title": "NarrationStep", "type": "object",
                        "properties": {
                            "type": { "type": "string", "enum": ["narration"] },
                            "id": { "type": "string", "description": "A unique ID for this step." },
                            "text": { "type": "string", "description": "Descriptive text from you, the Game Master." }
                        },
                        "required": ["type", "id", "text"]
                    }
                ]
            }
        },
        "itemsChanges": {
            "description": "A list of items that were created or had their properties changed.", "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": { "type": "string", "description": "The item's unique ID. Can be new or existing." },
                    "state": { "type": "string", "description": "The item's new state (e.g., 'on fire')." },
                    "description": { "type": "string", "description": "An updated narrative description." },
                    "asciiChar": { "type": "string", "description": "The ASCII character." },
                    "colorHex": { "type": "string", "description": "The hex color code." },
                    "type": { "type": "string", "enum": ["item"] },
                    "gridPosition": { "type": "object", "properties": { "x": { "type": "number" }, "y": { "type": "number" } }, "required": ["x", "y"] },
                    "name": { "type": "string", "description": "The proper name of the item." }
                },
                "required": ["id", "type"]
            }
        },
        "itemsMove": {
            "description": "A list of items that changed location.", "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": { "type": "string", "description": "The ID of the item being moved." },
                    "newRoomId": { "type": "string", "description": "The ID of the new room." },
                    "newGridPosition": { "type": "object", "description": "The new (x,y) coordinates.", "properties": { "x": { "type": "number" }, "y": { "type": "number" } }, "required": ["x", "y"] },
                    "newCharacterId": { "type": "string", "description": "The ID of the new character carrier." }
                }, "required": ["id"]
            }
        },
        "itemsDeleted": {
            "description": "A list of unique IDs of items that were permanently removed.", "type": "array",
            "items": { "type": "string" }
        },
        "charactersChanges": {
            "description": "A list of characters whose properties have changed.", "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": { "type": "string", "description": "The existing ID of the character." },
                    "state": { "type": "string", "description": "The character's new state (e.g., 'confused')." },
                    "description": { "type": "string", "description": "An updated narrative description." },
                    "asciiChar": { "type": "string", "description": "The ASCII character." },
                    "colorHex": { "type": "string", "description": "The hex color code." },
                    "type": { "type": "string", "enum": ["character"] },
                    "gridPosition": { "type": "object", "properties": { "x": { "type": "number" }, "y": { "type": "number" } }, "required": ["x", "y"] },
                    "itemsIdList": { "type": "array", "items": { "type": "string" }, "description": "The complete list of item IDs the character carries." }
                },
                "required": ["id", "type"]
            }
        },
        "charactersMove": {
            "description": "A list of characters that have moved to a new room.", "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": { "type": "string", "description": "The ID of the character moving." },
                    "newRoomId": { "type": "string", "description": "The ID of the new room." },
                    "newGridPosition": { "type": "object", "description": "The new (x,y) coordinates.", "properties": { "x": { "type": "number" }, "y": { "type": "number" } }, "required": ["x", "y"] }
                },
                "required": ["id", "newRoomId", "newGridPosition"]
            }
        }
    };

    // Assemble the final schema object.
    const finalSchema = {
        title: "GameTurn",
        description: "The complete definition of a single 'game' turn in Miracles.",
        type: "object",
        properties: staticProperties as Record<string, any>,
        required: ["type", "steps", "roomsEventSummary"] // Start with the always-required fields.
    };

    // Add the dynamic properties to the schema.
    finalSchema.properties.roomsEventSummary = createRoomsEventSummarySchema(roomIds);

    if (npcIds.length > 0) {
        finalSchema.properties.nextTurnNpcActions = createNextTurnNpcActionsSchema(npcIds);
        // If we add the property, we must also make it required.
        finalSchema.required.push("nextTurnNpcActions");
    }

    return finalSchema;
}

export async function countTokens(textToCount: string): Promise<number> {
    if (!GEMINI_API_KEY) {
        throw new Error("Gemini API key is not configured.");
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:countTokens?key=${GEMINI_API_KEY}`;

    const requestBody = {
        contents: [
            {
                parts: [
                    { text: textToCount }
                ]
            }
        ]
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error("Gemini API Error (countTokens):", responseData);
            throw new Error(`API error: ${response.status} - ${responseData.error?.message || 'Unknown error'}`);
        }

        // The response from countTokens contains the totalTokens field directly
        return responseData.totalTokens;

    } catch (error) {
        console.error("Error calling Gemini countTokens API:", error);
        throw error;
    }
}
