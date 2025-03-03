import { NextResponse } from "next/server";

/**
 * 투표 진행 요청
 */
export async function POST(request, { params }) {
  try {
    const { voteId } = await params;
    const body = await request.json();
    const { voteType } = body;

    // voteType 유효성 검사
    const validVoteTypes = ["POSITIVE", "NEUTRAL", "NEGATIVE"];
    if (!validVoteTypes.includes(voteType)) {
      return NextResponse.json(
        { error: "유효하지 않은 투표 유형입니다." },
        { status: 400 }
      );
    }

    // console.log(`투표 진행 요청...`);

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
    // console.log("투표 진행 결과:", data);

    if (!response.ok) {
      return NextResponse.json(
        { error: data.errorMessage || "투표 진행에 실패했습니다." },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: "투표가 성공적으로 진행되었습니다.",
      data: data.data,
    });
  } catch (error) {
    console.error("투표 진행 중 에러가 발생했습니다:", error);

    return NextResponse.json(
      { error: "서버 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}
