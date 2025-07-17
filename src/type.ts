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
export interface MusicStep {
    type: "music";
    id: string;
    value: string | null; // URL or path to the music file
}
export type Step = DialogStep | ActionStep | NarrationStep | ChoiceStep | MusicStep;

export interface RoomTurnSummary {
    roomId: string;
    eventSummary: string;
}
export interface Turn {
    id: string;
    steps: Step[];
    summary: RoomTurnSummary[];
	newMapId?: string; // Optional, used for map changes
	endDay?: boolean; // Optional, indicates if this turn starts a new day
}
export interface SaveState {
    currentTurnId: string;
    currentStepIndex: number;
    currentMapId: string;
    currentDay: number;
    turnsLeft: number;
}

// game data interfaces
export interface Item {
    id: string;
    name: string;
    description: string;
    state: string;
    roomId: string; // ID of the room where the item is located
}
export interface Character {
    id: string;
    description: string;
    state: string;
    inventory?: Item[];
    roomId: string; // ID of the room where the character is located
}
export interface Room {
    id: string;
    description: string;
    connectedRooms?: string[];
    inViewRooms?: string[];
}
