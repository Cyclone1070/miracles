import type { Transition } from "motion/react";
import type { Room } from "../types";
import { MapRoom } from "./MapRoom";

interface Props {
	className?: string;
	isMapExpanded: boolean;
	setActiveRoom: React.Dispatch<React.SetStateAction<Room | null>>;
	commonTransition: Transition;
	doorStyles: string;
	roomStyles: string;
}

export function HeavenMap({ ...props }: Props) {
	return (
		<>
			{/* heaven couryard*/}
			<MapRoom
				roomId="Heaven Court Yard"
				transition={props.commonTransition}
				onClick={() => {
					if (!props.isMapExpanded) return;
					props.setActiveRoom({
						id: "Heaven Court Yard",
						description:
							"A serene, celestial realm filled with soft clouds and gentle light. The air is filled with a sense of peace and tranquility.",
						connectedRooms: ["History Hall"],
						inViewRooms: ["History Hall"],
						width: 9,
						height: 9,
					});
				}}
				className={`${props.roomStyles} row-start-1 col-start-1 row-span-9 col-span-9 `}
			></MapRoom>
			<div
				className={`${props.doorStyles} row-start-5 col-start-9 border-r-4`}
			></div>
			{/* hallway */}
			<div
				className={`${props.roomStyles} row-start-5 col-start-10 row-span-1 col-span-2`}
			></div>
			{/* history hall */}
			<MapRoom
				roomId="History Hall"
				transition={props.commonTransition}
				onClick={() => {
					if (!props.isMapExpanded) return;
					props.setActiveRoom({
						id: "History Hall",
						description:
							"A small hall filled with the history of heaven, with paintings and artifacts from various eras. The walls are lined with portraits of previous Jesus in golden frames.",
						connectedRooms: ["Heaven Court Yard"],
						width: 5,
						height: 5,
					});
				}}
				className={`${props.roomStyles} row-start-3 col-start-12 row-span-5 col-span-5`}
			></MapRoom>
			<div
				className={`${props.doorStyles} row-start-5 col-start-12 border-l-4`}
			></div>
		</>
	);
}
