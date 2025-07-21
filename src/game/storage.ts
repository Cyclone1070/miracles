import type { Character, Furniture, GameMap, Item, Room, SaveState, Turn } from "../types";
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
    if (!room.furnituresIdList || room.furnituresIdList.length === 0) {
        return [];
    }
    const furniturePromises = room.furnituresIdList.map(id => loadFurniture(id));
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
    if (!room.charactersIdList || room.charactersIdList.length === 0) {
        return [];
    }
    const characterPromises = room.charactersIdList.map(id => loadCharacter(id));
    return Promise.all(characterPromises);
}
// items
export async function saveItem(item: Item): Promise<void> {
    await putObject("items", item);
}
export async function loadItem(itemId: string): Promise<Item> {
    const item = await getObject<Furniture>("items", itemId);
    if (!item) {
        throw new Error(`Item with ID ${itemId} not found`);
    }
    return item;
}
export async function getAllItemsInRoom(roomId: string): Promise<Item[]> {
    const room = await loadRoom(roomId);
    if (!room.itemsIdList || room.itemsIdList.length === 0) {
        return [];
    }
    const itemPromises = room.itemsIdList.map(id => loadItem(id));
    return Promise.all(itemPromises);
}
export async function getAllItemsInFurniture(furnitureId: string): Promise<Item[]> {
    const furniture = await loadFurniture(furnitureId);
    if (!furniture.itemsIdList || furniture.itemsIdList.length === 0) {
        return [];
    }
    const itemPromises = furniture.itemsIdList.map(id => loadItem(id));
    return Promise.all(itemPromises);
}
export async function getAllItemsInCharacter(characterId: string): Promise<Item[]> {
	const character = await loadCharacter(characterId);
	if (!character.itemsIdList || character.itemsIdList.length === 0) {
		return [];
	}
	const itemPromises = character.itemsIdList.map(id => loadItem(id));
	return Promise.all(itemPromises);
}
