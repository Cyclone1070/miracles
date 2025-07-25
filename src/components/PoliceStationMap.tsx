import type { Transition } from "motion/react";

interface Props {
	className?: string;
	isMapExpanded: boolean;
	setActiveRoom: React.Dispatch<
		React.SetStateAction<{
			id: string;
			width: number;
			height: number;
		} | null>
	>;
	commonTransition: Transition;
	doorStyles: string;
	roomStyles: string;
}

export function PoliceStationMap({ ...props }: Props) {
	return <>
		
	</>;
}
