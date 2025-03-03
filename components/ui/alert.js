"use client";

import { useEffect, useState } from "react";

export default function Alert({ message, type = "error" }) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (message) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!shouldRender) return null;

  return (
    <div
      className={`
        fixed top-0 left-1/2 transform -translate-x-1/2 z-50
        transition-all duration-300 ease-in-out
        ${isVisible ? "translate-y-8 opacity-100" : "-translate-y-16 opacity-0"}
      `}
    >
      <div
        className={`
          inline-block px-5 py-2.5 rounded-full shadow-lg
          ${
            type === "error"
              ? "bg-red-500 text-white"
              : type === "success"
              ? "bg-blue-500 text-white"
              : "bg-gray-700 text-white"
          }
        `}
      >
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}
