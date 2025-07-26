import type { Character } from "../types";

export const characters: Character[] = [
    {
        type: "character",
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
        type: "character",
        id: "Lucifer",
        description: "The devil himself. Been here for ages, or so he said. Pretty chill dude ngl.",
        gridPosition: {
            x: 4,
            y: 4,
        },
        asciiChar: "L",
        colorHex: "#de4221"
    },
    {
        type: "character",
        id: "Big Shot",
        description: "You, Jesus, inside the body of a cop. You've solved numerous tough cases in the past, earning the nick name Big Shot.",
        gridPosition: {
            x: 4,
            y: 4,
        },
        asciiChar: "B",
        colorHex: "#1591EA",
    }

]
