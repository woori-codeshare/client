"use client";

import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 페이지 로드 시 현재 테마 상태 확인
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setIsDark(true);
    }
  };

  return (
    <div className="fixed top-4 right-4">
      <button
        onClick={toggleTheme}
        className="w-16 h-8 rounded-full bg-gray-200 dark:bg-gray-700 
          relative transition-colors duration-300 focus:outline-none"
        aria-label="테마 변경"
      >
        {/* 트랙 (배경) */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          {/* 그라데이션 배경 효과 */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-100 
            dark:from-blue-900 dark:to-purple-900 transition-opacity duration-300
            opacity-20 dark:opacity-40"
          />
        </div>

        {/* 슬라이딩 버튼과 아이콘 */}
        <div
          className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md
            transform transition-transform duration-300 flex items-center justify-center
            ${isDark ? "translate-x-9" : "translate-x-1"}`}
        >
          {/* 개별 아이콘 애니메이션 효과 */}
          <div className="relative w-full h-full">
            <div
              className={`absolute inset-0 transition-opacity duration-300 flex items-center justify-center
              ${isDark ? "opacity-0" : "opacity-100"}`}
            >
              <FaSun className="w-3 h-3 text-yellow-500" />
            </div>
            <div
              className={`absolute inset-0 transition-opacity duration-300 flex items-center justify-center
              ${isDark ? "opacity-100" : "opacity-0"}`}
            >
              <FaMoon className="w-3 h-3 text-blue-500" />
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
