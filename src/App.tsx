import { useState } from 'react';
import { BgImage } from './components/BgImage';
import { MainMenu } from './components/MainMenu';
import { NarrativeBox } from './components/NarrativeBox';

function App() {
    const [directoryHandle, setDirectoryHandle] = useState<FileSystemDirectoryHandle>();
    const [isMainMenuOpen, setIsMainMenuOpen] = useState<boolean>(true);

    return (
        isMainMenuOpen ?
            <MainMenu directoryHandle={directoryHandle} setDirectoryHandle={setDirectoryHandle} setIsMainMenuOpen={setIsMainMenuOpen}></MainMenu> :
            <div className="w-screen h-screen flex flex-col p-6">
                <BgImage location='heaven' />
                <div className='grow'></div>
                <div><NarrativeBox isNameBoxLeft={true}/></div>
            </div>
    )
}

export default App
