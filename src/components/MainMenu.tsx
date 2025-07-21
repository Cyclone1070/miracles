import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { clearStore } from "../utils/indexedDb";
import { HighlightButton } from "./HighlightButton";

interface Props {
	setIsMainMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function MainMenu({ ...props }: Props) {
	const [isHelpVisible, setIsHelpVisible] = useState(false);
	// 1. Initialize state lazily from localStorage only on the first render.
	const [currentAccent, setCurrentAccent] = useState(() =>
		localStorage.getItem("accent"),
	);

	// 2. This effect now handles all side effects related to the accent color.
	useEffect(() => {
		// When currentAccent changes, update the CSS variable and localStorage.
		if (currentAccent) {
			document.documentElement.style.setProperty(
				"--accent",
				currentAccent,
			);
			localStorage.setItem("accent", currentAccent);
		} else {
			// If the accent is cleared, remove the property and the localStorage item.
			document.documentElement.style.removeProperty("--accent");
			localStorage.removeItem("accent");
		}
	}, [currentAccent]); // This effect runs only when currentAccent changes.

	return (
		<div className="w-screen h-dvh relative overflow-hidden flex justify-center items-center p-2">
			<video
				className="absolute top-0 left-0 adaptive-size -z-1 "
				autoPlay
				loop
				muted
				playsInline
				controls={false}
			>
				<source src="/splash-screen.webm" type="video/webm" />
				<source src="/splash-screen.mp4" type="video/mp4" />
			</video>
			{/* Note: Corrected Tailwind syntax for CSS variables, e.g., border-(--accent) */}
			<motion.div
				initial={{ opacity: 0, y: 10, visibility: "hidden" }}
				animate={{ opacity: 1, y: 0, visibility: "visible" }}
				transition={{ delay: 2, duration: 0.8, ease: "easeInOut" }}
				className={`border-2 border-(--accent) bg-black/80 p-8 rounded-xl text-(--text) flex flex-col items-center justify-center gap-4 text-center h-full w-full
				max-w-90 max-h-120 min-w-75
				md:max-w-160 md:max-h-130`}
			>
				<h1 className={`font-bold text-6xl md:text-8xl`}>Miracles</h1>
				<HighlightButton
					className={`rounded-xl m-auto bg-(--accent)
					text-2xl p-3 px-5
					md:text-3xl md:p-3 md:px-6`}
					onClick={() => {
						props.setIsMainMenuOpen(false);
					}}
				>
					Play!
				</HighlightButton>
				<div>
					The game is stored almost entirely on your machine! With
					your own API key I won't be able to see any of your sketchy
					text so go wild! <br />
					(Google can see them though, ofc)
				</div>
				<div className={`relative flex items-center`}>
					<input
						className="border-2 border-(--accent) rounded-sm p-1 px-2 outline-0"
						placeholder="Enter your API key"
						type="text"
					/>
					<HighlightButton
						className={`absolute -right-10 w-7 h-7 flex items-center justify-center rounded-full bg-(--accent)`}
						onClick={() => {
							setIsHelpVisible(true);
						}}
					>
						?
					</HighlightButton>
				</div>
				<HighlightButton
					onClick={async () => {
						localStorage.clear();
						await clearStore();
						window.location.reload();
					}}
					className={`bg-(--accent) p-1.5`}
				>
					Clear Data
				</HighlightButton>
				<div className={`flex gap-2 justify-center items-center`}>
					{/* 3. onClick handlers now only update the state. */}
					<button
						className={`rounded-md bg-cyan-700 ${!currentAccent ? "w-8 h-8 m-0" : "w-6 h-6 m-1"}`}
						onClick={() => {
							setCurrentAccent(null);
						}}
					></button>
					<button
						className={`rounded-md bg-teal-700 ${currentAccent === "var(--color-teal-700)" ? "w-8 h-8 m-0" : "w-6 h-6 m-1"}`}
						onClick={() => {
							setCurrentAccent("var(--color-teal-700)");
						}}
					></button>
					<button
						className={`rounded-md bg-yellow-700 ${currentAccent === "var(--color-yellow-700)" ? "w-8 h-8 m-0" : "w-6 h-6 m-1"}`}
						onClick={() => {
							setCurrentAccent("var(--color-yellow-700)");
						}}
					></button>
					<button
						className={`rounded-md bg-amber-700 ${currentAccent === "var(--color-amber-700)" ? "w-8 h-8 m-0" : "w-6 h-6 m-1"}`}
						onClick={() => {
							setCurrentAccent("var(--color-amber-700)");
						}}
					></button>
				</div>
			</motion.div>
			<div className="absolute right-0 bottom-0 text-sm pr-1">
				Art is AI cause I suck at it
			</div>
			<motion.div
				variants={{
					hidden: { opacity: 0, y: 5, visibility: "hidden" },
					visible: { opacity: 1, y: 0, visibility: "visible" },
				}}
				animate={isHelpVisible ? "visible" : "hidden"}
				transition={{ ease: "easeInOut" }}
				className={`absolute w-screen h-dvh bg-black/70 flex justify-center items-center`}
				onClick={() => {
					setIsHelpVisible(false);
				}}
			>
				<div
					className={`bg-(--theme-bg) w-70 p-4 border-2 border-(--accent) rounded-md text-(--text)`}
				>
					<span>
						You can obtain a free Gemini API key by visiting{" "}
					</span>
					<a
						className={`text-blue-500 underline`}
						href="https://aistudio.google.com/apikey"
						target="_blank"
					>
						this website
					</a>
					<span>
						. Log in to your account and click "create API key" on
						the top right.
					</span>
					<br />
					<br />
					<span className={`text-red-400 bold italic`}>
						Important:
					</span>
					<span>
						{" "}
						Fuck all has been done to protect your key. Only use a
						free key and clear your data when you finish the game since it's stored locally.
					</span>
				</div>
			</motion.div>
		</div>
	);
}
