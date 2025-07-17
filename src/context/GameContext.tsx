import { createContext, useContext, type ReactNode } from "react";
import { useGameHelper } from "../game/gameManager";

// provider pattern
type GameManagerContextType = ReturnType<typeof useGameHelper>;

const GameContext = createContext<GameManagerContextType | null>(null);

export function GameManagerProvider({ children }: { children: ReactNode }) {
	const gameManager = useGameHelper();
	return (
		<GameContext.Provider value={gameManager}>
			{children}
		</GameContext.Provider>
	);
}

export function useGameManager() {
	const context = useContext(GameContext);
	if (!context) {
		throw new Error("useGame must be used within a GameManagerProvider");
	}
	return context;
}
