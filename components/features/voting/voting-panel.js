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
    },
  },
};

function useInterval(callback, delay) {
  useEffect(() => {
    const intervalId = setInterval(callback, delay);
    return () => clearInterval(intervalId);
  }, [callback, delay]);
}

// 학습 내용 이해도를 체크하기 위한 투표 패널 컴포넌트
export default function VotingPanel({ roomId, snapshotId }) {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [voteResults, setVoteResults] = useState(null);

  // snapshotId가 변경될 때마다 상태 초기화
  useEffect(() => {
    setUserVote(null);
    setVoteResults(null);

    // 새로운 스냅샷의 이전 투표 확인
    if (snapshotId) {
      const previousVote = localStorage.getItem(`vote_${snapshotId}`);
      if (previousVote) {
        setUserVote(JSON.parse(previousVote));
      }
    }
  }, [snapshotId]);

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
      if (e.key === `vote_${snapshotId}` && e.newValue) {
        setUserVote(JSON.parse(e.newValue));
        fetchVoteResults(); // 투표 결과도 함께 갱신
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [snapshotId, fetchVoteResults]);

  // 초기 데이터 로드 및 이전 투표 확인
  useEffect(() => {
    fetchVoteResults();
  }, [fetchVoteResults, snapshotId]);

  // 폴링 설정
  useInterval(fetchVoteResults, POLLING_INTERVAL);

  const handleVote = async (voteType) => {
    if (loading || userVote) return;

    // 이전 투표 이력 확인
    const previousVote = localStorage.getItem(`vote_${snapshotId}`);
    if (previousVote) {
      showAlert("이미 투표하셨습니다.", "error");
      return;
    }

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

      // 투표 성공 시 로컬 스토리지에 저장
      localStorage.setItem(`vote_${snapshotId}`, JSON.stringify(voteType));

      setUserVote(voteType);
      await fetchVoteResults(); // 투표 후 즉시 결과 갱신

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

        {Object.entries(VOTE_TYPES).map(([type, config]) => (
          <button
            key={type}
            onClick={() => handleVote(type)}
            disabled={loading || userVote}
            className={`w-full ${config.styles.bg} ${
              config.styles.hover
            } p-3 rounded-lg 
            transition-colors border ${
              config.styles.border
            } text-left text-sm flex items-center justify-between ${
              config.styles.text
            }
            ${userVote === type ? `ring-2 ${config.styles.ring}` : ""}
            ${loading || (userVote && userVote !== type) ? "opacity-50" : ""}`}
          >
            <span>{config.text}</span>
            <span className="text-xs opacity-75">
              {voteResults?.[type] || 0} votes
              {totalVotes > 0 &&
                ` (${getVotePercentage(voteResults?.[type])}%)`}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
