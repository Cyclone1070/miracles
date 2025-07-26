import type { Room } from "../../types";

export const heavenRooms: Room[] = [
    {
        id: "Heaven Courtyard",
        description: "A serene, celestial realm filled with soft clouds and gentle light. The air is filled with a sense of peace and tranquility.",
        connectedRooms: ["History Hall"],
        inViewRooms: ["History Hall"],
        width: 9,
        height: 9,
        charactersIdList: ["Jesus"],
		itemsIdList: ["Newspaper", "Magic trees", "Magic trees 2", "Magic trees 3", "Magic trees 4"]
    },
    {
        id: "History Hall",
        description: "A small hall filled with the history of heaven, with paintings and artifacts from various eras. The walls are lined with portraits of the previous Jesuses(?) in golden frames.",
        connectedRooms: ["Heaven Courtyard"],
        width: 5,
        height: 5,
        itemsIdList: ["Portrait of Jonathan Cheesus", "Portrait of Ar En Gesus", "Portrait of Allah"],
		charactersIdList: ["Lucifer"],
    }
]
