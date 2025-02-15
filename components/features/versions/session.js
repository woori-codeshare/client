import { FaCode } from "react-icons/fa";

/**
 * 현재 작업 중인 코드 세션을 표시하는 컴포넌트
 * @param {Object} props
 * @param {boolean} props.isActive - 현재 활성화된 상태 여부
 * @param {function} props.onClick - 클릭 이벤트 핸들러
 */
export default function CurrentSession({ isActive = true, onClick }) {
  return (
    <div
      onClick={onClick}
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
      <div className="flex items-center gap-3">
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
            Current Session
          </span>
        </div>
      </div>
    </div>
  );
}
