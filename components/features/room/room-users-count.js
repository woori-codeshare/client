"use client";

import { useEffect, useState } from "react";
import { useWebSocket } from "@/contexts/websocket-context";
import { FaUsers } from "react-icons/fa";

export default function RoomUsersCount({ roomId }) {
  const [userCount, setUserCount] = useState(0);
  const [users, setUsers] = useState([]);
  const { client, connected } = useWebSocket();

  useEffect(() => {
    if (!client || !connected || !roomId) return;

    try {
      const subscription = client.subscribe(
        `/topic/room/${roomId}/users`,
        (message) => {
          try {
            const data = JSON.parse(message.body);
            setUserCount(data.userCount);
            setUsers(data.users || []);
          } catch (error) {
            console.error("Failed to parse message:", error);
          }
        }
      );

      // Join room
      client.publish({
        destination: "/app/join.room",
        body: JSON.stringify({ roomId: roomId }),
      });

      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    } catch (error) {
      console.error("WebSocket error:", error);
    }
  }, [client, connected, roomId]);

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
