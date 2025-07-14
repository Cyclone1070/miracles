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
	target: string[];
}
export interface MiracleAction extends BaseAction {
	type: "miracle";
}
export type Action = DoAction | SayAction | MiracleAction;
