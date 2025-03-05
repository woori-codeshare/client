import Editor from "@monaco-editor/react";
import "@/styles/editor-theme.css";

export default function LightWriteableEditor({
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
      theme="vs"
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
      className="rounded-lg border border-gray-200 shadow-sm"
    />
  );
}
