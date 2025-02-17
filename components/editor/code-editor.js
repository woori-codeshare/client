import { useState, useEffect } from "react";
import { FaCode, FaCopy, FaCamera, FaCheck } from "react-icons/fa";
import CreateSnapshotModal from "./create-snapshot-modal";

/**
 * 코드 에디터 컴포넌트
 * @param {Object} props
 * @param {string} props.code - 에디터에 표시될 코드
 * @param {Function} props.onCodeChange - 코드 변경 시 호출될 함수
 * @param {Function} props.onCreateSnapshot - 스냅샷 생성 시 호출될 함수
 * @param {string} props.className - 추가 스타일 클래스
 * @param {boolean} props.isReadOnly - 읽기 전용 모드 여부
 */
export default function CodeEditor({
  code,
  onCodeChange,
  onCreateSnapshot,
  className = "",
  isReadOnly = false,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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

  return (
    <div className={`h-full ${className}`}>
      {/* 헤더 영역: 제목과 기능 버튼들 */}
      <div className="flex items-center mb-2">
        <div className="flex items-center gap-3">
          <FaCode className="text-blue-400" />
          <h2 className="text-xl font-medium">Code Editor</h2>
        </div>

        <div className="flex items-center gap-2 ml-4">
          {/* 코드 복사 버튼 */}
          <button
            onClick={handleCopy}
            className="p-2 text-gray-400 hover:text-blue-400 transition-colors rounded hover:bg-gray-800"
            title={copied ? "Copied" : "Copy"}
          >
            {copied ? <FaCheck size={14} /> : <FaCopy size={14} />}
          </button>

          {/* 스냅샷 생성 버튼 */}
          {!isReadOnly && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-2 text-gray-400 hover:text-blue-400 transition-colors rounded hover:bg-gray-800"
              title="Snapshot"
            >
              <FaCamera size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 코드 에디터 영역 */}
      <div className="h-[calc(100%-2.5rem)] bg-gray-900/50 rounded-lg px-4 py-3 font-mono overflow-auto border border-gray-800/50 shadow-inner">
        <textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          className="w-full h-full bg-transparent resize-none focus:outline-none text-green-400 overflow-auto"
          spellCheck="false"
          readOnly={isReadOnly}
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
