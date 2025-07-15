import { AnimatePresence, motion } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { useGameManager } from "../game/gameManager";
import type { Action } from "../type";
import { mergeClasses } from "../utils/tailwindMerge";
import { AddPlayerActionButtons } from "./AddPlayerActionButtons";

interface Props {
	className?: string;
	children?: React.ReactNode;
	isNameBoxLeft: boolean;
	setIsMainMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setActions: React.Dispatch<React.SetStateAction<Action[]>>;
}

export function NarrativeBox({ ...props }: Props) {
	// Refs for narrativeBg calculation
	const nameBoxRef = useRef<HTMLDivElement>(null);
	const narrativeBoxRef = useRef<HTMLDivElement>(null);
	const narrativeBgRef = useRef<HTMLDivElement>(null);
	const addActionButtonRef = useRef<HTMLButtonElement>(null);
	const [clipPath, setClipPath] = useState({});

	const [isActionExpanded, setIsActionExpanded] = useState(false);
	const { currentStep, isLoading, advanceStory } = useGameManager();

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
			nameBoxRef.current &&
			addActionButtonRef.current
		) {
			resizeObserver.observe(narrativeBoxRef.current);
			resizeObserver.observe(nameBoxRef.current);
			mutationObserver.observe(nameBoxRef.current, {
				attributes: true,
				attributeFilter: ["style", "class"],
			});
		}
		run(); // Initial run to set the clip path
		return () => {
			resizeObserver.disconnect();
		};
	}, []);

	return (
		<div
			ref={narrativeBoxRef}
			className={mergeClasses(
				`relative h-55 max-w-200 border-2 border-t-0 border-(--accent) rounded-xl text-white p-2 pt-8`,
				props.className,
			)}
			onClick={async () => {
				console.log("narrative box clicked");
				advanceStory();
			}}
		>
			<div
				ref={narrativeBgRef}
				className={`absolute -inset-y-12 -inset-x-4 bg-(--bg) -z-1`}
				style={clipPath}
			></div>

			<div className="absolute top-0 -left-[2px] -right-[2px] flex">
				{/* border */}
				<div
					className={`border-t-2 border-(--accent) ${props.isNameBoxLeft ? "border-l-2 rounded-tl-xl w-6 md:w-8" : "border-l-2 rounded-tl-xl grow"}`}
				/>

				{/* name box */}
				<div
					ref={nameBoxRef}
					className={`relative -translate-y-1/2 text-white `}
				>
					<div className="relative border-2 border-(--accent) rounded-xl p-2 text-center">
						Jesus The Almighty
					</div>
				</div>

				{/* border */}
				<div
					className={`border-t-2 border-(--accent) ${props.isNameBoxLeft ? "border-r-2 rounded-tr-xl grow" : "border-r-2 rounded-tr-xl w-6 md:w-8"}`}
				/>
			</div>

			<AnimatePresence mode="wait">
				<motion.div
					variants={{
						visible: { opacity: 1, y: 0, visibility: "visible" },
						faded: { opacity: 0.15, y: 0, visibility: "visible" },
						hidden: { y: -8, opacity: 0, visibility: "hidden" },
						initial: { opacity: 0, y: 8, visibility: "hidden" },
					}}
					animate={isActionExpanded ? "faded" : "visible"}
					exit="hidden"
					initial="initial"
					transition={{ ease: "easeInOut", duration: 0.3 }}
					className={`w-full h-full`}
					key={currentStep?.id}
				>
					{currentStep?.displayText}
				</motion.div>
			</AnimatePresence>

			<AddPlayerActionButtons
				setIsMainMenuOpen={props.setIsMainMenuOpen}
				setActions={props.setActions}
				addActionButtonRef={addActionButtonRef}
				isActionExpanded={isActionExpanded}
				setIsActionExpanded={setIsActionExpanded}
			/>

			{props.children}
		</div>
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
