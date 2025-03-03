import { useState } from "react";
import Modal from "../common/modal";

const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 255;

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
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    if (newTitle.length <= MAX_TITLE_LENGTH) {
      setTitle(newTitle);
      setTitleError("");
    } else {
      setTitleError(`제목은 ${MAX_TITLE_LENGTH}자를 초과할 수 없습니다.`);
    }
  };

  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;
    if (newDescription.length <= MAX_DESCRIPTION_LENGTH) {
      setDescription(newDescription);
      setDescriptionError("");
    } else {
      setDescriptionError(
        `설명은 ${MAX_DESCRIPTION_LENGTH}자를 초과할 수 없습니다.`
      );
    }
  };

  /**
   * 스냅샷 생성 제출 처리
   * 제목이 비어있지 않은 경우에만 처리
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    if (
      title.length > MAX_TITLE_LENGTH ||
      description.length > MAX_DESCRIPTION_LENGTH
    ) {
      return;
    }

    onCreateSnapshot({
      title,
      description,
    });

    // 폼 초기화 및 모달 닫기
    setTitle("");
    setDescription("");
    setTitleError("");
    setDescriptionError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-6">
        Create Snapshot
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 제목 입력 필드 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <span className="text-xs text-gray-400">
              {title.length}/{MAX_TITLE_LENGTH}
            </span>
          </div>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            maxLength={MAX_TITLE_LENGTH}
            className="w-full px-3 py-2.5
              bg-white dark:bg-gray-800 
              border border-gray-300 dark:border-gray-700
              text-gray-900 dark:text-gray-200
              focus:ring-2 focus:ring-blue-500/20
              focus:border-blue-500/50
              rounded-lg transition-colors"
            placeholder="Enter snapshot title"
            required
            autoFocus
          />
          {titleError && (
            <p className="text-xs text-red-500 mt-1">{titleError}</p>
          )}
        </div>

        {/* 설명 입력 필드 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <span className="text-xs text-gray-400">
              {description.length}/{MAX_DESCRIPTION_LENGTH}
            </span>
          </div>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            maxLength={MAX_DESCRIPTION_LENGTH}
            className="w-full px-3 py-2.5
              bg-white dark:bg-gray-800
              border border-gray-300 dark:border-gray-700
              text-gray-900 dark:text-gray-200
              focus:ring-2 focus:ring-blue-500/20
              focus:border-blue-500/50
              rounded-lg transition-colors
              h-32 resize-none"
            placeholder="Enter snapshot description"
          />
          {descriptionError && (
            <p className="text-xs text-red-500 mt-1">{descriptionError}</p>
          )}
        </div>

        {/* 버튼 그룹 */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg
              bg-gray-50 hover:bg-gray-100
              dark:bg-gray-700/50 dark:hover:bg-gray-700
              text-gray-700 dark:text-gray-300
              border border-gray-200 dark:border-gray-600
              transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={!!titleError || !!descriptionError}
            className="px-4 py-2 rounded-lg
              bg-blue-500 hover:bg-blue-600
              text-white
              transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
}
