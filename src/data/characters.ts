import type { Character } from "../types";

export const characters: Character[] = [
    {
        id: "Jesus",
        description: "You, the almighty Jesus. Ruler of Heaven. God of benevolence. All that shit and whatnot.",
        gridPosition: {
			x: 3,
			y: 5,
		},
		asciiChar: "J",
		colorHex: "#1591EA",
		itemsIdList: ["Pen"]
	},
    {
        id: "Lucifer",
        description: "The devil himself. Been here for ages, or so he said. Pretty chill dude ngl.",
		gridPosition: {
			x: 4,
			y: 4,
		},
		asciiChar: "L",
		colorHex: "#de4221"
    }
]
