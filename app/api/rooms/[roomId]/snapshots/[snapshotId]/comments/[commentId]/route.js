import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  try {
    const { commentId } = await params;
    const body = await request.json();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    console.log("Updating comment:", {
      commentId,
      content: body.content,
    });

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

    console.log("Update response status:", response.status);
    const data = await response.json();
    console.log("Update response data:", data);

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "댓글 수정에 실패했습니다." },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Comment update error:", error);
    return NextResponse.json(
      { error: "서버 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { commentId } = await params;
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    console.log("Deleting comment:", commentId);

    const response = await fetch(`${API_URL}/api/v1/comments/${commentId}`, {
      method: "DELETE",
    });

    const data = await response.json();
    console.log("Delete response:", data);

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "댓글 삭제에 실패했습니다." },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "서버 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}
