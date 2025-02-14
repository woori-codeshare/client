import { useEffect } from "react";

/**
 * 모달 창을 표시하는 컴포넌트
 * @param {object} props
 * @param {boolean} props.isOpen - 모달 표시 여부
 * @param {Function} props.onClose - 모달 닫기 함수
 * @param {ReactNode} props.children - 모달 내부 컨텐츠
 * @param {boolean} props.allowBackdropClose - 백드롭 클릭 시 닫기 허용 여부
 * @param {boolean} props.closeButton - 닫기 버튼 표시 여부
 * @returns
 */
export default function Modal({
  isOpen,
  onClose,
  children,
  allowBackdropClose = true,
  closeButton = false,
}) {
  // ESC 키를 눌렀을 때 모달을 닫는 이벤트 핸들러 등록
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // 모달이 열려있을 때만 이벤트 리스너 등록
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  // 모달이 닫혀있으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  // 모달 외부 영역(백드롭) 클릭 시 모달 닫기
  const handleBackdropClick = (e) => {
    if (allowBackdropClose && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    // 모달 백드롭: 배경을 불투명하게 하고 중앙에 모달을 표시
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      {/* 모달 창: 실제 컨텐츠를 포함하는 박스 */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-[480px] relative">
        {/* 닫기 버튼 */}
        {closeButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-300"
          >
            ✕
          </button>
        )}
        {/* 모달 내부 컨텐츠 */}
        {children}
      </div>
    </div>
  );
}
