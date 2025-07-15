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

export interface DialogStep {
	type: "dialog";
    id: string;
	displayText: string;
    speakerId: string;
    speakerExpression: "neutral" | "happy" | "annoyed";
    listenerId?: string;
    listenerExpression?: "neutral" | "happy" | "annoyed";
}
export interface ActionStep {
	type: "action";
    id: string;
    displayText: string;
    actorId: string;
    actorExpression: "neutral" | "happy" | "annoyed";
    targetId?: string;
    targetExpression?: "neutral" | "happy" | "annoyed";
}
export interface NarrationStep {
	type: "narration";
    id: string;
    displayText: string;
}
export type Step = DialogStep | ActionStep | NarrationStep;

export interface Scene {
    id: string;
    steps: Step[];
}
export interface SaveState {
	currentSceneId: string;
	currentStepIndex: number;
}
