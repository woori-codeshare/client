"use client";
import React from "react";
import SnapshotEditor from "./snapshot-editor";
import CurrentSessionEditor from "./current-session-editor";

/**
 * 코드 에디터 컴포넌트 - 현재 세션 에디터와 스냅샷 에디터를 상황에 맞게 렌더링
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.code - 현재 코드
 * @param {Function} props.onCodeChange - 코드 변경 핸들러
 * @param {boolean} props.isDisabled - 에디터 비활성화 여부
 * @param {Function} props.onCreateSnapshot - 스냅샷 생성 핸들러
 * @param {boolean} props.isSidebarOpen - 좌측 사이드바 열림 여부
 * @param {boolean} props.isRightPanelOpen - 우측 패널 열림 여부
 * @param {boolean} props.isReadOnly - 읽기 전용 모드 여부
 * @param {string} props.roomId - 방 ID
 */
export default function CodeEditor({
  code,
  onCodeChange,
  isDisabled,
  onCreateSnapshot,
  isSidebarOpen,
  isRightPanelOpen,
  isReadOnly,
  roomId,
}) {
  if (isReadOnly) {
    return (
      <SnapshotEditor
        code={code}
        isSidebarOpen={isSidebarOpen}
        isRightPanelOpen={isRightPanelOpen}
      />
    );
  } else {
    return (
      <CurrentSessionEditor
        code={code}
        onCodeChange={onCodeChange}
        isDisabled={isDisabled}
        onCreateSnapshot={onCreateSnapshot}
        isSidebarOpen={isSidebarOpen}
        isRightPanelOpen={isRightPanelOpen}
        roomId={roomId}
      />
    );
  }
}
