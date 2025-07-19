import { AnimatePresence, motion, type Transition } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Room } from "../type";
import { mergeClasses } from "../utils/tailwindMerge";
import { MapRoom } from "./MapRoom";

interface Props {
	className?: string;
}

export function GameMap({ ...props }: Props) {
	const [isMapExpanded, setIsMapExpanded] = useState(false);
	const constraintRef = useRef<HTMLDivElement>(null);
	const roomStyles = `bg-(--bg) border-4 border-(--accent) -m-[2px] cursor-pointer will-change-transform`;
	const doorStyles = `border-green-400 -m-[2px] z-1 cursor-pointer`;
	const commonTransition: Transition = {
		ease: "easeInOut",
		duration: 0.3,
	};
	const [activeRoom, setActiveRoom] = useState<Room | null>(null);
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				event.target instanceof HTMLElement &&
				!event.target.closest("[data-map-none-close-click]")
			) {
				if (activeRoom) {
					setActiveRoom(null);
					return;
				} else {
					setIsMapExpanded(false);
				}
			}
		}

		if (isMapExpanded) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isMapExpanded, activeRoom]);
	return (
		<>
			<div
				className={mergeClasses(
					`relative flex justify-center items-center`,
					props.className,
				)}
			>
				{/* map view port */}
				<motion.div
					layoutId="map-viewport"
					data-map-none-close-click
					variants={{
						collapsed: {
							scale: 0.5,
						},
						expanded: {
							scale: 1,
						},
					}}
					transition={commonTransition}
					animate={isMapExpanded ? "expanded" : "collapsed"}
					ref={constraintRef}
					className={
						`will-change-transform overflow-hidden max-w-min max-h-min flex justify-center items-center rounded-md ` +
						`${!isMapExpanded && "absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 md:bottom-0 md:top-auto md:translate-y-1/4 cursor-pointer"} `
					}
					onClick={() => {
						if (!isMapExpanded) {
							setIsMapExpanded((prev) => !prev);
						}
					}}
				>
					{/* draggable map */}
					<motion.div
						drag
						dragConstraints={constraintRef}
						layout
						transition={commonTransition}
						className={`w-min h-min p-2 grid auto-rows-[1rem] auto-cols-[1rem]`}
					>
						{/* heaven couryard*/}
						<MapRoom
							id="Heaven Court Yard"
							transition={commonTransition}
							onClick={() => {
								if (!isMapExpanded) return;
								setActiveRoom({
									id: "Heaven Court Yard",
									description:
										"A serene, celestial realm filled with soft clouds and gentle light. The air is filled with a sense of peace and tranquility.",
									connectedRooms: ["History Hall"],
									inViewRooms: ["History Hall"],
									width: 9,
									height: 9,
								});
							}}
							className={`${roomStyles} row-start-1 col-start-1 row-span-9 col-span-9 `}
						></MapRoom>
						<div
							className={`${doorStyles} row-start-5 col-start-9 border-r-4`}
						></div>
						{/* hallway */}
						<div
							className={`${roomStyles} row-start-5 col-start-10 row-span-1 col-span-2`}
						></div>
						{/* history hall */}
						<MapRoom
							id="History Hall"
							transition={commonTransition}
							onClick={() => {
								if (!isMapExpanded) return;
								setActiveRoom({
									id: "History Hall",
									description:
										"A small hall filled with the history of heaven, with paintings and artifacts from various eras. The walls are lined with portraits of previous Jesus in golden frames.",
									connectedRooms: ["Heaven Court Yard"],
									width: 5,
									height: 5,
								});
							}}
							className={`${roomStyles} row-start-3 col-start-12 row-span-5 col-span-5`}
						></MapRoom>
						<div
							className={`${doorStyles} row-start-5 col-start-12 border-l-4`}
						></div>
					</motion.div>
				</motion.div>
				<AnimatePresence>
					{activeRoom && (
						<div
							className={`fixed inset-0 flex flex-col gap-4 z-10 p-4`}
						>
							<motion.div
								layoutId="map-viewport"
								className={`grow-3 basis-0 flex flex-col justify-center items-center`}
								transition={commonTransition}
							>
								<MapRoom
									id={activeRoom.id}
									transition={commonTransition}
									className={`bg-(--bg) w-full max-w-full max-h-full border-4 border-(--accent)`}
									style={{
										aspectRatio: `${activeRoom.width} / ${activeRoom.height}`,
									}}
								></MapRoom>
							</motion.div>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 20 }}
								transition={commonTransition}
								className={`grow-2 basis-0 bg-black rounded-xl`}
							></motion.div>
						</div>
					)}
				</AnimatePresence>
			</div>
		</>
	);
}

