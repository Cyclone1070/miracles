import { mergeClasses } from "../utils/tailwindMerge";

interface Props {
    className?: string;
    children?: React.ReactNode;
    isNameBoxLeft: boolean;
}

export function NarrativeBox({ ...props }: Props) {
    let bgColor = props.children ? "bg-black/85 ring-black/85" : "bg-black/70 ring-black/70";
    return (
        <div
            className={mergeClasses(`
			relative h-50 p4 text-white border-2 border-(--accent) rounded-xl ring-5 border-t-0 
			${bgColor}`, props.className)}
        >
            <div className="absolute top-0 -left-[2px] -right-[2px] flex">
                <div className={`border-t-2 border-(--accent) ${props.isNameBoxLeft ? "border-l-2 rounded-tl-xl w-8" : "border-l-2 rounded-tl-xl grow"}`}></div>
                <div className={`relative -translate-y-1/2 text-white `}>
                    <div className={`absolute -top-[5px] -left-[5px] -right-[5px] rounded-t-xl ${bgColor} h-[50%]`}></div>
                    <div className="relative border-2 border-(--accent) rounded-xl p-2 min-h-11 text-center">Jesus</div>
                </div>
                <div className={`border-t-2 border-(--accent) ${props.isNameBoxLeft ? "border-r-2 rounded-tr-xl grow" : "border-r-2 rounded-tr-xl w-8"}`}></div>
            </div>
            {props.children}
        </div >
    );
}

