import type { GameTurn } from "../../type";

const intro_wacky: GameTurn = {
    type: "game",
    id: 0,
    summary: [{
        roomId: "heaven",
        eventSummary: "Jesus and Lucifer exchange greetings in a wacky manner."
    }],
    steps: [
        {
            type: "dialog",
            id: "intro_4",
            text: "Lucie my brother! How you been?",
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
            text: "So, what brings you here today? Is it about the chick winning 2 lotteries back to back the other day? Cause I wouldn't know nothing about it.",
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
