import { motion, type Transition } from "motion/react";
import {
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
	type MouseEventHandler,
} from "react";
import { useGameManager } from "../context/GameContext";
import {
	getAllCharactersInRoom,
	getAllItemsInRoom,
	loadRoom,
} from "../game/storage";
import type { Character, Item, Room } from "../types";
import { mergeClasses } from "../utils/tailwindMerge";
import { HighlightButton } from "./HighlightButton";

interface Props {
	className?: string;
	roomId: string;
	transition?: Transition;
	onClick?: MouseEventHandler<HTMLDivElement>;
	style?: React.CSSProperties;
	setInspectId?: React.Dispatch<React.SetStateAction<string | null>>;
}

export function MapRoom({
	className,
	roomId,
	transition,
	onClick,
	style,
	setInspectId,
}: Props) {
	const [items, setItems] = useState<Item[]>();
	const [characters, setCharacters] = useState<Character[]>();
	const [roomInfo, setRoomInfo] = useState<Room>();

	const { isTurnEndHandling } = useGameManager();

	const gridRef = useRef<HTMLDivElement>(null);
	// fetching useEffect
	useEffect(() => {
		async function fetchData() {
			try {
				const fetchedRoomInfo: Room = await loadRoom(roomId);
				const fetchedItems: Item[] = await getAllItemsInRoom(
					roomId,
				);
				const fetchedCharacters: Character[] =
					await getAllCharactersInRoom(roomId);

				setRoomInfo(fetchedRoomInfo);
				setItems(fetchedItems);
				setCharacters(fetchedCharacters);
			} catch (error) {
				alert("Failed to load room data. " + error);
				console.error("Error fetching room data:", error);
			}
		}
		fetchData();
	}, [roomId, isTurnEndHandling]);

	// calculate font size based on cell size
	useLayoutEffect(() => {
		if (!gridRef.current || !roomInfo) return;

		const cellWidth = gridRef.current.clientWidth / roomInfo.width;
		const cellHeight = gridRef.current.clientHeight / roomInfo.height;
		const cellSize = Math.min(cellWidth, cellHeight);

		const fontSize = Math.max(cellSize * 0.8); // Ensure minimum font size
		gridRef.current.style.fontSize = `${fontSize}px`;
	}, [roomInfo]);

	return (
		<motion.div
			data-map-none-close-click
			ref={gridRef}
			layoutId={roomId}
			transition={transition}
			onClick={onClick}
			className={mergeClasses(
				`bg-(--bg) border-4 border-(--accent) grid text-white`,
				className,
			)}
			style={{
				...style,
				gridTemplateColumns: `repeat(${roomInfo?.width ?? 1}, minmax(0, 1fr))`,
				gridTemplateRows: `repeat(${roomInfo?.height ?? 1}, minmax(0, 1fr))`,
			}}
		>
			{items?.map((items) => {
				if (!items.gridPosition) {
					return;
				}
				return (
					<HighlightButton
						disabled={onClick !== undefined}
						key={items.id}
						onClick={() => {
							if (setInspectId) {
								setInspectId(items.id);
							}
						}}
						className={`col-span-1 row-span-1 flex justify-center items-center w-full h-full bg-transparent shadow-none font-bold`}
						style={{
							color: items.colorHex,
							gridColumnStart: items.gridPosition.x,
							gridRowStart: items.gridPosition.y,
						}}
					>
						{items.asciiChar}
					</HighlightButton>
				);
			})}
			{characters?.map((character) => (
				<HighlightButton
					disabled={onClick !== undefined}
					key={character.id}
					onClick={() => {
						if (setInspectId) {
							setInspectId(character.id);
						}
					}}
					className={`col-span-1 row-span-1 flex justify-center items-center rounded-sm w-full h-full bg-transparent shadow-none`}
					style={{
						backgroundColor: character.colorHex,
						gridColumnStart: character.gridPosition.x,
						gridRowStart: character.gridPosition.y,
					}}
				>
					{character.asciiChar}
				</HighlightButton>
			))}
		</motion.div>
	);
}
