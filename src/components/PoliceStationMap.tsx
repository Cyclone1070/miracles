import type { Transition } from "motion/react";
import { MapRoom } from "./MapRoom";

interface Props {
	className?: string;
	isMapExpanded: boolean;
	setActiveRoom: React.Dispatch<
		React.SetStateAction<{
			id: string;
			width: number;
			height: number;
		} | null>
	>;
	commonTransition: Transition;
	doorStyles: string;
	roomStyles: string;
}

export function PoliceStationMap({ ...props }: Props) {
	return (
		<>
			<MapRoom
				roomId="Outside Street"
				transition={props.commonTransition}
				className={`${props.roomStyles} row-start-1 col-start-1 row-span-9 col-span-29`}
				onClick={() => {
					if (!props.isMapExpanded) return;
					props.setActiveRoom({
						id: "Outside Street",
						width: 29,
						height: 9,
					});
				}}
			></MapRoom>
			<MapRoom
				roomId="Lobby"
				transition={props.commonTransition}
				className={`${props.roomStyles} row-start-10 col-start-11 row-span-9 col-span-9`}
				onClick={() => {
					if (!props.isMapExpanded) return;
					props.setActiveRoom({
						id: "Lobby",
						width: 9,
						height: 9,
					});
				}}
			></MapRoom>
			<MapRoom
				roomId="Front Hallway"
				transition={props.commonTransition}
				className={`${props.roomStyles} row-start-19 col-start-1 row-span-5 col-span-29`}
				onClick={() => {
					if (!props.isMapExpanded) return;
					props.setActiveRoom({
						id: "Front Hallway",
						width: 29,
						height: 5,
					});
				}}
			></MapRoom>
			<MapRoom
				roomId="Patrol Room"
				transition={props.commonTransition}
				className={`${props.roomStyles} row-start-10 col-start-21 row-span-9 col-span-9`}
				onClick={() => {
					if (!props.isMapExpanded) return;
					props.setActiveRoom({
						id: "Patrol Room",
						width: 9,
						height: 9,
					});
				}}
			></MapRoom>
			<MapRoom
				roomId="Captain Office"
				transition={props.commonTransition}
				className={`${props.roomStyles} row-start-10 col-start-1 row-span-9 col-span-9`}
				onClick={() => {
					if (!props.isMapExpanded) return;
					props.setActiveRoom({
						id: "Captain Office",
						width: 9,
						height: 9,
					});
				}}
			></MapRoom>
			<MapRoom
				roomId="Back Hallway"
				transition={props.commonTransition}
				className={`${props.roomStyles} row-start-24 col-start-12 row-span-27 col-span-5`}
				onClick={() => {
					if (!props.isMapExpanded) return;
					props.setActiveRoom({
						id: "Back Hallway",
						width: 5,
						height: 27,
					});
				}}
			></MapRoom>
			<MapRoom
				roomId="Parking Lot"
				transition={props.commonTransition}
				className={`${props.roomStyles} row-start-1 col-start-30 row-span-32 col-span-7`}
				onClick={() => {
					if (!props.isMapExpanded) return;
					props.setActiveRoom({
						id: "Parking Lot",
						width: 7,
						height: 32,
					});
				}}
			></MapRoom>
			<MapRoom
				roomId="Break Room"
				transition={props.commonTransition}
				className={`${props.roomStyles} row-start-24 col-start-17 row-span-9 col-span-13`}
				onClick={() => {
					if (!props.isMapExpanded) return;
					props.setActiveRoom({
						id: "Break Room",
						width: 13,
						height: 9,
					});
				}}
			></MapRoom>
			<MapRoom
				roomId="Security Room"
				transition={props.commonTransition}
				className={`${props.roomStyles} row-start-35 col-start-17 row-span-5 col-span-7`}
				onClick={() => {
					if (!props.isMapExpanded) return;
					props.setActiveRoom({
						id: "Security Room",
						width: 7,
						height: 5,
					});
				}}
			></MapRoom>
			<MapRoom
				roomId="Evidence Locker"
				transition={props.commonTransition}
				className={`${props.roomStyles} row-start-42 col-start-17 row-span-5 col-span-11`}
				onClick={() => {
					if (!props.isMapExpanded) return;
					props.setActiveRoom({
						id: "Evidence Locker",
						width: 11,
						height: 5,
					});
				}}
			></MapRoom>
			<MapRoom
				roomId="Forensics Lab"
				transition={props.commonTransition}
				className={`${props.roomStyles} row-start-42 col-start-28 row-span-9 col-span-11`}
				onClick={() => {
					if (!props.isMapExpanded) return;
					props.setActiveRoom({
						id: "Forensics Lab",
						width: 11,
						height: 9,
					});
				}}
			></MapRoom>
			<MapRoom
				roomId="Observation Room"
				transition={props.commonTransition}
				className={`${props.roomStyles} row-start-24 col-start-1 row-span-9 col-span-11`}
				onClick={() => {
					if (!props.isMapExpanded) return;
					props.setActiveRoom({
						id: "Observation Room",
						width: 11,
						height: 9,
					});
				}}
			></MapRoom>
			<MapRoom
				roomId="Interrogation Room"
				transition={props.commonTransition}
				className={`${props.roomStyles} row-start-33 col-start-7 row-span-5 col-span-5`}
				onClick={() => {
					if (!props.isMapExpanded) return;
					props.setActiveRoom({
						id: "Interrogation Room",
						width: 5,
						height: 5,
					});
				}}
			></MapRoom>
			<MapRoom
				roomId="Holding Cells"
				transition={props.commonTransition}
				className={`${props.roomStyles} row-start-38 col-start-5 row-span-11 col-span-7`}
				onClick={() => {
					if (!props.isMapExpanded) return;
					props.setActiveRoom({
						id: "Holding Cells",
						width: 7,
						height: 11,
					});
				}}
			></MapRoom>
		</>
	);
}
