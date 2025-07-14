import { useLayoutEffect, useRef, useState } from "react";
import { callGeminiApi } from "../utils/gemini";
import { HighlightButton } from "./HighlightButton";
import submitSvgURL from "/submit.svg?url";
import historySvgURL from "/history.svg?url";

interface Props {
	className?: string;
	addActionButtonRef: React.RefObject<HTMLButtonElement | null>;
}

export function BottomBar({ ...props }: Props) {
	const buttonClassNames = "rounded-xl basis-0 grow h-full flex justify-center items-center gap-2 bg-(--bg) max-w-40"
	const bottomBarRef = useRef<HTMLDivElement>(null);
	const [clipPath, setClipPath] = useState({});
	useLayoutEffect(() => {
		const run = () => {
			setClipPath(calculateClipPath());
		};

		// Resize observer on all relevant elements
		const resizeObserver = new ResizeObserver(run);
		const mutationObserver = new MutationObserver(run);
		if (props.addActionButtonRef.current) {
			resizeObserver.observe(props.addActionButtonRef.current);
			mutationObserver.observe(props.addActionButtonRef.current, {
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
			ref={bottomBarRef}
			className={` w-full h-10 m-1 rounded-t-xl flex items-center justify-center`}
		>
			<HighlightButton
				className={buttonClassNames}
			>
				<img
					className={`w-5 h-5`}
					src={historySvgURL}
					alt="history icon"
				/>
				<span>History</span>
			</HighlightButton>
			<div className={`w-18 shrink-0`}></div>
			<HighlightButton
				onClick={() => {
					callGeminiApi(
						"give me a say action with a target and an expression",
					).then((response) => {
						console.log("Gemini response:", response);
					});
				}}
				className={buttonClassNames}
			>
				<img
					className={`w-5 h-5`}
					src={submitSvgURL}
					alt="submit icon"
				/>
				<span>Go!</span>
			</HighlightButton>
		</div>
	);
	function calculateClipPath() {
		// Ensure both the bottom bar and the button refs are available
		if (!bottomBarRef.current || !props.addActionButtonRef.current) {
			console.log("failing")
			return {clipPath: "none"};
		}

		// Get the dimensions and position of the bottom bar and the button
		const bottomBarRect = bottomBarRef.current.getBoundingClientRect();
		const buttonRect =
			props.addActionButtonRef.current.getBoundingClientRect();

		// Calculate the radius of the circular button
		const buttonRadius = buttonRect.width / 2 + 4;

		// Determine the starting and ending points of the arc for the cutout,
		// relative to the bottom bar's coordinate system.
		const arcStartX = buttonRect.left - bottomBarRect.left;
		const arcEndX = arcStartX + buttonRect.width;

		// To prevent visual glitches at the edges of the arc, a small overlap can be added.
		const overlap = 0;

		// Construct the SVG path string for the clip-path
		const path = `M 0,${overlap} L ${arcStartX - overlap},${overlap} A ${buttonRadius},${buttonRadius} 0 0 0 ${arcEndX + overlap},${overlap} L ${bottomBarRect.width},${overlap} L ${bottomBarRect.width},${bottomBarRect.height} L 0,${bottomBarRect.height} Z`;

		// Return the style object for the clip-path
		return {
			clipPath: `path('${path}')`,
		};
	}
}
