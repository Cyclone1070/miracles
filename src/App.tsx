import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { ActionButton } from './components/ActionButton';
import { BgImage } from './components/BgImage';
import { MainMenu } from './components/MainMenu';
import { NarrativeBox } from './components/NarrativeBox';

function App() {
    const [directoryHandle, setDirectoryHandle] = useState<FileSystemDirectoryHandle>();
    const [isMainMenuOpen, setIsMainMenuOpen] = useState<boolean>(true);

    return (
        <AnimatePresence>
            {isMainMenuOpen ?
                <motion.div key="main-menu" 
					variants={{ hidden: { opacity: 0, transition: {duration: 0.7} }, visible: { opacity: 1, transition: {delay: 0.7, duration: 1}} }}
					initial={"hidden"} animate={"visible"} exit={"hidden"}>
                    <MainMenu directoryHandle={directoryHandle} setDirectoryHandle={setDirectoryHandle} setIsMainMenuOpen={setIsMainMenuOpen}></MainMenu>
                </motion.div> :
                <motion.div key="game-screen" 
					variants={{ hidden: { opacity: 0, transition: {duration: 0.7} }, visible: { opacity: 1, transition: {delay: 0.7, duration: 1}} }}
					initial={"hidden"} animate={"visible"} exit={"hidden"} 
					className="w-screen h-dvh flex flex-col p-6">
                    <BgImage location='heaven' />
                    <div className='grow'></div>
                    <div><NarrativeBox isNameBoxLeft={true} /></div>
					<ActionButton className={`absolute top-0 left-0 m-4 rounded-full`} onClick={() => {setIsMainMenuOpen(true)}}>Home</ActionButton>
                </motion.div>}
        </AnimatePresence>
    )
}

export default App
