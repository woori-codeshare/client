import { NextResponse } from "next/server";

/**
 * 방 생성 요청
 */
export async function POST(request) {
  try {
    const body = await request.json();

    console.log("방 생성 요청...");

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/api/v1/rooms/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("방 생성 요청 결과:", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.errorMessage || "방 생성에 실패했습니다.",
          code: data.errorCode,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: "방이 성공적으로 생성되었습니다.",
      data: data.data,
    });
  } catch (error) {
    console.error("방 생성 중 에러가 발생했습니다:", error);

    return NextResponse.json(
      { error: "서버 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}
