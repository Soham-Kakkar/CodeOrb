'use client'

import { useState } from 'react';

const Home = () => {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('print("Hello, world!")');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const runCode = async () => {
    setIsLoading(true);
    setOutput('');
    setError('');

    try {
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code }),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
        setOutput('');
      } else {
        setOutput(data.output);
      }
    } catch (err: any) {
      setError(`⚠️ Request failed: ${err.message}`);
      setOutput('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mx-auto p-8 bg-gradient-to-b from-blue-900 to-indigo-800 min-h-screen space-y-8">
      <h1 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">CodeOrb: Run Your Code</h1>

      <div className="w-full max-w-4xl flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 w-full md:w-auto">
          <label className="text-xl text-white">Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mt-2 md:mt-0 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <option value="python">Python</option>
            <option value="node">Node.js</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
        </div>

        <button
          onClick={runCode}
          className={`w-full md:w-auto py-3 px-2 mt-4 md:mt-0 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none transition-all duration-300 ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
          disabled={isLoading}>
          {isLoading ? '⏳ Running...' : '▶ Run Code'}
        </button>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="// Write your code here"
        className="w-full max-w-4xl h-72 p-6 mt-4 bg-gray-900 text-white font-mono rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
      />

      <div className="w-full max-w-4xl mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl text-white mb-2">Output:</h3>
        <pre className={`p-4 bg-gray-700 text-white rounded-md ${error ? 'text-red-400' : ''} whitespace-pre-wrap`}>
          {error ? error : output || '⚡ Output will appear here...'}
        </pre>
      </div>
    </div>
  );
};

export default Home;
