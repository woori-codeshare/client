import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  try {
    const { commentId } = await params;
    const body = await request.json();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(
      `${API_URL}/api/v1/comments/${commentId}/resolve`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ solved: body.solved }),
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "해결 상태 변경에 실패했습니다." },
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
