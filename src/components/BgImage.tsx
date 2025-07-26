import { useGameManager } from "../context/GameContext";
import { mergeClasses } from "../utils/tailwindMerge";
import backHallwayURL from "/back-hallway.webp?url";
import breakRoomURL from "/break-room.webp?url";
import captainOfficeURL from "/captain-office.webp?url";
import forensicLabURL from "/forensic-lab.webp?url";
import frontHallwayURL from "/front-hallway.webp?url";
import heavenCourtyardURL from "/heaven-courtyard.webp?url";
import holdingCellURL from "/holding-cell.webp?url";
import interrogationRoomURL from "/interrogation-room.webp?url";
import lobbyURL from "/lobby.webp?url";
import observationRoomURL from "/observation-room.webp?url";
import outsideStreetURL from "/outside-street.webp?url";
import parkingLotURL from "/parking-lot.webp?url";
import patrolRoomURL from "/patrol-room.webp?url";
import securityRoomURL from "/security-room.webp?url";

interface Props {
	className?: string;
}

export function BgImage({ ...props }: Props) {
	const { currentRoomId } = useGameManager();

	const roomImageMap: Record<string, string> = {
		"Heaven Courtyard": heavenCourtyardURL,
		"Outside Street": outsideStreetURL,
		"Lobby": lobbyURL,
		"Front Hallway": frontHallwayURL,
		"Patrol Room": patrolRoomURL,
		"Captain Office": captainOfficeURL,
		"Back Hallway": backHallwayURL,
		"Parking Lot": parkingLotURL,
		"Break Room": breakRoomURL,
		"Security Room": securityRoomURL,
		"Evidence Locker": securityRoomURL, // Using security room as placeholder
		"Forensics Lab": forensicLabURL,
		"Observation Room": observationRoomURL,
		"Holding Cells": holdingCellURL,
		"Interrogation Room": interrogationRoomURL,
	};

	const imageUrl = currentRoomId ? roomImageMap[currentRoomId] : undefined;

	return (
		<div
			className={mergeClasses(
				`absolute inset-0 flex justify-center items-center`,
				props.className,
			)}
		>
			{imageUrl && (
				<img
					className="adaptive-size"
					src={imageUrl}
					alt={`background of ${currentRoomId}`}
				/>
			)}
		</div>
	);
}
