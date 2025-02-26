"use client";

import { useState, useEffect, useCallback } from "react";
import { FaHistory } from "react-icons/fa";
import SnapshotItem from "./snapshot-item";
import LiveSessionButton from "./live-session-button";
import { motion, AnimatePresence } from "framer-motion";

const POLLING_INTERVAL = 1000;

function useInterval(callback, delay) {
  useEffect(() => {
    const intervalId = setInterval(callback, delay);
    return () => clearInterval(intervalId);
  }, [callback, delay]);
}

/**
 * 코드 스냅샷 기록과 라이브 세션 선택을 관리하는 패널 컴포넌트
 * @param {Object} props
 * @param {string} props.roomUuid - 방 UUID
 * @param {Array} props.snapshots - 저장된 코드 스냅샷 배열
 * @param {number|null} props.currentVersion - 현재 선택된 스냅샷 인덱스 (null일 경우 라이브 세션)
 * @param {Function} props.setCurrentVersion - 버전 변경 상태 업데이트 함수
 * @param {Function} props.onSnapshotsUpdate - 스냅샷 업데이트 콜백 함수
 */
export default function VersionsPanel({
  roomUuid,
  snapshots: externalSnapshots,
  currentVersion,
  setCurrentVersion,
  onSnapshotsUpdate,
}) {
  const [snapshots, setSnapshots] = useState(externalSnapshots || []);
  const isLiveSessionActive = currentVersion === null;

  // 현재 선택된 스냅샷의 ID를 저장
  const selectedSnapshotId =
    currentVersion !== null ? snapshots[currentVersion]?.id : null;

  const fetchSnapshots = useCallback(async () => {
    if (!roomUuid) {
      console.log("Room UUID is not set");
      return;
    }

    try {
      const response = await fetch(`/api/rooms/${roomUuid}/snapshots`);
      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to fetch snapshots:", data.error);
        return;
      }

      const formattedSnapshots = data.data
        .map((snapshot) => ({
          id: snapshot.snapshotId,
          createdAt: new Date(snapshot.createdAt),
          title: snapshot.title,
          description: snapshot.description,
          code: snapshot.code,
          comments: snapshot.comments || [],
        }))
        .sort((a, b) => b.createdAt - a.createdAt);

      // 스냅샷 데이터가 변경된 경우에만 상태 업데이트
      const currentSnapshotsStr = JSON.stringify(snapshots);
      const newSnapshotsStr = JSON.stringify(formattedSnapshots);

      if (currentSnapshotsStr !== newSnapshotsStr) {
        // 현재 선택된 스냅샷의 새 인덱스 찾기
        if (selectedSnapshotId !== null) {
          const newIndex = formattedSnapshots.findIndex(
            (snapshot) => snapshot.id === selectedSnapshotId
          );
          // 인덱스가 변경된 경우에만 업데이트
          if (newIndex !== -1 && newIndex !== currentVersion) {
            setCurrentVersion(newIndex);
          }
        }

        setSnapshots(formattedSnapshots);
        onSnapshotsUpdate(formattedSnapshots);
      }
    } catch (error) {
      console.error("Error fetching snapshots:", error);
    }
  }, [
    roomUuid,
    onSnapshotsUpdate,
    snapshots,
    selectedSnapshotId,
    currentVersion,
    setCurrentVersion,
  ]);

  // Initial fetch
  useEffect(() => {
    fetchSnapshots();
  }, [fetchSnapshots]);

  // Polling
  useInterval(() => {
    fetchSnapshots();
  }, POLLING_INTERVAL);

  /**
   * 저장된 스냅샷으로 전환
   * @param {number} index - 사용자가 선택한 스냅샷 인덱스
   */
  const switchToSnapshot = (index) => {
    setCurrentVersion(index);
  };

  /**
   * 라이브 코딩 세션으로 전환
   */
  const switchToLiveSession = () => {
    setCurrentVersion(null);
  };

  return (
    <div className="h-full flex flex-col text-gray-800 dark:text-gray-100">
      {/* 상단 고정 영역 */}
      <div className="flex-shrink-0 p-2">
        {/* Live Session 버튼 */}
        <LiveSessionButton
          isActive={isLiveSessionActive}
          onClick={switchToLiveSession}
        />

        {/* 구분선 */}
        <div className="h-px bg-gray-200 dark:bg-gray-800 my-4" />

        {/* 스냅샷 헤더 */}
        <div className="group p-2.5 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="text-blue-500">
              <FaHistory size={15} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-medium text-blue-500">Snapshots</span>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {snapshots.length} versions
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 스크롤 가능한 스냅샷 리스트 영역 */}
      <motion.div className="flex-1 overflow-y-auto px-2" layout>
        <div className="space-y-1 py-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {snapshots.map((snapshot, index) => (
              <SnapshotItem
                key={snapshot.id}
                snapshot={snapshot}
                isActive={currentVersion === index}
                onClick={() => switchToSnapshot(index)}
                layoutId={`snapshot-${snapshot.id}`}
              />
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
