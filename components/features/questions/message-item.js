import { useState, useEffect, useCallback } from "react";
import {
  FaRegClock,
  FaUserCircle,
  FaReply,
  FaPaperPlane,
} from "react-icons/fa";
import { formatRelativeTime } from "@/utils/formatters";

/**
 * 개별 질문/답변 메시지를 표시하는 컴포넌트
 * @param {Object} message - 표시할 메시지 데이터
 * @param {boolean} isReply - 답글 여부 (true: 답글, false: 원글)
 * @param {Function} onReply - 답글 작성 이벤트 핸들러
 * @param {Object} replyingTo - 현재 답글 작성 중인 메시지 정보
 * @param {Function} handleSubmit - 답글 제출 이벤트 핸들러
 */
export default function MessageItem({
  message,
  isReply = false,
  onReply,
  replyingTo,
  handleSubmit,
}) {
  // 상대적 시간 표시 상태 (예: "5분 전")
  const [formattedTime, setFormattedTime] = useState("");

  // 시간 형식 업데이트 함수
  const updateTime = useCallback(() => {
    if (!message?.createdAt) return;
    const timestamp = new Date(message.createdAt).getTime();
    setFormattedTime(formatRelativeTime(timestamp));
  }, [message?.createdAt]);

  // 주기적으로 시간 형식 업데이트 (30초 간격)
  useEffect(() => {
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, [updateTime]);

  return (
    // 메시지 컨테이너 (답글일 경우 왼쪽 패딩 추가)
    <div className={`flex gap-3 items-start ${isReply ? "pl-8" : ""}`}>
      {/* 사용자 아바타 */}
      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 text-gray-400">
        <FaUserCircle size={32} />
      </div>

      {/* 메시지 내용 영역 */}
      <div className="flex-1">
        {/* 메시지 텍스트 박스 */}
        <div
          className={`p-4 rounded-lg border ${
            message.solved
              ? "bg-blue-500/10 border-blue-500/20"
              : "bg-gray-700/30 border-gray-700/50"
          }`}
        >
          <p className="text-sm">{message.content}</p>
        </div>

        {/* 메시지 메타 정보 (시간, 답글 버튼) */}
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
          <FaRegClock size={10} />
          <span>{formattedTime}</span>
          {message.solved && <span className="text-blue-400">Solved</span>}
          {!isReply && (
            <button
              onClick={() => onReply(message.commentId)}
              className="ml-2 text-gray-400 hover:text-blue-400 flex items-center gap-1"
            >
              <FaReply size={10} />
              <span>Reply</span>
            </button>
          )}
        </div>

        {/* 답글 작성 폼 (답글 작성 중일 때만 표시) */}
        {replyingTo?.commentId === message.commentId && (
          <form
            onSubmit={(e) => handleSubmit(e, message.commentId)}
            className="mt-2 flex gap-2"
          >
            <input
              type="text"
              value={replyingTo?.content ?? ""}
              onChange={(e) =>
                onReply({
                  commentId: message.commentId,
                  content: e.target.value,
                })
              }
              placeholder="Write a reply..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
              autoFocus
            />
            <button
              type="submit"
              className="p-2 text-blue-400 hover:text-blue-300 disabled:text-gray-600"
              disabled={!replyingTo?.content?.trim()}
            >
              <FaPaperPlane size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
