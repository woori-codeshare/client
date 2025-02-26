"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { INITIAL_CODE } from "@/constants/initial-data";
import { INITIAL_WIDTHS, PANEL_CONFIGS } from "@/constants/panel-config";
import CodeEditorLayout from "@/components/layout/code-editor-layout";
import RoomEnterModal from "@/components/features/room/room-enter-modal";
import { RoomStorage } from "@/utils/room-storage";
import { useAlert } from "@/contexts/alert-context";
import { sanitizeCode, desanitizeCode } from "@/utils/code-formatter";

/**
 * 코드 공유 방 페이지
 * 실시간 코드 공유와 협업 기능을 제공하는 페이지 컴포넌트
 */
export default function CodeShareRoomPage() {
  const router = useRouter();
  const { id } = useParams();
  const { showAlert } = useAlert();

  // Room state
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showEnterModal, setShowEnterModal] = useState(false);
  const [roomInfo, setRoomInfo] = useState(null);

  // Editor state
  const [code, setCode] = useState(desanitizeCode(INITIAL_CODE));
  const [snapshots, setSnapshots] = useState([]);
  const [currentVersion, setCurrentVersion] = useState(null);

  // Layout state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const [leftWidth, setLeftWidth] = useState(INITIAL_WIDTHS.LEFT);
  const [rightWidth, setRightWidth] = useState(INITIAL_WIDTHS.RIGHT);

  // 스냅샷이 선택되었는지 여부로 readOnly 상태 결정
  const isReadOnly = currentVersion !== null;

  // 방 입장 권한 체크
  useEffect(() => {
    const checkAccess = async () => {
      const hasAccess = RoomStorage.hasAccess(id);
      setIsAuthorized(hasAccess);

      if (hasAccess) {
        // 이미 인증된 사용자인 경우
        showAlert("방에 입장하는데 성공하였습니다.", "success");
      } else {
        setShowEnterModal(true);
      }
    };

    checkAccess();
  }, [id, showAlert]);

  // 초기 roomInfo 로드
  useEffect(() => {
    const room = RoomStorage.getRoom(id);
    if (room) {
      setRoomInfo(room);
    }
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

      const data = await response.json();

      if (!response.ok) {
        showAlert(data.error || "방 입장에 실패했습니다.", "error");
        return;
      }

      const roomInfo = {
        uuid: id,
        roomId: data.data.roomId,
        title: data.data.title,
        isAuthorized: true,
      };

      RoomStorage.saveRoom(roomInfo);
      setRoomInfo(roomInfo);
      showAlert("방에 입장하는데 성공하였습니다.", "success");
      setIsAuthorized(true);
      setShowEnterModal(false);
    } catch (error) {
      console.error("방 입장 실패:", error);
      showAlert("서버 오류가 발생했습니다.", "error");
    }
  };

  /**
   * 우측 패널(질문, 투표) 토글 처리
   */
  const togglePanel = (panelName) => {
    // current session(currentVersion이 null)인 경우 패널을 열지 않음
    if (currentVersion === null) return;

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
  const createSnapshot = async (snapshotData) => {
    if (!code) return;

    const room = RoomStorage.getRoom(id);
    const roomId = room?.roomId;

    if (!roomId) {
      showAlert("방 정보를 찾을 수 없습니다.", "error");
      return;
    }

    try {
      const response = await fetch(`/api/rooms/${id}/snapshots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId,
          title: snapshotData.title,
          description: snapshotData.description,
          code: sanitizeCode(code),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showAlert(data.error || "스냅샷 생성에 실패했습니다.", "error");
        return;
      }

      const newSnapshot = {
        id: data.data.snapshotId,
        createdAt: new Date(data.data.createdAt),
        title: data.data.title,
        description: data.data.description,
        code: data.data.code,
      };

      setSnapshots((prev) => [newSnapshot, ...prev]);
      showAlert("스냅샷이 생성되었습니다.", "success");
    } catch (error) {
      showAlert("서버 오류가 발생했습니다.", "error");
    }
  };

  /**
   * 스냅샷 버전 변경 처리
   */
  const handleVersionChange = (index) => {
    if (index === null) {
      setCurrentVersion(null);
      setActivePanel(null); // 현재 세션으로 돌아갈 때는 패널 닫기
      return;
    }

    if (snapshots[index]) {
      setCode(desanitizeCode(snapshots[index].code));
      setCurrentVersion(index);
    }
  };

  /**
   * 스냅샷 목록 업데이트 핸들러
   */
  const handleSnapshotsUpdate = useCallback((updatedSnapshots) => {
    setSnapshots(updatedSnapshots);
  }, []);

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
        onSnapshotsUpdate={handleSnapshotsUpdate}
        currentVersion={currentVersion}
        onVersionChange={handleVersionChange}
        roomUuid={roomInfo?.uuid}
        roomId={roomInfo?.roomId}
        snapshotId={
          currentVersion !== null ? snapshots[currentVersion]?.id : null
        }
      />

      <RoomEnterModal
        isOpen={showEnterModal}
        onClose={() => router.push("/")}
        onSubmit={handleEnterRoom}
      />
    </>
  );
}
