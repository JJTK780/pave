import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Theme mode: 'auto', 'dark', or 'light'
    const [themeMode, setThemeMode] = useState(() => {
        const saved = localStorage.getItem("themeMode");
        return saved || "auto";
    });

    // Actual applied theme: 'dark' or 'light'
    const [appliedTheme, setAppliedTheme] = useState("light");

    // Get system preference
    const getSystemPreference = () => {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    };

    // Apply theme to document
    useEffect(() => {
        let theme;

        if (themeMode === "auto") {
            theme = getSystemPreference();
        } else {
            theme = themeMode;
        }

        setAppliedTheme(theme);
        document.documentElement.setAttribute("data-theme", theme);
    }, [themeMode]);

    // Listen for system preference changes when in auto mode
    useEffect(() => {
        if (themeMode !== "auto") return;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleChange = (e) => {
            const newTheme = e.matches ? "dark" : "light";
            setAppliedTheme(newTheme);
            document.documentElement.setAttribute("data-theme", newTheme);
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [themeMode]);

    // Change theme mode
    const setTheme = (mode) => {
        setThemeMode(mode);
        localStorage.setItem("themeMode", mode);
    };

    return (
        <ThemeContext.Provider value={{ themeMode, appliedTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
