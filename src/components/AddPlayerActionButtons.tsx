import { motion } from "motion/react";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useGameManager } from "../context/GameContext";
import { HighlightButton } from "./HighlightButton";
import actionSvgURL from "/action.svg?url";
import closeSvgURL from "/close.svg?url";
import miracleSvgURL from "/miracle.svg?url";
import saySvgURL from "/say.svg?url";
import historySvgURL from "/history.svg?url";

interface Props {
	className?: string;
	addActionButtonRef: React.Ref<HTMLButtonElement>;
	isActionExpanded: boolean;
	setIsActionExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AddPlayerActionButtons({ ...props }: Props) {
	const { setPlayerActions, currentMapId } = useGameManager();
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
	}, [props, props.isActionExpanded]);
	return (
		<>
			<motion.div
				data-textbox-none-close-click
				variants={{
					visible: {
						visibility: "visible",
					},
					hidden: {
						visibility: "hidden",
					},
				}}
				transition={{ ease: "easeInOut", duration: 0.3 }}
				animate={props.isActionExpanded ? "visible" : "hidden"}
				onClick={(e) => {
					e.stopPropagation();
				}}
				className={`absolute inset-0 grid grid-cols-[8rem_8rem] gap-3 gap-x-6 justify-center`}
			>
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
							x: -5,
						},
					}}
					transition={{ ease: "easeInOut", duration: 0.3 }}
					animate={props.isActionExpanded ? "visible" : "hidden"}
					onClick={(e) => {
						e.stopPropagation();
					}}
					className={`flex flex-col gap-2 justify-center`}
				>
					<HighlightButton
						onClick={addTransformAction}
						className={`flex items-center gap-2 h-10 col-span-2 justify-self-center`}
					>
						<img
							className={`w-5 h-5`}
							src={miracleSvgURL}
							alt="miracle icon"
						/>
						<span>Transform</span>
					</HighlightButton>
					<HighlightButton
						onClick={addDestroyAction}
						className={`flex items-center gap-2 h-10`}
					>
						<img
							className={`w-5 h-5`}
							src={miracleSvgURL}
							alt="miracle icon"
						/>
						<span>Destroy</span>
					</HighlightButton>
					<HighlightButton
						onClick={addCreateAction}
						className={`flex items-center gap-2 h-10`}
					>
						<img
							className={`w-5 h-5`}
							src={miracleSvgURL}
							alt="miracle icon"
						/>
						<span>Create</span>
					</HighlightButton>
				</motion.div>

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
							x: 5,
						},
					}}
					transition={{ ease: "easeInOut", duration: 0.3 }}
					animate={props.isActionExpanded ? "visible" : "hidden"}
					onClick={(e) => {
						e.stopPropagation();
					}}
					className={`flex flex-col gap-2 justify-center`}
				>
					<HighlightButton className={`flex items-center gap-2 h-10`}>
						<img
							className={`h-5 w-5`}
							src={historySvgURL}
							alt="history icon"
						/>
						<span>History</span>
					</HighlightButton>
					<HighlightButton
						onClick={addSayAction}
						className={`flex items-center gap-2 h-10`}
					>
						<img
							className={`h-5 w-5`}
							src={saySvgURL}
							alt="say icon"
						/>
						<span>Say</span>
					</HighlightButton>
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
				</motion.div>
			</motion.div>
			<div
				className={`flex justify-center items-center gap-8 -right-[2px] -left-[2px] absolute top-full -translate-y-1/2`}
			>
				{/* add action buttons popup */}

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
		</>
	);

	function addDoAction() {
		setPlayerActions((prev) => {
			if (prev.length >= 4) {
				alert("You can only have 4 actions per turn!");
				return prev;
			}
			return [
				...prev,
				{
					id: uuidv4(),
					characterId:
						currentMapId === "heaven" ? "Jesus" : "Big Shot",
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
				alert("You can only have 4 actions per turn!");
				return prev;
			}
			return [
				...prev,
				{
					id: uuidv4(),
					characterId:
						currentMapId === "heaven" ? "Jesus" : "Big Shot",
					expression: "neutral",
					type: "say",
					dialog: "test",
					target: "test target",
				},
			];
		});
	}
	function addCreateAction() {
		setPlayerActions((prev) => {
			if (prev.length >= 4) {
				alert("You can only have 4 actions per turn!");
				return prev;
			}
			return [
				...prev,
				{
					id: uuidv4(),
					characterId:
						currentMapId === "heaven" ? "Jesus" : "Big Shot",
					expression: "neutral",
					type: "create",
				},
			];
		});
	}
	function addTransformAction() {
		setPlayerActions((prev) => {
			if (prev.length >= 4) {
				alert("You can only have 4 actions per turn!");
				return prev;
			}
			return [
				...prev,
				{
					id: uuidv4(),
					characterId:
						currentMapId === "heaven" ? "Jesus" : "Big Shot",
					expression: "neutral",
					type: "transform",
				},
			];
		});
	}
	function addDestroyAction() {
		setPlayerActions((prev) => {
			if (prev.length >= 4) {
				alert("You can only have 4 actions per turn!");
				return prev;
			}
			return [
				...prev,
				{
					id: uuidv4(),
					characterId:
						currentMapId === "heaven" ? "Jesus" : "Big Shot",
					expression: "neutral",
					type: "destroy",
				},
			];
		});
	}
}
