import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { BgImage } from "./components/BgImage";
import { HighlightButton } from "./components/HighlightButton";
import { MainMenu } from "./components/MainMenu";
import { NarrativeBox } from "./components/NarrativeBox";
import { PlayerActionButtons } from "./components/PlayerActionButtons";
import { PlayerActionTextArea } from "./components/PlayerActionTextArea";
import type { Action } from "./type";
import miracleSvgURL from "/miracle.svg?url";

function App() {
	const [directoryHandle, setDirectoryHandle] =
		useState<FileSystemDirectoryHandle>();
	const [isMainMenuOpen, setIsMainMenuOpen] = useState<boolean>(false);
	const [actions, setActions] = useState<Action[]>([
		{ id: "1", expression: "neutral", type: "do", action: "test" },
	]);
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
	const actionButtonRef = useRef<HTMLButtonElement>(null);

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
		});
		loadVideo.then(() => {
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
				className="absolute left-0 top-0 w-screen h-dvh flex flex-col p-6 pb-10 items-center"
			>
				<BgImage location="heaven" className={`-z-1`} />

				<div className="grow"></div>

				<NarrativeBox
					className={`w-full`}
					isNameBoxLeft={true}
					actionButtonRef={actionButtonRef}
				>
					<PlayerActionButtons
						setActions={setActions}
						actionButtonRef={actionButtonRef}
					/>

					<PlayerActionTextArea
						setActions={setActions}
						actions={actions}
						className={`absolute mb-10 bottom-full inset-x-0`}
					/>
				</NarrativeBox>

				{/* back button */}
				<HighlightButton
					className={`absolute top-0 left-0 m-4 rounded-full w-10 h-10 text-center`}
					onClick={() => {
						setIsMainMenuOpen(true);
					}}
				>
					&lt;
				</HighlightButton>
			</motion.div>
		</>
	);
}

export default App;
