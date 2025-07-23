import { AnimatePresence, motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useGameManager } from "../context/GameContext";
import { saveTurn } from "../game/storage";
import type { ChoiceOption, Turn } from "../types";
import { mergeClasses } from "../utils/tailwindMerge";
import { AddPlayerActionButtons } from "./AddPlayerActionButtons";
import { HighlightButton } from "./HighlightButton";

interface Props {
	className?: string;
	children?: React.ReactNode;
}

export function NarrativeBox({ ...props }: Props) {
	// Refs for narrativeBg calculation
	const nameBoxRef = useRef<HTMLDivElement>(null);
	const nameBoxContainerRef = useRef<HTMLDivElement>(null);
	const narrativeBoxRef = useRef<HTMLDivElement>(null);
	const narrativeBgRef = useRef<HTMLDivElement>(null);
	const addActionButtonRef = useRef<HTMLButtonElement>(null);
	const [clipPath, setClipPath] = useState({});

	// State for scroll management
	const [isScrollEndSeen, setIsScrollEndSeen] = useState(false);
	const textContainerRef = useRef<HTMLDivElement>(null);

	const [isActionExpanded, setIsActionExpanded] = useState(false);

	// Game manager hooks
	const {
		isActingCharacterLeft,
		currentStep,
		isFetchingResponse,
		advanceStory,
		advanceTurn,
		currentTurn,
	} = useGameManager();
	let currentName = null;
	if (currentStep?.type === "dialog") {
		currentName = currentStep.speakerId;
	}

	useEffect(() => {
		const element = textContainerRef.current;
		if (!element) return;

		const handleScroll = () => {
			const isAtEnd =
				element.scrollHeight -
					element.scrollTop -
					element.clientHeight <
				1;
			if (isAtEnd) {
				setIsScrollEndSeen(true);
			}
		};
		element.addEventListener("scroll", handleScroll);
		return () => {
			element.removeEventListener("scroll", handleScroll);
		};
	}, []);

	useLayoutEffect(() => {
		const run = () => {
			setClipPath(calculateClipPath());
		};

		// Resize observer on all relevant elements
		const resizeObserver = new ResizeObserver(run);
		const mutationObserver = new MutationObserver(run);
		if (
			narrativeBgRef.current &&
			narrativeBoxRef.current &&
			nameBoxContainerRef.current &&
			addActionButtonRef.current
		) {
			resizeObserver.observe(narrativeBoxRef.current);
			mutationObserver.observe(narrativeBoxRef.current, {
				attributes: true,
				attributeFilter: ["style", "class"],
				childList: true,
			});
			resizeObserver.observe(nameBoxContainerRef.current);
			mutationObserver.observe(nameBoxContainerRef.current, {
				attributes: true,
				attributeFilter: ["style", "class"],
				childList: true,
			});
		}
		run(); // Initial run to set the clip path
		return () => {
			resizeObserver.disconnect();
		};
	}, [currentName, isActingCharacterLeft]);

	return (
		<>
			<div
				ref={narrativeBoxRef}
				className={mergeClasses(
					`relative border-2 border-t-0 border-(--accent) rounded-xl text-white p-2 pt-8 pb-10 md:px-6 cursor-pointer`,
					props.className,
				)}
				onClick={() => {
					const element = textContainerRef.current;
					if (!element) return;
					if (currentStep?.type === "choice") return;

					if (isScrollEndSeen) {
						setIsScrollEndSeen(false);
						advanceStory();
						return;
					}

					const remainingScroll =
						element.scrollHeight -
						element.scrollTop -
						element.clientHeight;

					// 2. Determine the distance for this scroll action.
					// It's either a full page, or the remaining distance if that's smaller.
					const distanceToScroll = Math.min(
						element.clientHeight,
						remainingScroll,
					);

					// 3. Perform the perfectly calculated, "smart" scroll.
					element.scrollBy({
						top: distanceToScroll,
						behavior: "smooth",
					});
				}}
			>
				<div
					ref={narrativeBgRef}
					className={`absolute -inset-y-12 -inset-x-4 bg-(--bg) -z-1`}
					style={clipPath}
				></div>

				<div
					ref={nameBoxContainerRef}
					className="absolute top-0 -left-[2px] -right-[2px] flex min-h-11"
				>
					{currentName ? (
						<>
							{/* border */}
							<div
								className={`border-t-2 border-(--accent) ${isActingCharacterLeft ? "border-l-2 rounded-tl-xl w-6 md:w-8" : "border-l-2 rounded-tl-xl grow"}`}
							/>

							{/* name box */}
							<div
								ref={nameBoxRef}
								className={`relative -translate-y-1/2 text-white border-2 border-(--accent) rounded-xl p-2 text-center`}
							>
								{currentName}
							</div>

							{/* border */}
							<div
								className={`border-t-2 border-(--accent) ${isActingCharacterLeft ? "border-r-2 rounded-tr-xl grow" : "border-r-2 rounded-tr-xl w-6 md:w-8"}`}
							/>
						</>
					) : (
						<div
							className={`border-2 border-b-0 rounded-t-xl border-(--accent) grow`}
						></div>
					)}
				</div>
				<motion.div
					ref={textContainerRef}
					variants={{
						visible: {
							opacity: 1,
							y: 0,
							visibility: "visible",
						},
						faded: {
							opacity: 0.15,
							y: 0,
							visibility: "visible",
						},
					}}
					animate={isActionExpanded ? "faded" : "visible"}
					transition={{ ease: "easeInOut", duration: 0.3 }}
					className={`h-full w-full overflow-auto`}
				>
					<AnimatePresence mode="wait">
						<motion.div
							key={currentStep?.id}
							variants={{
								visible: {
									opacity: 1,
									y: 0,
									visibility: "visible",
								},
								hidden: {
									y: -8,
									opacity: 0,
									visibility: "hidden",
								},
								initial: {
									opacity: 0,
									y: 8,
									visibility: "hidden",
								},
							}}
							animate="visible"
							exit="hidden"
							initial="initial"
							transition={{ ease: "easeInOut", duration: 0.3 }}
							onAnimationComplete={(latest) => {
								if (latest !== "visible") return;
								const element = textContainerRef.current;
								if (!element) return;

								if (
									element.scrollHeight <= element.clientHeight
								) {
									setIsScrollEndSeen(true);
									return;
								}
								setIsScrollEndSeen(false);
							}}
						>
							{currentStep?.type === "choice" ? (
								<div
									className={`flex flex-col items-center w-full`}
								>
									{currentStep.options.map(
										(option: ChoiceOption) => {
											return (
												<HighlightButton
													key={option.nextTurnId}
													className="text-left"
													onClick={async () => {
														if (!currentTurn) return;
														const module =
															await import(
																`../data/scripts/${option.nextTurnId}.ts`
															);
														const turn: Turn =
															module.default;
														turn.id = currentTurn.id + 1;
														await saveTurn(turn);
														advanceTurn();
													}}
												>
													{option.text}
												</HighlightButton>
											);
										},
									)}
								</div>
							) : (
								<span>{currentStep?.text}</span>
							)}
						</motion.div>
					</AnimatePresence>
				</motion.div>

				<AddPlayerActionButtons
					addActionButtonRef={addActionButtonRef}
					isActionExpanded={isActionExpanded}
					setIsActionExpanded={setIsActionExpanded}
				/>

				{props.children}
			</div>
		</>
	);

	function calculateClipPath(): React.CSSProperties {
		const narrativeBox = narrativeBoxRef.current;
		const nameBox = nameBoxRef.current;
		const narrativeBg = narrativeBgRef.current;
		const actionButton = addActionButtonRef.current;

		if (!narrativeBox || !narrativeBg) {
			return { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" };
		}

		const remToPx = (rem: number) =>
			rem *
			parseFloat(getComputedStyle(document.documentElement).fontSize);

		const outset = remToPx(0.5);
		const cornerRadius = remToPx(0.75);

		const narrativeBgRect = narrativeBg.getBoundingClientRect();
		const narrativeRect = narrativeBox.getBoundingClientRect();

		const relative = (
			parentRect: DOMRect,
			childRect: DOMRect,
		): [number, number, number, number] => {
			const left = childRect.left - parentRect.left;
			const top = childRect.top - parentRect.top;
			const right = childRect.right - parentRect.left;
			const bottom = childRect.bottom - parentRect.top;
			return [left, top, right, bottom];
		};

		const [nbL, nbT, nbR, nbB] = relative(narrativeBgRect, narrativeRect);
		const pathData: (string | number)[] = [];

		// Start path at top-left
		pathData.push(`M ${nbL - outset + cornerRadius},${nbT - outset}`);

		// Draw nameplate notch if nameBox exists
		if (nameBox) {
			const nameRect = nameBox.getBoundingClientRect();
			const [nmL, nmT, nmR] = relative(narrativeBgRect, nameRect);
			pathData.push(
				`L ${nmL - outset},${nbT - outset}`,
				`L ${nmL - outset},${nmT - outset + cornerRadius}`,
				`A ${cornerRadius},${cornerRadius} 0 0 1 ${nmL - outset + cornerRadius},${nmT - outset}`,
				`L ${nmR + outset - cornerRadius},${nmT - outset}`,
				`A ${cornerRadius},${cornerRadius} 0 0 1 ${nmR + outset},${nmT - outset + cornerRadius}`,
				`L ${nmR + outset},${nbT - outset}`,
			);
		}

		// Top edge and top-right corner
		pathData.push(
			`L ${nbR + outset - cornerRadius},${nbT - outset}`,
			`A ${cornerRadius},${cornerRadius} 0 0 1 ${nbR + outset},${nbT - outset + cornerRadius}`,
		);

		// Right edge and bottom-right corner
		pathData.push(
			`L ${nbR + outset},${nbB + outset - cornerRadius}`,
			`A ${cornerRadius},${cornerRadius} 0 0 1 ${nbR + outset - cornerRadius},${nbB + outset}`,
		);

		// Draw notch for the action button if it exists
		if (actionButton) {
			const actionRect = actionButton.getBoundingClientRect();
			const actionButtonRadius = actionRect.width / 2 + outset;
			const abL = actionRect.left - narrativeBgRect.left;
			const abCenterX = abL + actionRect.width / 2;
			const abCenterY =
				actionRect.top + actionRect.height / 2 - narrativeBgRect.top;

			const yOffset = abCenterY - (nbB + outset);
			const angle = Math.acos(yOffset / actionButtonRadius);
			const xOffset = Math.sin(angle) * actionButtonRadius;
			const tangentX1 = abCenterX + xOffset;
			const tangentX2 = abCenterX - xOffset;

			pathData.push(
				`L ${tangentX1},${nbB + outset}`,
				`A ${actionButtonRadius},${actionButtonRadius} 0 0 1 ${tangentX2},${nbB + outset}`,
			);
		}

		// Bottom edge, bottom-left corner, left edge, and close path
		pathData.push(
			`L ${nbL - outset + cornerRadius},${nbB + outset}`,
			`A ${cornerRadius},${cornerRadius} 0 0 1 ${nbL - outset},${nbB + outset - cornerRadius}`,
			`L ${nbL - outset},${nbT - outset + cornerRadius}`,
			`A ${cornerRadius},${cornerRadius} 0 0 1 ${nbL - outset + cornerRadius},${nbT - outset}`,
			`Z`,
		);

		return { clipPath: `path('${pathData.join(" ")}')` };
	}
}
