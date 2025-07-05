import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ActionButton } from "./ActionButton";

interface Props {
    directoryHandle?: FileSystemDirectoryHandle;
    setDirectoryHandle: React.Dispatch<React.SetStateAction<FileSystemDirectoryHandle | undefined>>;
    setIsMainMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function MainMenu({ ...props }: Props) {
    const [isHelpVisible, setIsHelpVisible] = useState(false);
    return (
        <div className="w-screen h-dvh relative overflow-hidden flex justify-center items-center p-2">
            <video className="absolute top-0 left-0 adaptive-size -z-1 " autoPlay loop muted playsInline controls={false}>
                <source src="/splash-screen.webm" type="video/webm" />
                <source src="/splash-screen.mp4" type="video/mp4" />
            </video>
            <motion.div
                initial={{ opacity: 0, y: 10, visibility: "hidden" }}
                animate={{ opacity: 1, y: 0, visibility: "visible" }}
                transition={{ delay: 2, duration: 0.8, ease: "easeInOut" }}
                className={
                    `border-2 border-(--accent) bg-black/80 p-8 rounded-xl text-(--text) flex flex-col items-center justify-center gap-4 text-center h-full w-full
				max-w-90 max-h-120 min-w-75
				md:max-w-160 md:max-h-130`
                }>
                <h1 className={`font-bold text-6xl md:text-8xl`}>Miracles</h1>
                <ActionButton className={
                    `rounded-xl m-auto
					text-2xl p-3 px-5
					md:text-3xl md:p-3 md:px-6`
                } onClick={() => {
                    props.setIsMainMenuOpen(false);
                }}>Play!</ActionButton>
                <div>The game is stored almost entirely on your machine! With your own API key I won't be able to see any of your sketchy text so go wild! <br />(Google can see them though, ofc)</div>
                <div className={`relative flex items-center`}>
                    <input className="border border-(--accent) rounded-sm p-1 px-2 outline-0" placeholder="Enter your API key" type="text" />
                    <ActionButton
                        className={`absolute -right-10 w-7 h-7 flex items-center justify-center rounded-full`}
                        onClick={() => {
                            setIsHelpVisible(true);
                        }}
                    >?</ActionButton>
                </div>
                <ActionButton className={`p-1.5`}>Clear Data</ActionButton>
            </motion.div>
            <div className="absolute right-0 bottom-0 text-sm pr-1">Art is AI cause I suck at it</div>
            <AnimatePresence>
                {isHelpVisible && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ ease: "easeInOut" }}
                        className={`absolute w-screen h-dvh bg-black/70 flex justify-center items-center`}
                        onClick={() => { setIsHelpVisible(false) }}>
                        <div className={`bg-(--bg) w-70 p-4 border-2 border-(--accent) rounded-md text-(--text)`}>You can obtain a free Gemini API key by visiting <a className={`text-blue-500 underline`} href="https://aistudio.google.com/apikey" target="_blank">this website</a>. Log in to your account and click "create API key" on the top right.</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
