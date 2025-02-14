"use client";

import { useState, useCallback } from "react";
import { FaQuestion, FaVoteYea, FaHistory } from "react-icons/fa";
import CodeEditor from "@/components/editor/code-editor";
import Snapshots from "@/components/features/snapshots/snapshots";
import QuestionsPanel from "@/components/features/questions/questions-panel";
import VotingPanel from "@/components/features/voting/voting-panel";
import ResizeHandle from "@/components/common/resize-handle";
import { INITIAL_CODE, INITIAL_SNAPSHOT } from "@/constants/initial-data";
import { INITIAL_WIDTHS, PANEL_CONFIGS } from "@/constants/panel-config";

/**
 * 메인 페이지 컴포넌트
 * 코드 에디터와 사이드 패널들을 관리하는 최상위 컴포넌트
 */
export default function Home() {
  // 상태 관리
  const [code, setCode] = useState(INITIAL_CODE);
  const [snapshots, setSnapshots] = useState([INITIAL_SNAPSHOT]);
  const [currentVersion, setCurrentVersion] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePanel, setActivePanel] = useState(PANEL_CONFIGS.QUESTIONS.id);
  const [leftWidth, setLeftWidth] = useState(INITIAL_WIDTHS.LEFT);
  const [rightWidth, setRightWidth] = useState(INITIAL_WIDTHS.RIGHT);

  /**
   * 우측 패널(질문, 투표) 토글 처리
   */
  const togglePanel = (panelName) => {
    setActivePanel(activePanel === panelName ? null : panelName);
  };

  /**
   * 좌측 사이드바(스냅샷) 크기 조절
   */
  const handleLeftResize = useCallback((delta) => {
    setLeftWidth((prev) => {
      const newWidth = prev + delta;
      return Math.min(
        Math.max(newWidth, INITIAL_WIDTHS.MIN_LEFT),
        window.innerWidth * INITIAL_WIDTHS.MAX_LEFT_RATIO
      );
    });
  }, []);

  /**
   * 우측 패널 크기 조절
   */
  const handleRightResize = useCallback((delta) => {
    setRightWidth((prev) => {
      const newWidth = prev + delta;
      return Math.min(
        Math.max(newWidth, INITIAL_WIDTHS.MIN_RIGHT),
        window.innerWidth * INITIAL_WIDTHS.MAX_RIGHT_RATIO
      );
    });
  }, []);

  /**
   * 새로운 스냅샷 생성
   */
  const createSnapshot = (title, description = "") => {
    const newSnapshot = {
      id: snapshots.length + 1,
      timestamp: new Date().toISOString(),
      title,
      description,
      code,
    };
    setSnapshots([newSnapshot, ...snapshots]);
    setCurrentVersion(0); // 새로운 스냅샷이 항상 인덱스 0이 됨
  };

  /**
   * 스냅샷 버전 변경 처리
   */
  const handleVersionChange = (index) => {
    setCurrentVersion(index);
    setCode(snapshots[index].code);
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* 좌측 사이드바 (스냅샷) */}
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
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
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

        {/* 스냅샷 패널 */}
        <div
          className={`
            h-full bg-gray-900 border-r border-gray-800
            transition-transform duration-200 ease-in-out relative
            ${isSidebarOpen ? "w-[calc(100%-3rem)]" : "w-0 overflow-hidden"}
          `}
        >
          <Snapshots
            snapshots={snapshots}
            currentVersion={currentVersion}
            setCurrentVersion={handleVersionChange}
          />
        </div>

        {/* 좌측 크기 조절 핸들 */}
        {isSidebarOpen && (
          <ResizeHandle
            onResize={handleLeftResize}
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
            onCodeChange={setCode}
            onCreateSnapshot={createSnapshot}
            isSidebarOpen={isSidebarOpen}
            isRightPanelOpen={!!activePanel}
          />
        </div>
      </div>

      {/* 우측 패널 영역 (질문, 투표) */}
      <div className="relative w-12">
        {/* 우측 고정 영역 */}
        <div className="fixed right-0 top-16 bottom-0 w-12 bg-gray-900 border-l border-gray-800 flex flex-col items-center py-4 z-20">
          <button
            onClick={() => togglePanel("questions")}
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
            onClick={() => togglePanel("voting")}
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
          {/* 우측 크기 조절 핸들 */}
          <ResizeHandle
            onResize={handleRightResize}
            direction="right"
            className="bg-gray-800"
          />
          <div className="flex-1 p-4 h-full ml-1">
            {activePanel === "questions" && <QuestionsPanel />}
            {activePanel === "voting" && <VotingPanel />}
          </div>
        </div>
      </div>
    </div>
  );
}
