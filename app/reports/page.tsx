"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Award,
  FileSpreadsheet,
} from "lucide-react";
import {
  calculatePeriodReport,
  calculateDailySummaries,
} from "@/lib/calculations";
import Charts from "@/components/Charts";
import { Transaction, Shop } from "@/lib/types";

export default function ReportsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [shop, setShop] = useState<Shop>({
    id: "shop-mama-01",
    name: "ร้านมาม่าเกาหลี",
    initialCapital: 3581,
  });
  const [period, setPeriod] = useState<
    "today" | "7days" | "thisMonth" | "lastMonth" | "thisYear" | "all"
  >("thisMonth");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();
        if (data.success) {
          setTransactions(data.transactions);
          if (data.summary) {
            setShop((prev) => ({
              ...prev,
              initialCapital: data.summary.initialCapital,
            }));
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, []);

  const report = useMemo(() => {
    return calculatePeriodReport(transactions, shop, period);
  }, [transactions, shop, period]);

  const allDailySummaries = useMemo(() => {
    return calculateDailySummaries(transactions);
  }, [transactions]);

  const handleExportCSV = () => {
    if (transactions.length === 0) return;

    let csvContent = "\uFEFFวันที่,ประเภท,จำนวนเงิน,หมายเหตุ\n";

    for (let i = 0; i < transactions.length; i++) {
      const t = transactions[i];
      const typeText = t.type === "SALE" ? "ยอดขาย" : "ลงทุนเพิ่ม";
      const noteText = t.note ? `"${t.note.replace(/"/g, '""')}"` : '""';
      csvContent += `${t.date},${typeText},${t.amount},${noteText}\n`;
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `รายงานการเงิน_ร้านมาม่า_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isMarginPositive = report.margin >= 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">รายงานการเงิน</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">สถิติและผลประกอบการภาพรวม</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl text-xs shadow-xs transition-all cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-xs">
        {(
          [
            { label: "วันนี้", value: "today" },
            { label: "7 วันล่าสุด", value: "7days" },
            { label: "เดือนนี้", value: "thisMonth" },
            { label: "เดือนที่แล้ว", value: "lastMonth" },
            { label: "ปีนี้", value: "thisYear" },
            { label: "ทั้งหมด", value: "all" },
          ] as const
        ).map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setPeriod(item.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              period === item.value
                ? "bg-slate-900 dark:bg-slate-700 text-white shadow-xs"
                : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-md space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span className="font-semibold">ช่วงเวลา: {report.periodLabel}</span>
          <span className="bg-slate-800 px-2.5 py-0.5 rounded-full text-[11px]">
            ขาย {report.activeSellingDays} วัน
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div>
            <span className="text-[11px] text-slate-400">ยอดขายช่วงนี้</span>
            <p className="text-xl sm:text-2xl font-black text-emerald-400">
              {report.totalSales.toLocaleString()} ฿
            </p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400">เงินลงทุนช่วงนี้</span>
            <p className="text-xl sm:text-2xl font-black text-amber-400">
              {report.totalInvestments.toLocaleString()} ฿
            </p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400">ส่วนต่างช่วงนี้</span>
            <p
              className={`text-xl sm:text-2xl font-black ${
                isMarginPositive ? "text-white" : "text-rose-400"
              }`}
            >
              {isMarginPositive ? "+" : ""}
              {report.margin.toLocaleString()} ฿
            </p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400">เฉลี่ยต่อวันขาย</span>
            <p className="text-xl sm:text-2xl font-black text-indigo-300">
              {Math.round(report.averageSalesPerDay).toLocaleString()} ฿
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">วันที่ขายดีที่สุด</span>
            <p className="text-sm font-extrabold text-gray-900 dark:text-white">
              {report.bestDay
                ? `${report.bestDay.date} (${report.bestDay.amount.toLocaleString()} ฿)`
                : "-"}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">วันที่ขายได้น้อยที่สุด</span>
            <p className="text-sm font-extrabold text-gray-900 dark:text-white">
              {report.worstDay
                ? `${report.worstDay.date} (${report.worstDay.amount.toLocaleString()} ฿)`
                : "-"}
            </p>
          </div>
        </div>
      </div>

      <Charts dailyData={allDailySummaries} />

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
            ต้องการดูตัวเลขสรุปแยกตามวันแบบละเอียด?
          </h4>
          <p className="text-[11px] text-gray-500 dark:text-slate-400">
            ตารางรวมยอดขาย ยอดลงทุน และส่วนต่างของแต่ละวัน
          </p>
        </div>
        <Link
          href="/daily-summary"
          className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs whitespace-nowrap transition-colors"
        >
          ดูสรุปรายวัน →
        </Link>
      </div>
    </div>
  );
}
