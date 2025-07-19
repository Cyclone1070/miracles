import { motion, type Transition } from "motion/react";
import type { MouseEventHandler } from "react";
import { mergeClasses } from "../utils/tailwindMerge";

interface Props {
	className?: string;
	id?: string;
	transition?: Transition;
	onClick?: MouseEventHandler<HTMLDivElement>;
	style?: React.CSSProperties;
}

export function MapRoom({ ...props }: Props) {
	return (
		<motion.div
			style={props.style}
			layoutId={props.id}
			transition={props.transition}
			onClick={props.onClick}
			className={mergeClasses(``, props.className)}
		></motion.div>
	);
}
