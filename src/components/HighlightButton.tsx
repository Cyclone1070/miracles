import { motion } from "motion/react";
import React from "react";
import { useTheme } from "../context/ThemeContext";
import { mergeClasses } from "../utils/tailwindMerge";

interface Props {
	className?: string;
	children: React.ReactNode;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
	onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
	ref?: React.Ref<HTMLButtonElement>;
	style?: React.CSSProperties;
	disabled?: boolean;
}

export function HighlightButton({ ...props }: Props) {
	const [isActive, setIsActive] = React.useState(false);
	const { darkMode } = useTheme();

	return (
		<button
			{...props}
			ref={props.ref}
			/* set to active on click */
			onMouseDown={() => {
				setIsActive(true);
			}}
			onMouseUp={() => {
				setIsActive(false);
			}}
			onMouseLeave={(e) => {
				setIsActive(false);
				if (props.onMouseLeave) props.onMouseLeave(e);
			}}
			onTouchStart={() => {
				setIsActive(true);
			}}
			onTouchEnd={() => {
				setIsActive(false);
			}}
			onClick={props.onClick}
			className={mergeClasses(
				"cursor-pointer p-2 relative bg-(--accent) text-white rounded-md shadow-md/25",
				`${props.disabled && "pointer-events-none"}`,
				props.className,
			)}
		>
			{/* darken background overlay */}
			{props.children}
			{!props.disabled && (
				<motion.div
					variants={{
						default: { opacity: 0 },
						hover: { opacity: 0.16 },
						active: { opacity: 0.22 },
					}}
					initial="default"
					whileHover={isActive ? "active" : "hover"}
					animate={isActive ? "active" : "default"}
					transition={{ duration: 0.2 }}
					className={`absolute inset-0 rounded-[inherit] ${darkMode ? "bg-white" : "bg-black"}`}
				></motion.div>
			)}
		</button>
	);
}
