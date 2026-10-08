"use client";

import React, { useEffect, useRef } from "react";
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
  const pollingRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const filenames: Record<string, string> = {
    "python": "code.py",
    "javascript": "code.js",
    "c": "code.c",
    "cpp": "code.cpp",
    "java": "Main.java",
  };

  const handleRunCode = async () => {
    pollingRef.current?.abort();
    const controller = new AbortController();
    pollingRef.current = controller;

    try {
      setIsRunning(true);
      setOutput(null);
      setError(null);
      const response = await fetch(`${apiUrl}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code }),
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new Error("Failed to submit code");
      }

      const { task_id: taskId } = await response.json();
      while (true) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const statusResponse = await fetch(`${apiUrl}/run/${taskId}`, {
          signal: controller.signal,
        });
        if (!statusResponse.ok) {
          throw new Error("Failed to read execution status");
        }

        const data = await statusResponse.json();
        const taskStatus = String(data.status || "").toUpperCase();
        if (taskStatus === "SUCCESS") {
          setOutput(data.output);
          setError(data.error);
          break;
        }
        if (["FAILURE", "REVOKED"].includes(taskStatus)) {
          setError(data.error || `Execution ${taskStatus.toLowerCase()}`);
          setOutput(null);
          break;
        }
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError("Failed to run code");
      setOutput(null);
    } finally {
      if (pollingRef.current === controller) {
        pollingRef.current = null;
        if (mountedRef.current) setIsRunning(false);
      }
    }
  };

  useEffect(() => {
    // React Strict Mode runs effect cleanup/setup once during development.
    // Reset this ref during setup so a dev-only cleanup cannot permanently
    // mark the editor as unmounted.
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      pollingRef.current?.abort();
    };
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || "";
    setCode(newCode);
  };

  const [filename, setFilename] = React.useState(filenames["python"]);

  useEffect(() => {
    setFilename(filenames[language]);
  }, [language]);

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
