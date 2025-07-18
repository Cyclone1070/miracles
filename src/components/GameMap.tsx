import { motion } from "motion/react";
import { useRef } from "react";
import { mergeClasses } from "../utils/tailwindMerge";

interface Props {
	className?: string;
	isMapExpanded: boolean;
}

export function GameMap({ ...props }: Props) {
	const constraintRef = useRef<HTMLDivElement>(null);
	const roomStyles = `bg-(--bg) border-4 border-(--accent) -m-[2px]`;
	const doorStyles = `border-green-400 -m-[2px] z-1`;
	return (
		<div className={mergeClasses(`relative`, props.className)}>
			{/* map view port */}
			<motion.div
				variants={{
					collapsed: {
						scale: 0.5,
					},
					expanded: {
						scale: 1,
					},
				}}
				layout
				transition={{
					ease: "easeInOut",
					duration: 0.2,
				}}
				animate={props.isMapExpanded ? "expanded" : "collapsed"}
				ref={constraintRef}
				className={`will-change-transform overflow-hidden max-w-min max-h-min flex justify-center items-center rounded-md ${props.isMapExpanded ? "" :"absolute top-0 right-0 md:bottom-0 md:top-auto md:translate-y-1/4 translate-x-1/4 -translate-y-1/4"}`}
			>
				{/* draggable map */}
				<motion.div
					drag
					dragConstraints={constraintRef}
					layout
					transition={{
						ease: "easeInOut",
						duration: 0.2,
					}}
					className={`w-min h-min p-5 grid auto-rows-[1rem] auto-cols-[1rem]`}
				>
					{/* heaven couryard*/}
					<div
						className={`${roomStyles} row-start-1 col-start-1 row-span-9 col-span-9`}
					></div>
					<div
						className={`${doorStyles} row-start-5 col-start-9 border-r-4`}
					></div>
					{/* hallway */}
					<div
						className={`${roomStyles} row-start-5 col-start-10 row-span-1 col-span-2`}
					></div>
					{/* history hall */}
					<div
						className={`${roomStyles} row-start-3 col-start-12 row-span-5 col-span-5`}
					></div>
					<div
						className={`${doorStyles} row-start-5 col-start-12 border-l-4`}
					></div>
				</motion.div>
			</motion.div>
		</div>
	);
}
