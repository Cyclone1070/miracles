import React, { useEffect } from "react";

interface ThemeContextType {
	darkMode: boolean;
	toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [darkMode, setDarkMode] = React.useState(true);

	useEffect(() => {
		document.documentElement.classList.toggle("dark", darkMode);
	}, [darkMode])

	const toggleTheme = () => {
		setDarkMode((prevTheme) => (!prevTheme));
	};

	return (
		<ThemeContext.Provider value={{ darkMode: darkMode, toggleTheme }} >
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = React.useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
