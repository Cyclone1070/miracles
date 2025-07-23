import { motion, type Transition } from "motion/react";
import {
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
	type MouseEventHandler,
} from "react";
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

export function MapRoom({ ...props }: Props) {
	const [items, setItems] = useState<Item[]>();
	const [characters, setCharacters] = useState<Character[]>();
	const [roomInfo, setRoomInfo] = useState<Room>();

	const gridRef = useRef<HTMLDivElement>(null);
	// fetching useEffect
	useEffect(() => {
		async function fetchData() {
			try {
				const fetchedRoomInfo: Room = await loadRoom(props.roomId);
				const fetchedItems: Item[] = await getAllItemsInRoom(
					props.roomId,
				);
				const fetchedCharacters: Character[] =
					await getAllCharactersInRoom(props.roomId);

				setRoomInfo(fetchedRoomInfo);
				setItems(fetchedItems);
				setCharacters(fetchedCharacters);
			} catch (error) {
				alert("Failed to load room data. " + error);
				console.error("Error fetching room data:", error);
			}
		}
		fetchData();
	}, [props.roomId]);

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
			layoutId={props.roomId}
			transition={props.transition}
			onClick={props.onClick}
			className={mergeClasses(
				`bg-(--bg) border-4 border-(--accent) grid text-white`,
				props.className,
			)}
			style={{
				...props.style,
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
						disabled={props.onClick !== undefined}
						key={items.id}
						onClick={() => {
							if (props.setInspectId) {
								props.setInspectId(items.id);
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
					disabled={props.onClick !== undefined}
					key={character.id}
					onClick={() => {
						if (props.setInspectId) {
							props.setInspectId(character.id);
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
