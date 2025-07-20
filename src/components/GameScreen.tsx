import { motion } from "motion/react";
import { BgImage } from "./BgImage";
import { BottomBar } from "./BottomBar";
import { CharacterImages } from "./CharacterImages";
import { GameMap } from "./GameMap";
import { NarrativeBox } from "./NarrativeBox";
import { PlayerActionInputArea } from "./PlayerActionInputArea";
import { mergeClasses } from "../utils/tailwindMerge";

interface Props {
	className?: string;
	isMainMenuOpen: boolean;
	setIsMainMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function GameScreen({ ...props }: Props) {
	const variants = {
		hidden: {
			opacity: 0,
			visibility: "hidden",
			transition: { duration: 0.7, ease: "easeInOut" as const },
		},
		visible: {
			opacity: 1,
			visibility: "visible",
			transition: { delay: 0.7, duration: 1, ease: "easeInOut" as const },
		},
	};
	return (
		<motion.div
			variants={variants}
			initial="hidden"
			animate="visible"
			exit="hidden"
			className={mergeClasses(
				`flex flex-col p-6 pb-0 items-center gap-2`,
				props.className,
			)}
		>
			<BgImage className={`-z-1`} />
			<CharacterImages className={`absolute bottom-0 w-full`} />

			{/* upper part of the screen */}
			<div className="w-full relative mb-10 flex flex-col flex-1 min-h-0 ">
				<GameMap
					className={`self-center w-full h-full max-w-200`}
				></GameMap>
				<PlayerActionInputArea
					className={`absolute inset-x-0 bottom-0`}
				/>
			</div>

			<NarrativeBox
				className={`w-full h-54 max-w-200`}
				setIsMainMenuOpen={props.setIsMainMenuOpen}
			/>
			<BottomBar />
		</motion.div>
	);
}
