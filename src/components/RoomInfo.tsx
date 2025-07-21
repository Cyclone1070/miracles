import { useEffect, useState } from "react";
import { useGameManager } from "../context/GameContext";
import {
	getAllCharactersInRoom,
	getAllFurnitureInRoom,
	getAllItemsInRoom,
	loadRoom,
} from "../game/storage";
import type { Character, Furniture, Item, Room } from "../types";
import { mergeClasses } from "../utils/tailwindMerge";
import { HighlightButton } from "./HighlightButton";
import { RoomInfoItem } from "./RoomInfoItem";
import { v4 as uuidv4 } from "uuid";

interface Props {
	className?: string;
	roomId: string;
	inspectId?: string | null;
}

export function RoomInfo({ ...props }: Props) {
	const [furnitures, setFurnitures] = useState<Furniture[]>();
	const [characters, setCharacters] = useState<Character[]>();
	const [items, setItems] = useState<Item[]>();
	const [roomInfo, setRoomInfo] = useState<Room>();
	const { setPlayerActions, currentMapId } = useGameManager();

	// fetching useEffect
	useEffect(() => {
		async function fetchData() {
			try {
				const fetchedRoomInfo: Room = await loadRoom(props.roomId);
				const fetchedFurnitures: Furniture[] =
					await getAllFurnitureInRoom(props.roomId);
				const fetchedCharacters: Character[] =
					await getAllCharactersInRoom(props.roomId);
				const fetchedItems: Item[] = await getAllItemsInRoom(
					props.roomId,
				);

				setRoomInfo(fetchedRoomInfo);
				setFurnitures(fetchedFurnitures);
				setCharacters(fetchedCharacters);
				setItems(fetchedItems);
			} catch (error) {
				alert("Failed to load room data. " + error);
				console.error("Error fetching room data:", error);
			}
		}
		fetchData();
	}, []);

	return (
		<div
			className={mergeClasses(
				`p-4 text-white flex flex-col gap-4`,
				props.className,
			)}
		>
			{roomInfo ? (
				<>
					<div
						className={`flex items-center gap-2 justify-between my-2`}
					>
						<h2 className="text-2xl font-bold">{roomInfo.id}</h2>
						<HighlightButton
							onClick={() => {
								setPlayerActions((prev) => {
									if (prev.length >= 4) {
										alert(
											"You can only have 4 actions per turn!",
										);
										return prev;
									}
									if (
										prev.some(
											(action) => action.type === "move",
										)
									) {
										alert(
											"You can only have one move action per turn!",
										);
										return prev;
									}
									return [
										...prev,
										{
											id: uuidv4(),
											characterId:
												currentMapId === "heaven"
													? "Jesus"
													: "Big Shot",
											expression: "neutral",
											type: "move",
											destinationId: props.roomId,
										},
									];
								});
							}}
							className={`shrink-0`}
						>
							Move here
						</HighlightButton>
					</div>
					<p className="text-sm text-(--text-secondary)">
						{roomInfo.description}
					</p>
					{furnitures && furnitures.length > 0 && (
						<div>
							<h3 className="text-xl underline">Furnitures:</h3>
							<div className={`flex flex-col gap-4`}>
								{furnitures.map((furniture) => (
									<RoomInfoItem
										inspectId={props.inspectId}
										key={furniture.id}
										id={furniture.id}
										description={furniture.description}
										asciiChar={furniture.asciiChar}
										colorHex={furniture.colorHex}
										className={`pl-4`}
										isFurniture
									></RoomInfoItem>
								))}
							</div>
						</div>
					)}
					{characters && characters.length > 0 && (
						<div>
							<h3 className="text-xl underline">Characters:</h3>
							<div className={`flex flex-col gap-4`}>
								{characters.map((character) => (
									<RoomInfoItem
										inspectId={props.inspectId}
										key={character.id}
										id={character.id}
										description={character.description}
										asciiChar={character.asciiChar}
										colorHex={character.colorHex}
										className={`pl-4`}
									></RoomInfoItem>
								))}
							</div>
						</div>
					)}
					{items && items.length > 0 && (
						<div>
							<h3 className="text-xl underline">Items:</h3>
							<div className={`flex flex-col gap-4`}>
								{items.map((item) => (
									<RoomInfoItem
										key={item.id}
										id={item.id}
										description={item.description}
										asciiChar={"I"}
										colorHex={"#e8e8e8"}
										className={`pl-4`}
										isItem
									></RoomInfoItem>
								))}
							</div>
						</div>
					)}
				</>
			) : (
				<p>Loading room information...</p>
			)}
		</div>
	);
}
