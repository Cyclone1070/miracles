import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { ActionButton } from './components/ActionButton';
import { BgImage } from './components/BgImage';
import { MainMenu } from './components/MainMenu';
import { NarrativeBox } from './components/NarrativeBox';

function App() {
    const [directoryHandle, setDirectoryHandle] = useState<FileSystemDirectoryHandle>();
    const [isMainMenuOpen, setIsMainMenuOpen] = useState<boolean>(true);
    const variants = { hidden: { opacity: 0, visibility: "hidden", transition: { duration: 0.7 } }, visible: { opacity: 1, visibility: "visible", transition: { delay: 0.7, duration: 1 } } }

    return (
        <>
            <AnimatePresence>
                {isMainMenuOpen ?
                    <motion.div key="main-menu"
                        variants={variants}
                        initial={"hidden"} animate={"visible"} exit={"hidden"}>
                        <MainMenu directoryHandle={directoryHandle} setDirectoryHandle={setDirectoryHandle} setIsMainMenuOpen={setIsMainMenuOpen}></MainMenu>
                    </motion.div> : null}
            </AnimatePresence>

            <motion.div key="game-screen"
                variants={variants}
                initial="hidden" animate={isMainMenuOpen ? "hidden" : "visible"}
                className="w-screen h-dvh flex flex-col p-6 pb-10">
                <BgImage location='heaven' />
                <div className='grow'></div>
                <NarrativeBox isNameBoxLeft={true} />
                <ActionButton className={`absolute top-0 left-0 m-4 rounded-full w-10 h-10 text-center`} onClick={() => { setIsMainMenuOpen(true) }}>&lt;</ActionButton>
            </motion.div>
        </>
    )
}

export default App
