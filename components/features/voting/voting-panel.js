import { FaVoteYea } from "react-icons/fa";

// 학습 내용 이해도를 체크하기 위한 투표 패널 컴포넌트
export default function VotingPanel() {
  return (
    // 메인 패널 컨테이너
    <div
      className="panel p-4 rounded-lg 
      bg-white dark:bg-gray-900
      border border-blue-200 dark:border-blue-500/20
      shadow-lg shadow-blue-500/5"
    >
      {/* 헤더 섹션: 투표 아이콘과 제목 표시 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaVoteYea className="text-blue-400" />
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Active Vote
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              4 votes total
            </p>
          </div>
        </div>
      </div>

      {/* 투표 옵션 섹션 */}
      <div className="space-y-3 mt-4">
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          현재 내용을 이해하셨나요?
        </p>
        {/* 긍정적 응답 버튼 */}
        <button
          className="w-full bg-green-50 dark:bg-green-500/10 hover:bg-green-100 dark:hover:bg-green-500/20 p-3 rounded-lg 
          transition-colors border border-green-200 dark:border-green-500/20 text-left text-sm flex items-center justify-between text-green-600 dark:text-green-400"
        >
          <span>O 이해했습니다</span>
          <span className="text-xs opacity-75">3 votes</span>
        </button>
        {/* 중립적 응답 버튼 */}
        <button
          className="w-full bg-yellow-50 dark:bg-yellow-500/10 hover:bg-yellow-100 dark:hover:bg-yellow-500/20 p-3 rounded-lg 
          transition-colors border border-yellow-200 dark:border-yellow-500/20 text-left text-sm flex items-center justify-between text-yellow-600 dark:text-yellow-400"
        >
          <span>△ 조금 더 설명이 필요합니다</span>
          <span className="text-xs opacity-75">1 vote</span>
        </button>
        {/* 부정적 응답 버튼 */}
        <button
          className="w-full bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 p-3 rounded-lg 
          transition-colors border border-red-200 dark:border-red-500/20 text-left text-sm flex items-center justify-between text-red-600 dark:text-red-400"
        >
          <span>✕ 전혀 이해하지 못했습니다</span>
          <span className="text-xs opacity-75">0 votes</span>
        </button>
      </div>
    </div>
  );
}
