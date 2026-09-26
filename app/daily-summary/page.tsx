"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { calculateDailySummaries, DailySummaryItem } from "@/lib/calculations";

export default function DailySummaryPage() {
  const [dailyData, setDailyData] = useState<DailySummaryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();
        if (data.success) {
          const summaries = calculateDailySummaries(data.transactions);
          setDailyData(summaries);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white">สรุปรายวัน</h2>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            รวมยอดขาย เงินลงทุน และส่วนต่าง แยกตามแต่ละวัน
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-12 text-center text-xs text-gray-400 dark:text-slate-500">
            กำลังคำนวณข้อมูลสรุปรายวัน...
          </div>
        ) : dailyData.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-400 dark:text-slate-500">
            ยังไม่มีรายการธุรกรรม
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 font-bold border-b border-gray-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-3 sm:px-4">วันที่</th>
                  <th className="py-3 px-2 sm:px-4 text-right text-emerald-700 dark:text-emerald-400">ยอดขาย</th>
                  <th className="py-3 px-2 sm:px-4 text-right text-amber-700 dark:text-amber-400">ลงทุน</th>
                  <th className="py-3 px-3 sm:px-4 text-right">ส่วนต่าง</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {dailyData.map((d) => {
                  const isMarginPositive = d.margin >= 0;
                  return (
                    <tr key={d.date} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors">
                      <td className="py-3.5 px-3 sm:px-4 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500 shrink-0" />
                          <span>{d.date}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 dark:text-slate-500 font-normal pl-5">
                          {d.transactionCount} รายการ
                        </span>
                      </td>

                      <td className="py-3.5 px-2 sm:px-4 text-right font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                        {d.sales > 0 ? `+${d.sales.toLocaleString()}` : "-"}
                      </td>

                      <td className="py-3.5 px-2 sm:px-4 text-right font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                        {d.investments > 0 ? `-${d.investments.toLocaleString()}` : "-"}
                      </td>

                      <td className="py-3.5 px-3 sm:px-4 text-right whitespace-nowrap">
                        <span
                          className={`font-black ${
                            isMarginPositive ? "text-slate-900 dark:text-white" : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {isMarginPositive ? "+" : ""}
                          {d.margin.toLocaleString()} ฿
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
