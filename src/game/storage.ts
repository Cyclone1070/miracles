import type { SaveState, Scene } from "../type";
import { getObject, putObject } from "../utils/indexedDb";

const SAVE_STATE_KEY = 'miracle_save_state';
const MUSIC_KEY = 'miracle_music';

export function saveState(saveState: SaveState): void {
    localStorage.setItem(SAVE_STATE_KEY, JSON.stringify(saveState));
}

export function loadState() {
    const savedState = localStorage.getItem(SAVE_STATE_KEY);
    if (savedState) {
        return JSON.parse(savedState) as SaveState;
    }
    return null;
}

export async function saveScene(scene: Scene): Promise<void> {
	await putObject(scene);
}

export async function loadScene(sceneId: string): Promise<Scene> {
	const scene = await getObject<Scene>(sceneId);
	if (!scene) {
		throw new Error(`Scene with ID ${sceneId} not found`);
	}
	if (!scene.steps || !Array.isArray(scene.steps)) {
		throw new Error(`Scene with ID ${sceneId} is invalid or corrupted`);
	}
	return scene;
}
export function saveMusic(trackURL: string | null) {
	if (trackURL) {
		localStorage.setItem(MUSIC_KEY, trackURL);
	} else {
		localStorage.removeItem(MUSIC_KEY);
	}
}
export function loadMusic(): string | null {
    return localStorage.getItem(MUSIC_KEY);
}
