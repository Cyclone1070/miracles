import { useGameManager } from "../context/GameContext";
import { mergeClasses } from "../utils/tailwindMerge";

interface Props {
	className?: string;
}

export function CharacterImages({ ...props }: Props) {
	const { currentStep, isActingCharacterLeft } = useGameManager();
	let imgMain = "";
	let imgTarget = "";
	if (currentStep?.type === "dialog") {
		imgMain = currentStep.speakerId + currentStep.speakerExpression;
		imgTarget = currentStep.listenerId
			? currentStep.listenerId + currentStep.listenerExpression
			: "";
	} else if (currentStep?.type === "action") {
		imgMain = currentStep.characterId + currentStep.characterExpression;
		imgTarget = currentStep.targetId
			? currentStep.targetId + currentStep.targetExpression
			: "";
	}
	return (
		<div
			className={mergeClasses(
				`flex justify-between h-100`,
				props.className,
			)}
		>
			<div>{isActingCharacterLeft ? imgMain : imgTarget}</div>
			<div>{isActingCharacterLeft ? imgTarget : imgMain}</div>
		</div>
	);
}
