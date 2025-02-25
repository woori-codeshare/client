import { useState } from "react";
import Modal from "@/components/common/modal";

export default function RoomEnterModal({ isOpen, onClose, onSubmit }) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} allowBackdropClose={false} closeButton={false}>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-4">
        Enter Room
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2
              bg-white dark:bg-gray-800 
              border border-gray-300 dark:border-gray-700
              text-gray-900 dark:text-gray-200
              focus:ring-2 focus:ring-blue-500/20
              focus:border-blue-500/50
              rounded-lg transition-colors"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 rounded-lg
            bg-blue-50 hover:bg-blue-100
            dark:bg-blue-500/20 dark:hover:bg-blue-500/30
            text-blue-600 dark:text-blue-400
            border border-blue-200 dark:border-blue-500/20
            transition-colors"
        >
          Enter
        </button>
      </form>
    </Modal>
  );
}
