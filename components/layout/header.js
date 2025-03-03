"use client";

import Image from "next/image";
import ThemeToggle from "@/components/layout/theme-toggle";

export default function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 p-4">
      <div className="flex justify-between items-center pl-4">
        <div className="flex items-center gap-2">
          <Image
            src="/img/logo.png"
            alt="Woori CodeShare Logo"
            width={40}
            height={40}
            priority
          />
          <Image
            src="/img/woori-codeshare.png"
            alt="CodeShare Logo"
            width={200}
            height={50}
            priority
            className="text-2xl font-bold"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="relative p-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
