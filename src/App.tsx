import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { ActionButton } from "./components/ActionButton";
import { BgImage } from "./components/BgImage";
import { MainMenu } from "./components/MainMenu";
import { NarrativeBox } from "./components/NarrativeBox";
import { PlayerActionButtons } from "./components/PlayerActionButtons";
import { PlayerActionTextArea } from "./components/PlayerActionTextArea";
import type { Action } from "./type";

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
				<ActionButton
					className={`absolute top-0 left-0 m-4 rounded-full w-10 h-10 text-center`}
					onClick={() => {
						setIsMainMenuOpen(true);
					}}
				>
					&lt;
				</ActionButton>
			</motion.div>
		</>
	);
}

export default App;
