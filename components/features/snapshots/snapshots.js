import { FaHistory } from "react-icons/fa";
import SnapshotItem from "./snapshot-item";
import LiveSession from "../live-session/live-session";

/**
 * 스냅샷 목록을 관리하고 표시하는 컴포넌트
 * @param {Object} props
 * @param {Array} props.snapshots - 스냅샷 배열
 * @param {number} props.currentVersion - 현재 선택된 버전 인덱스
 * @param {Function} props.setCurrentVersion - 버전 변경 함수
 */
export default function Snapshots({
  snapshots,
  currentVersion,
  setCurrentVersion,
}) {
  /**
   * 스냅샷 버전 변경 처리
   * @param {number} index - 선택된 스냅샷 인덱스
   */
  const handleVersionChange = (index) => {
    setCurrentVersion(index);
  };

  return (
    <div className="h-full p-2">
      {/* 실시간 코딩 세션 */}
      <LiveSession />

      {/* 헤더 섹션 */}
      <div className="flex items-center gap-2 mb-2">
        <FaHistory className="text-blue-400" />
        <div className="whitespace-nowrap">
          <h2 className="text-lg font-medium">Snapshots</h2>
          <p className="text-xs text-gray-400">{snapshots.length} versions</p>
        </div>
      </div>

      {/* 스냅샷 리스트 */}
      <div className="space-y-1 overflow-y-auto">
        {snapshots.map((snapshot, index) => (
          <SnapshotItem
            key={snapshot.id}
            snapshot={snapshot}
            isActive={currentVersion === index}
            onClick={() => handleVersionChange(index)}
          />
        ))}
      </div>
    </div>
  );
}
