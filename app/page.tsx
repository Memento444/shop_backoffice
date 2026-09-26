"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import DashboardCard from "@/components/DashboardCard";
import QuickAddModal from "@/components/QuickAddModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import Toast, { ToastData } from "@/components/Toast";
import Charts from "@/components/Charts";
import {
  TrendingUp,
  Wallet,
  PiggyBank,
  Percent,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Sparkles,
  Pencil,
  Trash2,
  Receipt,
  CalendarDays,
} from "lucide-react";
import { Transaction, FinancialSummary, TransactionType } from "@/lib/types";
import {
  detectMilestones,
  calculateDailySummaries,
  calculatePeriodReport,
} from "@/lib/calculations";

export default function HomePage() {
  const [summary, setSummary] = useState<FinancialSummary>({
    todaySales: 3092,
    cumulativeSales: 12354,
    initialCapital: 3581,
    additionalInvestments: 2896,
    cumulativeCapital: 6477,
    margin: 5877,
    marginPercentage: 47.57,
    transactionCount: 18,
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [dashboardPeriod, setDashboardPeriod] = useState<
    "all" | "today" | "7days" | "thisMonth"
  >("all");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<TransactionType>("SALE");
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const [deletingTx, setDeletingTx] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [toast, setToast] = useState<ToastData | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions);
        setSummary(data.summary);
      }
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const milestones = useMemo(() => {
    return detectMilestones(
      transactions,
      { id: "1", name: "ร้านมาม่าเกาหลี", initialCapital: summary.initialCapital },
      summary.cumulativeSales
    );
  }, [transactions, summary.initialCapital, summary.cumulativeSales]);

  const dailyData = useMemo(() => {
    return calculateDailySummaries(transactions);
  }, [transactions]);

  const periodReport = useMemo(() => {
    return calculatePeriodReport(
      transactions,
      { id: "1", name: "ร้านมาม่าเกาหลี", initialCapital: summary.initialCapital },
      dashboardPeriod
    );
  }, [transactions, summary.initialCapital, dashboardPeriod]);

  const handleOpenAddSale = () => {
    setEditingTx(null);
    setModalType("SALE");
    setIsModalOpen(true);
  };

  const handleOpenAddInvestment = () => {
    setEditingTx(null);
    setModalType("INVESTMENT");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tx: Transaction) => {
    setEditingTx(tx);
    setModalType(tx.type);
    setIsModalOpen(true);
  };

  const handleSaveSuccess = (
    _savedTx: Transaction,
    message: string,
    isEdit: boolean
  ) => {
    fetchData();
    setToast({
      id: "toast-" + Date.now(),
      message,
      canUndo: !isEdit,
      onUndo: !isEdit
        ? async () => {
            try {
              await fetch(`/api/transactions/${_savedTx.id}`, {
                method: "DELETE",
              });
              fetchData();
              setToast({
                id: "toast-undo-" + Date.now(),
                message: `ยกเลิกรายการ ${_savedTx.amount.toLocaleString()} บาทแล้ว`,
              });
            } catch (e) {
              console.error("Undo failed:", e);
            }
          }
        : undefined,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deletingTx) return;
    setIsDeleting(true);
    const txToDelete = deletingTx;

    try {
      const res = await fetch(`/api/transactions/${txToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setDeletingTx(null);
        fetchData();

        setToast({
          id: "toast-del-" + Date.now(),
          message: `ลบรายการ ${txToDelete.amount.toLocaleString()} บาทแล้ว`,
          canUndo: true,
          onUndo: async () => {
            try {
              await fetch("/api/transactions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  action: "RESTORE",
                  transaction: txToDelete,
                }),
              });
              fetchData();
              setToast({
                id: "toast-restore-" + Date.now(),
                message: `กู้คืนรายการ ${txToDelete.amount.toLocaleString()} บาทเรียบร้อย`,
              });
            } catch (e) {
              console.error("Restore failed:", e);
            }
          },
        });
      }
    } catch (e) {
      console.error("Delete failed:", e);
    } finally {
      setIsDeleting(false);
    }
  };

  const isMarginPositive = summary.margin >= 0;

  return (
    <div className="space-y-5">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <QuickAddModal
        isOpen={isModalOpen}
        initialType={modalType}
        editingTransaction={editingTx}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSaveSuccess}
      />

      <DeleteConfirmModal
        isOpen={!!deletingTx}
        transaction={deletingTx}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingTx(null)}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>วันนี้: 26 กันยายน 2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-0.5">
            ภาพรวมการเงินร้าน
          </h2>
        </div>

        {milestones.length > 0 && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-xl text-amber-900 dark:text-amber-200 text-xs font-semibold shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{milestones[0].message}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleOpenAddSale}
          className="flex items-center justify-center gap-2 py-4 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold rounded-2xl shadow-md shadow-emerald-200 dark:shadow-none transition-all text-sm sm:text-base cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-emerald-500/80 flex items-center justify-center shadow-xs">
            <Plus className="w-4 h-4 stroke-[3]" />
          </div>
          <span>+ บันทึกยอดขาย</span>
        </button>

        <button
          type="button"
          onClick={handleOpenAddInvestment}
          className="flex items-center justify-center gap-2 py-4 px-4 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-extrabold rounded-2xl shadow-md shadow-amber-200 dark:shadow-none transition-all text-sm sm:text-base cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center shadow-xs">
            <Plus className="w-4 h-4 stroke-[3]" />
          </div>
          <span>+ ลงทุนเพิ่ม</span>
        </button>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 sm:p-5 rounded-2xl shadow-md">
        <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
          <span>ยอดขายเฉพาะวันนี้ (26/09/2026)</span>
          <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-semibold text-[11px]">
            สดใหม่
          </span>
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {summary.todaySales.toLocaleString()}
          </span>
          <span className="text-sm font-normal text-slate-300">บาท</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <DashboardCard
          title="ยอดขายสะสม"
          amount={summary.cumulativeSales.toLocaleString()}
          subtitle="รวมทุกวันที่บันทึก"
          icon={<TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
          colorTheme="emerald"
        />

        <DashboardCard
          title="ทุนสะสม"
          amount={summary.cumulativeCapital.toLocaleString()}
          subtitle={`ทุนเริ่มต้น ${summary.initialCapital.toLocaleString()} ฿ + เพิ่ม ${summary.additionalInvestments.toLocaleString()} ฿`}
          icon={<PiggyBank className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
          colorTheme="amber"
        />

        <DashboardCard
          title="ส่วนต่าง (ขายหักทุน)"
          amount={`${isMarginPositive ? "+" : ""}${summary.margin.toLocaleString()}`}
          subtitle={isMarginPositive ? "ยอดขายเกินทุนสะสม" : "ยังไม่คืนทุนสะสม"}
          icon={<Wallet className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
          isPositive={isMarginPositive}
        />

        <DashboardCard
          title="% ส่วนต่างเทียบยอดขาย"
          amount={`${summary.marginPercentage.toFixed(2)}%`}
          unit=""
          subtitle="เทียบยอดขายสะสม"
          icon={<Percent className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
          colorTheme="indigo"
        />
      </div>

      <div className="p-3.5 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 rounded-2xl text-[12px] text-amber-900 dark:text-amber-300 leading-relaxed shadow-xs">
        <span className="font-bold">⚠️ หมายเหตุสำคัญ:</span> ตัวเลข{" "}
        <span className="font-semibold">“ส่วนต่าง”</span> ในระบบนี้คำนวณจาก{" "}
        <span className="underline font-bold">ยอดขายสะสม - ทุนสะสม</span>{" "}
        ยังไม่ใช่กำไรสุทธิจริงของร้าน
        เนื่องจากยังไม่ได้หักต้นทุนวัตถุดิบคงเหลือ ค่าแรง ค่าเช่า และค่าใช้จ่ายอื่น ๆ
      </div>

      <Charts dailyData={dailyData} />

      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">สรุปตามช่วงเวลา</h3>
          </div>
          <Link
            href="/daily-summary"
            className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
          >
            ดูสรุปรายวันเต็ม →
          </Link>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(
            [
              { label: "ทั้งหมด", value: "all" },
              { label: "วันนี้", value: "today" },
              { label: "7 วันล่าสุด", value: "7days" },
              { label: "เดือนนี้", value: "thisMonth" },
            ] as const
          ).map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setDashboardPeriod(item.value)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                dashboardPeriod === item.value
                  ? "bg-slate-900 dark:bg-slate-700 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <span className="text-gray-400 dark:text-slate-500 block text-[11px]">ยอดขายช่วงนี้</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm sm:text-base">
              +{periodReport.totalSales.toLocaleString()} ฿
            </span>
          </div>
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <span className="text-gray-400 dark:text-slate-500 block text-[11px]">ลงทุนช่วงนี้</span>
            <span className="font-extrabold text-amber-600 dark:text-amber-400 text-sm sm:text-base">
              -{periodReport.totalInvestments.toLocaleString()} ฿
            </span>
          </div>
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <span className="text-gray-400 dark:text-slate-500 block text-[11px]">ส่วนต่างช่วงนี้</span>
            <span
              className={`font-extrabold text-sm sm:text-base ${
                periodReport.margin >= 0 ? "text-slate-900 dark:text-white" : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {periodReport.margin >= 0 ? "+" : ""}
              {periodReport.margin.toLocaleString()} ฿
            </span>
          </div>
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <span className="text-gray-400 dark:text-slate-500 block text-[11px]">เฉลี่ยต่อวันขาย</span>
            <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-sm sm:text-base">
              {Math.round(periodReport.averageSalesPerDay).toLocaleString()} ฿
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-gray-700 dark:text-slate-300" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              รายการล่าสุด ({transactions.length} รายการ)
            </h3>
          </div>
          <Link
            href="/history"
            className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
          >
            ดูประวัติทั้งหมด →
          </Link>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-xs text-gray-400 dark:text-slate-500">
            กำลังโหลดข้อมูล...
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400 dark:text-slate-500">
            ยังไม่มีรายการธุรกรรม กดปุ่มด้านบนเพื่อบันทึกรายการแรก
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.slice(0, 5).map((tx) => {
              const isSale = tx.type === "SALE";
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100/80 dark:hover:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800/80 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSale
                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                          : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400"
                      }`}
                    >
                      {isSale ? (
                        <ArrowUpRight className="w-5 h-5" />
                      ) : (
                        <ArrowDownLeft className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-gray-900 dark:text-white">
                          {isSale ? "ยอดขายสินค้า" : "ลงทุนเพิ่มเติม"}
                        </p>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                            isSale
                              ? "bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300"
                              : "bg-amber-100/80 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300"
                          }`}
                        >
                          {isSale ? "SALE" : "INVEST"}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-slate-400 truncate mt-0.5">
                        {tx.date} {tx.note ? `• ${tx.note}` : "• ไม่ได้ระบุหมายเหตุ"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    <span
                      className={`text-sm sm:text-base font-extrabold ${
                        isSale ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {isSale ? "+" : "-"}{tx.amount.toLocaleString()} ฿
                    </span>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(tx)}
                      className="p-1.5 text-gray-400 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-slate-600 transition-all"
                      title="แก้ไขรายการ"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingTx(tx)}
                      className="p-1.5 text-gray-400 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-slate-600 transition-all"
                      title="ลบรายการ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
