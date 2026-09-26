"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { LogOut } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/login";

  const links = [
    { label: "Dashboard", href: "/" },
    { label: "ประวัติรายการ", href: "/history" },
    { label: "สรุปรายวัน", href: "/daily-summary" },
    { label: "รายงานและกราฟ", href: "/reports" },
    { label: "ตั้งค่า", href: "/settings" },
  ];

  const handleLogout = async () => {
    if (confirm("ต้องการออกจากระบบใช่หรือไม่?")) {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
        router.refresh();
      } catch (e) {
        console.error("Logout failed:", e);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-lg">
            🍜
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
              ร้านมาม่าเกาหลี
            </h1>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 font-normal">
              {isLoginPage ? "ระบบเฉพาะเจ้าของร้าน" : "ระบบหลังบ้านร้านอาหาร"}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links (แสดงเฉพาะเมื่อไม่ใช่หน้า Login) */}
        {!isLoginPage && (
          <nav className="hidden md:flex items-center gap-5 text-xs font-bold text-gray-600 dark:text-slate-300">
            {links.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors py-1 ${
                    isActive
                      ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400"
                      : "hover:text-emerald-600 dark:hover:text-emerald-400"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="flex items-center gap-2">
          {/* ปุ่มสลับโหมด Dark Theme */}
          <ThemeToggle />

          {!isLoginPage && (
            <>
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-[11px]">เจ้าของร้าน</span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all"
                title="ออกจากระบบ"
                aria-label="ออกจากระบบ"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
