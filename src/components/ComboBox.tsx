import { useCombobox, type UseComboboxStateChange } from "downshift";
import { useState } from "react";
import closeSvgURL from "/close.svg?url";

interface Props<T> {
	items: T[];
	itemToString: (item: T | null) => string;
	onSelectedItemChange?: (changes: UseComboboxStateChange<T>) => void;
	initialSelectedItem?: T;
	className?: string;
	placeholder?: string;
	label: string;
	required?: boolean;
}

export function Combobox<T>({ ...props }: Props<T>) {
	const [inputItems, setInputItems] = useState(props.items);

	const {
		isOpen,
		getLabelProps,
		getMenuProps,
		getInputProps,
		highlightedIndex,
		getItemProps,
		selectItem,
		selectedItem,
		reset,
		inputValue,
		setInputValue,
	} = useCombobox({
		onInputValueChange({ inputValue }) {
			setInputItems(
				props.items.filter((item) =>
					props
						.itemToString(item)
						.toLowerCase()
						.includes(inputValue?.toLowerCase() ?? ""),
				),
			);
		},
		items: inputItems,
		itemToString: props.itemToString,
		initialSelectedItem: props.initialSelectedItem,
		onSelectedItemChange: props.onSelectedItemChange,
	});

	return (
		<>
			<label {...getLabelProps()}>
				{props.required && <span className={`text-red-500`}>*</span>}
				{props.label}
			</label>
			<div className={`relative ${props.className}`}>
				<div className="relative rounded-md w-full">
					<input
						{...getInputProps({
							onKeyDown(event) {
								if (event.key === "Enter") {
									if (highlightedIndex === -1) {
										if (inputItems.length > 0) {
											selectItem(inputItems[0]);
										} else {
											reset();
										}
									}
								}
							},
							onBlur() {
								if (inputValue === "" && !props.required) {
									console.log("Resetting input value");
									reset();
								} else if (selectedItem) {
									selectItem(selectedItem);
								} else if (inputItems.length > 0) {
									selectItem(inputItems[0]);
								} else {
									console.log(
										"Resetting input value on blur",
									);
									reset();
								}
							},
						})}
						className="w-full rounded-md px-2 border-2 border-(--accent)"
						placeholder={props.placeholder}
					/>
					{inputValue !== "" && (
						<img
							onClick={() => {
								setInputValue("");
							}}
							src={closeSvgURL}
							alt="clear text field"
							className={`absolute right-0 top-0 h-full cursor-pointer`}
						/>
					)}
				</div>
				<div
					{...getMenuProps()}
					className={
						`absolute z-10 mt-1 w-full bg-(--theme-bg) border-2 border-(--accent) rounded-md shadow-lg max-h-60 overflow-auto flex flex-col ` +
						`${!isOpen || inputItems.length === 0 ? "invisible" : ""}`
					}
				>
					{isOpen &&
						inputItems.map((item, index) => (
							<div
								className={
									`text-left shadow-none rounded-none p-2 cursor-pointer ` +
									`${highlightedIndex === index ? "bg-(--accent)" : ""}`
								}
								key={`${props.itemToString(item)}${index}`}
								{...getItemProps({ item, index })}
							>
								{props.itemToString(item)}
							</div>
						))}
				</div>
			</div>
		</>
	);
}
