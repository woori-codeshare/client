"use client";

import { useState, useEffect, useCallback } from "react";
import { FaVoteYea } from "react-icons/fa";
import { useAlert } from "@/contexts/alert-context";

const POLLING_INTERVAL = 1000; // 1초마다 폴링

const VOTE_TYPES = {
  POSITIVE: {
    text: "O 이해했습니다",
    styles: {
      bg: "bg-green-50 dark:bg-green-500/10",
      hover: "hover:bg-green-100 dark:hover:bg-green-500/20",
      border: "border-green-200 dark:border-green-500/20",
      text: "text-green-600 dark:text-green-400",
      ring: "ring-green-500",
      button: "bg-green-600 hover:bg-green-700 text-white",
    },
  },
  NEUTRAL: {
    text: "△ 조금 더 설명이 필요합니다",
    styles: {
      bg: "bg-yellow-50 dark:bg-yellow-500/10",
      hover: "hover:bg-yellow-100 dark:hover:bg-yellow-500/20",
      border: "border-yellow-200 dark:border-yellow-500/20",
      text: "text-yellow-600 dark:text-yellow-400",
      ring: "ring-yellow-500",
      button: "bg-yellow-500 hover:bg-yellow-600 text-white",
    },
  },
  NEGATIVE: {
    text: "✕ 전혀 이해하지 못했습니다",
    styles: {
      bg: "bg-red-50 dark:bg-red-500/10",
      hover: "hover:bg-red-100 dark:hover:bg-red-500/20",
      border: "border-red-200 dark:border-red-500/20",
      text: "text-red-600 dark:text-red-400",
      ring: "ring-red-500",
      button: "bg-red-600 hover:bg-red-700 text-white",
    },
  },
};

function useInterval(callback, delay) {
  useEffect(() => {
    const intervalId = setInterval(callback, delay);
    return () => clearInterval(intervalId);
  }, [callback, delay]);
}

const getStorageKey = (roomId, snapshotId) => `vote_${roomId}_${snapshotId}`;

// 학습 내용 이해도를 체크하기 위한 투표 패널 컴포넌트
export default function VotingPanel({ roomId, snapshotId }) {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [voteResults, setVoteResults] = useState(null);
  const [selectedVote, setSelectedVote] = useState(null);

  // snapshotId가 변경될 때마다 상태 초기화
  useEffect(() => {
    setUserVote(null);
    setVoteResults(null);

    if (roomId && snapshotId) {
      const storedVote = localStorage.getItem(
        getStorageKey(roomId, snapshotId)
      );
      if (storedVote) {
        const voteData = JSON.parse(storedVote);
        setUserVote(voteData.voteType);
      }
    }
  }, [roomId, snapshotId]);

  const fetchVoteResults = useCallback(async () => {
    if (!snapshotId) {
      setVoteResults(null);
      return;
    }

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
      setVoteResults(null);
    }
  }, [roomId, snapshotId]);

  // Storage Event 리스너 추가
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === getStorageKey(roomId, snapshotId) && e.newValue) {
        const voteData = JSON.parse(e.newValue);
        setUserVote(voteData.voteType);
        fetchVoteResults(); // 투표 결과도 함께 갱신
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [roomId, snapshotId, fetchVoteResults]);

  // 초기 데이터 로드 및 이전 투표 확인
  useEffect(() => {
    fetchVoteResults();
  }, [fetchVoteResults, snapshotId]);

  // 폴링 설정
  useInterval(fetchVoteResults, POLLING_INTERVAL);

  const handleVoteClick = (voteType) => {
    if (loading || userVote) return;
    // 같은 투표를 다시 클릭하면 선택 취소
    setSelectedVote(selectedVote === voteType ? null : voteType);
  };

  const handleConfirmVote = async (voteType) => {
    if (loading || userVote) return;

    const storageKey = getStorageKey(roomId, snapshotId);
    const previousVote = localStorage.getItem(storageKey);
    if (previousVote) {
      showAlert("이미 투표하셨습니다.", "error");
      setSelectedVote(null);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/rooms/${roomId}/snapshots/${snapshotId}/votes/${snapshotId}/cast`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ voteType }),
        }
      );

      if (!response.ok) throw new Error("투표에 실패했습니다.");

      const voteData = {
        voteType,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(storageKey, JSON.stringify(voteData));

      setUserVote(voteType);
      await fetchVoteResults();
      showAlert("투표가 완료되었습니다.", "success");
    } catch (error) {
      showAlert(error.message, "error");
    } finally {
      setLoading(false);
      setSelectedVote(null);
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
      <div className="space-y-4 mt-4">
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          현재 내용을 이해하셨나요?
        </p>

        <div className="grid grid-cols-1 gap-2">
          {Object.entries(VOTE_TYPES).map(([type, config]) => (
            <button
              key={type}
              onClick={() => handleVoteClick(type)}
              disabled={loading || userVote}
              className={`p-3 rounded-lg transition-colors text-left
                ${config.styles.bg} ${config.styles.hover} border ${
                config.styles.border
              }
                ${config.styles.text} 
                ${selectedVote === type ? `ring-2 ${config.styles.ring}` : ""}
                ${loading || userVote ? "opacity-50" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{config.text}</span>
                <span className="text-xs opacity-75">
                  {voteResults?.[type] || 0} votes
                  {totalVotes > 0 &&
                    ` (${getVotePercentage(voteResults?.[type])}%)`}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* 확인 버튼 섹션 - 선택했을 때만 표시 */}
        {selectedVote && (
          <div className="mt-6 animate-fade-in">
            <div className="flex items-center justify-between border-t pt-4 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                선택: {VOTE_TYPES[selectedVote].text}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedVote(null)}
                  disabled={loading}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 
                    dark:text-gray-400 dark:hover:text-gray-200 transition-colors
                    disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  onClick={() => handleConfirmVote(selectedVote)}
                  disabled={loading}
                  className={`px-4 py-2 text-sm rounded-md transition-colors
                    ${VOTE_TYPES[selectedVote].styles.button}
                    disabled:opacity-50`}
                >
                  투표하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 투표 완료 메시지 */}
        {userVote && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              투표 완료: {VOTE_TYPES[userVote].text}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
