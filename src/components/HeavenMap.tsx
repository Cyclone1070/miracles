import type { Transition } from "motion/react";
import { MapRoom } from "./MapRoom";

interface Props {
	className?: string;
	isMapExpanded: boolean;
	setActiveRoom: React.Dispatch<React.SetStateAction<{id: string, width: number, height: number}| null>>;
	commonTransition: Transition;
	doorStyles: string;
	roomStyles: string;
}

export function HeavenMap({ ...props }: Props) {
	return (
		<>
			{/* heaven couryard*/}
			<MapRoom
				roomId="Heaven Courtyard"
				transition={props.commonTransition}
				onClick={() => {
					if (!props.isMapExpanded) return;
					props.setActiveRoom({
						id: "Heaven Courtyard",
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
