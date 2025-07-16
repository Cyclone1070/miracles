// user action interfaces
export interface BaseAction {
    id: string;
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
export type Action = DoAction | SayAction | MiracleAction;

// story display interfaces
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
    actorId: string;
    actorExpression: "neutral" | "happy" | "annoyed";
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
    nextSceneId: string;
}

export interface ChoiceStep {
    type: "choice";
    id: string;
    options: ChoiceOption[];
}
export type Step = DialogStep | ActionStep | NarrationStep | ChoiceStep;

export interface Scene {
    id: string;
    steps: Step[];
}
export interface SaveState {
    currentSceneId: string;
    currentStepIndex: number;
}

// game data interfaces
export interface Item {
    id: string;
    name: string;
    description?: string;
    state?: string;
}
export interface Character {
    id: string;
    description?: string;
    inventory?: Item[];
}
export interface Room {
    id: string;
    description?: string;
    connectedRooms?: string[];
    inViewRooms?: string[];
    items?: Item[];
    characters?: Character[];
}
