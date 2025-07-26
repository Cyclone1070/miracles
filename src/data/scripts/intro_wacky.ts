import type { GameTurn } from "../../types";

const intro_wacky: GameTurn = {
    type: "game",
    id: 0,
    roomsEventSummary: {
        "Heaven Courtyard": "Jesus greets Lucifer in a wacky manner.",
        "History Hall": "Nothing happened."
    },
    steps: [
        {
            type: "dialog",
            id: "intro_4",
            text: "Yoooo! Luci my brother! How you been?",
            speakerId: "Jesus",
            speakerExpression: "happy",
            listenerId: "Lucifer",
            listenerExpression: "happy"
        },
        {
            type: "action",
            id: "intro_5",
            text: "You exchange a fist bumb with Lucifer.",
            characterId: "Jesus",
            characterExpression: "happy",
            targetId: "Lucifer",
            targetExpression: "happy"
        },
        {
            type: "dialog",
            id: "intro_6",
            text: "So, what brings you here today? If it's about the ? Cause I wouldn't know nothing about it.",
            speakerId: "Jesus",
            speakerExpression: "neutral",
            listenerId: "Lucifer",
            listenerExpression: "happy"
        },
        {
            type: "dialog",
            id: "intro_7",
            text: "Nah mate, nothing serious like that.",
            speakerId: "Lucifer",
            speakerExpression: "happy",
            listenerId: "Jesus",
            listenerExpression: "happy"
        },
    ]
}
export default intro_wacky;
