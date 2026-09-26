"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, History, BarChart3, Settings } from "lucide-react";

interface BottomNavProps {
  onQuickAddClick?: () => void;
}

export default function BottomNav({ onQuickAddClick }: BottomNavProps) {
  const pathname = usePathname();

  // ไม่ต้องแสดง BottomNav ในหน้า Login
  if (pathname === "/login") {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-gray-200 dark:border-slate-800 shadow-lg md:hidden transition-colors">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 items-center px-1">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            pathname === "/"
              ? "text-emerald-600 dark:text-emerald-400 font-semibold"
              : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Dashboard</span>
        </Link>

        <Link
          href="/history"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            pathname === "/history"
              ? "text-emerald-600 dark:text-emerald-400 font-semibold"
              : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <History className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">ประวัติ</span>
        </Link>

        <button
          type="button"
          onClick={onQuickAddClick}
          className="flex flex-col items-center justify-center -mt-5 group cursor-pointer"
          aria-label="บันทึกรายการด่วน"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-200 dark:shadow-emerald-950 group-active:scale-95 transition-transform">
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 mt-1">
            + เพิ่ม
          </span>
        </button>

        <Link
          href="/reports"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            pathname === "/reports"
              ? "text-emerald-600 dark:text-emerald-400 font-semibold"
              : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <BarChart3 className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">รายงาน</span>
        </Link>

        <Link
          href="/settings"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            pathname === "/settings"
              ? "text-emerald-600 dark:text-emerald-400 font-semibold"
              : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <Settings className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">ตั้งค่า</span>
        </Link>
      </div>
    </nav>
  );
}
