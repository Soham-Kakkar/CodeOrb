import React from "react";
import { useAppContext } from "../app/AppProvider";


export default function LanguageSelector() {
  const { language, setLanguage } = useAppContext();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  return (
    <select
      className="border border-gray-500 p-2 rounded mx-2"
      value={language}
      onChange={handleLanguageChange}
    >
      <option value="python">Python</option>
      <option value="javascript">Node.js</option>
      <option value="java">Java</option>
      <option value="c">C</option>
      <option value="cpp">C++</option>
    </select>
  );
};
