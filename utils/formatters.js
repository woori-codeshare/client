/**
 * 타임스탬프를 한국 날짜/시간 형식으로 변환
 * @param {number} timestamp - 변환할 타임스탬프
 * @returns {string} 형식: 'YYYY-MM-DD HH:mm' 형태의 문자열
 */
export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const dateStr = date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const timeStr = date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${dateStr} ${timeStr}`;
};

/**
 * 상대적 시간 포맷팅 (예: '방금 전', '5분 전')
 * @param {Date} timestamp - 포맷팅할 시간
 * @returns {string} 포맷팅된 시간 문자열
 */
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "";

  // timestamp를 숫자로 변환
  const timeValue = Number(new Date(timestamp));
  if (isNaN(timeValue)) return "";

  const now = Date.now();
  const diffInMinutes = Math.floor((now - timeValue) / 60000);

  if (diffInMinutes < 1) return "방금 전";
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;

  return formatTime(timeValue);
};

/**
 * 긴 텍스트를 지정된 길이로 잘라서 말줄임(...) 처리
 * @param {string} text - 원본 텍스트
 * @param {number} maxLength - 최대 길이 (기본값: 50)
 * @returns {string} 처리된 텍스트
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};
