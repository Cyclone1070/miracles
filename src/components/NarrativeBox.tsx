import { useLayoutEffect, useRef, useState } from "react";
import { mergeClasses } from "../utils/tailwindMerge";

interface Props {
	className?: string;
	children?: React.ReactNode;
	isNameBoxLeft: boolean;
	actionButtonRef: React.RefObject<HTMLButtonElement | null>;
}

export function NarrativeBox({ ...props }: Props) {
	const nameBoxRef = useRef<HTMLDivElement>(null);
	const narrativeBoxRef = useRef<HTMLDivElement>(null);
	const outerDivRef = useRef<HTMLDivElement>(null);
	const [clipPath, setClipPath] = useState({});
	useLayoutEffect(() => {
		const run = () => {
			setClipPath(calculateClipPath());
		};

		// Resize observer on all relevant elements
		const resizeObserver = new ResizeObserver(run);
		if (
			outerDivRef.current &&
			narrativeBoxRef.current &&
			nameBoxRef.current &&
			props.actionButtonRef?.current
		) {
			resizeObserver.observe(outerDivRef.current);
			resizeObserver.observe(narrativeBoxRef.current);
			resizeObserver.observe(nameBoxRef.current);
			resizeObserver.observe(props.actionButtonRef.current);
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
				`relative h-50 max-w-200 border-2 border-t-0 border-(--accent) rounded-xl text-white`,
				props.className,
			)}
		>
			<div
				ref={outerDivRef}
				className={`absolute -inset-y-8 -inset-x-4 bg-(--bg) -z-1`}
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
			{props.children}
		</div>
	);

	function calculateClipPath(): React.CSSProperties {
		const narrativeBox = narrativeBoxRef.current;
		const nameBox = nameBoxRef.current;
		const actionButton = props.actionButtonRef.current;
		const outerDiv = outerDivRef.current;

		if (!narrativeBox || !nameBox || !actionButton || !outerDiv) {
			return { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" };
		}

		const remToPx = (rem: number) =>
			rem *
			parseFloat(getComputedStyle(document.documentElement).fontSize);

		const outset = remToPx(0.5);
		const cornerRadius = remToPx(0.75); // For narrative box and nameplate

		const outerRect = outerDiv.getBoundingClientRect();
		const narrativeRect = narrativeBox.getBoundingClientRect();
		const nameRect = nameBox.getBoundingClientRect();
		const actionRect = actionButton.getBoundingClientRect();

		const actionButtonRadius = actionRect.width / 2 + outset;

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

		const [nbL, nbT, nbR, nbB] = relative(outerRect, narrativeRect);
		const [nmL, nmT, nmR] = relative(outerRect, nameRect);
		const [abL, abR] = [
			actionRect.left - outerRect.left,
			actionRect.right - outerRect.left,
		];
		const abCenterX = abL + actionRect.width / 2;
		const abCenterY =
			actionRect.top + actionRect.height / 2 - outerRect.top;

		// Calculate the tangent points for a smooth connection
		const yOffset = abCenterY - (nbB + outset);
		const angle = Math.acos(yOffset / actionButtonRadius);
		const xOffset = Math.sin(angle) * actionButtonRadius;

		const tangentX1 = abCenterX + xOffset;
		const tangentX2 = abCenterX - xOffset;

		const pathData = [
			// Start at top-left corner, move right
			`M ${nbL - outset + cornerRadius},${nbT - outset}`,
			// Top edge before nameplate (sharp corner)
			`L ${nmL - outset},${nbT - outset}`,
			// Nameplate notch (sharp bottom corners, rounded top)
			`L ${nmL - outset},${nmT - outset + cornerRadius}`,
			`A ${cornerRadius},${cornerRadius} 0 0 1 ${nmL - outset + cornerRadius},${nmT - outset}`,
			`L ${nmR + outset - cornerRadius},${nmT - outset}`,
			`A ${cornerRadius},${cornerRadius} 0 0 1 ${nmR + outset},${nmT - outset + cornerRadius}`,
			`L ${nmR + outset},${nbT - outset}`,
			// Top edge after nameplate
			`L ${nbR + outset - cornerRadius},${nbT - outset}`,
			// Top-right corner
			`A ${cornerRadius},${cornerRadius} 0 0 1 ${nbR + outset},${nbT - outset + cornerRadius}`,
			// Right edge
			`L ${nbR + outset},${nbB + outset - cornerRadius}`,
			// Bottom-right corner
			`A ${cornerRadius},${cornerRadius} 0 0 1 ${nbR + outset - cornerRadius},${nbB + outset}`,
			// Bottom edge before action button
			`L ${tangentX1},${nbB + outset}`,
			// Action button circular notch (traces the bottom)
			`A ${actionButtonRadius},${actionButtonRadius} 0 0 1 ${tangentX2},${nbB + outset}`,
			// Bottom edge after action button
			`L ${nbL - outset + cornerRadius},${nbB + outset}`,
			// Bottom-left corner
			`A ${cornerRadius},${cornerRadius} 0 0 1 ${nbL - outset},${nbB + outset - cornerRadius}`,
			// Left edge
			`L ${nbL - outset},${nbT - outset + cornerRadius}`,
			// Close path back to top-left corner
			`A ${cornerRadius},${cornerRadius} 0 0 1 ${nbL - outset + cornerRadius},${nbT - outset}`,
			`Z`,
		].join(" ");

		return { clipPath: `path('${pathData}')` };
	}
}
