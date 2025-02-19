import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  try {
    const { commentId } = params;
    const body = await request.json();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    console.log("Updating comment resolve status:", {
      commentId,
      solved: body.solved,
    });

    const response = await fetch(
      `${API_URL}/api/v1/comments/${commentId}/resolve`,
      {
        method: "PATCH", // 백엔드 API 스펙에 맞춰 PATCH 메서드 사용
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ solved: body.solved }),
      }
    );

    const data = await response.json();
    console.log("Resolve status update response:", data);

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "해결 상태 변경에 실패했습니다." },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating resolve status:", error);
    return NextResponse.json(
      { error: "서버 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}
