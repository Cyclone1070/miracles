interface Props {
    classsName?: string;
    children?: React.ReactNode;
}

export function NarrativeBox({ ...props }: Props) {
    return (
        <div className={`bg-black m-4 p-1 rounded-xl ${props.children ? "opacity-85" : "opacity-70"} ${props.classsName || ''}`}>
            <div className={`text-white w-full h-full rounded-xl border border-amber-500 p-4 `}>
                {props.children}
            </div>
        </div>
    );
}

