import { motion } from "motion/react";
import { useGameManager } from "../context/GameContext";

export function DaySplashScreen() {
	const { currentTurn, advanceTurn, currentDay } = useGameManager();

	if (currentTurn?.type !== "time") {
		return null;
	}

	return (
		<motion.div
			animate={{ opacity: [0, 1, 1, 0] }}
			transition={{ duration: 4, times: [0, 0.2, 0.8, 1] }}
			className="absolute inset-0 bg-(--theme-bg) flex items-center justify-center z-50 text-(--text)"
		>
			<motion.div
				className="flex flex-col items-center gap-4"
				animate={{ opacity: [1, 1, 0] }}
				transition={{ duration: 4, times: [0, 0.8, 1] }}
				onAnimationComplete={() => {
					advanceTurn();
				}}
			>
				<h1 className="text-6xl font-bold">Day: {currentDay}</h1>
				{currentTurn.title && (
					<h2 className="text-4xl">{currentTurn.title}</h2>
				)}
			</motion.div>
		</motion.div>
	);
}
