"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Editor from "@monaco-editor/react";
import { FaCode, FaHistory, FaQuestion, FaVoteYea } from "react-icons/fa";
import { INITIAL_CODE } from "@/constants/initial-data";
import "@/styles/editor-theme.css";

export default function MockCodeEditorLayout() {
  const [isDark, setIsDark] = useState(false);
  const editorRef = useRef(null);

  // 다크모드 감지 및 업데이트
  useEffect(() => {
    const updateTheme = () => {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
      if (editorRef.current) {
        editorRef.current.updateOptions({
          theme: isDarkMode ? "vs-dark" : "vs",
        });
      }
    };

    // 초기 테마 설정
    updateTheme();

    // MutationObserver로 html 클래스 변경 감지
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          updateTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="h-screen flex">
      {/* 왼쪽 영역 (스냅샷) */}
      <div className="w-12 h-full border-r flex-shrink-0 z-20 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <div className="flex flex-col items-center py-4">
          <button
            className="p-3 rounded-lg transition-colors text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
            disabled
          >
            <FaHistory size={18} />
          </button>
        </div>
      </div>

      {/* 중앙 에디터 */}
      <div className="flex-1 h-full min-w-[300px] relative p-2 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div className="h-full rounded-lg overflow-hidden">
          <div className="h-full flex flex-col">
            {/* 에디터 헤더 */}
            <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <FaCode className="text-blue-500 dark:text-blue-400 text-2xl" />
                <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">
                  Code Editor
                </h2>
              </div>
            </div>

            {/* 에디터 본문 */}
            <div className="flex-1">
              <Editor
                height="100%"
                language="java"
                value={INITIAL_CODE}
                theme={isDark ? "vs-dark" : "vs"}
                beforeMount={(monaco) => {
                  monaco.editor.addKeybindingRule({
                    keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF,
                    command: null,
                  });
                }}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  tabSize: 2,
                  padding: { top: 16, bottom: 16 },
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  contextmenu: false,
                  lineNumbers: "on",
                  folding: true,
                  foldingStrategy: "indentation",
                  automaticLayout: true,
                  fontFamily: "Monaco, 'Courier New', monospace",
                }}
                onMount={(editor, monaco) => {
                  editorRef.current = editor;
                  const isDarkMode =
                    document.documentElement.classList.contains("dark");
                  setIsDark(isDarkMode);
                  editor.updateOptions({
                    theme: isDarkMode ? "vs-dark" : "vs",
                    foreground: isDarkMode ? "#E4E4E7" : "#1F2937",
                    background: isDarkMode ? "#18181B" : "#FFFFFF",
                  });
                }}
                className={`rounded-lg border ${
                  isDark ? "border-gray-800" : "border-gray-200"
                } shadow-sm`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 우측 사이드바 영역 */}
      <div className="w-12 h-full border-l flex-shrink-0 z-20 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <div className="flex flex-col items-center py-4 gap-2">
          <button
            className="p-3 rounded-lg transition-colors text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
            title="Questions"
            disabled
          >
            <FaQuestion size={18} />
          </button>
          <button
            className="p-3 rounded-lg transition-colors text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
            title="Voting"
            disabled
          >
            <FaVoteYea size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
