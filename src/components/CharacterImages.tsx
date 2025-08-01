import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useGameManager } from "../context/GameContext";
import { mergeClasses } from "../utils/tailwindMerge";
import beamURL from "/beam.webp?url";
import bigShotAnnoyedURL from "/big-shot-annoyed.webp?url";
import bigShotHappyURL from "/big-shot-happy.webp?url";
import bigShotNeutralURL from "/big-shot-neutral.webp?url";
import emilyAnnoyedURL from "/emily-annoyed.webp?url";
import emilyHappyURL from "/emily-happy.webp?url";
import emilyNeutralURL from "/emily-neutral.webp?url";
import garyAnnoyedURL from "/gary-annoyed.webp?url";
import garyHappyURL from "/gary-happy.webp?url";
import garyNeutralURL from "/gary-neutral.webp?url";
import holdItSoundURL from "/hold-it.mp3?url";
import holdItURL from "/hold-it.webp?url";
import jesusAnnoyedURL from "/jesus-annoyed.webp?url";
import jesusHappyURL from "/jesus-happy.webp?url";
import jesusNeutralURL from "/jesus-neutral.webp?url";
import luciferAnnoyedURL from "/lucifer-annoyed.webp?url";
import luciferHappyURL from "/lucifer-happy.webp?url";
import luciferNeutralURL from "/lucifer-neutral.webp?url";
import markAnnoyedURL from "/mark-annoyed.webp?url";
import markHappyURL from "/mark-happy.webp?url";
import markNeutralURL from "/mark-neutral.webp?url";
import mattAnnoyedURL from "/matt-annoyed.webp?url";
import mattHappyURL from "/matt-happy.webp?url";
import mattNeutralURL from "/matt-neutral.webp?url";
import sophieAnnoyedURL from "/sophie-annoyed.webp?url";
import sophieHappyURL from "/sophie-happy.webp?url";
import sophieNeutralURL from "/sophie-neutral.webp?url";

interface Props {
	className?: string;
}

