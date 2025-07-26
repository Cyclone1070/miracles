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
            text: "Luci my brother! How you been?",
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
            text: "So, what brings you here today? I for real didn't steal anything this time. Or last time, also.",
            speakerId: "Jesus",
            speakerExpression: "neutral",
            listenerId: "Lucifer",
            listenerExpression: "happy"
        },
        {
            type: "dialog",
            id: "intro_7",
            text: "Nah mate, nothing dead serious like that.",
            speakerId: "Lucifer",
            speakerExpression: "happy",
            listenerId: "Jesus",
            listenerExpression: "happy"
        },
        {
            type: "dialog",
            id: "intro_8",
            text: "They are looking into it though, so you might wanna to lay low for a bit.",
            speakerId: "Lucifer",
            speakerExpression: "neutral",
            listenerId: "Jesus",
            listenerExpression: "happy"
        },
        {
            type: "dialog",
            id: "intro_9",
            text: "Anyway, speaking of laying low, The Oracle had another one of her wobbly moments.",
            speakerId: "Lucifer",
            speakerExpression: "neutral",
            listenerId: "Jesus",
            listenerExpression: "neutral"
        },
        {
            type: "dialog",
            id: "intro_9.5",
            text: "Ah yes, the Oracle. What did that bitch see this time?",
            speakerId: "Jesus",
            speakerExpression: "neutral",
            listenerId: "Lucifer",
            listenerExpression: "neutral"
        },
        {
            type: "dialog",
            id: "intro_10",
            text: "It was a biggie. Another 'humanity nearly trips over its own feet into oblivion' vision. Luckily, it's a near miss, and you know her visions are always spot on.",
            speakerId: "Lucifer",
            speakerExpression: "neutral",
            listenerId: "Jesus",
            listenerExpression: "neutral"
        },
        {
            type: "dialog",
            id: "intro_11",
            text: "To make sure it stays a 'near miss', a specific series of bizarre events has to happen. And the focal point is... a police station in Nowheresville.",
            speakerId: "Lucifer",
            speakerExpression: "happy",
            listenerId: "Jesus",
            listenerExpression: "annoyed"
        },
        {
            type: "dialog",
            id: "intro_12",
            text: "A police station? Seriously? I was supposed to teach a flock of pigeons to fake die today.",
            speakerId: "Jesus",
            speakerExpression: "annoyed",
            listenerId: "Lucifer",
            listenerExpression: "happy"
        },
        {
            type: "dialog",
            id: "intro_13",
            text: "Management's choice, not mine. We need you to go down, swap bodies with some flatfoot, and make sure every weird little thing in that vision happens exactly as it should.",
            speakerId: "Lucifer",
            speakerExpression: "neutral",
            listenerId: "Jesus",
            listenerExpression: "annoyed"
        },
        {
            type: "dialog",
            id: "intro_14",
            text: "*Sigh*. Fine. But if the prophecy involves paperwork, I'm delegating.",
            speakerId: "Jesus",
            speakerExpression: "annoyed",
            listenerId: "Lucifer",
            listenerExpression: "happy"
        },
        {
            type: "dialog",
            id: "intro_14.5",
            text: "Yeah right. Anyway, you know the drill. You go down and we'll give you directions from here. They're gonna give you some vague instructions at the start of your shift since that's all we got.",
            speakerId: "Lucifer",
            speakerExpression: "neutral",
            listenerId: "Jesus",
            listenerExpression: "neutral"
        },
        {
            type: "dialog",
            id: "intro_15",
            text: "Just keep a low profile. You know the rules. If the humans down there figure out you're the real deal, you'll lose your position. Become one of them. Mortal.",
            speakerId: "Lucifer",
            speakerExpression: "neutral",
            listenerId: "Jesus",
            listenerExpression: "neutral"
        },
        {
            type: "dialog",
            id: "intro_16",
            text: "But I'm sure you know that already. That's how your predecessor lost his power, after all.",
            speakerId: "Lucifer",
            speakerExpression: "happy",
            listenerId: "Jesus",
            listenerExpression: "annoyed"
        },
        {
            type: "dialog",
            id: "intro_16",
            text: "...",
            speakerId: "Jesus",
            speakerExpression: "annoyed",
            listenerId: "Lucifer",
            listenerExpression: "happy"
        }
    ],
    isObjectiveCompleted: true,
}
export default intro_wacky;
