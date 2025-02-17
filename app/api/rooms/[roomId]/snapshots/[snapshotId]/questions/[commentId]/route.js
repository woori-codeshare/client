import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  try {
    const { commentId } = await params;
    const body = await request.json();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // API 응답 로깅 추가
    console.log("Updating comment:", commentId, "with content:", body.content);

    const response = await fetch(
      `${API_URL}/api/v1/comments/${commentId}/update`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: body.content }),
        cache: "no-store", // 캐시 비활성화
      }
    );

    // 응답 로깅 추가
    console.log("API Response status:", response.status);
    const data = await response.json();
    console.log("API Response data:", data);

    if (!response.ok) {
      // 더 자세한 에러 메시지 반환
      return NextResponse.json(
        {
          error: data.message || "댓글 수정에 실패했습니다.",
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      code: data.code || "SUCCESS",
      message: data.message || "댓글이 수정되었습니다.",
      data: data.data,
    });
  } catch (error) {
    // 에러 로깅 추가
    console.error("Error updating comment:", error);
    return NextResponse.json(
      {
        error: "서버 에러가 발생했습니다.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
