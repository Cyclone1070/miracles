import { motion } from "motion/react";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useGameManager } from "../context/GameContext";
import { HighlightButton } from "./HighlightButton";
import actionSvgURL from "/action.svg?url";
import closeSvgURL from "/close.svg?url";
import miracleSvgURL from "/miracle.svg?url";
import saySvgURL from "/say.svg?url";

interface Props {
	className?: string;
	addActionButtonRef: React.Ref<HTMLButtonElement>;
	isActionExpanded: boolean;
	setIsActionExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AddPlayerActionButtons({ ...props }: Props) {
	const { setPlayerActions } = useGameManager();
	const iconVariants = {
		visible: {
			opacity: 1,
			scale: 1,
			visibility: "visible",
			transition: { duration: 0.2 },
		},
		hidden: {
			opacity: 0,
			scale: 0,
			visibility: "hidden",
			transition: { duration: 0.2 },
		},
	};
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				event.target instanceof HTMLElement &&
				!event.target.closest("[data-add-button-none-close-click]")
			) {
				props.setIsActionExpanded(false);
			}
		};

		if (props.isActionExpanded) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [props.isActionExpanded]);
	return (
		<div
			className={`flex justify-center items-center gap-8 -right-[2px] -left-[2px] absolute top-full -translate-y-1/2`}
		>
			{/* add action buttons popup */}
			<motion.div
				data-textbox-none-close-click
				variants={{
					visible: {
						visibility: "visible",
						opacity: 1,
					},
					hidden: {
						visibility: "hidden",
						opacity: 0,
						y: 5,
					},
				}}
				transition={{ ease: "easeInOut", duration: 0.3 }}
				animate={props.isActionExpanded ? "visible" : "hidden"}
				className={`absolute bottom-full mb-2 md:mb-3 left-1/2 -translate-x-1/2 flex flex-col gap-2`}
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				<HighlightButton
					onClick={addDoAction}
					className={`flex items-center gap-2 h-10`}
				>
					<img
						className={`h-5 w-5`}
						src={actionSvgURL}
						alt="action icon"
					/>
					<span>Do</span>
				</HighlightButton>
				<HighlightButton
					onClick={addSayAction}
					className={`flex items-center gap-2 h-10`}
				>
					<img className={`h-5 w-5`} src={saySvgURL} alt="say icon" />
					<span>Say</span>
				</HighlightButton>
				<HighlightButton
					onClick={addMiracleAction}
					className={`flex items-center gap-2 h-10`}
				>
					<img
						className={`w-5 h-5`}
						src={miracleSvgURL}
						alt="miracle icon"
					/>
					<span>Miracle</span>
				</HighlightButton>
			</motion.div>

			{/* main toggle action button */}
			<HighlightButton
				data-add-button-none-close-click
				data-textbox-none-close-click
				ref={props.addActionButtonRef}
				onClick={(e) => {
					e.stopPropagation();
					props.setIsActionExpanded((prev) => !prev);
				}}
				className={`w-14 h-14 rounded-full flex justify-center items-center`}
			>
				<motion.img
					variants={iconVariants}
					animate={props.isActionExpanded ? "hidden" : "visible"}
					className={`h-7 absolute`}
					src={actionSvgURL}
					alt="action icon"
				/>
				<motion.img
					variants={iconVariants}
					animate={props.isActionExpanded ? "visible" : "hidden"}
					className={`absolute h-7`}
					src={closeSvgURL}
					alt="close icon"
				/>
			</HighlightButton>
		</div>
	);

	function addDoAction() {
		setPlayerActions((prev) => {
			if (prev.length >= 4) {
				return prev;
			}
			return [
				...prev,
				{
					id: uuidv4(),
					expression: "neutral",
					type: "do",
					action: "test",
				},
			];
		});
	}
	function addSayAction() {
		setPlayerActions((prev) => {
			if (prev.length >= 4) {
				return prev;
			}
			return [
				...prev,
				{
					id: uuidv4(),
					expression: "neutral",
					type: "say",
					dialog: "test",
					target: "test target",
				},
			];
		});
	}
	function addMiracleAction() {
		setPlayerActions((prev) => {
			if (prev.length >= 4) {
				return prev;
			}
			return [
				...prev,
				{
					id: uuidv4(),
					expression: "neutral",
					type: "miracle",
				},
			];
		});
	}
}
