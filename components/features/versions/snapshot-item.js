import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { formatRelativeTime } from "@/utils/formatters";

/**
 * 코드 스냅샷 아이템을 표시하는 컴포넌트
 * @param {Object} props 컴포넌트 속성
 * @param {Object} props.snapshot - 스냅샷 정보 객체
 * @param {string} props.snapshot.id - 스냅샷의 고유 식별자
 * @param {string} props.snapshot.title - 스냅샷 제목
 * @param {string} props.snapshot.description - 스냅샷 설명 (선택적)
 * @param {string|number} props.snapshot.createdAt - 스냅샷 생성 시간
 * @param {boolean} props.isActive - 현재 선택된 스냅샷인지 여부
 * @param {Function} props.onClick - 스냅샷 클릭 시 호출할 핸들러 함수
 * @param {string} props.layoutId - framer-motion 애니메이션을 위한 레이아웃 ID
 */
export default function SnapshotItem({
  snapshot,
  isActive,
  onClick,
  layoutId,
}) {
  // 포맷팅된 시간을 저장하는 상태
  const [formattedTime, setFormattedTime] = useState("");

  /**
   * 타임스탬프를 상대적 시간으로 포맷팅하는 함수
   * 스냅샷의 타임스탬프가 변경될 때마다 새로운 함수 생성 방지를 위해 useCallback 사용
   */
  const updateTime = useCallback(() => {
    if (!snapshot?.createdAt) return;
    setFormattedTime(formatRelativeTime(snapshot.createdAt));
  }, [snapshot?.createdAt]);

  /**
   * 컴포넌트 마운트 시 시간 포맷팅 시작
   * 30초마다 시간 표시 업데이트
   * 컴포넌트 언마운트 시 타이머 정리
   */
  useEffect(() => {
    updateTime();
    const timer = setInterval(updateTime, 30000); // 30초마다 업데이트
    return () => clearInterval(timer);
  }, [updateTime]);

  return (
    <motion.div
      layoutId={layoutId}
      layout // 레이아웃 애니메이션 활성화
      initial={{
        opacity: 0,
        y: -15,
        scale: 0.97,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 500,
          damping: 25,
          mass: 1,
        },
      }}
      exit={{
        opacity: 0,
        scale: 0.97,
        transition: {
          duration: 0.15,
        },
      }}
      onClick={onClick}
      className={`
        group p-2.5 rounded-lg cursor-pointer 
        transition-colors duration-200 relative
        ${
          isActive
            ? "bg-blue-50 dark:bg-blue-500/20 border border-blue-500/30"
            : "hover:bg-gray-100 dark:hover:bg-gray-800/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
        }
      `}
    >
      {/* 타임스탬프 */}
      <div className="flex items-center gap-2 mb-1">
        <div
          className={`
          text-xs
          ${isActive ? "text-blue-500" : "text-gray-600 dark:text-gray-500"}
        `}
        >
          {formattedTime}
        </div>
      </div>

      {/* 스냅샷 제목 */}
      <div
        className={`
        font-medium text-sm truncate
        ${
          isActive
            ? "text-blue-500"
            : "text-gray-700 dark:text-gray-200 group-hover:text-blue-500 dark:group-hover:text-blue-400"
        }
      `}
      >
        {snapshot.title}
      </div>

      {/* 스냅샷 설명 (존재하는 경우에만 표시) */}
      {snapshot.description && (
        <div className="text-xs mt-1.5 line-clamp-2 text-gray-500 dark:text-gray-400">
          {snapshot.description}
        </div>
      )}

      {/* 활성화 상태 표시 도트 */}
      {isActive && (
        <div className="absolute -left-[3px] top-1/2 -translate-y-1/2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        </div>
      )}
    </motion.div>
  );
}
