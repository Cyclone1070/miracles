import { motion } from "motion/react";
import { useGameManager } from "../context/GameContext";
import { HighlightButton } from "./HighlightButton";

export function GameOverScreen() {
	const { retryFromLastSave } = useGameManager();

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 1.5 }}
			className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50"
		>
			<h1 className="text-8xl font-bold text-red-600 mb-4">GAME OVER</h1>
			<p className="text-2xl text-white mb-8">
				Thanks for playing!
			</p>
			<HighlightButton
				onClick={retryFromLastSave}
				className="px-8 py-4 bg-red-700 text-white font-bold rounded-lg transition-colors"
			>
				Retry
			</HighlightButton>
		</motion.div>
	);
}
