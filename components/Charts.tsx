"use client";

import { useState } from "react";
import { DailySummaryItem } from "@/lib/calculations";

interface ChartsProps {
  dailyData: DailySummaryItem[];
}

export default function Charts({ dailyData }: ChartsProps) {
  const [activeTab, setActiveTab] = useState<"daily" | "cumulative" | "compare">("daily");

  const chronological = [...dailyData].reverse();

  if (chronological.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-gray-400 dark:text-slate-500">
        ยังไม่มีข้อมูลเพียงพอสำหรับสร้างกราฟ
      </div>
    );
  }

  const maxDailySale = Math.max(...chronological.map((d) => d.sales), 100);

  let runningSales = 0;
  let runningInvest = 0;
  const trendData = chronological.map((d) => {
    runningSales += d.sales;
    runningInvest += d.investments;
    return {
      date: d.date.substring(5),
      cumulativeSales: runningSales,
      cumulativeInvest: runningInvest,
    };
  });

  const maxCumulative = Math.max(...trendData.map((d) => d.cumulativeSales), 100);

  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">📊 กราฟวิเคราะห์</h3>

        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("daily")}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeTab === "daily"
                ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs"
                : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            ยอดขายรายวัน
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("cumulative")}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeTab === "cumulative"
                ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs"
                : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            ยอดขายสะสม
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("compare")}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeTab === "compare"
                ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs"
                : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            ยอดขาย vs ลงทุน
          </button>
        </div>
      </div>

      {activeTab === "daily" && (
        <div className="space-y-2">
          <div className="h-44 sm:h-52 flex items-end gap-1.5 sm:gap-2 pt-6 pb-2 px-1 border-b border-gray-100 dark:border-slate-800 overflow-x-auto">
            {chronological.map((item) => {
              const heightPercent = Math.max((item.sales / maxDailySale) * 100, 4);
              const labelDate = item.date.substring(5);
              return (
                <div
                  key={item.date}
                  className="flex-1 min-w-[28px] sm:min-w-[34px] flex flex-col items-center gap-1 group relative"
                >
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-7 text-[10px] font-bold bg-slate-800 dark:bg-slate-700 text-white px-1.5 py-0.5 rounded shadow-xs pointer-events-none transition-opacity whitespace-nowrap z-10">
                    {item.sales.toLocaleString()} ฿
                  </span>

                  <div
                    className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-t-md transition-all duration-300 group-hover:scale-y-[1.02]"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 font-medium truncate w-full text-center">
                    {labelDate}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-gray-400 dark:text-slate-500 text-right">
            แกน X = วันที่ | แกน Y = ยอดขายแต่ละวัน (บาท)
          </p>
        </div>
      )}

      {activeTab === "cumulative" && (
        <div className="space-y-2">
          <div className="h-44 sm:h-52 flex items-end gap-1.5 sm:gap-2 pt-6 pb-2 px-1 border-b border-gray-100 dark:border-slate-800 overflow-x-auto">
            {trendData.map((item) => {
              const heightPercent = Math.max((item.cumulativeSales / maxCumulative) * 100, 4);
              return (
                <div
                  key={item.date}
                  className="flex-1 min-w-[28px] sm:min-w-[34px] flex flex-col items-center gap-1 group relative"
                >
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-7 text-[10px] font-bold bg-indigo-900 dark:bg-indigo-800 text-white px-1.5 py-0.5 rounded shadow-xs pointer-events-none transition-opacity whitespace-nowrap z-10">
                    {item.cumulativeSales.toLocaleString()} ฿
                  </span>

                  <div
                    className="w-full bg-indigo-500 hover:bg-indigo-600 rounded-t-md transition-all duration-300"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 font-medium truncate w-full text-center">
                    {item.date}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-gray-400 dark:text-slate-500 text-right">
            แนวโน้มยอดขายสะสมที่เพิ่มขึ้นอย่างต่อเนื่อง
          </p>
        </div>
      )}

      {activeTab === "compare" && (
        <div className="space-y-2">
          <div className="h-44 sm:h-52 flex items-end gap-2 pt-6 pb-2 px-1 border-b border-gray-100 dark:border-slate-800 overflow-x-auto">
            {chronological.map((item) => {
              const salesHeight = Math.max((item.sales / maxDailySale) * 100, 4);
              const investHeight = Math.max((item.investments / maxDailySale) * 100, 4);
              return (
                <div
                  key={item.date}
                  className="flex-1 min-w-[36px] flex flex-col items-center gap-1 group relative"
                >
                  <div className="w-full flex items-end gap-1 h-36">
                    <div
                      className="flex-1 bg-emerald-500 rounded-t-md"
                      style={{ height: `${salesHeight}%` }}
                      title={`ยอดขาย: ${item.sales.toLocaleString()} ฿`}
                    />
                    <div
                      className="flex-1 bg-amber-500 rounded-t-md"
                      style={{ height: `${investHeight}%` }}
                      title={`ลงทุน: ${item.investments.toLocaleString()} ฿`}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 font-medium truncate w-full text-center">
                    {item.date.substring(5)}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-400 pt-1">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> ยอดขาย
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" /> ลงทุน
              </span>
            </div>
            <span className="text-gray-400 dark:text-slate-500">เปรียบเทียบรายวัน</span>
          </div>
        </div>
      )}
    </div>
  );
}
