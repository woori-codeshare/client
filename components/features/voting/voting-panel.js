import { useState, useEffect } from "react";
import { FaVoteYea } from "react-icons/fa";
import { useAlert } from "@/contexts/alert-context";

// 학습 내용 이해도를 체크하기 위한 투표 패널 컴포넌트
export default function VotingPanel({ roomId, snapshotId }) {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [voteResults, setVoteResults] = useState(null);

  // 투표 결과 조회
  const fetchVoteResults = async () => {
    try {
      const response = await fetch(
        `/api/rooms/${roomId}/snapshots/${snapshotId}/votes/${snapshotId}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setVoteResults(data.data.voteCounts);
    } catch (error) {
      console.error("투표 결과 조회 실패:", error);
    }
  };

  // 컴포넌트 마운트 시 투표 결과 조회
  useEffect(() => {
    if (snapshotId) {
      fetchVoteResults();
    }
  }, [snapshotId]);

  const handleVote = async (voteType) => {
    if (loading || userVote) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/rooms/${roomId}/snapshots/${snapshotId}/votes/${snapshotId}/cast`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ voteType }),
        }
      );

      if (!response.ok) {
        throw new Error("투표에 실패했습니다.");
      }

      setUserVote(voteType);
      setVoteResults((prevResults) => {
        const updatedResults = { ...prevResults };
        updatedResults[voteType] = (updatedResults[voteType] || 0) + 1;
        return updatedResults;
      });

      showAlert("투표가 완료되었습니다.", "success");
    } catch (error) {
      showAlert(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // 전체 투표 수 계산
  const totalVotes = voteResults
    ? Object.values(voteResults).reduce((a, b) => a + b, 0)
    : 0;

  // 투표 비율 계산 함수
  const getVotePercentage = (count) => {
    if (!totalVotes) return 0;
    return Math.round((count / totalVotes) * 100);
  };

  return (
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
            {totalVotes > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {totalVotes} votes total
              </p>
            )}
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
          onClick={() => handleVote("POSITIVE")}
          disabled={loading || userVote}
          className={`w-full bg-green-50 dark:bg-green-500/10 hover:bg-green-100 dark:hover:bg-green-500/20 p-3 rounded-lg 
          transition-colors border border-green-200 dark:border-green-500/20 text-left text-sm flex items-center justify-between text-green-600 dark:text-green-400
          ${userVote === "POSITIVE" ? "ring-2 ring-green-500" : ""}
          ${
            loading || (userVote && userVote !== "POSITIVE") ? "opacity-50" : ""
          }`}
        >
          <span>O 이해했습니다</span>
          <span className="text-xs opacity-75">
            {voteResults?.POSITIVE || 0} votes
            {totalVotes > 0 &&
              ` (${getVotePercentage(voteResults?.POSITIVE)}%)`}
          </span>
        </button>

        {/* 중립적 응답 버튼 */}
        <button
          onClick={() => handleVote("NEUTRAL")}
          disabled={loading || userVote}
          className={`w-full bg-yellow-50 dark:bg-yellow-500/10 hover:bg-yellow-100 dark:hover:bg-yellow-500/20 p-3 rounded-lg 
          transition-colors border border-yellow-200 dark:border-yellow-500/20 text-left text-sm flex items-center justify-between text-yellow-600 dark:text-yellow-400
          ${userVote === "NEUTRAL" ? "ring-2 ring-yellow-500" : ""}
          ${
            loading || (userVote && userVote !== "NEUTRAL") ? "opacity-50" : ""
          }`}
        >
          <span>△ 조금 더 설명이 필요합니다</span>
          <span className="text-xs opacity-75">
            {voteResults?.NEUTRAL || 0} votes
            {totalVotes > 0 && ` (${getVotePercentage(voteResults?.NEUTRAL)}%)`}
          </span>
        </button>

        {/* 부정적 응답 버튼 */}
        <button
          onClick={() => handleVote("NEGATIVE")}
          disabled={loading || userVote}
          className={`w-full bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 p-3 rounded-lg 
          transition-colors border border-red-200 dark:border-red-500/20 text-left text-sm flex items-center justify-between text-red-600 dark:text-red-400
          ${userVote === "NEGATIVE" ? "ring-2 ring-red-500" : ""}
          ${
            loading || (userVote && userVote !== "NEGATIVE") ? "opacity-50" : ""
          }`}
        >
          <span>✕ 전혀 이해하지 못했습니다</span>
          <span className="text-xs opacity-75">
            {voteResults?.NEGATIVE || 0} votes
            {totalVotes > 0 &&
              ` (${getVotePercentage(voteResults?.NEGATIVE)}%)`}
          </span>
        </button>
      </div>
    </div>
  );
}
