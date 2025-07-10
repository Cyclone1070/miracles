import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Action } from "../type";
import { HighlightButton } from "./HighlightButton";
import actionSvgURL from "/action.svg?url";
import closeSvgURL from "/close.svg?url";
import miracleSvgURL from "/miracle.svg?url";
import saySvgURL from "/say.svg?url";
import historySvgURL from "/history.svg?url";
import submitSvgURL from "/submit.svg?url";
import { v4 as uuidv4 } from "uuid";

interface Props {
	className?: string;
	setActions: React.Dispatch<React.SetStateAction<Action[]>>;
	actionButtonRef: React.Ref<HTMLButtonElement>;
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
			className={`flex justify-center items-center gap-8 -right-[2px] -left-[2px] absolute top-full -translate-y-1/2`}
		>
			{/* create action buttons popup */}
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
				animate={isActionExpanded ? "visible" : "hidden"}
				className={`absolute bottom-full mb-2 md:mb-3 left-1/2 -translate-x-1/2 flex flex-col gap-2`}
			>
				{/* history and submit buttons */}
				<div
					data-textbox-none-close-click
					className={`absolute bottom-0 -inset-x-13 justify-between flex`}
				>
					<motion.div
						variants={{
							visible: {
								opacity: 1,
								visibility: "visible",
							},
							hidden: {
								opacity: 0,
								visibility: "hidden",
								x: 5,
							},
						}}
						transition={{ ease: "easeInOut" }}
						animate={isActionExpanded ? "visible" : "hidden"}
					>
						<HighlightButton className={`rounded-full w-10 h-10 flex justify-center items-center`}>
							<img
								className={`w-5 h-5`}
								src={historySvgURL}
								alt="history icon"
							/>
						</HighlightButton>
					</motion.div>

					<motion.div
						variants={{
							visible: {
								opacity: 1,
								visibility: "visible",
							},
							hidden: {
								opacity: 0,
								visibility: "hidden",
								x: -5,
							},
						}}
						transition={{ ease: "easeInOut" }}
						animate={isActionExpanded ? "visible" : "hidden"}
					>
						<HighlightButton className={`rounded-full w-10 h-10 flex justify-center items-center`}>
							<img
								className={`w-5 h-5`}
								src={submitSvgURL}
								alt="submit icon"
							/>
						</HighlightButton>
					</motion.div>
				</div>
				
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
				data-none-close-click
				data-textbox-none-close-click
				ref={props.actionButtonRef}
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
			</HighlightButton>
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
