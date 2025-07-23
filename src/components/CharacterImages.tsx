import { useGameManager } from "../context/GameContext";
import { mergeClasses } from "../utils/tailwindMerge";
import jesusHappyURL from "/jesus-happy.webp?url";
import jesusNeutralURL from "/jesus-neutral.webp?url";
import jesusAnnoyedURL from "/jesus-annoyed.webp?url";
import luciferHappyURL from "/lucifer-happy.webp?url";
import luciferNeutralURL from "/lucifer-neutral.webp?url";
import luciferAnnoyedURL from "/lucifer-annoyed.webp?url";
import { useRef } from "react";

interface Props {
	className?: string;
}

export function CharacterImages({ ...props }: Props) {
	const svgMap: Record<string, string> = {
		Jesushappy: jesusHappyURL,
		Jesusneutral: jesusNeutralURL,
		Jesusannoyed: jesusAnnoyedURL,
		Luciferhappy: luciferHappyURL,
		Luciferneutral: luciferNeutralURL,
		Luciferannoyed: luciferAnnoyedURL,
	};
	const { currentStep } = useGameManager();
	const prevSpeakerRef = useRef<string | null>(null);
	const isLeftRef = useRef(true);

	let imgMain;
	let imgTarget;
	let actingCharacterId: string | null = null;

	if (currentStep?.type === "dialog") {
		actingCharacterId = currentStep.speakerId;
		imgMain = currentStep.speakerId + currentStep.speakerExpression;
		imgTarget = currentStep.listenerId
			? currentStep.listenerId + currentStep.listenerExpression
			: undefined;
	} else if (currentStep?.type === "action") {
		actingCharacterId = currentStep.characterId;
		imgMain = currentStep.characterId + currentStep.characterExpression;
		imgTarget = currentStep.targetId
			? currentStep.targetId + currentStep.targetExpression
			: undefined;
	}

	if (actingCharacterId && actingCharacterId !== prevSpeakerRef.current) {
		isLeftRef.current = !isLeftRef.current;
		prevSpeakerRef.current = actingCharacterId;
	}

	const leftCharKey = isLeftRef.current ? imgMain : imgTarget;
	const rightCharKey = isLeftRef.current ? imgTarget : imgMain;

	return (
		<div
			className={mergeClasses(
				`flex justify-between items-end`,
				props.className,
			)}
		>
			{leftCharKey && svgMap[leftCharKey] ? (
				<img
					className={`drop-shadow-xl drop-shadow-black grow basis-0 max-w-1/2 md:max-w-100`}
					src={svgMap[leftCharKey]}
				/>
			) : (
				<div className={`grow basis-0 max-w-1/2 md:max-w-100`} />
			)}
			{rightCharKey && svgMap[rightCharKey] ? (
				<img
					className={`drop-shadow-xl drop-shadow-black transform scale-x-[-1] grow basis-0 max-w-1/2 md:max-w-100`}
					src={svgMap[rightCharKey]}
				/>
			) : (
				<div className={`grow basis-0 max-w-1/2 md:max-w-100`} />
			)}
		</div>
	);
}
