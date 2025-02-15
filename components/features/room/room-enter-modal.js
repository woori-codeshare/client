import { useState } from "react";
import Modal from "@/components/common/modal";

export default function RoomEnterModal({ isOpen, onClose, onSubmit }) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} allowBackdropClose={false}>
      <h2 className="text-xl font-semibold text-gray-200 mb-4">방 입장</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
        >
          입장하기
        </button>
      </form>
    </Modal>
  );
}
