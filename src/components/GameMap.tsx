import { AnimatePresence, motion, type Transition } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useGameManager } from "../context/GameContext";
import { mergeClasses } from "../utils/tailwindMerge";
import { HeavenMap } from "./HeavenMap";
import { MapRoom } from "./MapRoom";
import { RoomInfo } from "./RoomInfo";

interface Props {
	className?: string;
}

export function GameMap({ ...props }: Props) {
	const { currentMapId } = useGameManager();
	const [isMapExpanded, setIsMapExpanded] = useState(false);
	const [inspectId, setInspectId] = useState<string | null>(null);
	const constraintRef = useRef<HTMLDivElement>(null);
	const roomStyles = `bg-(--bg) border-4 border-(--accent) -m-[2px] cursor-pointer will-change-transform`;
	const doorStyles = `border-green-400 -m-[2px] z-1 cursor-pointer`;
	const commonTransition: Transition = {
		ease: "easeInOut",
		duration: 0.3,
	};
	const [activeRoom, setActiveRoom] = useState<{
		id: string;
		width: number;
		height: number;
	} | null>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				event.target instanceof HTMLElement &&
				!event.target.closest("[data-map-none-close-click]")
			) {
				setInspectId(null);
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
		currentMapId && (
			<>
				{activeRoom && (
					<div
						className={`absolute inset-0 z-2`}
						onClick={(e) => {
							if (isMapExpanded) {
								e.stopPropagation();
							}
						}}
					></div>
				)}
				<div
					className={mergeClasses(
						`relative flex justify-center items-center`,
						props.className,
					)}
				>
					{/* map viewport */}
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
							`will-change-transform overflow-hidden w-full h-full max-w-min max-h-min flex justify-center items-center rounded-md ` +
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
							className={`w-min h-min p-1 grid auto-rows-[1.25rem] auto-cols-[1.25rem]`}
							animate={
								activeRoom
									? { visibility: "hidden", opacity: 0 }
									: { visibility: "visible", opacity: 1 }
							}
						>
							<HeavenMap
								isMapExpanded={isMapExpanded}
								setActiveRoom={setActiveRoom}
								commonTransition={commonTransition}
								doorStyles={doorStyles}
								roomStyles={roomStyles}
							/>
						</motion.div>
					</motion.div>
					<AnimatePresence>
						{activeRoom && (
							<div
								className={
									`fixed inset-0 m-auto flex flex-col gap-4 z-10 p-4 max-w-200 ` +
									`md:absolute bottom-10 md:flex-row`
								}
							>
								<motion.div
									layoutId="map-viewport"
									className={`flex-2 basis-0 flex flex-col justify-center items-center`}
									transition={commonTransition}
								>
									<div
										className={
											`h-full max-w-full max-h-full flex justify-center items-center ` +
											`md:w-full md:h-auto`
										}
										style={{
											aspectRatio: `${activeRoom.width} / ${activeRoom.height}`,
										}}
									>
										<MapRoom
											roomId={activeRoom.id}
											transition={commonTransition}
											className={
												`w-full max-h-full max-w-full ` +
												`md:h-full md:w-auto`
											}
											style={{
												aspectRatio: `${activeRoom.width} / ${activeRoom.height}`,
											}}
											setInspectId={setInspectId}
										></MapRoom>
									</div>
								</motion.div>
								<motion.div
									data-map-none-close-click
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 20 }}
									transition={commonTransition}
									className={`flex-3 basis-0 bg-(--theme-bg) md:bg-(--bg) rounded-xl overflow-y-auto`}
								>
									<RoomInfo
										setActiveRoom={setActiveRoom}
										inspectId={inspectId}
										setInspectId={setInspectId}
										roomId={activeRoom.id}
										className={`w-full`}
									></RoomInfo>
								</motion.div>
							</div>
						)}
					</AnimatePresence>
				</div>
			</>
		)
	);
}