export function CharacterImages({ className }: Props) {
	const imageMap: Record<string, string> = {
		"Jesus-happy": jesusHappyURL,
		"Jesus-neutral": jesusNeutralURL,
		"Jesus-annoyed": jesusAnnoyedURL,
		"Lucifer-happy": luciferHappyURL,
		"Lucifer-neutral": luciferNeutralURL,
		"Lucifer-annoyed": luciferAnnoyedURL,
		"Big Shot-happy": bigShotHappyURL,
		"Big Shot-neutral": bigShotNeutralURL,
		"Big Shot-annoyed": bigShotAnnoyedURL,
		"Mark-happy": markHappyURL,
		"Mark-neutral": markNeutralURL,
		"Mark-annoyed": markAnnoyedURL,
		"Matt-happy": mattHappyURL,
		"Matt-neutral": mattNeutralURL,
		"Matt-annoyed": mattAnnoyedURL,
		"Emily-happy": emilyHappyURL,
		"Emily-neutral": emilyNeutralURL,
		"Emily-annoyed": emilyAnnoyedURL,
		"Sophie-happy": sophieHappyURL,
		"Sophie-neutral": sophieNeutralURL,
		"Sophie-annoyed": sophieAnnoyedURL,
		"Gary-happy": garyHappyURL,
		"Gary-neutral": garyNeutralURL,
		"Gary-annoyed": garyAnnoyedURL,
	};
	const {
		currentStep,
		currentRoomId,
		currentMapId,
		advanceStory,
		currentTurn,
	} = useGameManager();
	const prevActingCharacterRef = useRef<string | null>(null);
	const isLeftRef = useRef(true);
	const lastLeftCharKeyRef = useRef<string | undefined>(undefined);
	const lastRightCharKeyRef = useRef<string | undefined>(undefined);
	const [luciferAnimationSide, setLuciferAnimationSide] = useState<
		"left" | "right" | null
	>(null);
	const [showHoldItBox, setShowHoldItBox] = useState(false);
	const holdItSoundPlayer = useRef(new Audio(holdItSoundURL));

	// Reset all trackers when entering a new room or map or on a time turn
	useEffect(() => {
		prevActingCharacterRef.current = null;
		isLeftRef.current = true;
		lastLeftCharKeyRef.current = undefined;
		lastRightCharKeyRef.current = undefined;
	}, [currentRoomId, currentMapId]);

	useEffect(() => {
		if (currentTurn?.type === "time") {
			prevActingCharacterRef.current = null;
			isLeftRef.current = true;
			lastLeftCharKeyRef.current = undefined;
			lastRightCharKeyRef.current = undefined;
			setLuciferAnimationSide(null);
			setShowHoldItBox(false);
		}
	}, [currentTurn]);

	let imgMain: string | undefined;
	let imgTarget: string | undefined;
	let actingCharacterId: string | null = null;
	const isFadingBoth =
		currentStep?.type === "narration" ||
		currentStep?.type === "choice" ||
		(currentStep?.type === "animation" && !currentStep.characterId);

	if (currentStep?.type === "dialog") {
		actingCharacterId = currentStep.speakerId;
		imgMain = `${currentStep.speakerId}-${currentStep.speakerExpression}`;
		imgTarget = currentStep.listenerId
			? `${currentStep.listenerId}-${currentStep.listenerExpression}`
			: undefined;
	} else if (currentStep?.type === "action") {
		actingCharacterId = currentStep.characterId;
		imgMain = `${currentStep.characterId}-${currentStep.characterExpression}`;
		imgTarget = currentStep.targetId
			? `${currentStep.targetId}-${currentStep.targetExpression}`
			: undefined;
	} else if (currentStep?.type === "animation") {
		if (currentStep.characterId) {
			actingCharacterId = currentStep.characterId;
			if (currentStep.characterExpression) {
				imgMain = `${currentStep.characterId}-${currentStep.characterExpression}`;
			}
		}
	}

	useEffect(() => {
		if (
			currentStep?.type === "animation" &&
			currentStep.animationId === "lucifer-appears"
		) {
			const isLuciferMain = actingCharacterId === "Lucifer";
			const luciferIsLeft = isLeftRef.current
				? isLuciferMain
				: !isLuciferMain;
			setLuciferAnimationSide(luciferIsLeft ? "left" : "right");
		} else if (
			currentStep?.type === "animation" &&
			currentStep.animationId === "hold-it"
		) {
			setShowHoldItBox(true);
		}
	}, [currentStep, actingCharacterId]);

	useEffect(() => {
		if (showHoldItBox) {
			holdItSoundPlayer.current.play();
			const timer = setTimeout(() => {
				setShowHoldItBox(false);
				advanceStory();
			}, 1500); // 1.5-second delay

			return () => clearTimeout(timer);
		}
	}, [showHoldItBox, advanceStory]);

	if (
		actingCharacterId &&
		actingCharacterId !== prevActingCharacterRef.current
	) {
		isLeftRef.current = !isLeftRef.current;
		prevActingCharacterRef.current = actingCharacterId;
	}

	const currentLeftKey = isLeftRef.current ? imgMain : imgTarget;
	const currentRightKey = isLeftRef.current ? imgTarget : imgMain;

	let displayLeftKey = currentLeftKey ?? lastLeftCharKeyRef.current;
	let displayRightKey = currentRightKey ?? lastRightCharKeyRef.current;

	const getCharId = (key: string | undefined) => key?.split("-")[0];
	if (getCharId(displayLeftKey) === getCharId(displayRightKey)) {
		if (isLeftRef.current) {
			displayRightKey = undefined;
		} else {
			displayLeftKey = undefined;
		}
	}

	lastLeftCharKeyRef.current = displayLeftKey;
	lastRightCharKeyRef.current = displayRightKey;

	const isLeftTarget = !isFadingBoth && !isLeftRef.current && displayRightKey;
	const isRightTarget = !isFadingBoth && isLeftRef.current && displayLeftKey;

	const fadeClass = "brightness-70";
	const transitionClass = "transition-all duration-300";

	const renderImageSlot = (
		key: string | undefined,
		side: "left" | "right",
	) => {
		const isTarget = side === "left" ? isLeftTarget : isRightTarget;
		const shouldAnimate = luciferAnimationSide === side;

		return (
			<AnimatePresence>
				{key && imageMap[key] && !shouldAnimate ? (
					<img
						className={mergeClasses(
							`drop-shadow-xl drop-shadow-black grow basis-0 max-w-1/2 md:max-w-100`,
							transitionClass,
							(isFadingBoth || isTarget) && fadeClass,
							side === "right" && "transform scale-x-[-1]",
						)}
						src={imageMap[key]}
					/>
				) : (
					<div className={`grow basis-0 max-w-1/2 md:max-w-100`} />
				)}

				{shouldAnimate && (
					<motion.img
						src={beamURL}
						alt="Lucifer animation"
						variants={{
							initial: { scaleX: 0 },
							animate: { scaleX: 1 },
							exit: {
								scaleX: 0,
								transition: {
									delay: 0.5,
									duration: 1,
								},
							},
						}}
						key={"lucifer-animation"}
						className={`absolute w-[calc(50%+3rem)] md:w-140 h-full ${side === "left" ? "-left-10 md:-left-20" : "-right-10 md:-right-20"}`}
						initial="initial"
						animate="animate"
						exit="exit"
						transition={{ duration: 1 }}
						onAnimationComplete={async (latest) => {
							if (latest === "animate") {
								setLuciferAnimationSide(null);
							} else if (latest === "exit") {
								await advanceStory();
							}
						}}
					/>
				)}
			</AnimatePresence>
		);
	};

	return (
		<div
			className={mergeClasses(
				`flex justify-between items-end`,
				className,
			)}
		>
			{showHoldItBox && (
				<div className="fixed inset-0 bottom-20 md:bottom-0 flex items-center justify-center z-50 ">
					<img src={holdItURL} alt="hold it" className={`w-100 h-100`} />
				</div>
			)}
			{renderImageSlot(displayLeftKey, "left")}
			{renderImageSlot(displayRightKey, "right")}
		</div>
	);
}
