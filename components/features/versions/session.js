"use client";

import { GoBroadcast } from "react-icons/go";

/**
 * 현재 작업 중인 코드 세션을 표시하는 컴포넌트
 * @param {Object} props
 * @param {boolean} props.isActive - 현재 활성화된 상태 여부
 * @param {function} props.onClick - 클릭 이벤트 핸들러
 */
export default function CurrentSession({ isActive = true, onClick }) {
  return (
    <div className="overflow-hidden rounded-lg relative">
      {/* 스포트라이트 레이어 */}
      <div
        className={`
        absolute inset-0 rounded-lg
        before:absolute before:inset-[-1px] before:rounded-lg before:animate-spotlight
        before:bg-[conic-gradient(from_0deg,transparent_0deg,transparent_60deg,#ff0000_75deg,transparent_90deg,transparent_240deg)]
        ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
      `}
      />

      {/* 배경 레이어 */}
      <div className="relative m-[2px] rounded-lg bg-white dark:bg-gray-900">
        {/* 메인 컨텐츠 */}
        <div
          onClick={onClick}
          className={`
            p-4 rounded-lg cursor-pointer border
            ${
              isActive
                ? "border-blue-500/30 bg-blue-500/5 dark:border-emerald-500/30 dark:bg-emerald-500/10"
                : "border-transparent hover:bg-gray-50 dark:hover:bg-gray-800"
            }
          `}
        >
          <div className="flex items-center gap-4">
            <div
              className={`
              transition-colors duration-200
              ${
                isActive
                  ? "text-blue-500 dark:text-emerald-400"
                  : "text-gray-400 group-hover:text-blue-500 dark:group-hover:text-emerald-400"
              }
            `}
            >
              <GoBroadcast size={15} />
            </div>

            {/* 컨텐츠 */}
            <div className="flex-1 min-w-0">
              <span
                className={`
                font-medium truncate transition-colors duration-200
                ${
                  isActive
                    ? "text-blue-500 dark:text-emerald-400"
                    : "text-gray-600 group-hover:text-blue-500 dark:text-gray-300 dark:group-hover:text-emerald-400"
                }
              `}
              >
                Current Session
              </span>
              <div className="text-xs mt-0.5 text-gray-500 dark:text-gray-400">
                Live editing mode
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
