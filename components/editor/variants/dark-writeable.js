import Editor from "@monaco-editor/react";
import "@/styles/editor-theme.css";

export default function DarkWriteableEditor({
  code,
  onChange,
  language = "javascript",
}) {
  return (
    <Editor
      height="100%"
      language={language}
      value={code}
      onChange={onChange}
      theme="vs-dark"
      options={{
        readOnly: false,
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: "on",
        contextmenu: false,
        lineNumbers: "on",
        folding: true,
        automaticLayout: true,
        padding: { top: 16, bottom: 16 },
      }}
      className="rounded-lg border border-gray-800 shadow-sm"
    />
  );
}
