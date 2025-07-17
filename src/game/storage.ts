import type { SaveState, Turn } from "../type";
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

export async function saveTurn(turn: Turn): Promise<void> {
	await putObject("turns", turn);
}

export async function loadTurn(turnId: string): Promise<Turn> {
	const turn = await getObject<Turn>("turns", turnId);
	if (!turn) {
		throw new Error(`Turn with ID ${turnId} not found`);
	}
	if (!turn.steps || !Array.isArray(turn.steps)) {
		throw new Error(`Turn with ID ${turnId} is invalid or corrupted`);
	}
	return turn;
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
