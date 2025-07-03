interface Props {
    classsName?: string;
    children?: React.ReactNode;
    isNameBoxLeft: boolean;
}

export function NarrativeBox({ ...props }: Props) {
    let bgColor = props.children ? "bg-black/85 ring-black/85" : "bg-black/70 ring-black/70";
    return (
        <div
            className={`
			relative m-6 p4 text-white border-2 border-(--accent) rounded-md ring-5 border-t-0 
			${bgColor} ${props.classsName || ''}`}
        >
            <div className="absolute top-0 -left-[2px] -right-[2px] flex">
                <div className={`border-t-2 border-(--accent) ${props.isNameBoxLeft ? "border-l-2 rounded-tl-md w-8" : "border-l-2 rounded-tl-md grow"}`}></div>
                <div className={`relative -translate-y-1/2 text-white `}>
                    <div className={`absolute -top-[5px] -left-[5px] -right-[5px] rounded-t-md ${bgColor} h-[50%]`}></div>
                    <div className="relative border-2 border-(--accent) rounded-md p-2 text-center">Jesus</div>
                </div>
                <div className={`border-t-2 border-(--accent) ${props.isNameBoxLeft ? "border-r-2 rounded-tr-md grow" : "border-r-2 rounded-tr-md w-8"}`}></div>
            </div>
            {props.children}
        </div >
    );
}

