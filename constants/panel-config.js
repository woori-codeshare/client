export const PANEL_CONFIGS = {
  // 질문 및 답변을 관리하는 패널
  QUESTIONS: {
    id: "comments",
    icon: "FaQuestion",
    title: "Questions",
  },

  // 투표 기능을 제공하는 패널
  VOTING: {
    id: "voting",
    icon: "FaVoteYea",
    title: "Voting",
  },

  // 코드 스냅샷 히스토리를 보여주는 패널
  SNAPSHOTS: {
    id: "snapshots",
    icon: "FaHistory",
    title: "Snapshots",
  },
};

export const INITIAL_WIDTHS = {
  // 사이드바 너비 설정
  LEFT: 400, // 좌측 사이드바 기본 너비
  RIGHT: 500, // 우측 사이드바 기본 너비

  // 최소 너비 설정
  MIN_LEFT: 300, // 좌측 사이드바 최소 너비
  MIN_RIGHT: 400, // 우측 패널 최소 너비

  // 최대 너비 비율 (화면 너비 대비)
  MAX_LEFT_RATIO: 0.25, // 좌측 최대 너비 비율
  MAX_RIGHT_RATIO: 0.35, // 우측 최대 너비 비율
};
