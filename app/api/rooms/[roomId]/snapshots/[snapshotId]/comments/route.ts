import { NextRequest, NextResponse } from "next/server";

interface CommentParams {
  params: {
    roomId: string;
    snapshotId: string;
  };
}

/**
 * 댓글 생성 요청 DTO
 */
export interface CreateCommentRequestDTO {
  content: string;
  parentCommentId?: number | null;
}

/**
 * 댓글 생성 응답 DTO
 */
export interface CreateCommentResponseDTO {
  commentId: number;
  parentCommentId: number | null;
  snapshotId: number;
  content: string;
}

/**
 * 댓글 목록 조회 응답 DTO
 */
export interface CommentResponseDTO {
  commentId: number;
  parentCommentId: number | null;
  content: string;
  solved: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 댓글 조회 요청
 */
export async function GET(request: NextRequest, { params }: CommentParams) {
  try {
    const { snapshotId } = await params;
    console.log("댓글 조회 요청...");

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/api/v1/comments/${snapshotId}`, {
      headers: {
        accept: "application/json",
      },
    });

    const data = await response.json();
    console.log("댓글 조회 결과:", data);

    if (!response.ok) {
      return NextResponse.json(
        { error: data.errorMessage || "댓글 조회에 실패했습니다." },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: "성공적으로 조회되었습니다.",
      data: data.data as CommentResponseDTO[],
    });
  } catch (error) {
    console.error("댓글 조회 중 에러가 발생했습니다:", error);

    return NextResponse.json(
      { error: "서버 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * 질문/댓글 작성 요청
 */
export async function POST(request: NextRequest, { params }: CommentParams) {
  try {
    const { snapshotId } = await params;
    const body = (await request.json()) as CreateCommentRequestDTO;

    console.log("질문/댓글 작성 요청...");

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(
      `${API_URL}/api/v1/comments/${snapshotId}/new`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: body.content,
          parentCommentId: body.parentCommentId || null,
        }),
      }
    );

    const data = await response.json();
    console.log("질문/댓글 작성 요청 결과:", data);

    if (!response.ok) {
      return NextResponse.json(
        { error: data.errorMessage || "질문 및 답글 작성에 실패했습니다." },
        { status: response.status }
      );
    }

    // 질문인지 답변인지에 따라 다른 성공 메시지 반환
    const successMessage = body.parentCommentId
      ? "답변이 성공적으로 작성되었습니다."
      : "질문이 성공적으로 작성되었습니다.";

    return NextResponse.json({
      message: successMessage,
      data: data.data as CreateCommentResponseDTO,
    });
  } catch (error) {
    console.error("질문/댓글 작성 중 에러가 발생했습니다:", error);

    return NextResponse.json(
      { error: "서버 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}
