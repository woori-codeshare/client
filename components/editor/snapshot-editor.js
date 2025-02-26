"use client";

import { useState, useEffect, useRef } from "react";
import { FaHistory, FaCopy, FaCheck, FaCode } from "react-icons/fa";
import Editor from "@monaco-editor/react";
import { detectLanguage } from "@/utils/detect-language";
import "../../styles/editor-theme.css";

/**
 * 스냅샷 전용 코드 에디터 컴포넌트 (읽기 전용)
 */
export default function SnapshotEditor({
  code,
  title,
  snapshotInfo,
  isSidebarOpen,
  isRightPanelOpen,
}) {
  const [copied, setCopied] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState("javascript");
  const [isDark, setIsDark] = useState(false);
  const editorRef = useRef(null);

  // 초기 언어 감지
  useEffect(() => {
    if (code) {
      const detected = detectLanguage(code);
      setDetectedLanguage(detected);
    }
  }, [code]);

  /**
   * 코드 복사 처리
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // 사이드바나 우측 패널 상태 변경시 에디터 크기 재조정
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.layout();
    }
  }, [isSidebarOpen, isRightPanelOpen]);

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

  // 타임스탬프 포맷팅
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <div className="flex flex-col h-full px-2 py-2">
      {/* 헤더 영역 */}
      <div className="flex items-center justify-between mb-4">
        {/* 왼쪽: 제목과 버튼들 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <FaHistory className="text-blue-500 dark:text-blue-400 text-2xl" />
            <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">
              Snapshot: {title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* 코드 복사 버튼 */}
            <button
              onClick={handleCopy}
              className="p-2 text-gray-600 dark:text-gray-400
                hover:text-blue-500 dark:hover:text-blue-400
                transition-colors rounded
                hover:bg-gray-100 dark:hover:bg-gray-800"
              title={copied ? "Copied" : "Copy"}
            >
              {copied ? <FaCheck size={14} /> : <FaCopy size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Monaco 에디터 영역 */}
      <div className="flex-1 relative">
        <Editor
          width="100%"
          height="100%"
          language={detectedLanguage}
          value={code}
          beforeMount={(monaco) => {
            // ctrl+f 키 바인딩만 제거
            monaco.editor.addKeybindingRule({
              keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF,
              command: null,
            });
          }}
          options={{
            theme: isDark ? "vs-dark" : "vs",
            fontSize: 14, // 폰트 크기
            tabSize: 2, // 탭 크기
            padding: { top: 16, bottom: 16 },

            // 자동 완성 및 힌트
            quickSuggestions: {
              other: true,
              comments: false,
              strings: false,
            },
            parameterHints: {
              enabled: true,
            },

            // 에디터 기본 설정
            folding: true,
            foldingStrategy: "indentation",
            wordWrap: "on",
            links: false,
            contextmenu: false,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            lineNumbers: "on",
            readOnly: true,
            fontFamily: "Monaco, 'Courier New', monospace",
          }}
          className={`rounded-lg border ${
            isDark ? "border-gray-800" : "border-gray-200"
          } shadow-sm`}
          onMount={(editor, monaco) => {
            editorRef.current = editor;
            // 에디터 마운트 시 검색 관련 커맨드 제거
            editor.addCommand(
              monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_F,
              () => {
                // do nothing
              }
            );
            // 초기 마운트 시 레이아웃 조정
            setTimeout(() => {
              editor.layout();
            }, 100);
            // 마운트 시 초기 테마 적용
            editor.updateOptions({
              theme: isDark ? "vs-dark" : "vs",
              foreground: isDark ? "#E4E4E7" : "#1F2937",
              background: isDark ? "#18181B" : "#FFFFFF",
              lineNumbers: "on",
              renderLineHighlight: "all",
              renderLineHighlightOnlyWhenFocus: true,
              renderFinalNewline: "dimmed",
            });
          }}
        />
      </div>
    </div>
  );
}
