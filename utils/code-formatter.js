/**
 * 코드 문자열을 JSON으로 전송하기 위해 정리합니다.
 * @param {string} code - 정리할 코드 문자열
 * @returns {string} 정리된 코드 문자열
 */
export const sanitizeCode = (code) => {
  if (!code) return "";

  return code
    .replace(/\t/g, "  ") // 탭을 공백 2개로 변환
    .replace(/\\/g, "\\\\") // 백슬래시 이스케이프
    .replace(/"/g, '\\"') // 따옴표 이스케이프
    .replace(/\r\n/g, "\n") // CRLF를 LF로 변환
    .replace(/\r/g, "\n"); // CR을 LF로 변환
};

/**
 * JSON으로 전송된 코드 문자열을 원래 형태로 복원합니다.
 * @param {string} code - 복원할 코드 문자열
 * @returns {string} 복원된 코드 문자열
 */
export const desanitizeCode = (code) => {
  if (!code) return "";

  return code
    .replace(/\\"/g, '"') // 이스케이프된 따옴표 복원
    .replace(/\\\\/g, "\\"); // 이스케이프된 백슬래시 복원
};
