/**
 * 방 참가자 관리를 위한 API 라우트
 */

import { NextResponse } from "next/server";

/**
 * 방 참가 요청을 처리합니다.
 *
 * @param {Request} request - HTTP 요청 객체
 * @param {Object} params - URL 매개변수
 * @param {string} params.roomId - 방 UUID
 * @returns {Promise<NextResponse>} JSON 응답
 *
 * @throws {Error} 비밀번호가 일치하지 않는 경우
 * @throws {Error} 서버 에러 발생 시
 */
export async function POST(request, { params }) {
  try {
    const { roomId } = params;
    const { searchParams } = new URL(request.url);
    const password = searchParams.get("password");
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(
      `${API_URL}/api/v1/rooms/enter/${roomId}?password=${password}`,
      {
        method: "POST",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.errorMessage || "방 입장에 실패했습니다.",
          code: data.errorCode,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "서버 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}
