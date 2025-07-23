import { AnimatePresence, motion } from "motion/react";
import { Fragment, useEffect, useState } from "react";
import { useGameManager } from "../context/GameContext";
import {
	getAllCharactersInRoom,
	getAllItemsInCharacter,
	getAllItemsInRoom,
	loadRoom,
} from "../game/storage";
import type { Action, Character, GameObject, Item } from "../types";
import { mergeClasses } from "../utils/tailwindMerge";
import { Combobox } from "./ComboBox";
import { HighlightButton } from "./HighlightButton";
import actionSvgURL from "/action.svg?url";
import binSvgURL from "/bin.svg?url";
import miracleSvgURL from "/miracle.svg?url";
import moveSvgURL from "/move.svg?url";
import saySvgURL from "/say.svg?url";

interface Props {
	className?: string;
}

export function PlayerActionInputArea({ ...props }: Props) {
	const ANIMATION_DURATION_MS = 150;
	const [activeAction, setActiveAction] = useState<Action | null>(null);
	const [characters, setCharacters] = useState<Character[]>();
	const [items, setItems] = useState<Item[]>();
	const [connectedRooms, setConnectedRooms] = useState<string[]>([]);
	const { playerActions, setPlayerActions, currentRoomId } = useGameManager();
	const targets: GameObject[] =
		characters && items ? [...items, ...characters] : [];
	const dialogTargets: GameObject[] =
		characters && items ? [...characters, ...items] : [];

	const typeToText = {
		do: "Do something",
		say: "Say something",
		move: "Move somewhere",
		create: "Create something",
		destroy: "Destroy something",
		transform: "Transform something",
	};

	// fetching useEffect
	useEffect(() => {
		async function fetchData() {
			if (!currentRoomId) {
				return;
			}
			try {
				const fetchedCharacters: Character[] =
					await getAllCharactersInRoom(currentRoomId);
				const roomItems: Item[] =
					await getAllItemsInRoom(currentRoomId);

				const itemPromises = fetchedCharacters.map((character) =>
					getAllItemsInCharacter(character.id),
				);
				const inventoryItems = await Promise.all(itemPromises);
				const fetchedItems: Item[] = [
					...roomItems,
					...inventoryItems.flat(),
				];
				const currentRoom = await loadRoom(currentRoomId);
				setConnectedRooms(currentRoom.connectedRooms || []);
				setCharacters(fetchedCharacters);
				setItems(fetchedItems);
			} catch (error) {
				alert("Failed to load room data. " + error);
				console.error("Error fetching room data:", error);
			}
		}
		fetchData();
	}, [currentRoomId]);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				event.target instanceof HTMLElement &&
				!event.target.closest("[data-textbox-none-close-click]")
			) {
				setActiveAction(null);
			}
		}

		if (activeAction) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [activeAction]);

	return (
		<div
			className={mergeClasses(
				`flex gap-2 m-auto max-w-100 justify-center text-white`,
				props.className,
			)}
		>
			<AnimatePresence>
				{playerActions.map((action, index) => (
					<Fragment key={action.id}>
						{/* arrow between actions */}
						{index !== 0 && (
							<motion.div
								key={`${action.id}-arrow`}
								variants={{
									hidden: {
										x: 10,
										opacity: 0,
										visibility: "hidden",
									},
									visible: {
										x: 0,
										opacity: 1,
										visibility: "visible",
									},
								}}
								transition={{
									duration: 0.3,
									ease: "easeInOut",
								}}
								layout
								initial={{
									x: 10,
									opacity: 0,
									visibility: "hidden",
								}}
								animate={{
									x: 0,
									opacity: 1,
									visibility: "visible",
								}}
								exit={{
									y: -10,
									opacity: 0,
									visibility: "hidden",
								}}
								className={`w-6 h-6 text-[color:var(--accent)] self-center`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 14"
									className="w-full h-full fill-current stroke-(--bg)"
								>
									<path d="M0 4H16V0L24 7L16 14V10H0V4Z" />
								</svg>
							</motion.div>
						)}

						{/* not expanded action button */}
						<motion.div
							key={action.id}
							variants={{
								hidden: {
									x: 10,
									opacity: 0,
									visibility: "hidden",
								},
								visible: {
									x: 0,
									opacity: 1,
									visibility: "visible",
								},
							}}
							transition={{ duration: 0.3, ease: "easeInOut" }}
							layout
							initial="hidden"
							animate="visible"
							exit="hidden"
							className={`w-10 h-10 flex-shrink-0`}
						>
							{activeAction?.id !== action.id && (
								<motion.div
									data-textbox-none-close-click
									layoutId={action.id}
									transition={{
										type: "spring",
										stiffness: 300,
										damping: 30,
									}}
									className={`w-full h-full will-change-transform ${activeAction?.id === action.id ? "invisible" : ""}`}
								>
									<HighlightButton
										onClick={() => {
											handleActionChange(action);
										}}
										className={`w-full h-full flex justify-center items-center bg-(--bg)`}
									>
										{/* icons */}
										{action.type === "do" && (
											<motion.img
												layoutId={`${action.id}-icon`}
												transition={{
													type: "spring",
													stiffness: 300,
													damping: 30,
												}}
												src={actionSvgURL}
												alt="do icon"
												className={`will-change-transform w-full h-full`}
											/>
										)}
										{action.type === "say" && (
											<motion.img
												layoutId={`${action.id}-icon`}
												transition={{
													type: "spring",
													stiffness: 300,
													damping: 30,
												}}
												src={saySvgURL}
												alt="say icon"
												className={`will-change-transform w-full h-full`}
											/>
										)}
										{action.type === "move" && (
											<motion.img
												layoutId={`${action.id}-icon`}
												transition={{
													type: "spring",
													stiffness: 300,
													damping: 30,
												}}
												src={moveSvgURL}
												alt="move icon"
												className={`will-change-transform w-full h-full`}
											/>
										)}
										{(action.type === "create" ||
											action.type === "destroy" ||
											action.type === "transform") && (
											<motion.img
												layoutId={`${action.id}-icon`}
												transition={{
													type: "spring",
													stiffness: 300,
													damping: 30,
												}}
												src={miracleSvgURL}
												alt="miracle icon"
												className={`will-change-transform w-full h-full`}
											/>
										)}
									</HighlightButton>
								</motion.div>
							)}
						</motion.div>

						{/* pop up expanded box */}
					</Fragment>
				))}
			</AnimatePresence>
			<AnimatePresence>
				{activeAction && (
					<motion.div
						data-map-close-click
						key={`${activeAction.id}-expanded`}
						data-textbox-none-close-click
						layoutId={activeAction.id}
						transition={{
							type: "spring",
							stiffness: 300,
							damping: 30,
						}}
						exit={{
							opacity: 0,
							y: -10,
							transition: { duration: 0.3 },
						}}
						className={`fixed top-10 w-80 max-w-[95vw] h-min max-h-100 bg-(--bg) rounded-lg p-2 flex flex-col gap-4 will-change-transform z-10
					md:absolute md:bottom-full md:mb-10 md:top-auto`}
					>
						{/* first row */}
						<div
							className={`relative w-full flex items-center gap-2`}
						>
							{/* action icon */}
							<HighlightButton
								className={`w-8 h-8 p-1 shadow-none bg-transparent flex gap-2`}
								onClick={() => {
									setActiveAction(null);
								}}
							>
								{activeAction.type === "do" && (
									<motion.img
										layoutId={`${activeAction.id}-icon`}
										transition={{
											type: "spring",
											stiffness: 300,
											damping: 30,
										}}
										src={actionSvgURL}
										alt="do icon"
										className={`will-change-transform w-full h-full`}
									/>
								)}
								{activeAction.type === "say" && (
									<motion.img
										layoutId={`${activeAction.id}-icon`}
										transition={{
											type: "spring",
											stiffness: 300,
											damping: 30,
										}}
										src={saySvgURL}
										alt="say icon"
										className={`will-change-transform w-full h-full`}
									/>
								)}
								{activeAction.type === "move" && (
									<motion.img
										layoutId={`${activeAction.id}-icon`}
										transition={{
											type: "spring",
											stiffness: 300,
											damping: 30,
										}}
										src={moveSvgURL}
										alt="move icon"
										className={`will-change-transform w-full h-full`}
									/>
								)}
								{(activeAction.type === "create" ||
									activeAction.type === "destroy" ||
									activeAction.type === "transform") && (
									<motion.img
										layoutId={`${activeAction.id}-icon`}
										transition={{
											type: "spring",
											stiffness: 300,
											damping: 30,
										}}
										src={miracleSvgURL}
										alt="miracle icon"
										className={`will-change-transform w-full h-full`}
									/>
								)}
							</HighlightButton>
							<span className={`grow`}>
								{typeToText[activeAction.type]}
							</span>

							{/* delete button */}
							<HighlightButton
								className={`h-8 w-8 p-1 bg-transparent shadow-none`}
								onClick={() => {
									setPlayerActions((prev) => {
										const indexToRemove = prev.findIndex(
											(action) => action.id === activeAction.id,
										);

										// 2. Remove the item at the found index if it exists (index is not -1)
										if (indexToRemove !== -1) {
											prev.splice(indexToRemove, 1);
										}
										return prev
									});
									setActiveAction(null);
								}}
							>
								<img
									src={binSvgURL}
									alt=""
									className={`w-full h-full`}
								/>
							</HighlightButton>
						</div>

						{/* content */}
						<form
							action=""
							className={`grid gap-2 grid-cols-[min-content_1fr] items-center`}
						>
							<label htmlFor="expression">Expression:</label>
							<select
								name="expression"
								id="expression"
								className={`rounded-md py-1 w-min`}
								value={activeAction.expression}
								onChange={(e) => {
									setPlayerActions((prev) => {
										return prev.map((action) => {
											if (
												action.id === activeAction!.id
											) {
												return {
													...action,
													expression: e.target
														.value as
														| "neutral"
														| "happy"
														| "annoyed",
												};
											}
											return action;
										});
									});
									setActiveAction((prev) => {
										if (!prev) return null;
										return {
											...prev,
											expression: e.target.value as
												| "neutral"
												| "happy"
												| "annoyed",
										};
									});
								}}
							>
								<option value="neutral">Neutral</option>
								<option value="happy">Happy</option>
								<option value="annoyed">Annoyed</option>
							</select>

							{activeAction.type === "do" && (
								<>
									<label htmlFor="action">Action:</label>
									<textarea
										name="action"
										id="action"
										className={`resize-none h-20 md:h-32 rounded-md px-2 border-2 border-(--accent)`}
										value={activeAction.action}
										onChange={(e) => {
											setPlayerActions((prev) => {
												return prev.map((action) => {
													if (
														action.id ===
														activeAction!.id
													) {
														return {
															...action,
															action: e.target
																.value,
														};
													}
													return action;
												});
											});
											setActiveAction((prev) => {
												if (!prev) return null;
												return {
													...prev,
													action: e.target.value,
												};
											});
										}}
									/>

									<Combobox
										label="Target:"
										items={targets}
										itemToString={(item) => {
											if (!item) return "";
											if (item.type === "item") {
												return item.name;
											}
											return item.id;
										}}
										initialSelectedItem={targets.find(
											(target) =>
												target.id ===
												activeAction.target,
										)}
										onSelectedItemChange={({
											selectedItem,
										}) => {
											setPlayerActions((prev) => {
												return prev.map((action) => {
													if (
														action.id ===
														activeAction!.id
													) {
														return {
															...action,
															target: selectedItem?.id,
														};
													}
													return action;
												});
											});
											setActiveAction((prev) => {
												if (!prev) return null;
												return {
													...prev,
													target: selectedItem?.id,
												};
											});
										}}
									/>

									<Combobox
										label="Using:"
										items={targets}
										itemToString={(item) => {
											if (!item) return "";
											if (item.type === "item") {
												return item.name;
											}
											return item.id;
										}}
										initialSelectedItem={targets.find(
											(target) =>
												target.id ===
												activeAction.using,
										)}
										onSelectedItemChange={({
											selectedItem,
										}) => {
											setPlayerActions((prev) => {
												return prev.map((action) => {
													if (
														action.id ===
														activeAction!.id
													) {
														return {
															...action,
															using: selectedItem?.id,
														};
													}
													return action;
												});
											});
											setActiveAction((prev) => {
												if (!prev) return null;
												return {
													...prev,
													using: selectedItem?.id,
												};
											});
										}}
									/>
								</>
							)}

							{activeAction.type === "say" && (
								<>
									<label htmlFor="dialog">Dialog:</label>
									<textarea
										name="dialog"
										id="dialog"
										className={`resize-none h-20 md:h-32 rounded-md px-2 border-2 border-(--accent)`}
										value={activeAction.dialog}
										onChange={(e) => {
											setPlayerActions((prev) => {
												return prev.map((action) => {
													if (
														action.id ===
														activeAction!.id
													) {
														return {
															...action,
															dialog: e.target
																.value,
														};
													}
													return action;
												});
											});
											setActiveAction((prev) => {
												if (!prev) return null;
												return {
													...prev,
													dialog: e.target.value,
												};
											});
										}}
									/>

									<Combobox
										label="Target:"
										items={dialogTargets}
										itemToString={(item) => {
											if (!item) return "";
											if (item.type === "item") {
												return item.name;
											}
											return item.id;
										}}
										initialSelectedItem={targets.find(
											(target) =>
												target.id ===
												activeAction.target,
										)}
										onSelectedItemChange={({
											selectedItem,
										}) => {
											setPlayerActions((prev) => {
												return prev.map((action) => {
													if (
														action.id ===
														activeAction!.id
													) {
														return {
															...action,
															target: selectedItem?.id,
														};
													}
													return action;
												});
											});
											setActiveAction((prev) => {
												if (!prev) return null;
												return {
													...prev,
													target: selectedItem?.id,
												};
											});
										}}
									/>
								</>
							)}
							{activeAction.type === "move" && (
								<>
									<label htmlFor="destination">
										Destination:
									</label>
									<select
										name="destination"
										id="destination"
										className={`rounded-md py-1 w-min`}
										value={activeAction.destinationId}
										onChange={(e) => {
											setPlayerActions((prev) => {
												return prev.map((action) => {
													if (
														action.id ===
														activeAction!.id
													) {
														return {
															...action,
															destinationId:
																e.target.value,
														};
													}
													return action;
												});
											});
											setActiveAction((prev) => {
												if (!prev) return null;
												return {
													...prev,
													destinationId:
														e.target.value,
												};
											});
										}}
									>
										{connectedRooms.map((roomId) => (
											<option key={roomId} value={roomId}>
												{roomId}
											</option>
										))}
									</select>
								</>
							)}
							{(activeAction.type === "destroy" ||
								activeAction.type === "transform") &&
								items &&
								items.length > 0 && (
									<Combobox
										required
										label="Target:"
										items={items ? items : []}
										itemToString={(item) => {
											if (!item) return "";
											if (item.type === "item") {
												return item.name;
											}
											return item.id;
										}}
										initialSelectedItem={
											activeAction.targetId
												? items.find(
														(target) =>
															target.id ===
															activeAction.targetId,
													)
												: items?.[0]
										}
										onSelectedItemChange={({
											selectedItem,
										}) => {
											setPlayerActions((prev) => {
												return prev.map((action) => {
													if (
														action.id ===
														activeAction.id
													) {
														return {
															...action,
															targetId:
																selectedItem!
																	.id,
														};
													}
													return action;
												});
											});
											setActiveAction((prev) => {
												if (!prev) return null;
												return {
													...prev,
													targetId: selectedItem!.id,
												};
											});
										}}
									/>
								)}
							{(activeAction.type === "create" ||
								activeAction.type === "transform") && (
								<>
									<label htmlFor="description">
										Description:
									</label>
									<textarea
										name="description"
										id="description"
										className={`resize-none h-20 md:h-32 rounded-md px-2 border-2 border-(--accent)`}
										value={activeAction.description}
										onChange={(e) => {
											setPlayerActions((prev) => {
												return prev.map((action) => {
													if (
														action.id ===
														activeAction!.id
													) {
														return {
															...action,
															description:
																e.target.value,
														};
													}
													return action;
												});
											});
											setActiveAction((prev) => {
												if (!prev) return null;
												return {
													...prev,
													description: e.target.value,
												};
											});
										}}
									/>
								</>
							)}
						</form>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);

	// animate the action change
	async function handleActionChange(newAction: Action) {
		if (newAction.id === activeAction?.id) {
			setActiveAction(null);
		}
		if (activeAction !== null) {
			setActiveAction(null);
			await new Promise((resolve) =>
				setTimeout(resolve, ANIMATION_DURATION_MS),
			);
		}
		setActiveAction(newAction);
	}
}
