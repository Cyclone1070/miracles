import { motion, type Transition } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState, type MouseEventHandler } from "react";
import {
    getAllCharactersInRoom,
    getAllFurnitureInRoom,
    loadRoom,
} from "../game/storage";
import type { Character, Furniture, Room } from "../types";
import { mergeClasses } from "../utils/tailwindMerge";

interface Props {
	className?: string;
	roomId: string;
	transition?: Transition;
	onClick?: MouseEventHandler<HTMLDivElement>;
	style?: React.CSSProperties;
}

export function MapRoom({ ...props }: Props) {
	const [furnitures, setFurnitures] = useState<Furniture[]>();
	const [characters, setCharacters] = useState<Character[]>();
	const [roomInfo, setRoomInfo] = useState<Room>();
	
	const gridRef = useRef<HTMLDivElement>(null);
	// fetching useEffect
	useEffect(() => {
		async function fetchData() {
			try {
				const fetchedRoomInfo: Room = await loadRoom(props.roomId);
				const fetchedFurnitures: Furniture[] =
					await getAllFurnitureInRoom(props.roomId);
				const fetchedCharacters: Character[] =
					await getAllCharactersInRoom(props.roomId);

				setRoomInfo(fetchedRoomInfo);
				setFurnitures(fetchedFurnitures);
				setCharacters(fetchedCharacters);
			} catch (error) {
				alert("Failed to load room data. " + error);
				console.error("Error fetching room data:", error);
			}
		}
		fetchData();
	}, []);

	// calculate font size based on cell size
	useLayoutEffect(() => {
		if (!gridRef.current || !roomInfo) return;

		const cellWidth = gridRef.current.clientWidth / roomInfo.width;
		const cellHeight = gridRef.current.clientHeight / roomInfo.height;
		const cellSize = Math.min(cellWidth, cellHeight);

		const fontSize = Math.max(cellSize * 0.8); // Ensure minimum font size
		gridRef.current.style.fontSize = `${fontSize}px`;
	})

	return (
		<motion.div
			ref={gridRef}
			layoutId={props.roomId}
			transition={props.transition}
			onClick={props.onClick}
			className={mergeClasses(
				`bg-(--bg) border-4 border-(--accent) grid`,
				props.className,
			)}
			style={{
				...props.style,
				gridTemplateColumns: `repeat(${roomInfo?.width ?? 1}, minmax(0, 1fr))`,
				gridTemplateRows: `repeat(${roomInfo?.height ?? 1}, minmax(0, 1fr))`,
			}}
		>
			{furnitures?.map((furniture) => (
				<div
					key={furniture.id}
					className={`col-span-1 row-span-1 flex justify-center items-center w-full h-full`}
					style={{
						color: furniture.colorHex,
						gridColumnStart: furniture.gridPosition.x,
						gridRowStart: furniture.gridPosition.y,
					}}
				>
					{furniture.asciiChar}
				</div>
			))}
			{characters?.map((character) => (
				<div
					key={character.id}
					className={`col-span-1 row-span-1 flex justify-center items-center rounded-sm w-full h-full`}
					style={{
						backgroundColor: character.colorHex,
						gridColumnStart: character.gridPosition.x,
						gridRowStart: character.gridPosition.y,
					}}
				>
					{character.asciiChar}
				</div>
			))}
		</motion.div>
	);
}
