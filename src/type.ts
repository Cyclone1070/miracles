// user action interfaces
export interface BaseAction {
    id: string;
    characterId: string;
    expression: "neutral" | "happy" | "annoyed";
}
export interface DoAction extends BaseAction {
    type: "do";
    action: string;
    using?: string[];
    target?: string[];
}
export interface SayAction extends BaseAction {
    type: "say";
    dialog: string;
    target: string;
}
export interface MiracleAction extends BaseAction {
    type: "miracle";
}
export interface MoveAction extends BaseAction {
    type: "move";
    destinationId: string;
}
export type Action = DoAction | SayAction | MiracleAction;

// story steps interfaces
export interface DialogStep {
    type: "dialog";
    id: string;
    text: string;
    speakerId: string;
    speakerExpression: "neutral" | "happy" | "annoyed";
    listenerId?: string;
    listenerExpression?: "neutral" | "happy" | "annoyed";
}
export interface ActionStep {
    type: "action";
    id: string;
    text: string;
    characterId: string;
    characterExpression: "neutral" | "happy" | "annoyed";
    targetId?: string;
    targetExpression?: "neutral" | "happy" | "annoyed";
}
export interface NarrationStep {
    type: "narration";
    id: string;
    text: string;
}
export interface ChoiceOption {
    text: string;
    nextTurnId: string;
}

export interface ChoiceStep {
    type: "choice";
    id: string;
    options: ChoiceOption[];
}
export type Step = DialogStep | ActionStep | NarrationStep | ChoiceStep;

export interface BaseTurn {
    id: number; // Unique identifier for the turn
}
export interface MusicTurn extends BaseTurn {
    type: "music";
    value: string | null; // URL or path to the music file
}
export interface MapTurn extends BaseTurn {
    type: "map";
    newMapId: string; // ID of the new map to switch to
}
export interface TimeTurn extends BaseTurn {
    type: "time";
    newDay: number; // The new day number to set
    turnLimit: number; // The limit of turns for the new day
}
export interface RoomSummary {
    roomId: string;
    eventSummary: string;
}
export interface GameTurn extends BaseTurn {
    type: "game";
    steps: Step[];
    summary?: RoomSummary[];
}
export type Turn = GameTurn | MusicTurn | MapTurn | TimeTurn;

export interface SaveState {
    currentTurnId: number;
    currentStepIndex: number;
    currentMapId?: string;
    currentDay?: number;
    turnsLeft?: number;
}

// game data interfaces
export interface Furniture {
    id: string;
    name: string;
    description: string;
    state: string;
    roomId: string; // ID of the room where the item is located
    gridPosition: {
        x: number; // X coordinate in the grid
        y: number; // Y coordinate in the grid
    };
    asciiArt: string; // Optional ASCII art representation
    color: string; // Optional color for the furniture
    itemsIdList?: string[]; // Optional, list of items on the furniture
}
export interface Item {
    id: string;
    name: string;
    description: string;
    state: string;
    characterId?: string;
    furnitureId?: string;
}
export interface Character {
    id: string;
    description: string;
    state: string;
    roomId: string; // ID of the room where the character is located
    itemIdList?: string[]; // Optional, list of items the character has
}
export interface Room {
    id: string;
    description: string;
    connectedRooms?: string[];
    inViewRooms?: string[];
    width: number; // Width of the room in grid units
    height: number; // Height of the room in grid units
    furnitureIdList?: string[]; // Optional, list of furniture in the room
    characterIdList?: string[]; // Optional, list of characters in the room
}
export interface GameMap {
    id: string;
    roomIdList: string[]; // List of rooms in the map
}
