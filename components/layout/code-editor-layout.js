import { FaQuestion, FaVoteYea, FaHistory } from "react-icons/fa";
import CodeEditor from "@/components/editor/code-editor";
import ResizeHandle from "@/components/common/resize-handle";
import VersionsPanel from "@/components/features/versions/versions-panel";
import QuestionsPanel from "@/components/features/questions/questions-panel";
import VotingPanel from "@/components/features/voting/voting-panel";

/**
 * 코드 에디터 레이아웃 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.code - 현재 코드
 * @param {Function} props.onCodeChange - 코드 변경 핸들러
 * @param {boolean} props.isDisabled - 에디터 비활성화 여부
 * @param {Function} props.onCreateSnapshot - 스냅샷 생성 핸들러
 * @param {boolean} props.isSidebarOpen - 좌측 사이드바 열림 여부
 * @param {Function} props.onSidebarToggle - 사이드바 토글 핸들러
 * @param {boolean} props.isReadOnly - 읽기 전용 모드 여부
 * @param {number} props.leftWidth - 좌측 패널 너비
 * @param {number} props.rightWidth - 우측 패널 너비
 * @param {Function} props.onLeftResize - 좌측 패널 크기 조절 핸들러
 * @param {Function} props.onRightResize - 우측 패널 크기 조절 핸들러
 * @param {Array} props.snapshots - 코드 스냅샷 배열
 * @param {number|null} props.currentVersion - 현재 선택된 스냅샷 인덱스
 * @param {Function} props.onVersionChange - 버전 변경 핸들러
 * @param {string} props.activePanel - 활성화된 패널 ID
 * @param {Function} props.onPanelChange - 패널 변경 핸들러
 * @param {string} props.roomId - 방 ID
 * @param {string|null} props.snapshotId - 현재 선택된 스냅샷 ID
 */
export default function CodeEditorLayout({
  code,
  onCodeChange,
  isDisabled,
  onCreateSnapshot,
  isSidebarOpen,
  onSidebarToggle,
  isReadOnly,
  leftWidth,
  rightWidth,
  onLeftResize,
  onRightResize,
  snapshots,
  currentVersion,
  onVersionChange,
  activePanel,
  onPanelChange,
  roomId,
  snapshotId,
}) {
  const renderActivePanel = () => {
    switch (activePanel) {
      case "questions":
        return <QuestionsPanel roomId={roomId} snapshotId={snapshotId} />;
      case "voting":
        return <VotingPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* 좌측 사이드바 영역 */}
      <div
        className="h-full relative flex"
        style={{
          width: isSidebarOpen ? `${leftWidth}px` : "3rem",
          transition: isSidebarOpen ? "none" : "width 200ms ease-in-out",
        }}
      >
        {/* 아이콘 메뉴 */}
        <div className="w-12 h-full bg-gray-900 border-r border-gray-800 flex-shrink-0 z-20">
          <div className="flex flex-col items-center py-4">
            <button
              onClick={onSidebarToggle}
              className={`p-3 rounded-lg transition-colors ${
                isSidebarOpen
                  ? "bg-blue-500/20 text-blue-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
              title="스냅샷"
            >
              <FaHistory size={18} />
            </button>
          </div>
        </div>

        {/* 버전 관리 패널 */}
        <div
          className={`
            h-full bg-gray-900 border-r border-gray-800
            transition-transform duration-200 ease-in-out relative
            ${isSidebarOpen ? "w-[calc(100%-3rem)]" : "w-0 overflow-hidden"}
          `}
        >
          <VersionsPanel
            snapshots={snapshots}
            currentVersion={currentVersion}
            setCurrentVersion={onVersionChange}
          />
        </div>

        {/* 좌측 크기 조절 핸들 */}
        {isSidebarOpen && (
          <ResizeHandle
            onResize={onLeftResize}
            direction="left"
            className="bg-gray-800 z-30"
          />
        )}
      </div>

      {/* 메인 컨텐츠 (코드 에디터) */}
      <div className="flex-1 relative transition-all duration-200 ease-in-out">
        <div className="p-2 h-full">
          <CodeEditor
            code={code}
            onCodeChange={onCodeChange}
            isDisabled={isDisabled}
            onCreateSnapshot={onCreateSnapshot}
            isSidebarOpen={isSidebarOpen}
            isRightPanelOpen={!!activePanel}
            isReadOnly={isReadOnly}
          />
        </div>
      </div>

      {/* 우측 패널 영역 */}
      <div className="relative w-12">
        {/* 우측 고정 영역 */}
        <div className="fixed right-0 top-16 bottom-0 w-12 bg-gray-900 border-l border-gray-800 flex flex-col items-center py-4 z-20">
          <button
            onClick={() => onPanelChange("questions")}
            className={`p-3 mb-2 rounded-lg transition-colors ${
              activePanel === "questions"
                ? "bg-blue-500/20 text-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
            title="Questions"
          >
            <FaQuestion size={18} />
          </button>
          <button
            onClick={() => onPanelChange("voting")}
            className={`p-3 rounded-lg transition-colors ${
              activePanel === "voting"
                ? "bg-blue-500/20 text-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
            title="Voting"
          >
            <FaVoteYea size={18} />
          </button>
        </div>

        {/* 패널 컨텐츠 */}
        <div
          className={`fixed right-12 top-16 bottom-0 bg-gray-900 border-l border-gray-800
          transition-transform duration-200 ease-in-out flex
          ${activePanel ? "translate-x-0" : "translate-x-full"}`}
          style={{ width: `${rightWidth}px` }}
        >
          <ResizeHandle
            onResize={onRightResize}
            direction="right"
            className="bg-gray-800"
          />
          <div className="flex-1 p-4 h-full ml-1">{renderActivePanel()}</div>
        </div>
      </div>
    </div>
  );
}
