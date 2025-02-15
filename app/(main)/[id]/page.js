"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { INITIAL_CODE } from "@/constants/initial-data";
import { INITIAL_WIDTHS, PANEL_CONFIGS } from "@/constants/panel-config";
import CodeEditorLayout from "@/components/layout/code-editor-layout";
import RoomEnterModal from "@/components/features/room/room-enter-modal";
import { RoomStorage } from "@/utils/room-storage";

/**
 * 코드 공유 방 페이지
 * 실시간 코드 공유와 협업 기능을 제공하는 페이지 컴포넌트
 */
export default function CodeShareRoomPage() {
  const router = useRouter();
  const { id } = useParams();
  const [showEnterModal, setShowEnterModal] = useState(false); // 초기값을 false로 변경
  const [isAuthorized, setIsAuthorized] = useState(false);

  // 상태 관리
  const [code, setCode] = useState(INITIAL_CODE);
  const [snapshots, setSnapshots] = useState([]);
  const [currentVersion, setCurrentVersion] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePanel, setActivePanel] = useState(PANEL_CONFIGS.QUESTIONS.id);
  const [leftWidth, setLeftWidth] = useState(INITIAL_WIDTHS.LEFT);
  const [rightWidth, setRightWidth] = useState(INITIAL_WIDTHS.RIGHT);

  // 스냅샷이 선택되었는지 여부로 readOnly 상태 결정
  const isReadOnly = currentVersion !== null;

  // 방 입장 권한 체크
  useEffect(() => {
    const checkAccess = async () => {
      const hasAccess = RoomStorage.hasAccess(id);
      setIsAuthorized(hasAccess);

      // 접근 권한이 없는 경우에만 모달 표시
      if (!hasAccess) {
        setShowEnterModal(true);
      }
    };

    checkAccess();
  }, [id]);

  /**
   * 방 입장 처리
   */
  const handleEnterRoom = async (password) => {
    try {
      const response = await fetch(
        `/api/rooms/${id}/participants?password=${password}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Invalid password");
      }

      const data = await response.json();
      RoomStorage.saveRoom({
        uuid: id,
        title: data.data.title,
        isCreator: false,
        isAuthorized: true, // 성공적으로 인증된 경우
      });

      setIsAuthorized(true);
      setShowEnterModal(false);
    } catch (error) {
      console.error("방 입장 실패:", error);
      // TODO: Show error message to user
    }
  };

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
  const createSnapshot = (title = "", description = "") => {
    if (!code) return;

    const newSnapshot = {
      id: Date.now(),
      timestamp: new Date(),
      title: title || `Snapshot ${snapshots.length + 1}`,
      description,
      code,
    };

    setSnapshots((prev) => [newSnapshot, ...prev]);
  };

  /**
   * 스냅샷 버전 변경 처리
   */
  const handleVersionChange = (index) => {
    if (index === null) {
      setCurrentVersion(null);
      return;
    }

    if (snapshots[index]) {
      setCode(snapshots[index].code);
      setCurrentVersion(index);
    }
  };

  return (
    <>
      <CodeEditorLayout
        code={code}
        onCodeChange={setCode}
        isDisabled={!isAuthorized}
        onCreateSnapshot={createSnapshot}
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isReadOnly={isReadOnly}
        leftWidth={leftWidth}
        rightWidth={rightWidth}
        onLeftResize={handleLeftResize}
        onRightResize={handleRightResize}
        activePanel={activePanel}
        onPanelChange={togglePanel}
        snapshots={snapshots}
        currentVersion={currentVersion}
        onVersionChange={handleVersionChange}
      />

      <RoomEnterModal
        isOpen={showEnterModal}
        onClose={() => router.push("/")}
        onSubmit={handleEnterRoom}
      />
    </>
  );
}
