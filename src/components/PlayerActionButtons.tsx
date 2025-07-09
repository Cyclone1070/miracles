import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Action } from "../type";
import { ActionButton } from "./ActionButton";
import actionSvgURL from "/action.svg?url";
import closeSvgURL from "/close.svg?url";
import miracleSvgURL from "/miracle.svg?url";
import saySvgURL from "/say.svg?url";
import { v4 as uuidv4 } from "uuid";

interface Props {
	className?: string;
	setActions: React.Dispatch<React.SetStateAction<Action[]>>;
}

export function PlayerActionButtons({ ...props }: Props) {
	const [isActionExpanded, setIsActionExpanded] = useState(false);
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
				!event.target.closest("[data-none-close-click]")
			) {
				setIsActionExpanded(false);
			}
		};

		if (isActionExpanded) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isActionExpanded]);
	return (
		<div
			className={`flex justify-center -right-[2px] -left-[2px] absolute top-full -translate-y-1/2`}
		>
			<div className={`relative text-white`}>
				<ActionButton
					data-none-close-click
					data-textbox-none-close-click
					onClick={() => {
						setIsActionExpanded((prev) => !prev);
					}}
					className={`w-12 h-12 rounded-full flex justify-center items-center`}
				>
					<motion.img
						variants={iconVariants}
						animate={isActionExpanded ? "hidden" : "visible"}
						className={`h-7 absolute`}
						src={actionSvgURL}
						alt="action icon"
					/>
					<motion.img
						variants={iconVariants}
						animate={isActionExpanded ? "visible" : "hidden"}
						className={`absolute h-7`}
						src={closeSvgURL}
						alt="close icon"
					/>
				</ActionButton>
				<motion.div
					data-textbox-none-close-click
					variants={{
						visible: {
							visibility: "visible",
							opacity: 1,
							y: -3,
							transition: { ease: "easeInOut" },
						},
						hidden: {
							visibility: "hidden",
							opacity: 0,
							y: 0,
							transition: { ease: "easeInOut" },
						},
					}}
					animate={isActionExpanded ? "visible" : "hidden"}
					className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1 md:mb-2 flex flex-col gap-2`}
				>
					<ActionButton
						onClick={addDoAction}
						className={`flex gap-2 items-center`}
					>
						<div className={`h-5 w-5`}>
							<img
								className={`h-full w-full`}
								src={actionSvgURL}
								alt="action icon"
							/>
						</div>
						<span>Do</span>
					</ActionButton>
					<ActionButton
						onClick={addSayAction}
						className={`flex gap-2 items-center`}
					>
						<div className={`h-4 w-5`}>
							<img
								className={`h-full w-full`}
								src={saySvgURL}
								alt="say icon"
							/>
						</div>
						<span>Say</span>
					</ActionButton>
					<ActionButton
						onClick={addMiracleAction}
						className={`flex gap-2 items-center`}
					>
						<div className={`h-5 w-5`}>
							<img
								className={`w-full h-full`}
								src={miracleSvgURL}
								alt="miracle icon"
							/>
						</div>
						<span>Miracle</span>
					</ActionButton>
				</motion.div>
			</div>
		</div>
	);

	function addDoAction() {
		props.setActions((prev) => {
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
		props.setActions((prev) => {
			if (prev.length >= 4) {
				return prev;
			}
			return [
				...prev,
				{
					id: uuidv4(),
					expression: "neutral",
					type: "say",
					action: "test",
					target: "test target",
				},
			];
		});
	}
	function addMiracleAction() {
		props.setActions((prev) => {
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
