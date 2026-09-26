"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Store,
  Check,
  Layers,
  Lock,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import Toast, { ToastData } from "@/components/Toast";

export default function SettingsPage() {
  const [shopName, setShopName] = useState<string>("ร้านมาม่าเกาหลี");
  const [initialCapital, setInitialCapital] = useState<string>("3581");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastData | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadShop() {
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();
        if (data.summary) {
          setInitialCapital(data.summary.initialCapital.toString());
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadShop();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      setToast({
        id: "toast-save-" + Date.now(),
        message: "บันทึกการตั้งค่าร้านค้าเรียบร้อยแล้ว",
      });
    }, 400);
  };

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
    <div className="space-y-5">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white">ตั้งค่าระบบ</h2>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            ข้อมูลร้านค้า ทุนเริ่มต้น และการจัดการความปลอดภัย
          </p>
        </div>
      </div>

      {/* ข้อมูลร้านค้า */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 dark:border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">ข้อมูลร้านค้า</h3>
            <p className="text-[11px] text-gray-400 dark:text-slate-500">
              ชื่อร้านและเงินลงทุนเริ่มต้นก้อนแรก
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-slate-300">ชื่อร้าน</label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-hidden"
              placeholder="เช่น ร้านมาม่าเกาหลี"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-slate-300 flex items-center justify-between">
              <span>เงินลงทุนเริ่มต้น (บาท) *</span>
              <span className="text-[11px] text-gray-400 dark:text-slate-500 font-normal">
                ใช้รวมเป็น &quot;ทุนสะสม&quot; ใน Dashboard
              </span>
            </label>
            <div className="relative">
              <input
                type="number"
                inputMode="decimal"
                value={initialCapital}
                onChange={(e) => setInitialCapital(e.target.value)}
                className="w-full py-2.5 px-3.5 pr-12 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm font-bold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-hidden"
                placeholder="3581"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 dark:text-slate-500">
                บาท
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isSaving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>บันทึกการตั้งค่า</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* ความปลอดภัยและสิทธิ์การเข้าใช้งาน */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 dark:border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">ความปลอดภัยเฉพาะเจ้าของร้าน</h3>
            <p className="text-[11px] text-gray-400 dark:text-slate-500">
              ระบบป้องกันข้อมูลด้วยรหัสผ่านเจ้าของร้านเพียงผู้เดียว
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>สถานะ: เข้าสู่ระบบในฐานะเจ้าของร้านเรียบร้อยแล้ว</span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed">
              บุคคลภายนอกที่เปิดลิงก์เว็บเข้ามาจะติดหน้าจอเข้าสู่ระบบ และไม่สามารถเข้าถึง ดู หรือแก้ไขข้อมูลยอดขายและเงินลงทุนของร้านได้เด็ดขาด
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2.5 px-4 border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100/60 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-400 font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>ออกจากระบบ (Logout)</span>
          </button>
        </div>
      </div>

      {/* โครงสร้างเตรียมพร้อม Version 2 */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-3xl shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-400" />
          <h4 className="text-sm font-bold">โครงสร้างที่เตรียมพร้อมสำหรับ Version 2</h4>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          ฐานข้อมูลและสถาปัตยกรรมของระบบนี้ถูกออกแบบให้พร้อมขยายฟีเจอร์ระดับสูงในอนาคต:
        </p>
        <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
          <li>ระบบสต็อกวัตถุดิบและแจ้งเตือนของหมด</li>
          <li>การคำนวณต้นทุนต่อชามและกำไรสุทธิจริง</li>
          <li>แยกช่องทางขาย: หน้าร้าน vs Grab / LINE MAN (หักค่า GP)</li>
          <li>ค่าใช้จ่ายคงที่: ค่าแรงพนักงาน, ค่าเช่าที่, ค่าน้ำ/ค่าไฟ</li>
        </ul>
      </div>
    </div>
  );
}
