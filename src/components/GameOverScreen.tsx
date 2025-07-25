import { motion } from "motion/react";

export function GameOverScreen() {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 1.5 }}
			className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50"
		>
			<h1 className="text-8xl font-bold text-red-600 mb-4">GAME OVER</h1>
			<p className="text-2xl text-white">
				Thanks for playing!
			</p>
		</motion.div>
	);
}
