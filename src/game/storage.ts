import type { Character, Furniture, GameMap, Room, SaveState, Turn } from "../types";
import { getObject, putObject } from "../utils/indexedDb";

const SAVE_STATE_KEY = 'miracle_save_state';

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

// furniture
export async function saveFurniture(furniture: Furniture): Promise<void> {
	await putObject("furniture", furniture);
}
export async function loadFurniture(furnitureId: string): Promise<Furniture> {
	const furniture = await getObject<Furniture>("furniture", furnitureId);
	if (!furniture) {
		throw new Error(`Furniture with ID ${furnitureId} not found`);
	}
	return furniture;
}

export async function getAllFurnitureInRoom(roomId: string): Promise<Furniture[]> {
    const room = await loadRoom(roomId);
    if (!room.furnitureIdList || room.furnitureIdList.length === 0) {
        return [];
    }
    const furniturePromises = room.furnitureIdList.map(id => loadFurniture(id));
    return Promise.all(furniturePromises);
}
// characters
export async function saveCharacter(character: Character): Promise<void> {
	await putObject("characters", character);
}
export async function loadCharacter(characterId: string): Promise<Character> {
	const character = await getObject<Character>("characters", characterId);
	if (!character) {
		throw new Error(`Character with ID ${characterId} not found`);
	}
	return character;
}
export async function getAllCharactersInRoom(roomId: string): Promise<Character[]> {
	const room = await loadRoom(roomId);
	if (!room.characterIdList || room.characterIdList.length === 0) {
		return [];
	}
	const characterPromises = room.characterIdList.map(id => loadCharacter(id));
	return Promise.all(characterPromises);
}
