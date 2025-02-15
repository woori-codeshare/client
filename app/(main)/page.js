"use client";

import { useState } from "react";
import CodeEditorLayout from "@/components/layout/code-editor-layout";
import { INITIAL_CODE } from "@/constants/initial-data";
import RoomCreateModal from "@/components/features/room/room-create-modal";
import { useRouter } from "next/navigation";
import { INITIAL_WIDTHS, PANEL_CONFIGS } from "@/constants/panel-config";
import { RoomStorage } from "@/utils/room-storage";

/**
 * 방 생성 페이지
 * 새로운 코드 공유 방을 생성하는 페이지 컴포넌트
 */
export default function CreateRoomPage() {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(true);
  const [code, setCode] = useState(INITIAL_CODE);
  const [activePanel, setActivePanel] = useState(PANEL_CONFIGS.QUESTIONS.id);
  const [rightWidth] = useState(INITIAL_WIDTHS.RIGHT);

  const handleCreateRoom = async (title, password) => {
    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      // 방 생성 후 방장 정보 저장
      RoomStorage.saveRoom({
        uuid: data.data.uuid,
        title: title,
        isCreator: true,
      });

      router.push(`/${data.data.uuid}`);
    } catch (error) {
      console.error("방 생성 실패:", error);
      // TODO: 에러 처리
    }
  };

  return (
    <>
      <div
        className={showCreateModal ? "filter blur-sm pointer-events-none" : ""}
      >
        <CodeEditorLayout
          code={code}
          onCodeChange={setCode}
          isDisabled={showCreateModal}
          isSidebarOpen={false}
          onSidebarToggle={() => {}} // 비활성화된 상태
          rightWidth={rightWidth}
          activePanel={activePanel}
          onPanelChange={setActivePanel}
          snapshots={[]}
          currentVersion={null}
          onVersionChange={() => {}}
        />
      </div>

      <RoomCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateRoom}
      />
    </>
  );
}
