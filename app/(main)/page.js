"use client";

import { useState } from "react";
import { FaQuestion, FaVoteYea, FaHistory } from "react-icons/fa";
import CodeEditor from "../../components/editor/code-editor";
import QuestionsPanel from "../../components/features/questions/questions-panel";
import { INITIAL_CODE } from "@/constants/initial-data";
import RoomCreateModal from "../../components/features/room/room-create-modal";
import { useRouter } from "next/navigation";
import { INITIAL_WIDTHS } from "@/constants/panel-config";

/**
 * 메인 페이지 컴포넌트
 * 코드 에디터와 사이드 패널들을 관리하는 최상위 컴포넌트
 */
export default function Home() {
    const router = useRouter();
    const [showCreateModal, setShowCreateModal] = useState(true);
    const [code, setCode] = useState(INITIAL_CODE);

    const handleCreateRoom = () => {
        // TODO: API 호출하여 방 생성
        const roomId = "fb1dfb89-393f-4e9d-9d62-3b2af9afe788"; // API에서 받아올 실제 UUID
        router.push(`/${roomId}`);
    };

    return (
        <>
            {/* 기존 UI를 블러 처리 */}
            <div
                className={`${
                    showCreateModal ? "filter blur-sm pointer-events-none" : ""
                }`}
            >
                <div className="flex h-[calc(100vh-64px)]">
                    {/* 좌측 아이콘 사이드바 */}
                    <div className="w-12 h-full bg-gray-900 border-r border-gray-800 flex-shrink-0">
                        <div className="flex flex-col items-center py-4">
                            <button className="p-3 text-gray-400" disabled>
                                <FaHistory size={18} />
                            </button>
                        </div>
                    </div>

                    {/* 메인 컨텐츠 (코드 에디터) */}
                    <div className="flex-1">
                        <div className="p-2 h-full">
                            <CodeEditor
                                code={code}
                                onCodeChange={setCode}
                                isDisabled={showCreateModal}
                            />
                        </div>
                    </div>

                    {/* 우측 패널 영역 */}
                    <div className="relative flex">
                        {/* Questions 패널 */}
                        <div
                            className="bg-gray-900 border-l border-gray-800"
                            style={{ width: `${INITIAL_WIDTHS.RIGHT}px` }}
                        >
                            <div className="p-4 h-full">
                                <QuestionsPanel />
                            </div>
                        </div>

                        {/* 우측 아이콘 사이드바 */}
                        <div className="w-12 bg-gray-900 border-l border-gray-800">
                            <div className="flex flex-col items-center py-4">
                                <button
                                    className="p-3 mb-2 text-blue-400 bg-blue-500/20"
                                    disabled
                                >
                                    <FaQuestion size={18} />
                                </button>
                                <button className="p-3 text-gray-400" disabled>
                                    <FaVoteYea size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 방 생성 모달 */}
            <RoomCreateModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateRoom}
            />
        </>
    );
}

