import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { getAllItemsInCharacter } from "../game/storage";
import type { Item } from "../types";
import { mergeClasses } from "../utils/tailwindMerge";
import { HighlightButton } from "./HighlightButton";
import { useGameManager } from "../context/GameContext";

interface Props {
	className?: string;
	id: string;
	asciiChar: string;
	colorHex: string;
	description: string;
	state?: string;
	isItem?: boolean;
	inspectId?: string | null;
	setInspectId?: React.Dispatch<React.SetStateAction<string | null>>;
}

export function RoomInfoItem({
	className,
	id,
	asciiChar,
	colorHex,
	description,
	state,
	isItem,
	inspectId,
	setInspectId,
}: Props) {
	const [items, setItems] = useState<Item[]>([]);
	const [isExpanded, setIsExpanded] = useState(false);
	const { npcActions, isTurnEndHandling } = useGameManager();
	if (inspectId === id && !isExpanded) {
		setIsExpanded(true);
	}
	useEffect(() => {
		if (isItem) return;

		async function fetchItems() {
			try {
				if (!isItem) {
					// If it's not an item, we can fetch items the character inventory
					const fetchedItems = await getAllItemsInCharacter(id);
					setItems(fetchedItems);
				}
			} catch (error) {
				console.error("Error fetching room items:", error);
			}
		}
		fetchItems();
	}, [id, isItem, isTurnEndHandling]);

	return (
		<div className={mergeClasses(`flex flex-col`, className)}>
			<HighlightButton
				className={`flex rounded-sm p-2 cursor-pointer bg-transparent shadow-none text-left`}
				key={id}
				onClick={() => {
					setIsExpanded((prev) => !prev);
					if (inspectId === id) {
						setInspectId?.(null);
					}
				}}
			>
				<div
					className={
						`w-6 h-6 rounded-sm flex justify-center items-center ` +
						`${isItem && "font-bold"}`
					}
					style={
						isItem
							? { color: colorHex }
							: { backgroundColor: colorHex }
					}
				>
					{asciiChar}
				</div>
				<span>:&nbsp;</span>
				<span>{id}</span>
			</HighlightButton>
			<AnimatePresence>
				{isExpanded && (
					<motion.div
						initial={{ opacity: 0, y: -5, height: 0 }}
						animate={{ opacity: 1, y: 0, height: "auto" }}
						exit={{ opacity: 0, y: -5, height: 0 }}
						transition={{ duration: 0.2, ease: "easeInOut" }}
						className={`pl-12 overflow-hidden`}
					>
						<div className="text-sm text-(--text-secondary)">
							{description}
						</div>
						{state && (
							<>
								<div className="text-sm text-(--text) underline mt-2">
									State:
								</div>
								<div className="text-sm text-(--text-secondary)">
									{state}
								</div>
							</>
						)}
						{!isItem && npcActions && id in npcActions && (
							<>
								<div className="text-sm text-(--text) underline mt-2">
									Next Action:
								</div>
								<div className="text-sm text-(--text-secondary)">
									{npcActions[id]}
								</div>
							</>
						)}
						{items.length > 0 && (
							<>
								<div className="text-sm text-(--text) underline mt-2">
									Inventory:
								</div>
								<div className="flex flex-col gap-2">
									{items.map((item) => (
										<RoomInfoItem
											key={item.id}
											id={item.id}
											description={item.description}
											asciiChar={item.asciiChar}
											colorHex={item.colorHex}
											className={`pl-4`}
											isItem
										></RoomInfoItem>
									))}
								</div>{" "}
							</>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
