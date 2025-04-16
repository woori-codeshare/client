import { NextRequest, NextResponse } from "next/server";

interface VoteParams {
  params: {
    roomId: string;
    snapshotId: string;
    voteId: string;
  };
}

/**
 * 투표 타입
 */
export enum VoteType {
  POSITIVE = "POSITIVE",
  NEUTRAL = "NEUTRAL",
  NEGATIVE = "NEGATIVE",
}

/**
 * 투표 진행 요청 DTO
 */
export interface VoteRequestDTO {
  voteType: VoteType;
}

/**
 * 투표 진행 응답 DTO
 */
export interface VoteResponseDTO {
  voteId: number;
  voteType: VoteType;
}

/**
 * 투표 진행 요청
 */
export async function POST(request: NextRequest, { params }: VoteParams) {
  try {
    const { voteId } = await params;
    const body = (await request.json()) as VoteRequestDTO;
    const { voteType } = body;

    // voteType 유효성 검사
    const validVoteTypes = Object.values(VoteType);
    if (!validVoteTypes.includes(voteType)) {
      return NextResponse.json(
        { error: "유효하지 않은 투표 유형입니다." },
        { status: 400 }
      );
    }

    console.log(`투표 진행 요청...`);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/api/v1/votes/${voteId}/cast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json;charset=UTF-8",
      },
      body: JSON.stringify({ voteType }),
    });

    const data = await response.json();
    console.log("투표 진행 결과:", data);

    if (!response.ok) {
      return NextResponse.json(
        { error: data.errorMessage || "투표 진행에 실패했습니다." },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: "투표가 성공적으로 진행되었습니다.",
      data: data.data as VoteResponseDTO,
    });
  } catch (error) {
    console.error("투표 진행 중 에러가 발생했습니다:", error);

    return NextResponse.json(
      { error: "서버 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}
