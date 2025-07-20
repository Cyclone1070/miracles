import { AnimatePresence, motion } from "motion/react";
import { Fragment, useEffect, useState } from "react";
import { useGameManager } from "../context/GameContext";
import type { Action } from "../types";
import { mergeClasses } from "../utils/tailwindMerge";
import { HighlightButton } from "./HighlightButton";
import actionSvgURL from "/action.svg?url";
import binSvgURL from "/bin.svg?url";
import miracleSvgURL from "/miracle.svg?url";
import saySvgURL from "/say.svg?url";

interface Props {
	className?: string;
}

export function PlayerActionInputArea({ ...props }: Props) {
	const ANIMATION_DURATION_MS = 150;
	const [activeAction, setActiveAction] = useState<Action | null>(null);
	const { playerActions, setPlayerActions } = useGameManager();

	async function handleActionChange(newAction: Action) {
		if (newAction.id === activeAction?.id) {
			setActiveAction(null);
		}
		if (activeAction !== null) {
			setActiveAction(null);
			await new Promise((resolve) =>
				setTimeout(resolve, ANIMATION_DURATION_MS),
			);
		}
		setActiveAction(newAction);
	}

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				event.target instanceof HTMLElement &&
				!event.target.closest("[data-textbox-none-close-click]")
			) {
				setActiveAction(null);
			}
		}

		if (activeAction) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [activeAction]);

	return (
		<div
			className={mergeClasses(
				`flex gap-2 m-auto max-w-100 justify-center text-white`,
				props.className,
			)}
		>
			<AnimatePresence>
				{playerActions.map((action, index) => (
					<Fragment key={action.id}>
						{/* arrow between actions */}
						{index !== 0 && (
							<motion.div
								key={`${action.id}-arrow`}
								variants={{
									hidden: {
										x: 10,
										opacity: 0,
										visibility: "hidden",
									},
									visible: {
										x: 0,
										opacity: 1,
										visibility: "visible",
									},
								}}
								transition={{
									duration: 0.3,
									ease: "easeInOut",
								}}
								layout
								initial={{
									x: 10,
									opacity: 0,
									visibility: "hidden",
								}}
								animate={{
									x: 0,
									opacity: 1,
									visibility: "visible",
								}}
								exit={{
									y: -10,
									opacity: 0,
									visibility: "hidden",
								}}
								className={`w-6 h-6 text-[color:var(--accent)] self-center`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 14"
									className="w-full h-full fill-current stroke-(--bg)"
								>
									<path d="M0 4H16V0L24 7L16 14V10H0V4Z" />
								</svg>
							</motion.div>
						)}

						{/* not expanded action button */}
						<motion.div
							key={action.id}
							variants={{
								hidden: {
									x: 10,
									opacity: 0,
									visibility: "hidden",
								},
								visible: {
									x: 0,
									opacity: 1,
									visibility: "visible",
								},
							}}
							transition={{ duration: 0.3, ease: "easeInOut" }}
							layout
							initial="hidden"
							animate="visible"
							exit="hidden"
							className={`w-10 h-10 flex-shrink-0`}
						>
							{activeAction?.id !== action.id && (
								<motion.div
									data-textbox-none-close-click
									layoutId={action.id}
									transition={{
										type: "spring",
										stiffness: 300,
										damping: 30,
									}}
									className={`w-full h-full will-change-transform ${activeAction?.id === action.id ? "invisible" : ""}`}
								>
									<HighlightButton
										onClick={() => {
											handleActionChange(action);
										}}
										className={`w-full h-full flex justify-center items-center bg-(--bg)`}
									>
										{/* icons */}
										{action.type === "do" && (
											<motion.img
												layoutId={`${action.id}-icon`}
												transition={{
													type: "spring",
													stiffness: 300,
													damping: 30,
												}}
												src={actionSvgURL}
												alt="do icon"
												className={`will-change-transform w-full h-full`}
											/>
										)}
										{action.type === "say" && (
											<motion.img
												layoutId={`${action.id}-icon`}
												transition={{
													type: "spring",
													stiffness: 300,
													damping: 30,
												}}
												src={saySvgURL}
												alt="say icon"
												className={`will-change-transform w-full h-full`}
											/>
										)}
										{action.type === "miracle" && (
											<motion.img
												layoutId={`${action.id}-icon`}
												transition={{
													type: "spring",
													stiffness: 300,
													damping: 30,
												}}
												src={miracleSvgURL}
												alt="miracle icon"
												className={`will-change-transform w-full h-full`}
											/>
										)}
									</HighlightButton>
								</motion.div>
							)}
						</motion.div>

						{/* pop up expanded box */}
					</Fragment>
				))}
			</AnimatePresence>
			{activeAction && (
				<motion.div
					key={`${activeAction.id}-expanded`}
					data-textbox-none-close-click
					layoutId={activeAction.id}
					transition={{
						type: "spring",
						stiffness: 300,
						damping: 30,
					}}
					exit={{
						opacity: 0,
						y: -10,
						transition: { duration: 0.3 },
					}}
					className={`fixed top-10 w-80 max-w-[95vw] h-50 bg-(--bg) rounded-lg p-2 flex flex-col gap-4 will-change-transform z-10
					md:absolute md:bottom-full md:mb-10 md:top-auto`}
				>
					{/* first row */}
					<div className={`relative w-full flex items-center gap-2`}>
						{/* action icon */}
						<HighlightButton
							className={`w-8 h-8 p-1 shadow-none bg-transparent flex gap-2`}
							onClick={() => {
								setActiveAction(null);
							}}
						>
							{activeAction.type === "do" && (
								<motion.img
									layoutId={`${activeAction.id}-icon`}
									transition={{
										type: "spring",
										stiffness: 300,
										damping: 30,
									}}
									src={actionSvgURL}
									alt="do icon"
									className={`will-change-transform w-full h-full`}
								/>
							)}
							{activeAction.type === "say" && (
								<motion.img
									layoutId={`${activeAction.id}-icon`}
									transition={{
										type: "spring",
										stiffness: 300,
										damping: 30,
									}}
									src={saySvgURL}
									alt="say icon"
									className={`will-change-transform w-full h-full`}
								/>
							)}
							{activeAction.type === "miracle" && (
								<motion.img
									layoutId={`${activeAction.id}-icon`}
									transition={{
										type: "spring",
										stiffness: 300,
										damping: 30,
									}}
									src={miracleSvgURL}
									alt="miracle icon"
									className={`will-change-transform w-full h-full`}
								/>
							)}
						</HighlightButton>
						<span className={`grow`}>
							{activeAction.type === "do"
								? "Do something"
								: activeAction.type === "say"
									? "Say something"
									: "Make a miracle"}
						</span>

						{/* delete button */}
						<HighlightButton
							className={`h-8 w-8 p-1 bg-transparent shadow-none`}
							onClick={() => {
								setPlayerActions((prev) =>
									prev.filter(
										(a) => a.id !== activeAction.id,
									),
								);
								setActiveAction(null);
							}}
						>
							<img
								src={binSvgURL}
								alt=""
								className={`w-full h-full`}
							/>
						</HighlightButton>
					</div>

					{/* content */}
					<input
						type="text"
						className={`border-1 border-(--accent) rounded-md`}
					/>
				</motion.div>
			)}
		</div>
	);
}
