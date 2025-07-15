import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { BgImage } from "./components/BgImage";
import { BottomBar } from "./components/BottomBar";
import { MainMenu } from "./components/MainMenu";
import { NarrativeBox } from "./components/NarrativeBox";
import { AddPlayerActionButtons } from "./components/AddPlayerActionButtons";
import { PlayerActionInputArea } from "./components/PlayerActionInputArea";
import type { Action } from "./type";
import miracleSvgURL from "/miracle.svg?url";
import { initialiseGame } from "./game/gameManager";

function App() {
	const [directoryHandle, setDirectoryHandle] =
		useState<FileSystemDirectoryHandle>();
	const [isMainMenuOpen, setIsMainMenuOpen] = useState<boolean>(false);
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
	// Refs for narrativeBg calculation
	const addActionButtonRef = useRef<HTMLButtonElement>(null);

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
		Promise.all([loadVideo, initialiseGame()]).then(() => {
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
				{isMainMenuOpen && (
					<motion.div
						variants={variants}
						initial={"hidden"}
						animate={"visible"}
						exit={"hidden"}
					>
						<MainMenu
							directoryHandle={directoryHandle}
							setDirectoryHandle={setDirectoryHandle}
							setIsMainMenuOpen={setIsMainMenuOpen}
						></MainMenu>
					</motion.div>
				)}
			</AnimatePresence>

			<motion.div
				variants={variants}
				initial="hidden"
				animate={isMainMenuOpen ? "hidden" : "visible"}
				className="absolute left-0 top-0 w-screen h-dvh flex flex-col p-6 pb-0 items-center gap-2"
			>
				<BgImage location="heaven" className={`-z-1`} />

				<div className="w-full relative grow">
					<PlayerActionInputArea
						setActions={setActions}
						actions={actions}
						className={`absolute mb-10 inset-x-0 bottom-0`}
					/>
				</div>

				<NarrativeBox
					className={`w-full`}
					isNameBoxLeft={true}
					addActionButtonRef={addActionButtonRef}
				>
					<AddPlayerActionButtons
						setIsMainMenuOpen={setIsMainMenuOpen}
						setActions={setActions}
						addActionButtonRef={addActionButtonRef}
					/>
				</NarrativeBox>
				<BottomBar></BottomBar>
			</motion.div>
		</>
	);
}

export default App;
