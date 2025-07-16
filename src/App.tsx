import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { GameScreen } from "./components/GameScreen";
import { MainMenu } from "./components/MainMenu";
import miracleSvgURL from "/miracle.svg?url";
import { GameManagerProvider } from "./game/gameManager";

function App() {
	const [isMainMenuOpen, setIsMainMenuOpen] = useState<boolean>(true);
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

	// Assets loading screen
	const [assetsLoaded, setAssetsLoaded] = useState(false);
	useEffect(() => {
		const loadVideo = new Promise((resolve) => {
			const video = document.createElement("video");
			// Check if the browser can play webm. If not, fall back to mp4.
			const videoSrc = video.canPlayType("video/webm")
				? "/splash-screen.webm"
				: "/splash-screen.mp4";
			video.src = videoSrc;
			video.oncanplaythrough = resolve;
			video.onerror = resolve;
			video.load();
		});
		Promise.all([loadVideo]).then(() => {
			setAssetsLoaded(true);
		});
	}, []);

	if (!assetsLoaded) {
		return (
			<div className="w-screen h-screen flex flex-col gap-5 items-center justify-center text-white">
				<motion.img
					src={miracleSvgURL}
					alt="Loading icon"
					className="h-12 w-12"
					animate={{
						rotate: [0, 180, 180, 180],
						scale: [1, 1, 0.5, 1],
					}}
					transition={{
						duration: 2,
						ease: "easeInOut",
						times: [0, 0.5, 0.75, 1],
						repeat: Infinity,
						repeatDelay: 0.2,
					}}
				/>
				Loading assets...
			</div>
		);
	}

	return (
		<>
			<AnimatePresence>
				{!isMainMenuOpen && (
					<GameManagerProvider>
						<GameScreen
							isMainMenuOpen={isMainMenuOpen}
							setIsMainMenuOpen={setIsMainMenuOpen}
						/>
					</GameManagerProvider>
				)}
				{isMainMenuOpen && (
					<motion.div
						key="main-menu"
						variants={variants}
						initial={"hidden"}
						animate={"visible"}
						exit={"hidden"}
					>
						<MainMenu
							setIsMainMenuOpen={setIsMainMenuOpen}
						></MainMenu>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}

export default App;
