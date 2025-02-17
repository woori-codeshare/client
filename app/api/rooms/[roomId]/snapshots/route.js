/**
 * 코드 스냅샷 관리를 위한 API 라우트
 */

import { NextResponse } from "next/server";

/**
 * 코드 스냅샷 조회 요청을 처리합니다.
 *
 * @param {Request} request - HTTP 요청 객체
 * @param {Object} params - 라우트 파라미터
 * @returns {Promise<NextResponse>} JSON 응답
 */
export async function GET(request, { params }) {
  try {
    const { roomId } = await params;

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/api/v1/snapshots/${roomId}/`, {
      headers: {
        accept: "application/json;charset=UTF-8",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "스냅샷 조회에 실패했습니다." },
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

/**
 * 코드 스냅샷 생성 요청을 처리합니다.
 *
 * @param {Request} request - HTTP 요청 객체
 * @returns {Promise<NextResponse>} JSON 응답
 *
 * @throws {Error} 필수 데이터 누락 시
 * @throws {Error} 서버 에러 발생 시
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { roomId, title, description, code } = body;

    if (!roomId) {
      return NextResponse.json(
        { error: "roomId가 필요합니다." },
        { status: 400 }
      );
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/api/v1/snapshots/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        accept: "application/json;charset=UTF-8",
      },
      body: JSON.stringify({ roomId, title, description, code }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "스냅샷 생성에 실패했습니다." },
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
