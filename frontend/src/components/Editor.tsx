"use client";

import React, { useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import { useAppContext } from "../app/AppProvider";
import LanguageSelector from "./LanguageSelector";
import RunButton from "./RunButton";
import { Sun, Moon } from "lucide-react";

export default function CodeEditor() {
  const {
    language,
    code, setCode,
    isRunning, setIsRunning,
    setOutput,
    setError,
    darkMode, setDarkMode,
  } = useAppContext();

  const filenames: Record<string, string> = {
    "python": "code.py",
    "javascript": "code.js",
    "c": "code.c",
    "cpp": "code.cpp",
    "java": "Main.java",
  };

  const handleRunCode = async () => {
    try {
      setIsRunning(true);
      const response = await fetch("http://localhost:5000/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code }),
      });
      const data = await response.json();
      if (data.output) {
        setOutput(data.output);
        setError(null);
      } else {
        setError(data.error);
        setOutput(null);
      }
    } catch (err) {
      setError("Failed to run code");
      console.log(err);
      setOutput(null);
    } finally {
      setIsRunning(false);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || "";
    setCode(newCode);
  };

  const [filename, setFilename] = React.useState(filenames["python"]);

  useEffect(() => {
    setFilename(filenames[language]);
  }, [language, filenames]);

  return (
    <div className="border border-gray-300 mt-4 md:w-[50%] w-full md:h-[calc(100vh-6rem)] h-[calc(50vh-3rem)] flex flex-col">
      <div className="font-bold bg-gray-300 flex justify-between items-center">
        <h3 className="bg-gray-400 w-fit p-4">{filename}</h3>
        <div className="flex items-center space-x-4 px-4">
          <LanguageSelector />
          <RunButton onClick={handleRunCode} loading={isRunning} />
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-800 text-white px-4 py-2 rounded cursor-pointer"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun /> : <Moon />}
          </button>
        </div>
      </div>
      <MonacoEditor
        height="calc(100% - 56px)"
        language={language}
        value={code}
        onChange={handleEditorChange}
        theme={darkMode ? "vs-dark" : "light"}
        className="flex-grow"
      />
    </div>
  );
};
