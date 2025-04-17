import { NextRequest, NextResponse } from "next/server";

interface ParticipantParams {
  params: {
    roomId: string;
  };
}

/**
 * 방 참가 응답 DTO
 */
export interface EnterRoomResponseDTO {
  roomId: number;
  uuid: string;
  title: string;
  createdAt: string;
}

/**
 * 방 참가 요청
 */
export async function POST(
  request: NextRequest,
  { params }: ParticipantParams
) {
  try {
    const { roomId } = await params;
    const { searchParams } = new URL(request.url);
    const password = searchParams.get("password");

    console.log("방 참가 요청...");

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(
      `${API_URL}/api/v1/rooms/enter/${roomId}?password=${password}`,
      {
        method: "POST",
      }
    );

    const data = await response.json();
    console.log("방 참가 요청 결과:", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.errorMessage || "방 입장에 실패했습니다.",
          code: data.errorCode,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: "방에 성공적으로 참가되었습니다.",
      data: data.data as EnterRoomResponseDTO,
    });
  } catch (error) {
    console.error("방 참가 중 에러가 발생했습니다:", error);

    return NextResponse.json(
      { error: "서버 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}
