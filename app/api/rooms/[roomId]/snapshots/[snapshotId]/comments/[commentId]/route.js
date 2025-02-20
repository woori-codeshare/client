import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  try {
    const { commentId } = await params;
    const body = await request.json();

    console.log("댓글 수정 요청...");

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(
      `${API_URL}/api/v1/comments/${commentId}/update`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: body.content }),
      }
    );

    const data = await response.json();
    console.log("댓글 수정 요청 결과:", data);

    if (!response.ok) {
      return NextResponse.json(
        { error: data.errorMessage || "댓글 수정에 실패했습니다." },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: "성공적으로 수정되었습니다.",
      data: data.data,
    });
  } catch (error) {
    console.error("댓글 수정 중 에러가 발생했습니다:", error);

    return NextResponse.json(
      { error: "서버 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { commentId } = await params;

    console.log("댓글 삭제 요청...");

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/api/v1/comments/${commentId}`, {
      method: "DELETE",
    });

    const data = await response.json();
    console.log("댓글 삭제 요청 결과:", data);

    if (!response.ok) {
      return NextResponse.json(
        { error: data.errorMessage || "댓글 삭제에 실패했습니다." },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: "성공적으로 삭제되었습니다.",
      data: data.data,
    });
  } catch (error) {
    console.error("댓글 삭제 중 에러가 발생했습니다:", error);

    return NextResponse.json(
      { error: "서버 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}
