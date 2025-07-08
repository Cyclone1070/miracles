import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { mergeClasses } from "../utils/tailwindMerge";
import { ActionButton } from "./ActionButton";
import actionSvgURL from "/action.svg?url";
import closeSvgURL from "/close.svg?url";
import miracleSvgURL from "/miracle.svg?url";
import saySvgURL from "/say.svg?url";

interface Props {
    className?: string;
    bgColor: string;
}

export function PlayerActions({ ...props }: Props) {
    const [isActionExpanded, setIsActionExpanded] = useState(false);
    const iconVariants = {
        visible: { opacity: 1, scale: 1, visibility: "visible", transition: { duration: 0.2 } },
        hidden: { opacity: 0, scale: 0, visibility: "hidden", transition: { duration: 0.2 } }
    }
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (event.target instanceof HTMLElement && !event.target.closest("[data-none-close-click]")) {
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
        <div className={mergeClasses(`flex`, props.className)}>
            <div className={`border-b-2 border-(--accent) border-l-2 rounded-bl-xl grow`}></div>
            <div className={`relative text-white translate-y-1/2`}>
                <div className={`absolute -z-1 -inset-[5px] rounded-full [clip-path:inset(calc(50%+5px)_0_0_0)] ${props.bgColor}`}></div>
                <ActionButton
                    data-none-close-click
                    onClick={() => { setIsActionExpanded((prev) => !prev) }}
                    className={`w-12 h-12 rounded-full flex justify-center items-center`}>
                    <motion.img
                        variants={iconVariants}
                        animate={isActionExpanded ? "hidden" : "visible"}
                        className={`h-7 absolute`} src={actionSvgURL} alt="action icon" />
                    <motion.img
                        variants={iconVariants}
                        animate={isActionExpanded ? "visible" : "hidden"}
                        className={`absolute h-7`} src={closeSvgURL} alt="close icon" />
                </ActionButton>
                <motion.div variants={{ visible: { visibility: "visible", opacity: 1, y: -3, transition: {ease: "easeInOut"}}, hidden: { visibility: "hidden", opacity: 0, y: 0, transition: {ease: "easeInOut"}} }} animate={isActionExpanded ? "visible" : "hidden"} className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1 md:mb-2 flex flex-col gap-2`}>
                    <ActionButton className={`flex gap-2 items-center`}>
                        <div className={`h-5 w-5`}><img className={`h-full w-full`} src={actionSvgURL} alt="action icon" /></div>
                        <span>Do</span>
                    </ActionButton>
                    <ActionButton className={`flex gap-2 items-center`}>
                        <div className={`h-4 w-5`}><img className={`h-full w-full`} src={saySvgURL} alt="say icon" /></div>
                        <span>Say</span>
                    </ActionButton>
                    <ActionButton className={`flex gap-2 items-center`}>
                        <div className={`h-5 w-5`}><img className={`w-full h-full`} src={miracleSvgURL} alt="action icon" /></div>
                        <span>Miracle</span>
                    </ActionButton>
                </motion.div>
            </div>
            <div className={`border-b-2 border-(--accent) border-r-2 rounded-br-xl grow`}></div>
        </div>
    );
}
