"use client";

import { FaHistory } from "react-icons/fa";
import SnapshotItem from "./snapshot-item";
import CurrentSession from "./session";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 스냅샷 목록을 관리하고 표시하는 컴포넌트
 * @param {Object} props
 * @param {Array} props.snapshots - 스냅샷 배열
 * @param {number} props.currentVersion - 현재 선택된 버전 인덱스
 * @param {Function} props.setCurrentVersion - 버전 변경 함수
 */
export default function VersionsPanel({
  snapshots,
  currentVersion,
  setCurrentVersion,
}) {
  // 현재 작업 중인 세션인지 여부 (스냅샷을 선택하지 않은 상태)
  const isCurrentSessionActive = currentVersion === null;

  /**
   * 스냅샷 버전 변경 처리
   * @param {number} index - 선택된 스냅샷 인덱스
   */
  const handleSnapshotSelect = (index) => {
    setCurrentVersion(index);
  };

  const handleCurrentSessionSelect = () => {
    setCurrentVersion(null);
  };

  return (
    <div className="h-full p-2 flex flex-col text-gray-800 dark:text-gray-100">
      {/* 현재 작업 중인 세션 */}
      <CurrentSession
        isActive={isCurrentSessionActive}
        onClick={handleCurrentSessionSelect}
      />

      {/* 구분선 */}
      <div className="h-px bg-gray-200 dark:bg-gray-800 my-4" />

      {/* 스냅샷 섹션 */}
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
              onClick={() => handleSnapshotSelect(index)}
              layoutId={`snapshot-${snapshot.id}`}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
