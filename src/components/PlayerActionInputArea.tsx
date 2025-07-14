import { AnimatePresence, motion } from "motion/react";
import { Fragment, useEffect, useState } from "react";
import type { Action } from "../type";
import { mergeClasses } from "../utils/tailwindMerge";
import { HighlightButton } from "./HighlightButton";
import actionSvgURL from "/action.svg?url";
import saySvgURL from "/say.svg?url";
import miracleSvgURL from "/miracle.svg?url";
import binSvgURL from "/bin.svg?url";

interface Props {
	className?: string;
	actions: Action[];
	setActions: React.Dispatch<React.SetStateAction<Action[]>>;
}

export function PlayerActionInputArea({ ...props }: Props) {
	const ANIMATION_DURATION_MS = 150;
	const [activeId, setActiveId] = useState<string | null>(null);

	async function handleActionChange(newId: string) {
		if (newId === activeId) {
			setActiveId(null);
		}
		if (activeId !== null) {
			setActiveId(null);
			await new Promise((resolve) =>
				setTimeout(resolve, ANIMATION_DURATION_MS),
			);
		}
		setActiveId(newId);
	}

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				event.target instanceof HTMLElement &&
				!event.target.closest("[data-textbox-none-close-click]")
			) {
				setActiveId(null);
			}
		}

		if (activeId) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [activeId]);

	return (
		<div
			className={mergeClasses(
				`flex gap-2 m-auto max-w-100 justify-center`,
				props.className,
			)}
		>
			<AnimatePresence>
				{props.actions.map((action, index) => (
					<Fragment key={action.id}>
						{/* action button */}
						{/* pop up expanded box */}
						{activeId === action.id && (
							<motion.div
								key={`${action.id}-expanded`}
								data-textbox-none-close-click
								layoutId={action.id}
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
								className={`absolute w-full h-50 bg-(--bg) rounded-lg bottom-full mb-4 p-2 flex flex-col gap-4 will-change-transform ${activeId === action.id ? "" : "invisible"}`}
							>
								{/* first row */}
								<div
									className={`relative w-full flex items-center gap-2`}
								>
									{/* action icon */}
									<HighlightButton
										className={`w-8 h-8 p-1 shadow-none bg-transparent flex gap-2`}
										onClick={() => {
											setActiveId(null);
										}}
									>
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
									<span className={`grow`}>
										{action.type === "do"
											? "Do something"
											: action.type === "say"
												? "Say something"
												: "Make a miracle"}
									</span>

									{/* delete button */}
									<HighlightButton
										className={`h-8 w-8 p-1 bg-transparent shadow-none`}
										onClick={() => {
											props.setActions((prev) =>
												prev.filter(
													(a) => a.id !== action.id,
												),
											);
											setActiveId(null);
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
							{activeId !== action.id && (
								<motion.div
									data-textbox-none-close-click
									layoutId={action.id}
									transition={{
										type: "spring",
										stiffness: 300,
										damping: 30,
									}}
									className={`w-full h-full will-change-transform ${activeId === action.id ? "invisible" : ""}`}
								>
									<HighlightButton
										onClick={() => {
											handleActionChange(action.id);
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
					</Fragment>
				))}
			</AnimatePresence>
		</div>
	);
}
