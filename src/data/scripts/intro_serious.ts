import type { GameTurn } from "../../types";

const intro_wacky: GameTurn = {
    type: "game",
    id: 0,
    roomsEventSummary: {
        "Heaven Courtyard": "Jesus greets Lucifer in a serious manner.",
        "History Hall": "Nothing happened."
    },
    steps: [
        {
            type: "dialog",
            id: "intro_4",
            text: "What do you need, dude?",
            speakerId: "Jesus",
            speakerExpression: "neutral",
            listenerId: "Lucifer",
            listenerExpression: "happy"
        },
        {
            type: "dialog",
            id: "intro_5",
            text: "Hey hey, no need to be so serious, bro! It's just me, your buddy Lucifer!",
            speakerId: "Lucifer",
            speakerExpression: "happy",
            listenerId: "Jesus",
            listenerExpression: "annoyed"
        },
        {
            type: "animation",
            id: "intro_6",
            animationId: "hold-it",
            characterId: "Jesus",
            characterExpression: "neutral",
        },
        {
            type: "dialog",
            id: "intro_7",
            text: "My what now? Don't go around calling yourself that, it makes me sound like a loser.",
            speakerId: "Jesus",
            speakerExpression: "neutral",
            listenerId: "Lucifer",
            listenerExpression: "neutral"
        },
    ],
	isGameOver: true,
}
export default intro_wacky;
