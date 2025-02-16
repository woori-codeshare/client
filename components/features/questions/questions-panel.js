import { useState } from "react";
import { FaQuestion, FaPaperPlane } from "react-icons/fa";
import MessageItem from "./message-item";
import { INITIAL_MESSAGES } from "@/constants/initial-data";

/**
 * 질문과 답변을 관리하는 패널 컴포넌트
 * 학생들의 질문과 강사의 답변을 표시하고 관리하는 메인 컴포넌트
 */
export default function QuestionsPanel({ roomId, snapshotId }) {
  // 새로운 질문 입력을 관리하는 상태
  const [newQuestion, setNewQuestion] = useState("");

  // 현재 답변 작성 중인 질문을 추적하는 상태
  // null이면 답변 작성 중이 아님
  // { id: number, text: string }와 같은 형태로 저장
  const [replyingTo, setReplyingTo] = useState(null);

  // 전체 메시지(질문/답변) 목록을 관리하는 상태
  // INITIAL_MESSAGES는 초기 더미 데이터 (실제 환경에서는 API 호출로 대체)
  const [messages, setMessages] = useState(INITIAL_MESSAGES);

  /**
   * 답변 작성 모드를 토글하는 함수
   * @param {number|Object} messageData - 답변할 메시지의 ID 또는 답변 데이터
   *   - number: 최초 답변 시작 시
   *   - Object: 답변 내용 업데이트 시 ({ id, text })
   */
  const handleReply = (messageData) => {
    const isInitialReply = typeof messageData === "number";
    setReplyingTo(isInitialReply ? { id: messageData, text: "" } : messageData);
  };

  /**
   * 새로운 메시지(질문/답변) 객체를 생성하는 헬퍼 함수
   * @param {string} text - 메시지 내용
   * @returns {Object} 생성된 메시지 객체
   */
  const createNewMessage = (text) => ({
    id: Date.now(), // 임시 ID 생성 (실제는 서버에서 생성)
    text: text.trim(),
    timestamp: new Date(),
    user: { name: "Student" }, // 실제는 인증된 사용자 정보 사용
    replies: [], // 답변 배열 초기화
  });

  /**
   * 질문 또는 답변 제출을 처리하는 함수
   * @param {Event} e - 폼 제출 이벤트 객체
   * @param {number|null} parentId - 답변의 경우 부모 질문 ID, 새 질문은 null
   */
  const handleSubmit = (e, parentId = null) => {
    e.preventDefault();

    // 답변인지 새 질문인지에 따라 다른 텍스트 참조
    const text = parentId ? replyingTo?.text : newQuestion;
    if (!text?.trim()) return; // 빈 내용 제출 방지

    const newMessage = createNewMessage(text);

    if (parentId) {
      // 기존 질문에 대한 답변 추가
      setMessages(
        messages.map((msg) =>
          msg.id === parentId
            ? { ...msg, replies: [...msg.replies, newMessage] }
            : msg
        )
      );
      setReplyingTo(null); // 답변 작성 모드 종료
    } else {
      // 새로운 질문 추가
      setMessages([...messages, newMessage]);
      setNewQuestion(""); // 입력 폼 초기화
    }
  };

  return (
    <div className="panel flex flex-col h-full">
      {/* 패널 헤더: 제목과 질문 개수 표시 */}
      <div className="flex items-center gap-3">
        <FaQuestion className="text-blue-400" />
        <div>
          <h2 className="text-lg font-medium">Questions</h2>
          <p className="text-xs text-gray-400">{messages.length} questions</p>
        </div>
      </div>

      {/* 메시지 목록: 질문과 답변을 계층 구조로 표시 */}
      <div className="flex-1 space-y-4 mt-4 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className="space-y-3">
            {/* 질문 메시지 컴포넌트 */}
            <MessageItem
              message={message}
              onReply={handleReply}
              replyingTo={replyingTo}
              handleSubmit={handleSubmit}
            />
            {/* 해당 질문에 대한 답변 목록 */}
            {message.replies.map((reply) => (
              <MessageItem
                key={reply.id}
                message={reply}
                isReply={true}
                onReply={handleReply}
                replyingTo={replyingTo}
                handleSubmit={handleSubmit}
              />
            ))}
          </div>
        ))}
      </div>

      {/* 새 질문 입력 폼 */}
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="p-2 text-blue-400 hover:text-blue-300 disabled:text-gray-600"
          disabled={!newQuestion.trim()} // 빈 질문 제출 방지
          title="Send question"
        >
          <FaPaperPlane size={16} />
        </button>
      </form>
    </div>
  );
}
