import { useState, useRef, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = () => {
    const { themeMode, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getLabel = () => {
        if (themeMode === "dark") return "Dark";
        if (themeMode === "light") return "Light";
        return "Auto";
    };

    const handleSelect = (mode) => {
        setTheme(mode);
        setIsOpen(false);
    };

    return (
        <div className="theme-toggle" ref={dropdownRef}>
            <button
                className="theme-toggle-btn"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle theme"
            >
                <span className="theme-label">{getLabel()}</span>
            </button>

            {isOpen && (
                <div className="theme-dropdown">
                    <button
                        className={`theme-option ${themeMode === "light" ? "active" : ""}`}
                        onClick={() => handleSelect("light")}
                    >
                        <span>Light</span>
                    </button>
                    <button
                        className={`theme-option ${themeMode === "dark" ? "active" : ""}`}
                        onClick={() => handleSelect("dark")}
                    >
                        <span>Dark</span>
                    </button>
                    <button
                        className={`theme-option ${themeMode === "auto" ? "active" : ""}`}
                        onClick={() => handleSelect("auto")}
                    >
                        <span>Auto</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ThemeToggle;
