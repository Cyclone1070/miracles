// user action interfaces
export interface BaseAction {
    id: string;
    characterId: string;
    expression: "neutral" | "happy" | "annoyed";
}
export interface DoAction extends BaseAction {
    type: "do";
    action: string;
    using?: string;
    target?: string;
}
export interface SayAction extends BaseAction {
    type: "say";
    dialog: string;
    target?: string;
}
export interface CreateAction extends BaseAction {
    type: "create";
	description?: string;
}
export interface DestroyAction extends BaseAction {
	type: "destroy";
	targetId?: string;
}
export interface TransformAction extends BaseAction {
	type: "transform";
	targetId?: string;
	description?: string;
}
export interface MoveAction extends BaseAction {
    type: "move";
    destinationId: string;
}
export type Action = DoAction | SayAction | CreateAction | MoveAction | DestroyAction | TransformAction;

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
    newMusic: string | null; // URL or path to the music file
}
export interface MapTurn extends BaseTurn {
    type: "map";
    newMapId: string; // ID of the new map to switch to
}
export interface TimeTurn extends BaseTurn {
    type: "time";
    newDay?: number; // The new day number to set
    newTurnLimit?: number; // The limit of turns for the new day
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
    currentTurnId?: number;
    currentRoomId?: string;
    currentStepIndex: number;
    currentMapId?: string;
    currentDay?: number;
    currentTurnsLeft?: number;
    currentMusic?: string;
}

// game data interfaces
export interface BaseCellObject {
    id: string;
    state?: string;
    description: string;
    asciiChar: string;
    colorHex: string;
}
export interface Item extends BaseCellObject {
	type: "item";
    gridPosition?: {
        x: number;
        y: number;
    };
    name: string;
    itemsIdList?: string[];
}
export interface Character extends BaseCellObject {
	type: "character";
    gridPosition: {
        x: number;
        y: number;
    };
    itemsIdList?: string[];
}
export type GameObject = Item | Character;
export interface Room {
    id: string;
    description: string;
    connectedRooms?: string[];
    inViewRooms?: string[];
    width: number; // Width of the room in grid units
    height: number; // Height of the room in grid units
    charactersIdList?: string[]; // Optional, list of characters in the room
    itemsIdList?: string[]; // Optional, list of items in the room
}
export interface GameMap {
    id: string;
    roomIdList: string[]; // List of rooms in the map
}
