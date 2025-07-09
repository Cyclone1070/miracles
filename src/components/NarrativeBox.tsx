import { mergeClasses } from "../utils/tailwindMerge";

interface Props {
	className?: string;
	children?: React.ReactNode;
	isNameBoxLeft: boolean;
}

export function NarrativeBox({ ...props }: Props) {
	return (
		<div
			className={mergeClasses(
				`relative h-50 max-w-200 border-2 border-t-0 border-(--accent) rounded-xl text-white`,
				props.className,
			)}
		>
			<div className={`absolute -inset-8 bg-(--bg) -z-1`}></div>
			<div className="absolute top-0 -left-[2px] -right-[2px] flex">
				{/* border */}
				<div
					className={`border-t-2 border-(--accent) ${props.isNameBoxLeft ? "border-l-2 rounded-tl-xl w-6 md:w-8" : "border-l-2 rounded-tl-xl grow"}`}
				/>

				{/* name box */}
				<div className={`relative -translate-y-1/2 text-white `}>
					<div className="relative border-2 border-(--accent) rounded-xl p-2 text-center">
						Jesus The Almighty
					</div>
				</div>

				{/* border */}
				<div
					className={`border-t-2 border-(--accent) ${props.isNameBoxLeft ? "border-r-2 rounded-tr-xl grow" : "border-r-2 rounded-tr-xl w-6 md:w-8"}`}
				/>
			</div>
			{props.children}
		</div>
	);
}
