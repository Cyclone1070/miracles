import { useGameManager } from "../context/GameContext";
import { mergeClasses } from "../utils/tailwindMerge";

interface Props {
	className?: string;
}

export function BgImage({ ...props }: Props) {
	const { currentMapId } = useGameManager();
	return (
		<div
			className={mergeClasses(
				`absolute inset-0 flex justify-center items-center`,
				props.className,
			)}
		>
			{currentMapId === "Heaven" ? (
				<img
					className="adaptive-size"
					src="/heaven-courtyard.jpg"
					alt="a heaven courtyard"
				/>
			) : null}
		</div>
	);
}
