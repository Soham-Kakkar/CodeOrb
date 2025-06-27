import CodeEditor from "./Editor";
import Output from "./Output";

export default function CodeExecution() {
  return (
    <div className="mx-auto p-4 flex flex-col md:flex-row">
      <CodeEditor />
      <Output />
    </div>
  );
};
