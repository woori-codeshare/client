"use client";

/**
 * 패널 크기 조절을 위한 핸들 컴포넌트
 * @param {Object} props
 * @param {Function} props.onResize - 크기 변경 시 호출될 콜백 함수
 * @param {string} props.direction - 리사이즈 방향 ('left' 또는 'right')
 * @param {string} props.className - 추가적인 CSS 클래스
 */
export default function ResizeHandle({
  onResize,
  direction = "left",
  className = "",
}) {
  // 마우스 드래그 시작 시 호출되는 이벤트 핸들러
  const handleMouseDown = (e) => {
    e.preventDefault();
    let startX = e.pageX; // 드래그 시작 위치

    // 마우스 이동 중 호출되는 이벤트 핸들러
    const handleMouseMove = (moveEvent) => {
      const currentX = moveEvent.pageX;
      const delta = currentX - startX; // 이동 거리 계산

      // 방향에 따른 델타값 조정
      // right 방향일 경우 반대 방향으로 조정
      const adjustedDelta = direction === "right" ? -delta : delta;
      onResize(adjustedDelta);

      startX = currentX; // 현재 위치를 마지막 위치로 업데이트
    };

    // 마우스 버튼을 놓았을 때 호출되는 이벤트 핸들러
    const handleMouseUp = () => {
      // 이벤트 리스너 제거로 메모리 누수 방지
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default"; // 커서 스타일 복원
    };

    // 전역 이벤트 리스너 등록
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize"; // 리사이즈 커서로 변경
  };

  return (
    // 리사이즈 핸들 요소
    <div
      className={`w-1 hover:bg-blue-500/50 absolute cursor-col-resize h-full
        ${
          direction === "left" ? "-right-0.5" : "-left-0.5"
        }  /* 방향에 따른 위치 조정 */
        ${className}`}
      onMouseDown={handleMouseDown}
    />
  );
}
