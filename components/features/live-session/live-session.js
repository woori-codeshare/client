import { FaCode } from "react-icons/fa";

/**
 * 실시간 코딩 세션 정보를 표시하는 컴포넌트
 * @param {Object} props
 * @param {boolean} props.isLive - 실시간 진행 여부
 * @param {boolean} props.isActive - 현재 활성화된 상태 여부
 */
export default function LiveSession({ isLive = true, isActive = true }) {
  return (
    <div
      className={`
        group relative p-2.5 rounded-lg cursor-pointer
        border transition-all duration-200
        ${
          isActive
            ? "border-emerald-500/30 bg-emerald-500/10"
            : "border-transparent hover:border-gray-700 hover:bg-gray-800"
        }
      `}
    >
      {/* 실시간 표시 도트 */}
      {isLive && (
        <div className="absolute -left-[3px] top-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping absolute" />
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 pl-1">
        {/* 아이콘 */}
        <div
          className={`
          transition-colors duration-200
          ${
            isActive
              ? "text-emerald-400"
              : "text-gray-400 group-hover:text-emerald-400"
          }
        `}
        >
          <FaCode size={15} />
        </div>

        {/* 컨텐츠 */}
        <div className="flex-1 min-w-0">
          <span
            className={`
            font-medium truncate transition-colors duration-200
            ${
              isActive
                ? "text-emerald-400"
                : "text-gray-300 group-hover:text-emerald-400"
            }
          `}
          >
            Instructor&apos;s Session
          </span>
          {isLive && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-medium bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded-full">
                LIVE
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
