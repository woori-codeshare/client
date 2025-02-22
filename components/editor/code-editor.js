import { useState, useEffect, useCallback, useRef } from "react";
import { FaCode, FaCopy, FaCamera, FaCheck } from "react-icons/fa";
import Editor from "@monaco-editor/react";
import CreateSnapshotModal from "./create-snapshot-modal";
import { detectLanguage } from "@/utils/detect-language";
import "../../styles/editor-theme.css";

/**
 * 코드 에디터 컴포넌트
 * @param {Object} props
 * @param {string} props.code - 에디터에 표시될 코드
 * @param {string} props.language - 코드 언어
 * @param {Function} props.onCodeChange - 코드 변경 시 호출될 함수
 * @param {Function} props.onCreateSnapshot - 스냅샷 생성 시 호출될 함수
 * @param {string} props.className - 추가 스타일 클래스
 * @param {boolean} props.isReadOnly - 읽기 전용 모드 여부
 * @param {boolean} props.isDisabled - 비활성화 여부
 * @param {boolean} props.isSidebarOpen - 사이드바 열림 여부
 * @param {boolean} props.isRightPanelOpen - 우측 패널 열림 여부
 */
export default function CodeEditor({
  code,
  language,
  onCodeChange,
  onCreateSnapshot,
  className = "",
  isReadOnly = false,
  isDisabled,
  isSidebarOpen,
  isRightPanelOpen,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState(
    language || "javascript"
  );
  const [isDark, setIsDark] = useState(false); // 다크모드 상태 추가
  const editorRef = useRef(null);

  /**
   * 디바운스 함수 구현
   */
  function debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  // 언어 감지 함수를 컴포넌트 내부에서 디바운스 처리
  const debouncedDetectLanguage = useCallback(
    debounce((newCode) => {
      const detected = detectLanguage(newCode);
      if (detected !== detectedLanguage) {
        setDetectedLanguage(detected);
      }
    }, 300),
    [detectedLanguage]
  );

  // 코드 변경 핸들러
  const handleCodeChange = useCallback(
    (newCode) => {
      onCodeChange(newCode);
      if (!language) {
        // 디바운스 없이 바로 실행
        debouncedDetectLanguage(newCode);
      }
    },
    [language, onCodeChange, debouncedDetectLanguage]
  );

  // 초기 언어 감지 및 코드 변경 시 언어 감지
  useEffect(() => {
    if (!language && code) {
      debouncedDetectLanguage(code);
    }
  }, [code, language, debouncedDetectLanguage]);

  /**
   * 키보드 단축키 이벤트 핸들러 등록
   * readOnly 모드가 아닐 때만 단축키 동작
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isReadOnly && (e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault(); // 브라우저 기본 저장 동작 방지
        setIsModalOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isReadOnly]);

  /**
   * 스냅샷 생성 처리
   * @param {Object} snapshotData - 스냅샷 제목과 설명 데이터
   */
  const handleCreateSnapshot = (snapshotData) => {
    onCreateSnapshot(snapshotData);
  };

  /**
   * 코드 복사 처리
   * 복사 성공 시 2초간 성공 표시 아이콘 표시
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2초 후 복사 상태 리셋
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
          theme: isDarkMode ? "vs-dark" : "vs"
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
    <div className="flex flex-col h-full px-2 py-2">
      {/* 헤더 영역 */}
      <div className="flex items-center mb-4">
        <div className="flex items-center gap-3">
          <FaCode className="text-blue-500 dark:text-blue-400 text-2xl" />
          <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">
            Code Editor
          </h2>
        </div>

        <div className="flex items-center gap-2 ml-4">
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

          {/* 스냅샷 생성 버튼 */}
          {!isReadOnly && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-2 text-gray-600 dark:text-gray-400 
                hover:text-blue-500 dark:hover:text-blue-400 
                transition-colors rounded 
                hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Snapshot"
            >
              <FaCamera size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Monaco 에디터 영역 */}
      <div className="flex-1 relative">
        <Editor
          width="100%"
          height="100%"
          language={language || detectedLanguage} // 명시적 language가 없을 때만 감지된 언어 사용
          value={code}
          onChange={handleCodeChange}
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
            readOnly: isDisabled || isReadOnly,
            fontFamily: "Monaco, 'Courier New', monospace"
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

      {/* 스냅샷 생성 모달 */}
      <CreateSnapshotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateSnapshot={handleCreateSnapshot}
      />
    </div>
  );
}
