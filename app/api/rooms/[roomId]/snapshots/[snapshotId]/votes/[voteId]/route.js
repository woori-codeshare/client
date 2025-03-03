import { NextResponse } from "next/server";

/**
 * 투표 결과 조회 요청
 */
export async function GET(request, { params }) {
  try {
    const { voteId } = await params;

    // console.log("투표 결과 조회 요청...");

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/api/v1/votes/${voteId}/results`, {
      headers: {
        accept: "application/json;charset=UTF-8",
      },
    });

    const data = await response.json();
    // console.log("투표 결과 조회 요청 결과:", data);

    if (!response.ok) {
      return NextResponse.json(
        { error: data.errorMessage || "투표 결과 조회에 실패했습니다." },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: "투표 결과 조회에 성공했습니다.",
      data: data.data,
    });
  } catch (error) {
    console.error("투표 결과 조회 중 에러가 발생했습니다:", error);

    return NextResponse.json(
      { error: "서버 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}
