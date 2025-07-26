import type { Turn } from "../../types";

const day1: Turn[] = [
    {
        type: "time",
        id: 1,
        newDay: 1,
		objective: "Get the elephant inside one of the rooms in the Police Station.",
		title: "Elephant in the room."
    },
    {
        type: "map",
        id: 2,
        newMapId: "Police Station",
		newRoomId: "Outside Street",
    },
	{
		type: "game",
		id: 3,
		roomsEventSummary: {
			"Outside Street": "A normal day in the Police Station, you see an elephant.",
			"Police Station": "Nothing happened."
		},
		steps: [
			{
				type: "narration",
				id: "day1_1",
				text: "You see an elephant in the street."
			},
			{
				type: "dialog",
				id: "day1_2",
				text: "What the hell is that doing here?",
				speakerId: "Big Shot",
				speakerExpression: "neutral"
			},
			{
				type: "dialog",
				id: "day1_3",
				text: "I guess I should get it inside the Police Station.",
				speakerId: "Big Shot",
				speakerExpression: "neutral"
			},
		],
	}
]
export default day1;
