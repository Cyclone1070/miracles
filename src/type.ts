export interface BaseAction {
	id: string;
	expression: "neutral" | "happy" | "annoyed";
}
export interface DoAction extends BaseAction {
	type: "do";
	action: string;
	target?: string;
	with?: string;
}
export interface SayAction extends BaseAction {
	type: "say";
	action: string;
	target: string;
}
export interface MiracleAction extends BaseAction {
	type: "miracle";
}
export type Action = DoAction | SayAction | MiracleAction;
