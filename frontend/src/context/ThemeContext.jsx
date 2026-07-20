// frontend/src/context/ThemeContext.jsx
import { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Initialize from localStorage if available, otherwise respect the user's
  // OS-level preference (prefers-color-scheme), otherwise default to light.
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("ff_theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Whenever darkMode changes, toggle Tailwind's "dark" class on the <html>
  // element (Tailwind's dark: variant only activates when an ancestor has
  // this class present) AND persist the choice to localStorage.
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("ff_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};