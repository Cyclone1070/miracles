import { motion } from 'motion/react';
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { mergeClasses } from '../utils/tailwindMerge';

interface Props {
    className?: string;
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
	onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
	onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
}

export function ActionButton({...props}: Props) {
    const [isActive, setIsActive] = React.useState(false);
    const { darkMode } = useTheme();

    return (
        <button
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
			onMouseEnter={props.onMouseEnter}
			onTouchStart={() => {
				setIsActive(true);
			}}
			onTouchEnd={() => {
				setIsActive(false);
			}}
            onClick={props.onClick}
            className={mergeClasses("cursor-pointer relative bg-(--accent) text-white rounded-md", props.className,)}
        >
            {/* darken background overlay */}
            <motion.div
                variants={{
                    default: { opacity: 0 },
                    hover: { opacity: 0.16 },
                    active: { opacity: 0.22 },
                }}
                initial="default"
                whileHover={isActive ? 'active' : 'hover'}
                animate={isActive ? 'active' : 'default'}
                transition={{ duration: 0.2 }}
                className={`absolute top-0 left-0 w-full h-full rounded-[inherit] ${darkMode ? 'bg-white' : 'bg-black'}`}
            ></motion.div>
            {props.children}
        </button>
    );
}
