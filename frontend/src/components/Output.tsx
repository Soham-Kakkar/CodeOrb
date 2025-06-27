"use client"

import { useAppContext } from "@/app/AppProvider";

export default function Output() {
  const { isRunning, output, error } = useAppContext();
  return (
    <div className="mt-4 border border-gray-200 bg-gray-900 md:w-[50%] w-full md:h-[calc(100vh-6rem)] h-[calc(50vh-3rem)] overflow-y-scroll">
      <h3 className="font-bold bg-gray-300 p-4">Output</h3>
      <pre className="text-white whitespace-pre-wrap break-words p-2">
        {(isRunning && "Running...") ||
          (output && output) ||
          (error && <span className="text-red-600">{error}</span>)}
      </pre>
    </div>
  );
}
