"use client";

import { useState, useEffect, useCallback } from "react";
import { FaQuestion, FaPaperPlane } from "react-icons/fa";
import MessageItem from "./message-item";
import { useAlert } from "@/contexts/alert-context";

const POLLING_INTERVAL = 1000; // 질문/답변 조회 폴링 간격 (1초)

// 폴링을 위한 커스텀 훅
function useInterval(callback, delay) {
  useEffect(() => {
    const intervalId = setInterval(callback, delay);
    return () => clearInterval(intervalId);
  }, [callback, delay]);
}

/**
 * 질문과 답변을 관리하는 패널 컴포넌트
 * @param {string} roomId - 현재 룸의 고유 식별자
 * @param {string} snapshotId - 현재 스냅샷의 고유 식별자
 * @param {Array} snapshots - 전체 스냅샷 목록
 * @param {Function} onSnapshotsUpdate - 스냅샷 업데이트 핸들러
 */
export default function QuestionsPanel({
  roomId,
  snapshotId,
  snapshots,
  onSnapshotsUpdate,
}) {
  // 사용자 입력 질문을 관리하는 상태
  const [newQuestion, setNewQuestion] = useState("");

  // 답변 작성 중인 질문 정보를 관리하는 상태
  // { commentId: number, content: string } 형태로 저장
  const [replyingTo, setReplyingTo] = useState(null);

  // 전체 질문/답변 목록을 관리하는 상태
  const [messages, setMessages] = useState([]);

  // 알림 컨텍스트 훅
  const { showAlert } = useAlert();

  const [editingId, setEditingId] = useState(null);

  /**
   * 댓글들을 계층 구조로 정리하는 함수
   * 평면적인 댓글 배열을 부모-자식 관계가 있는 트리 구조로 변환합니다.
   *
   * @param {Array} comments - 정리할 댓글 목록
   * @returns {Array} - 계층 구조로 정리된 댓글 트리
   *
   * 동작 과정:
   * 1. 부모 댓글과 자식 댓글을 분류
   *    - parentCommentId가 0인 댓글은 부모 댓글로 분류
   *    - parentCommentId가 있는 댓글은 해당 ID를 키로 하여 Map에 저장
   *
   * 2. 부모 댓글에 자식 댓글 연결
   *    - 각 부모 댓글의 commentId를 키로 하여 Map에서 자식 댓글들을 찾아 연결
   *    - 자식 댓글이 없는 경우 빈 배열로 처리
   *
   * 입력 예시:
   * [
   *   { commentId: 1, content: "질문1", parentCommentId: 0 },
   *   { commentId: 2, content: "답변1", parentCommentId: 1 },
   *   { commentId: 3, content: "질문2", parentCommentId: 0 }
   * ]
   *
   * 출력 예시:
   * [
   *   {
   *     commentId: 1,
   *     content: "질문1",
   *     parentCommentId: 0,
   *     replies: [
   *       { commentId: 2, content: "답변1", parentCommentId: 1 }
   *     ]
   *   },
   *   {
   *     commentId: 3,
   *     content: "질문2",
   *     parentCommentId: 0,
   *     replies: []
   *   }
   * ]
   */
  const organizeComments = (comments) => {
    const parentComments = []; // 부모 댓글 목록
    const childComments = new Map(); // 부모-자식 댓글 매핑

    // 부모-자식 댓글 분류
    comments.forEach((comment) => {
      if (comment.parentCommentId === 0) {
        parentComments.push(comment);
      } else {
        if (!childComments.has(comment.parentCommentId)) {
          childComments.set(comment.parentCommentId, []);
        }
        childComments.get(comment.parentCommentId).push(comment);
      }
    });

    // 부모 댓글에 자식 댓글 연결
    return parentComments.map((parent) => ({
      ...parent,
      replies: childComments.get(parent.commentId) || [],
    }));
  };

  // 현재 스냅샷의 댓글 목록을 조회하는 함수
  const fetchComments = useCallback(async () => {
    if (!snapshotId) return;

    try {
      const response = await fetch(
        `/api/rooms/${roomId}/snapshots/${snapshotId}/comments`
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Comments fetch error:", data);
        return;
      }

      const organizedMessages = organizeComments(
        data.data.map((comment) => ({
          ...comment,
          parentCommentId:
            comment.parentCommentId === null ? 0 : comment.parentCommentId,
        }))
      );

      if (JSON.stringify(messages) !== JSON.stringify(organizedMessages)) {
        setMessages(organizedMessages);
      }
    } catch (error) {
      console.error("Comments fetch error:", error);
    }
  }, [roomId, snapshotId]);

  // 스냅샷이 변경될 때마다 댓글 목록 조회
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Add polling for comments
  useInterval(() => {
    if (snapshotId) {
      fetchComments();
    }
  }, POLLING_INTERVAL);

  /**
   * 스냅샷의 댓글 목록을 업데이트하는 함수
   * @param {Object} newComment - 새로 추가된 댓글
   */
  const updateSnapshotComments = useCallback(
    (newComment) => {
      if (!snapshots || !snapshotId) return;

      // 스냅샷 목록에서 현재 스냅샷을 찾아 댓글 추가
      const updatedSnapshots = snapshots.map((snapshot) => {
        if (snapshot.id === parseInt(snapshotId)) {
          return {
            ...snapshot,
            comments: [...(snapshot.comments || []), newComment],
          };
        }
        return snapshot;
      });

      // 상위 컴포넌트의 스냅샷 상태 업데이트
      onSnapshotsUpdate?.(updatedSnapshots);
    },
    [snapshotId, snapshots, onSnapshotsUpdate]
  );

  /**
   * 답변 작성 모드를 토글하는 함수
   * @param {number|Object} messageData - 답변할 메시지의 ID 또는 답변 데이터
   *   - number: 최초 답변 시작 시
   *   - Object: 답변 내용 업데이트 시 ({ id, text })
   */
  const handleReply = (messageData) => {
    // 답글 작성 시 데이터 구조 통일
    const isInitialReply = typeof messageData === "number";
    setReplyingTo(
      isInitialReply
        ? { commentId: messageData, content: "" } // 초기 답글 시작
        : messageData // 답글 내용 업데이트
    );
  };

  /**
   * 질문 또는 답변 제출을 처리하는 함수
   * @param {Event} e - 폼 제출 이벤트 객체
   * @param {number|null} parentId - 답변의 경우 부모 질문 ID, 새 질문은 null
   */
  const handleSubmit = async (e, parentId = null) => {
    e.preventDefault();

    if (!snapshotId) {
      showAlert("Snapshot ID is required", "error");
      return;
    }

    const content = parentId ? replyingTo?.content : newQuestion;
    if (!content?.trim()) return;

    try {
      const requestBody = {
        snapshotId: parseInt(snapshotId),
        content: content.trim(),
        ...(parentId ? { parentCommentId: parentId } : {}),
      };

      const response = await fetch(
        `/api/rooms/${roomId}/snapshots/${snapshotId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showAlert(data.message || "Failed to create comment", "error");
        return;
      }

      const newMessage = {
        commentId: data.data.commentId,
        content: data.data.content,
        createdAt: new Date().toISOString(),
        solved: false,
        parentCommentId: parentId === null ? 0 : parentId,
        replies: [],
      };

      if (parentId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.commentId === parentId
              ? { ...msg, replies: [...msg.replies, newMessage] }
              : msg
          )
        );
        setReplyingTo(null);
      } else {
        setMessages((prev) => [...prev, newMessage]);
        setNewQuestion("");
      }

      // 스냅샷의 comments 배열 업데이트
      updateSnapshotComments(newMessage);

      showAlert(data.message || "Comment created successfully", "success");
    } catch (error) {
      showAlert("Server connection error", "error");
    }
  };

  /**
   * 댓글 수정을 처리하는 함수
   * @param {number} commentId - 수정할 댓글 ID
   * @param {string} content - 수정할 내용
   */
  const handleEdit = async (commentId, content) => {
    // 수정 모드 취소
    if (!commentId) {
      setEditingId(null);
      return;
    }

    // 수정 모드 시작
    if (!content) {
      setEditingId(commentId);
      return;
    }

    try {
      const response = await fetch(
        `/api/rooms/${roomId}/snapshots/${snapshotId}/comments/${commentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        }
      );

      const data = await response.json();
      console.log("Edit response:", data);

      if (!response.ok) {
        showAlert(data.message || "댓글 수정에 실패했습니다.", "error");
        return;
      }

      // 응답이 성공적인 경우 (200)
      const updatedComment = {
        commentId: data.data.commentId,
        content: data.data.content,
        updatedAt: data.data.updatedAt,
      };

      // 로컬 메시지 목록 업데이트
      setMessages((prev) =>
        prev.map((msg) =>
          msg.commentId === commentId ? { ...msg, ...updatedComment } : msg
        )
      );

      // 스냅샷 업데이트 - comments가 없는 경우 처리
      if (snapshots) {
        const updatedSnapshots = snapshots.map((snapshot) => {
          if (snapshot.id === parseInt(snapshotId)) {
            const updatedComments = snapshot.comments
              ? snapshot.comments.map((comment) =>
                  comment.commentId === commentId
                    ? { ...comment, ...updatedComment }
                    : comment
                )
              : []; // comments가 없으면 빈 배열 사용

            return {
              ...snapshot,
              comments: updatedComments,
            };
          }
          return snapshot;
        });

        onSnapshotsUpdate?.(updatedSnapshots);
      }

      setEditingId(null);
      showAlert("댓글이 수정되었습니다.", "success");
    } catch (error) {
      console.error("Edit error:", error);
      showAlert("서버 연결 오류가 발생했습니다.", "error");
    }
  };

  /**
   * 댓글 삭제를 처리하는 함수
   * @param {number} commentId - 삭제할 댓글 ID
   */
  const handleDelete = async (commentId) => {
    try {
      const response = await fetch(
        `/api/rooms/${roomId}/snapshots/${snapshotId}/comments/${commentId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showAlert(data.error || "댓글 삭제에 실패했습니다.", "error");
        return;
      }

      // 메시지 목록에서 삭제
      setMessages((prev) => prev.filter((msg) => msg.commentId !== commentId));

      // 스냅샷 상태 업데이트
      const updatedSnapshots = snapshots.map((snapshot) => {
        if (snapshot.id === parseInt(snapshotId)) {
          return {
            ...snapshot,
            comments: snapshot.comments.filter(
              (comment) => comment.commentId !== commentId
            ),
          };
        }
        return snapshot;
      });

      onSnapshotsUpdate(updatedSnapshots);
      showAlert(data.message || "댓글이 삭제되었습니다.", "success");
    } catch (error) {
      showAlert("서버 연결 오류가 발생했습니다.", "error");
    }
  };

  /**
   * 질문 해결 여부를 토글하는 함수
   * @param {number} commentId - 질문 ID
   * @param {boolean} solved - 해결 여부
   */
  const handleToggleSolved = async (commentId, solved) => {
    try {
      const response = await fetch(
        `/api/rooms/${roomId}/snapshots/${snapshotId}/comments/${commentId}/resolve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ solved }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showAlert(data.error || "해결 상태 변경에 실패했습니다.", "error");
        return;
      }

      // 메시지 목록 업데이트
      setMessages((prev) =>
        prev.map((msg) =>
          msg.commentId === commentId
            ? { ...msg, solved: data.data.solved }
            : msg
        )
      );

      // 스냅샷 상태 업데이트
      const updatedSnapshots = snapshots.map((snapshot) => {
        if (snapshot.id === parseInt(snapshotId)) {
          return {
            ...snapshot,
            comments: snapshot.comments.map((comment) =>
              comment.commentId === commentId
                ? { ...comment, solved: data.data.solved }
                : comment
            ),
          };
        }
        return snapshot;
      });

      onSnapshotsUpdate(updatedSnapshots);
      showAlert(
        solved
          ? "질문이 해결 완료되었습니다."
          : "질문이 미해결로 변경되었습니다.",
        "success"
      );
    } catch (error) {
      showAlert("서버 연결 오류가 발생했습니다.", "error");
    }
  };

  return (
    <div className="h-full p-2 flex flex-col text-gray-800 dark:text-gray-100">
      {/* 패널 헤더 */}
      <div className="group p-2.5 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="text-blue-500">
            <FaQuestion size={15} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-medium text-blue-500">Questions</span>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {messages.length} questions
            </div>
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <div className="h-px bg-gray-200 dark:bg-gray-800 my-4" />

      {/* 메시지 목록: 질문과 답변을 계층 구조로 표시 */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.commentId} className="p-1 space-y-3">
            <MessageItem
              message={message}
              onReply={handleReply}
              replyingTo={replyingTo}
              handleSubmit={handleSubmit}
              onEdit={handleEdit}
              editingId={editingId}
              onDelete={handleDelete}
              onToggleSolved={handleToggleSolved}
            />
            {message.replies.map((reply) => (
              <MessageItem
                key={reply.commentId}
                message={reply}
                isReply={true}
                onReply={handleReply}
                replyingTo={replyingTo}
                handleSubmit={handleSubmit}
                onEdit={handleEdit}
                editingId={editingId}
                onDelete={handleDelete}
                onToggleSolved={handleToggleSolved}
              />
            ))}
          </div>
        ))}
      </div>

      {/* 입력 폼 */}
      <div className="mt-4 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 px-3 py-2 rounded-lg text-sm border transition-colors
              bg-white dark:bg-gray-700/50 
              border-gray-200 dark:border-gray-600 
              text-gray-900 dark:text-gray-200 
              focus:border-blue-400 dark:focus:border-blue-500/50"
          />
          <button
            type="submit"
            className={`
              p-2 rounded-lg transition-colors
              ${
                newQuestion.trim()
                  ? "bg-blue-50 dark:bg-blue-500/20 text-blue-500 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/30"
                  : "opacity-50 cursor-not-allowed"
              }
            `}
            disabled={!newQuestion.trim()}
            title="Send question"
          >
            <FaPaperPlane size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
