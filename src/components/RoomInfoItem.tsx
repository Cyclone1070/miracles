import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { getAllItemsInCharacter } from "../game/storage";
import type { Item } from "../types";
import { mergeClasses } from "../utils/tailwindMerge";
import { HighlightButton } from "./HighlightButton";

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

export function RoomInfoItem({ ...props }: Props) {
	const [items, setItems] = useState<Item[]>([]);
	const [isExpanded, setIsExpanded] = useState(false);
	if (props.inspectId === props.id && !isExpanded) {
		setIsExpanded(true);
	}
	useEffect(() => {
		if (props.isItem) return;

		async function fetchItems() {
			try {
				if (!props.isItem) {
					// If it's not an item, we can fetch items the character inventory
					const fetchedItems = await getAllItemsInCharacter(props.id);
					setItems(fetchedItems);
				}
			} catch (error) {
				console.error("Error fetching room items:", error);
			}
		}
		fetchItems();
	}, [props.id, props.isItem]);

	return (
		<div className={mergeClasses(`flex flex-col`, props.className)}>
			<HighlightButton
				className={`flex rounded-sm p-2 cursor-pointer bg-transparent shadow-none text-left`}
				key={props.id}
				onClick={() => {
					setIsExpanded((prev) => !prev);
					if (props.inspectId === props.id) {
						props.setInspectId?.(null);
					}
				}}
			>
				<div
					className={
						`w-6 h-6 rounded-sm flex justify-center items-center ` +
						`${props.isItem && "font-bold"}`
					}
					style={
						props.isItem
							? { color: props.colorHex }
							: { backgroundColor: props.colorHex }
					}
				>
					{props.asciiChar}
				</div>
				<span>:&nbsp;</span>
				<span>{props.id}</span>
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
							{props.description}
						</div>
						{props.state && (
							<>
								<div className="text-sm text-gray-300 underline mt-2">
									State:
								</div>
								<div className="text-sm text-gray-400">
									{props.state}
								</div>
							</>
						)}
						{items.length > 0 && (
							<>
								<div className="text-sm text-gray-300 underline mt-2">
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
