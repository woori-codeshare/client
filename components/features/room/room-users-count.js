import { useState } from "react";
import { FaUsers } from "react-icons/fa";

export default function RoomUsersCount() {
  const [userCount, setUserCount] = useState(0);

  return (
    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
      <FaUsers size={14} className="text-blue-500 dark:text-blue-400" />
      <span className="text-sm font-medium">{userCount}</span>
    </div>
  );
}
