import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { BgImage } from "./components/BgImage";
import { BottomBar } from "./components/BottomBar";
import { CharacterImages } from "./components/CharacterImages";
import { MainMenu } from "./components/MainMenu";
import { NarrativeBox } from "./components/NarrativeBox";
import { PlayerActionInputArea } from "./components/PlayerActionInputArea";
import { useGameManager } from "./game/gameManager";
import type { Action } from "./type";
import miracleSvgURL from "/miracle.svg?url";

function App() {
	const [isMainMenuOpen, setIsMainMenuOpen] = useState<boolean>(false);
	const [actions, setActions] = useState<Action[]>([]);
	const { isGameInitiating } = useGameManager();
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

	if (!assetsLoaded || isGameInitiating) {
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
			<motion.div
				variants={variants}
				initial="hidden"
				animate={isMainMenuOpen ? "hidden" : "visible"}
				className="absolute left-0 top-0 w-screen h-dvh flex flex-col p-6 pb-0 items-center gap-2"
			>
				<BgImage location="heaven" className={`-z-1`} />
				<CharacterImages className={`absolute bottom-0 w-full`}/>

				<div className="w-full relative grow">
					<PlayerActionInputArea
						setActions={setActions}
						actions={actions}
						className={`absolute mb-10 inset-x-0 bottom-0`}
					/>
				</div>

				<NarrativeBox
					className={`w-full`}
					setIsMainMenuOpen={setIsMainMenuOpen}
					setActions={setActions}
				/>
				<BottomBar />
			</motion.div>

			<AnimatePresence>
				{isMainMenuOpen && (
					<motion.div
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
