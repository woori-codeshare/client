import { useState, useEffect, useCallback } from "react";
import {
  FaRegClock,
  FaUserCircle,
  FaReply,
  FaPaperPlane,
  FaEdit,
  FaTrash,
  FaCheck,
} from "react-icons/fa";
import { formatRelativeTime } from "@/utils/formatters";

/**
 * 개별 질문/답변 메시지를 표시하는 컴포넌트
 * @param {Object} message - 표시할 메시지 데이터
 * @param {boolean} isReply - 답글 여부 (true: 답글, false: 원글)
 * @param {Function} onReply - 답글 작성 이벤트 핸들러
 * @param {Object} replyingTo - 현재 답글 작성 중인 메시지 정보
 * @param {Function} handleSubmit - 답글 제출 이벤트 핸들러
 * @param {Function} onEdit - 수정 핸들러
 * @param {string} editingId - 현재 수정 중인 메시지 ID
 * @param {Function} onDelete - 삭제 핸들러
 * @param {Function} onToggleSolved - 해결 상태 토글 핸들러
 */
export default function MessageItem({
  message,
  isReply = false,
  onReply,
  replyingTo,
  handleSubmit,
  onEdit, // 새로운 prop: 수정 핸들러
  editingId, // 새로운 prop: 현재 수정 중인 메시지 ID
  onDelete, // 새로운 prop 추가
  onToggleSolved, // 새로운 prop 추가
}) {
  // 상대적 시간 표시 상태 (예: "5분 전")
  const [formattedTime, setFormattedTime] = useState("");

  // 수정 중인 content 상태
  const [editContent, setEditContent] = useState(message.content);

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

  // 수정 가능 여부 체크 (대댓글이 없고 원글인 경우에만 수정 가능)
  const canEdit =
    !isReply && (!message.replies || message.replies.length === 0);

  useEffect(() => {
    setEditContent(message.content);
  }, [message.content]);

  return (
    // 메시지 컨테이너 (답글일 경우 왼쪽 패딩 추가)
    <div className={`flex gap-3 items-start ${isReply ? "pl-8" : ""}`}>
      {/* 사용자 아바타 */}
      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 text-gray-500 dark:text-gray-400">
        <FaUserCircle size={32} />
      </div>

      {/* 메시지 내용 영역 */}
      <div className="flex-1">
        {editingId === message.commentId ? (
          // 수정 모드 UI
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onEdit(message.commentId, editContent);
            }}
            className="mb-2"
          >
            <input
              type="text"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="flex-1 w-full rounded-lg px-3 py-2 text-sm mb-2 transition-colors 
                bg-white dark:bg-gray-800 
                border-gray-200 dark:border-gray-700 
                text-gray-900 dark:text-gray-200 
                focus:border-blue-400 dark:focus:border-blue-500/50 
                border"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => onEdit(null)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                취소
              </button>
              <button
                type="submit"
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  !editContent.trim() || editContent === message.content
                    ? "opacity-50 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                disabled={
                  !editContent.trim() || editContent === message.content
                }
              >
                수정
              </button>
            </div>
          </form>
        ) : (
          // 일반 메시지 UI
          <div
            className={`p-4 rounded-lg border transition-colors ${
              message.solved
                ? "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20"
                : "bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-700/50"
            }`}
          >
            <p className="text-sm text-gray-700 dark:text-gray-200">
              {message.content}
            </p>
          </div>
        )}

        {/* 메시지 메타 정보 (시간, 답글 버튼) */}
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-600 dark:text-gray-500">
          <FaRegClock size={10} />
          <span>{formattedTime}</span>
          <div className="flex items-center gap-2 ml-auto">
            {!isReply && (
              <>
                <button
                  onClick={() =>
                    onToggleSolved(message.commentId, !message.solved)
                  }
                  className={`flex items-center gap-1 transition-colors ${
                    message.solved
                      ? "text-green-500"
                      : "text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-400"
                  }`}
                  title={message.solved ? "질문 해결 취소" : "질문 해결 완료"}
                >
                  <FaCheck size={10} />
                  <span>{message.solved ? "해결됨" : "해결"}</span>
                </button>
                {canEdit && (
                  <>
                    <button
                      onClick={() => onEdit(message.commentId)}
                      className="flex items-center gap-1 transition-colors text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      <FaEdit size={10} />
                      <span>수정</span>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("정말 삭제하시겠습니까?")) {
                          onDelete(message.commentId);
                        }
                      }}
                      className="flex items-center gap-1 transition-colors text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                    >
                      <FaTrash size={10} />
                      <span>삭제</span>
                    </button>
                  </>
                )}
              </>
            )}
            {!isReply && (
              <button
                onClick={() => onReply(message.commentId)}
                className="flex items-center gap-1 transition-colors text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <FaReply size={10} />
                <span>답글</span>
              </button>
            )}
          </div>
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
              className="flex-1 px-3 py-2 rounded-lg text-sm border transition-colors
                bg-white dark:bg-gray-800 
                border-gray-200 dark:border-gray-700 
                text-gray-900 dark:text-gray-200 
                focus:border-blue-400 dark:focus:border-blue-500/50"
              autoFocus
            />
            <button
              type="submit"
              className={`p-2 transition-colors ${
                !replyingTo?.content?.trim()
                  ? "opacity-50 cursor-not-allowed"
                  : "text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              }`}
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
