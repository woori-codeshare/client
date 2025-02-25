"use client";

import { FaHistory } from "react-icons/fa";
import SnapshotItem from "./snapshot-item";
import LiveSessionButton from "./live-session-button";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 코드 스냅샷 기록과 라이브 세션 선택을 관리하는 패널 컴포넌트
 * @param {Object} props
 * @param {Array} props.snapshots - 저장된 코드 스냅샷 배열
 * @param {number|null} props.currentVersion - 현재 선택된 스냅샷 인덱스 (null일 경우 라이브 세션)
 * @param {Function} props.setCurrentVersion - 버전 변경 상태 업데이트 함수
 */
export default function VersionsPanel({
  snapshots,
  currentVersion,
  setCurrentVersion,
}) {
  // 현재 라이브 세션 활성화 여부 (스냅샷을 선택하지 않은 상태)
  const isLiveSessionActive = currentVersion === null;

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
    <div className="h-full p-2 flex flex-col text-gray-800 dark:text-gray-100">
      {/* 라이브 코딩 세션 버튼 */}
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

      {/* 스냅샷 리스트 */}
      <motion.div className="space-y-1 overflow-y-auto mt-2" layout>
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
      </motion.div>
    </div>
  );
}
