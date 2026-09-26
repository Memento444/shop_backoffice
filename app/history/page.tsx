"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Pencil,
  Trash2,
} from "lucide-react";
import { Transaction } from "@/lib/types";
import QuickAddModal from "@/components/QuickAddModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import Toast, { ToastData } from "@/components/Toast";

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [filterType, setFilterType] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deletingTx, setDeletingTx] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterType !== "ALL") params.append("type", filterType);
      if (search.trim()) params.append("search", search.trim());
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const res = await fetch(`/api/transactions?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [filterType, search, startDate, endDate]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleConfirmDelete = async () => {
    if (!deletingTx) return;
    setIsDeleting(true);
    const tx = deletingTx;

    try {
      const res = await fetch(`/api/transactions/${tx.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setDeletingTx(null);
        fetchTransactions();

        setToast({
          id: "toast-del-" + Date.now(),
          message: `ลบรายการ ${tx.amount.toLocaleString()} บาทแล้ว`,
          canUndo: true,
          onUndo: async () => {
            await fetch("/api/transactions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "RESTORE", transaction: tx }),
            });
            fetchTransactions();
            setToast({
              id: "toast-rest-" + Date.now(),
              message: "กู้คืนรายการเรียบร้อย",
            });
          },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetFilters = () => {
    setFilterType("ALL");
    setSearch("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="space-y-4">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <QuickAddModal
        isOpen={!!editingTx}
        editingTransaction={editingTx}
        initialType={editingTx?.type || "SALE"}
        onClose={() => setEditingTx(null)}
        onSuccess={() => {
          fetchTransactions();
          setToast({ id: "t-" + Date.now(), message: "แก้ไขรายการเรียบร้อย" });
        }}
      />

      <DeleteConfirmModal
        isOpen={!!deletingTx}
        transaction={deletingTx}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingTx(null)}
      />

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white">ประวัติรายการ</h2>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            รายการยอดขายและเงินลงทุนทั้งหมด ({transactions.length} รายการ)
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาตามหมายเหตุ (เช่น วัตถุดิบ, ไข่, หน้าร้าน)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-xs sm:text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-hidden placeholder:text-gray-400 dark:placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { label: "ทั้งหมด", value: "ALL" },
            { label: "🟢 ยอดขายเท่านั้น", value: "SALE" },
            { label: "🟠 ลงทุนเพิ่มเท่านั้น", value: "INVESTMENT" },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilterType(item.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filterType === item.value
                  ? "bg-slate-900 dark:bg-slate-700 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {item.label}
            </button>
          ))}

          {(filterType !== "ALL" || search || startDate || endDate) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline ml-auto whitespace-nowrap"
            >
              ล้างตัวกรอง
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-600 dark:text-slate-400">
          <div>
            <label className="block text-[11px] font-medium text-gray-400 dark:text-slate-500 mb-1">
              ตั้งแต่วันที่
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-gray-400 dark:text-slate-500 mb-1">
              ถึงวันที่
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-12 text-center text-xs text-gray-400 dark:text-slate-500">
            กำลังโหลดข้อมูล...
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-400 dark:text-slate-500">
            ไม่พบรายการที่ตรงกับเงื่อนไขค้นหา
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            {transactions.map((tx) => {
              const isSale = tx.type === "SALE";
              return (
                <div
                  key={tx.id}
                  className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors"
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
                        <span
                          className={`text-xs font-bold ${
                            isSale ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"
                          }`}
                        >
                          {isSale ? "ยอดขาย" : "ลงทุนเพิ่ม"}
                        </span>
                        <span className="text-[11px] text-gray-400 dark:text-slate-500">
                          {tx.date}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-slate-300 truncate mt-0.5">
                        {tx.note || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-4 shrink-0 ml-2">
                    <span
                      className={`text-sm sm:text-base font-extrabold ${
                        isSale ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {isSale ? "+" : "-"}{tx.amount.toLocaleString()} ฿
                    </span>

                    <button
                      type="button"
                      onClick={() => setEditingTx(tx)}
                      className="p-1.5 text-gray-400 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-slate-600 transition-all"
                      title="แก้ไข"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingTx(tx)}
                      className="p-1.5 text-gray-400 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-slate-600 transition-all"
                      title="ลบ"
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
