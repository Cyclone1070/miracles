import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { GameManagerProvider } from "./game/gameManager.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider>
			<GameManagerProvider>
				<App />
			</GameManagerProvider>
		</ThemeProvider>
	</StrictMode>,
);
