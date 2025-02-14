import { useState } from "react";
import Modal from "../common/modal";

/**
 * 스냅샷 생성을 위한 모달 컴포넌트
 * @param {Object} props
 * @param {boolean} props.isOpen - 모달 표시 여부
 * @param {Function} props.onClose - 모달 닫기 핸들러
 * @param {Function} props.onCreateSnapshot - 스냅샷 생성 완료 핸들러
 */
export default function CreateSnapshotModal({
  isOpen,
  onClose,
  onCreateSnapshot,
}) {
  // 스냅샷 입력 폼 상태 관리
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  /**
   * 스냅샷 생성 제출 처리
   * 제목이 비어있지 않은 경우에만 처리
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    onCreateSnapshot({
      title,
      description,
    });

    // 폼 초기화 및 모달 닫기
    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeButton={true}>
      {/* 모달 제목 */}
      <h2 className="text-xl font-medium mb-4">Create Snapshot</h2>

      {/* 스냅샷 생성 폼 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 제목 입력 필드 */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
            placeholder="Enter snapshot title..."
          />
        </div>

        {/* 설명 입력 필드 */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm h-24 resize-none"
            placeholder="Enter snapshot description..."
          />
        </div>

        {/* 버튼 그룹 */}
        <div className="flex justify-end gap-3">
          {/* 취소 버튼 */}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-gray-300"
          >
            Cancel
          </button>

          {/* 스냅샷 생성 버튼 */}
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"
          >
            Create Snapshot
          </button>
        </div>
      </form>
    </Modal>
  );
}
