import { useRef } from "react";
import { callGeminiApi } from "../utils/gemini";
import { mergeClasses } from "../utils/tailwindMerge";
import { HighlightButton } from "./HighlightButton";
import historySvgURL from "/history.svg?url";
import submitSvgURL from "/submit.svg?url";
import mapSvgURL from "/map.svg?url";

interface Props {
	className?: string;
	setIsMapExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

export function BottomBar({ ...props }: Props) {
	const buttonClassNames = "rounded-xl basis-0 grow h-full flex justify-center items-center gap-2 bg-(--bg) max-w-40"
	const bottomBarRef = useRef<HTMLDivElement>(null);
	return (
		<div
			ref={bottomBarRef}
			className={mergeClasses(`w-full h-10 m-1 rounded-t-xl flex items-center justify-center`, props.className)}
		>
			<HighlightButton
				className={buttonClassNames}
				onClick={()=>{props.setIsMapExpanded(prev => !prev)}}
			>
				<img
					className={`w-5 h-5`}
					src={mapSvgURL}
					alt="history icon"
				/>
				<span>Map</span>
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
				<span>Submit</span>
			</HighlightButton>
		</div>
	);
}
