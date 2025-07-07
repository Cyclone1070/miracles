import { mergeClasses } from "../utils/tailwindMerge";
import { PlayerActions } from "./PlayerActions";

interface Props {
    className?: string;
    children?: React.ReactNode;
    isNameBoxLeft: boolean;
}

export function NarrativeBox({ ...props }: Props) {
    let bgColor = props.children ? "bg-(--bg) ring-[var(--bg)]" : "bg-(--bg-without-text) ring-[var(--bg-without-text)]";
    return (
        <div
            className={mergeClasses(`
			relative h-50 p4 text-white border-x-2 border-(--accent) rounded-xl ring-5 
			${bgColor}`, props.className)}
        >
            <div className="absolute top-0 -left-[2px] -right-[2px] flex">
                <div className={`border-t-2 border-(--accent) ${props.isNameBoxLeft ? "border-l-2 rounded-tl-xl w-8" : "border-l-2 rounded-tl-xl grow"}`}></div>
                <div className={`relative -translate-y-1/2 text-white `}>
                    <div className={`absolute -inset-[5px] rounded-xl [clip-path:inset(0_0_calc(50%+5px)_0)] ${bgColor}`}></div>
                    <div className="relative border-2 border-(--accent) rounded-xl p-2 min-h-11 text-center">Jesus The Almighty</div>
                </div>
                <div className={`border-t-2 border-(--accent) ${props.isNameBoxLeft ? "border-r-2 rounded-tr-xl grow" : "border-r-2 rounded-tr-xl w-8"}`}></div>
            </div>
            {props.children}
			<PlayerActions className={`absolute bottom-0 -left-[2px] -right-[2px]`} bgColor={bgColor}></PlayerActions>
        </div >
    );
}

