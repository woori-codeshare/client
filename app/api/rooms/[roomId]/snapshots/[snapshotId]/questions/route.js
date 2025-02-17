import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const requestBody = {
      snapshotId: body.snapshotId,
      content: body.content,
      ...(body.parentCommentId
        ? { parentCommentId: body.parentCommentId }
        : {}), // 답글인 경우 부모 댓글 ID 추가
    };

    const response = await fetch(`${API_URL}/api/v1/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "질문 및 답글 작성에 실패했습니다." },
        { status: response.status }
      );
    }

    // 질문인지 답변인지에 따라 다른 성공 메시지 반환
    const successMessage = body.parentCommentId
      ? "답변이 성공적으로 작성되었습니다."
      : "질문이 성공적으로 작성되었습니다.";

    return NextResponse.json({
      message: successMessage,
      data: data.data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "서버 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}
