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
        <div className="w-screen h-screen relative overflow-hidden flex justify-center items-center p-2">
            <video className="absolute top-0 left-0 adaptive-size -z-1 " autoPlay loop muted playsInline>
                <source src="/splash-screen.webm" type="video/webm" />
                <source src="/splash-screen.mp4" type="video/mp4" />
            </video>
            <div className={
                `border-2 border-(--accent) bg-black/80 p-8 rounded-xl text-(--text) flex flex-col items-center justify-center gap-2 text-center h-full w-full
				max-w-90 max-h-120
				md:max-w-160`
            }>
                <h1 className={`font-bold text-6xl md:text-8xl`}>Miracles</h1>
                <ActionButton className={
                    `bg-(--accent-under-text) rounded-xl m-auto
					text-2xl p-3 px-5
					md:text-3xl md:p-3 md:px-6`
                } onClick={() => {
                    props.setIsMainMenuOpen(false);
                }}>Play!</ActionButton>
                <div>The game is stored entirely on your machine! With your own API key I won't be able to see any of your sketchy text so go wild! (Google can see them though, ofc)</div>
                <div className={`relative flex items-center`}>
                    <ActionButton
                        className={`absolute -left-10 w-7 h-7 flex items-center justify-center bg-(--accent-under-text) rounded-full`}
                        onClick={() => {
                            setIsHelpVisible(true);
                        }}
                    >?</ActionButton>
                    <input className="border border-(--accent) rounded-sm p-1 px-2" placeholder="Enter your API key" type="text" />
                </div>
                <ActionButton className="bg-(--accent-under-text) p-1.5 md:p-2 rounded-xl" onClick={handleFileChooser}>Choose a folder</ActionButton>
            </div>
            <div className="absolute right-0 bottom-0 text-sm pr-1">Art is AI cause I suck at it</div>
            <AnimatePresence>
                {isHelpVisible && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`absolute w-screen h-screen bg-black/70 flex justify-center items-center`}
                        onClick={() => { setIsHelpVisible(false) }}>
                        <div className={`bg-(--bg) w-70 p-4 border-2 border-(--accent) rounded-md text-(--text)`}>You can obtain a free Gemini API key by visiting <a className={`text-blue-500 underline`} href="https://aistudio.google.com/apikey">this website</a>. Log in to your account and click "create API key" on the top right.</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    async function handleFileChooser() {
        try {
            const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
            props.setDirectoryHandle(handle);
        } catch (error: any) {
            console.error('Error selecting directory:', error);
            if (error.name !== 'AbortError') {
                alert('Error selecting directory: ' + error.message);
            }
            props.setDirectoryHandle(undefined);
            return;
        }
    }
}
