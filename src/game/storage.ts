import type { Character, GameMap, Item, ProcessedCharacter, ProcessedRoom, Room, SaveState, Turn } from "../types";
import { getAllObjectsFromStore, getObject, putObject } from "../utils/indexedDb";

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

export async function getAllTurns(): Promise<Turn[]> {
    const turns = await getAllObjectsFromStore<Turn>("turns");
    if (!turns || turns.length === 0) {
        return [];
    }
    return turns.sort((a, b) => a.id - b.id);
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
export async function getAllRoomsInMap(mapId: string): Promise<Room[]> {
    const map = await loadMap(mapId);
    if (!map.roomsIdList || map.roomsIdList.length === 0) {
        return [];
    }
    const roomPromises = map.roomsIdList.map(id => loadRoom(id));
    return Promise.all(roomPromises);
}
export async function findRoomWithCharacter(characterId: string): Promise<Room> {
    const rooms = await getAllObjectsFromStore<Room>('rooms', (room) =>
        !room.charactersIdList ? false : room.charactersIdList.includes(characterId)
    );
    // Returns the first matching room, or undefined if no rooms match.
	if (rooms.length === 0) {
		throw new Error(`No room found with character ID ${characterId}`);
	}
    return rooms[0];
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
    const item = await getObject<Item>("items", itemId);
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
export async function getAllItemsInCharacter(characterId: string): Promise<Item[]> {
    const character = await loadCharacter(characterId);
    if (!character.itemsIdList || character.itemsIdList.length === 0) {
        return [];
    }
    const itemPromises = character.itemsIdList.map(id => loadItem(id));
    return Promise.all(itemPromises);
}
export async function getCurrentProcessedRooms(mapId: string): Promise<ProcessedRoom[]> {
    const rooms = await getAllRoomsInMap(mapId)
    const processedRooms: ProcessedRoom[] = [];
    for (const room of rooms) {
        const characters = await getAllCharactersInRoom(room.id);
        const processedCharacters: ProcessedCharacter[] = [];
        const RoomItems = await getAllItemsInRoom(room.id);
        for (const character of characters) {
            const items = await getAllItemsInCharacter(character.id);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { itemsIdList: _items, ...characterWithoutItems } = character;
            const processedCharacter: ProcessedCharacter = {
                ...characterWithoutItems,
                items: items,
            }
            processedCharacters.push(processedCharacter);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { charactersIdList: _characters, itemsIdList: _items, ...roomWithoutItems } = room;
        const processedRoom: ProcessedRoom = {
            ...roomWithoutItems,
            characters: processedCharacters,
            items: RoomItems,
        };
        processedRooms.push(processedRoom);
    }
    return processedRooms;
}
