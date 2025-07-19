import type { Character, Furniture, GameMap, Room, SaveState, Turn } from "../type";
import { getAllObjectsFromStore, getObject, putObject } from "../utils/indexedDb";

const SAVE_STATE_KEY = 'miracle_save_state';
const MUSIC_KEY = 'miracle_music';

// states
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

// turns
export async function saveTurn(turn: Turn): Promise<void> {
    await putObject("turns", turn);
}

export async function loadTurn(turnId: number): Promise<Turn> {
    const turn = await getObject<Turn>("turns", turnId);
    if (!turn) {
        throw new Error(`Turn with ID ${turnId} not found`);
    }
    return turn;
}

// maps
export async function saveMap(map: GameMap): Promise<void> {
	await putObject("maps", map);
}
export async function loadMap(mapId: string): Promise<GameMap> {
	const map = await getObject<GameMap>("maps", mapId);
	if (!map) {
		throw new Error(`Map with ID ${mapId} not found`);
	}
	return map;
}

// rooms
export async function saveRoom(room: Room): Promise<void> {
    await putObject("rooms", room);
}

export async function loadRoom(roomId: string): Promise<Room> {
    const room = await getObject<Room>("rooms", roomId);
    if (!room) {
        throw new Error(`Room with ID ${roomId} not found`);
    }
    return room;
}

export async function loadCharactersInRoom(roomId: string): Promise<Character[]> {
    return getAllObjectsFromStore<Character>("characters", "roomId", roomId);
}

export async function loadFurnitureInRoom(roomId: string): Promise<Furniture[]> {
    return getAllObjectsFromStore<Furniture>("furniture", "roomId", roomId);
}

// music
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
