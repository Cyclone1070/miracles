import { motion } from "motion/react";
import { useGameManager } from "../context/GameContext";

export function DaySplashScreen() {
	const { currentTurn, advanceTurn, currentDay } = useGameManager();

	if (currentTurn?.type !== "time") {
		return null;
	}

	return (
		<div className="absolute inset-0 bg-[--theme-bg] flex items-center justify-center z-50 text-[--theme-fg]">
			<motion.div
				className="text-center"
				animate={{ opacity: [0, 1, 1, 0] }}
				transition={{ duration: 4, times: [0, 0.2, 0.8, 1] }}
				onAnimationComplete={() => {
					advanceTurn();
				}}
			>
				<h1 className="text-6xl font-bold">Day: {currentDay}</h1>
				{currentTurn.title && (
					<h2 className="text-4xl">{currentTurn.title}</h2>
				)}
			</motion.div>
		</div>
	);
}
