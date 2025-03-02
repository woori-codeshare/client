"use client";

import { WebSocketProvider } from "@/contexts/websocket-context";

export default function RoomLayout({ children }) {
  return <WebSocketProvider>{children}</WebSocketProvider>;
}
