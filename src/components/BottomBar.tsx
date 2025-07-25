import { useRef } from "react";
import { useGameManager } from "../context/GameContext";
import { mergeClasses } from "../utils/tailwindMerge";
import { HighlightButton } from "./HighlightButton";
import homeSvgURL from "/home.svg?url";
import submitSvgURL from "/submit.svg?url";

interface Props {
	className?: string;
	setIsMainMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function BottomBar({ ...props }: Props) {
	const { submitPlayerAction, playerActions, isTurnEnd, currentStep} = useGameManager();
	const buttonClassNames =
		"rounded-xl basis-0 grow h-full flex justify-center items-center gap-2 bg-(--bg) max-w-40";
	const bottomBarRef = useRef<HTMLDivElement>(null);
	return (
		<div
			ref={bottomBarRef}
			className={mergeClasses(
				`w-full h-10 m-1 rounded-t-xl flex items-center justify-center`,
				props.className,
			)}
		>
			<HighlightButton
				className={buttonClassNames}
				onClick={() => {
					props.setIsMainMenuOpen((prev) => !prev);
				}}
			>
				<img
					className={`w-5 h-5`}
					src={homeSvgURL}
					alt="history icon"
				/>
				<span>Home</span>
			</HighlightButton>
			<div className={`w-18 shrink-0`}></div>
			<HighlightButton
				onClick={() => {
					if (!isTurnEnd || currentStep?.type === "choice") {
						alert("You can only submit actions at the end of a turn.");
						return;
					}
					for (const action of playerActions) {
						if (action.type === "do" && !action.action) {
							alert("Missing requried fields in do action.");
							return;
						} else if (action.type === "say" && !action.dialog) {
							alert("Missing requried fields in say action.");
							return;
						} else if (
							action.type === "create" &&
							!action.description
						) {
							alert("Missing requried fields in create action.");
							return;
						} else if (
							action.type === "destroy" &&
							!action.targetId
						) {
							alert("Missing requried fields in destroy action.");
							return;
						} else if (
							action.type === "transform" &&
							(!action.targetId || !action.description)
						) {
							alert(
								"Missing requried fields in transform action.",
							);
							return;
						}
					}
					submitPlayerAction();
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
