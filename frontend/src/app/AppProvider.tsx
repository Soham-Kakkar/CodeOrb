"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";

// Define the shape of the context state
interface AppContextType {
  language: string;
  setLanguage: (language: string) => void;
  code: string;
  setCode: (code: string) => void;
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
  output: string | null;
  setOutput: (output: string | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

// Create the context with default values
const AppContext = createContext<AppContextType>({
  language: "python",
  setLanguage: () => {},
  code: "",
  setCode: () => {},
  isRunning: false,
  setIsRunning: () => {},
  output: "",
  setOutput: () => {},
  error: "",
  setError: () => {},
  darkMode: false,
  setDarkMode: () => {},
});

// Custom hook for consuming the context
export const useAppContext = () => useContext(AppContext);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>("");
  const [error, setError] = useState<string | null>("");
  const [darkMode, setDarkMode] = useState(false);

  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    const savedCode = localStorage.getItem("code");
    const savedDarkMode = localStorage.getItem("darkMode");

    if (savedLanguage) setLanguage(savedLanguage);
    if (savedCode) setCode(savedCode);
    if (savedDarkMode) setDarkMode(savedDarkMode === "true");
  }, []);

  // Save state to localStorage on change
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("code", code);
  }, [code]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  return (
    <AppContext.Provider
      value={
        { 
            language, setLanguage,
            code, setCode, 
            isRunning, setIsRunning, 
            output, setOutput, 
            error, setError, 
            darkMode, setDarkMode 
        }
      }
    >
      {children}
    </AppContext.Provider>
  );
};
