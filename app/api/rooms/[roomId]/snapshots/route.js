import { NextResponse } from "next/server";

/**
 * 코드 스냅샷 조회 요청
 */
export async function GET(request, { params }) {
  try {
    const { roomId } = await params;

    // console.log("스냅샷 조회 요청...");

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/api/v1/snapshots/${roomId}/`, {
      headers: {
        accept: "application/json;charset=UTF-8",
      },
    });

    const data = await response.json();
    // console.log("스냅샷 조회 결과:", data);

    if (!response.ok) {
      return NextResponse.json(
        { error: data.errorMessage || "스냅샷 조회에 실패했습니다." },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: "스냅샷을 조회하는데 성공했습니다.",
      data: data.data,
    });
  } catch (error) {
    console.error("스냅샷 조회 중 에러가 발생했습니다:", error);

    return NextResponse.json(
      { error: "서버 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * 코드 스냅샷 생성 요청
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { roomId, title, description, code } = body;

    // console.log("스냅샷 생성 요청...");

    const requestBody = { title, description, code };

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/api/v1/snapshots/${roomId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    // console.log("스냅샷 생성 결과:", data);

    if (!response.ok) {
      return NextResponse.json(
        { error: data.errorMessage || "스냅샷 생성에 실패했습니다." },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: "스냅샷이 성공적으로 생성되었습니다.",
      data: data.data,
    });
  } catch (error) {
    console.error("스냅샷 생성 중 에러가 발생했습니다:", error);

    return NextResponse.json(
      { error: "서버 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}
