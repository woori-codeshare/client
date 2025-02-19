import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    const { snapshotId } = params;
    const body = await request.json();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    console.log("Creating comment:", {
      snapshotId,
      content: body.content,
      parentCommentId: body.parentCommentId || null, // 0 대신 null 사용
    });

    const response = await fetch(
      `${API_URL}/api/v1/comments/${snapshotId}/new`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: body.content,
          parentCommentId: body.parentCommentId || null, // 0 대신 null 사용
        }),
      }
    );

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

export async function GET(request, { params }) {
  try {
    const { snapshotId } = params;
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    console.log("Fetching comments for snapshot:", snapshotId);
    const response = await fetch(`${API_URL}/api/v1/comments/${snapshotId}`, {
      headers: {
        accept: "application/json",
      },
    });

    console.log("Response status:", response.status);
    const data = await response.json();
    console.log("Comments data:", data);

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "댓글 조회에 실패했습니다." },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Comments fetch error:", error);
    return NextResponse.json(
      { error: "서버 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}
