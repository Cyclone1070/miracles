import { motion } from "motion/react";
import { useState } from "react";
import type { Action } from "../type";
import { BgImage } from "./BgImage";
import { BottomBar } from "./BottomBar";
import { CharacterImages } from "./CharacterImages";
import { NarrativeBox } from "./NarrativeBox";
import { PlayerActionInputArea } from "./PlayerActionInputArea";

interface Props {
	className?: string;
	isMainMenuOpen: boolean;
	setIsMainMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function GameScreen({ ...props }: Props) {
	const [actions, setActions] = useState<Action[]>([]);
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
			className="absolute left-0 top-0 w-screen h-dvh flex flex-col p-6 pb-0 items-center gap-2"
		>
			<BgImage location="heaven" className={`-z-1`} />
			<CharacterImages className={`absolute bottom-0 w-full`} />

			<div className="w-full relative grow">
				<PlayerActionInputArea
					setActions={setActions}
					actions={actions}
					className={`absolute mb-10 inset-x-0 bottom-0`}
				/>
			</div>

			<NarrativeBox
				className={`w-full`}
				setIsMainMenuOpen={props.setIsMainMenuOpen}
				setActions={setActions}
			/>
			<BottomBar />
		</motion.div>
	);
}
