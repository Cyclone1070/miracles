import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useGameManager } from "../context/GameContext";
import {
	getAllCharactersInRoom,
	getAllItemsInRoom,
	loadRoom,
} from "../game/storage";
import type { Character, Item, Room } from "../types";
import { mergeClasses } from "../utils/tailwindMerge";
import { HighlightButton } from "./HighlightButton";
import { RoomInfoItem } from "./RoomInfoItem";

interface Props {
	className?: string;
	roomId: string;
	inspectId?: string | null;
	setInspectId?: React.Dispatch<React.SetStateAction<string | null>>;
	setActiveRoom: React.Dispatch<
		React.SetStateAction<{
			id: string;
			width: number;
			height: number;
		} | null>
	>;
}

export function RoomInfo({ ...props }: Props) {
	const [characters, setCharacters] = useState<Character[]>();
	const [items, setItems] = useState<Item[]>();
	const [roomInfo, setRoomInfo] = useState<Room>();
	const [currentRoomInfo, setCurrentRoomInfo] = useState<Room>();
	const {
		setPlayerActions,
		currentMapId,
		currentRoomId,
		isTurnEndHandling,
		eventSummary,
	} = useGameManager();

	// fetching useEffect
	useEffect(() => {
		async function fetchData() {
			if (!props.roomId || !currentRoomId) {
				return;
			}

			try {
				const fetchedRoomInfo: Room = await loadRoom(props.roomId);
				const fetchedCharacters: Character[] =
					await getAllCharactersInRoom(props.roomId);
				const fetchedItems: Item[] = await getAllItemsInRoom(
					props.roomId,
				);
				const currentRoom: Room = await loadRoom(currentRoomId);
				setCurrentRoomInfo(currentRoom);

				setRoomInfo(fetchedRoomInfo);
				setCharacters(fetchedCharacters);
				setItems(fetchedItems);
			} catch (error) {
				alert("Failed to load room data. " + error);
				console.error("Error fetching room data:", error);
			}
		}
		fetchData();
	}, [currentRoomId, props.roomId, isTurnEndHandling]);

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
						{currentRoomInfo?.connectedRooms?.includes(
							props.roomId,
						) && (
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
												(action) =>
													action.type === "move",
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
													currentMapId === "Heaven"
														? "Jesus"
														: "Big Shot",
												expression: "neutral",
												type: "move",
												destinationId: props.roomId,
											},
										];
									});
									props.setActiveRoom(null);
								}}
								className={`shrink-0`}
							>
								Move here
							</HighlightButton>
						)}
					</div>
					<p className="text-sm text-(--text-secondary)">
						{roomInfo.description}
					</p>
					{eventSummary &&
						props.roomId in eventSummary && (
							<>
								<h3 className="text-xl underline">Event summary:</h3>
								<div className="text-sm text-(--text-secondary)">
									{eventSummary[props.roomId]}
								</div>
							</>
						)}
					{items && items.length > 0 && (
						<div>
							<h3 className="text-xl underline">Items:</h3>
							<div className={`flex flex-col gap-3`}>
								{items.map((item) => (
									<RoomInfoItem
										inspectId={props.inspectId}
										setInspectId={props.setInspectId}
										key={item.id}
										id={item.id}
										description={item.description}
										state={item.state}
										asciiChar={item.asciiChar}
										colorHex={item.colorHex}
										className={`pl-4`}
										isItem
									></RoomInfoItem>
								))}
							</div>
						</div>
					)}
					{characters && characters.length > 0 && (
						<div>
							<h3 className="text-xl underline">Characters:</h3>
							<div className={`flex flex-col gap-3`}>
								{characters.map((character) => (
									<RoomInfoItem
										inspectId={props.inspectId}
										setInspectId={props.setInspectId}
										key={character.id}
										id={character.id}
										description={character.description}
										state={character.state}
										asciiChar={character.asciiChar}
										colorHex={character.colorHex}
										className={`pl-4`}
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
