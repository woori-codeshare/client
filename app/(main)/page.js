"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RoomCreateModal from "@/components/features/room/room-create-modal";
import { RoomStorage } from "@/utils/room-storage";
import { useAlert } from "@/contexts/alert-context";
import MockCodeEditorLayout from "@/components/layout/mock-code-editor-layout";

/**
 * 방 생성 페이지 (Room Creation Page)
 *
 * 이 페이지는 사용자가 새로운 코드 공유방을 생성할 수 있는 기능을 제공합니다.
 * 페이지 접속 시 방 생성 모달이 자동으로 표시되며, 사용자는 방 제목과 비밀번호를
 * 입력하여 새로운 방을 생성할 수 있습니다.
 */
export default function CreateRoomPage() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [showCreateModal, setShowCreateModal] = useState(true);

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
        showAlert(data.error || "방 생성에 실패했습니다.", "error");
        return;
      }

      // 방 생성 후 방장 정보 저장
      const roomInfo = {
        uuid: data.data.uuid,
        roomId: data.data.roomId,
        title: title,
        isAuthorized: true,
      };

      RoomStorage.saveRoom(roomInfo);

      showAlert("방이 성공적으로 생성되었습니다.", "success");
      router.push(`/${data.data.uuid}`);
    } catch (error) {
      console.error("방 생성 실패:", error);
      showAlert("서버 오류가 발생했습니다.", "error");
    }
  };

  return (
    <>
      <div
        className={showCreateModal ? "filter blur-sm pointer-events-none" : ""}
      >
        <MockCodeEditorLayout />
      </div>

      <RoomCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateRoom}
        preventEscClose={true}
      />
    </>
  );
}
