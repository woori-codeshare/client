"use client";

import { useEffect, useState, useCallback } from "react";
import { useWebSocket } from "@/contexts/websocket-context";
import { FaUsers } from "react-icons/fa";

export default function RoomUsersCount({ roomId }) {
  const [userCount, setUserCount] = useState(0);
  const [users, setUsers] = useState([]);
  const { client, connected, nickname, setNickname } = useWebSocket();

  // 이미 입장한 방인지 확인
  const checkExistingSession = useCallback(() => {
    const savedSession = localStorage.getItem("roomSession");
    if (savedSession) {
      const session = JSON.parse(savedSession);
      if (session.roomId === roomId) {
        return session.nickname;
      }
      // 다른 방에 입장한 기록이 있으면 삭제
      localStorage.removeItem("roomSession");
    }
    return null;
  }, [roomId]);

  // 세션 저장
  const saveSession = useCallback(
    (userNickname) => {
      localStorage.setItem(
        "roomSession",
        JSON.stringify({
          roomId,
          nickname: userNickname,
        })
      );
    },
    [roomId]
  );

  // 방 나가기 처리 함수 - 동기 방식으로 변경
  const leaveRoom = useCallback(() => {
    if (client?.connected && nickname && roomId) {
      try {
        // 동기적으로 메시지 전송
        client.publish({
          destination: "/app/leave.room",
          body: JSON.stringify({ roomId, nickname }),
        });
        localStorage.removeItem("roomSession");
        setNickname(null);
      } catch (error) {
        console.error("방 나가기 요청 실패:", error);
      }
    }
  }, [client, nickname, roomId, setNickname]);

  // WebSocket 구독 및 방 입장 처리
  useEffect(() => {
    let subscription = null;
    const existingNickname = checkExistingSession();

    const setupConnection = async () => {
      if (!client || !connected || !roomId) return;

      try {
        // 사용자 목록 업데이트 구독
        subscription = client.subscribe(
          `/topic/room/${roomId}/users`,
          (message) => {
            try {
              const data = JSON.parse(message.body);
              setUserCount(data.userCount);
              setUsers(data.users || []);

              // 방 입장 시 서버에서 할당한 닉네임 저장
              if (data.eventType === "JOIN" && data.nickname && !nickname) {
                setNickname(data.nickname);
                saveSession(data.nickname);
              }
            } catch (error) {
              console.error("메시지 파싱 실패:", error);
            }
          }
        );

        // 이전 세션이 없을 때만 새로 입장
        if (!existingNickname && !nickname) {
          await client.publish({
            destination: "/app/join.room",
            body: JSON.stringify({ roomId }),
          });
        } else if (existingNickname) {
          setNickname(existingNickname);
        }
      } catch (error) {
        console.error("WebSocket 에러:", error);
      }
    };

    setupConnection();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
      leaveRoom();
    };
  }, [
    client,
    connected,
    roomId,
    nickname,
    setNickname,
    leaveRoom,
    checkExistingSession,
    saveSession,
  ]);

  // beforeunload 이벤트 처리 수정
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (client?.connected && nickname) {
        // 브라우저 종료 시 동기적으로 처리
        const msg = client.publish({
          destination: "/app/leave.room",
          body: JSON.stringify({ roomId, nickname }),
        });
        localStorage.removeItem("roomSession");

        // 브라우저에게 잠시 대기하도록 요청
        e.preventDefault();
        e.returnValue = "";

        // 메시지가 전송될 시간을 확보
        const start = Date.now();
        while (Date.now() - start < 100) {
          // 잠시 대기
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [client, nickname, roomId]);

  return (
    <div
      className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
      title={users.join(", ")}
    >
      <FaUsers size={14} />
      <span>{userCount} users</span>
    </div>
  );
}
