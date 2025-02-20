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

      {/* 배경 레이어 - 항상 일정한 마진 유지 */}
      <div className="relative m-[2px] rounded-lg bg-gray-900">
        {/* 메인 컨텐츠 - border 공간을 항상 확보 */}
        <div
          onClick={onClick}
          className={`
            p-4 rounded-lg cursor-pointer border
            ${
              isActive
                ? "border-emerald-500/30 bg-emerald-500/10"
                : "border-transparent hover:bg-gray-800"
            }
          `}
        >
          <div className="flex items-center gap-4">
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
              <GoBroadcast size={15} />
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
      </div>
    </div>
  );
}
