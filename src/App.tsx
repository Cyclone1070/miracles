import { useState } from 'react';
import './App.css';
import { BgImage } from './components/BgImage';
import { NarrativeBox } from './components/NarrativeBox';
import { MainMenu } from './components/MainMenu';

function App() {
    const [directoryHandle, setDirectoryHandle] = useState<FileSystemDirectoryHandle | null>(null);
    const [isMainMenuOpen, setIsMainMenuOpen] = useState<boolean>(false);

    return (
        isMainMenuOpen ?
            <MainMenu setDirectoryHandle={setDirectoryHandle}></MainMenu> :
            <div className="w-screen h-screen grid grid-rows-[3fr_1fr]">
                <BgImage location='heaven' />
                <div></div>
                <NarrativeBox isNameBoxLeft={true} />
            </div>
    )
}

export default App
