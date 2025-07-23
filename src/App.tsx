import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { GameScreen } from "./components/GameScreen";
import { MainMenu } from "./components/MainMenu";
import { GameManagerProvider } from "./context/GameContext";
import miracleSvgURL from "/miracle.svg?url";

function App() {
	const [isMainMenuOpen, setIsMainMenuOpen] = useState<boolean>(false);
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

		const preloadImages = async () => {
			const imageModules = import.meta.glob(
				"/*.webp",
			) as Record<string, () => Promise<{ default: string }>>;

			const promises = Object.values(imageModules).map((loadImage) => {
				return new Promise((resolve, reject) => {
					loadImage()
						.then((img) => {
							const image = new Image();
							image.src = img.default;
							image.onload = resolve;
							image.onerror = reject;
						})
						.catch(reject);
				});
			});

			await Promise.all(promises);
		};

		Promise.all([loadVideo, preloadImages()]).then(() => {
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
							className={`absolute left-0 top-0 w-screen h-dvh`}
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
