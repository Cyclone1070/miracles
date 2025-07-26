import type { Room } from "../../types";

export const policeStationRooms: Room[] = [
    {
        id: "Outside Street",
        description: "A city street in front of the police station. Large glass doors lead north into the Lobby.",
        connectedRooms: ["Lobby", "Parking Lot"],
        inViewRooms: ["Lobby", "Detectives Room"],
        width: 29,
        height: 9,
    },
    {
        id: "Lobby",
        description: "The main entrance hall of the station with polished floors and a reception desk. A wide hallway continues deeper into the building.",
        connectedRooms: ["Outside Street", "Front Hallway"],
        inViewRooms: ["Outside Street", "Front Hallway"],
        width: 9,
        height: 9,
    },
    {
        id: "Front Hallway",
        description: "A clean, public hallway connecting various offices. A large window looks into the Lobby. A heavy steel door at the east end, marked 'Authorized Personnel Only', leads to the Back Hallway.",
        connectedRooms: [
            "Lobby",
            "Detectives Room",
            "Patrol Room",
            "Captain Office",
            "Meeting Room",
            "Back Hallway"
        ],
        inViewRooms: ["Lobby", "Captain Office"],
        width: 29,
        height: 5
    },
    {
        id: "Patrol Room",
        description: "A locker room and briefing area for patrol officers. A window overlooks the Parking Lot where cruisers are parked.",
        connectedRooms: ["Front Hallway"],
        inViewRooms: ["Parking Lot"],
        width: 9,
        height: 9,
    },
    {
        id: "Captain Office",
        description: "The private office of the station chief. A large interior window provides a clear view into the Front Hallway.",
        connectedRooms: ["Front Hallway"],
        inViewRooms: ["Front Hallway"],
        width: 9,
        height: 9,
    },
    {
        id: "Back Hallway",
        description: "A stark, secure hallway that runs behind the public areas. It connects the secure parts of the station.",
        connectedRooms: [
            "Front Hallway",
            "Parking Lot",
            "Break Room",
            "Security Room",
            "Evidence Locker",
            "Holding Cells"
        ],
        width: 5,
        height: 27,
    },
    {
        id: "Parking Lot",
        description: "A small, fenced-in parking lot for police cruisers. A metal door connects to the Back Hallway.",
        connectedRooms: ["Back Hallway", "Outside Street"],
        inViewRooms: ["Patrol Room", "Break Room"],
        width: 7,
        height: 32,
    },
    {
        id: "Break Room",
        description: "A small kitchen and rest area for officers. A grated window offers a limited view of the Parking Lot.",
        connectedRooms: ["Back Hallway"],
        inViewRooms: ["Parking Lot"],
        width: 13,
        height: 9,
    },
    {
        id: "Security Room",
        description: "A cramped, dimly lit room humming with electronics. A bank of monitors displays clear, flickering footage from the Lobby, both hallways, and the Holding Cells. A small door at the back leads to the observation room.",
        "connectedRooms": ["Back Hallway", "Observation Room"],
        inViewRooms: [
            "Lobby",
            "Front Hallway",
            "Back Hallway",
            "Holding Cells"
        ],
        width: 7,
        height: 5,
    },
    {
        id: "Evidence Locker",
        description: "A secure vault lined with shelves of sealed and labeled evidence bags. A door connects directly to the Forensics Lab.",
        connectedRooms: ["Back Hallway", "Forensics Lab"],
        width: 11,
        height: 5,
    },
    {
        id: "Forensics Lab",
        description: "A sterile lab filled with microscopes and scientific equipment. It is only accessible through the Evidence Locker.",
        connectedRooms: ["Evidence Locker"],
        width: 11,
        height: 9,
    },
    {
        id: "Observation Room",
        description: "A dark, cramped room standing behind a one-way mirror, offering a clear, secret view into the adjacent Interrogation Room.",
        connectedRooms: ["Back Hallway"],
        inViewRooms: ["Interrogation Room"],
        width: 11,
        height: 9,
    },
    {
        id: "Holding Cells",
        description: "A small jail area with three spartan cells behind a set of bars. A door leads directly to the Interrogation Room.",
        connectedRooms: ["Back Hallway", "Interrogation Room"],
        width: 5,
        height: 11,
    },
    {
        id: "Interrogation Room",
        description: "A small, soundproofed room with a metal table and chairs. One wall is a large, dark pane of glass that looks into the Observation Room.",
        connectedRooms: ["Holding Cells"],
        width: 7,
        height: 5,
    }
]
