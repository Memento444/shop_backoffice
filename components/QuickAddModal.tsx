"use client";

import { useState, useEffect, useRef } from "react";
import { X, Check, Calendar, FileText, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Transaction, TransactionType } from "@/lib/types";

interface QuickAddModalProps {
  isOpen: boolean;
  initialType?: TransactionType;
  editingTransaction?: Transaction | null;
  onClose: () => void;
  onSuccess: (tx: Transaction, message: string, isEdit: boolean) => void;
}

export default function QuickAddModal({
  isOpen,
  initialType = "SALE",
  editingTransaction,
  onClose,
  onSuccess,
}: QuickAddModalProps) {
  const [type, setType] = useState<TransactionType>(initialType);
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const amountInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      if (editingTransaction) {
        setType(editingTransaction.type);
        setAmount(editingTransaction.amount.toString());
        setDate(editingTransaction.date);
        setNote(editingTransaction.note || "");
      } else {
        setType(initialType);
        setAmount("");
        const today = new Date().toISOString().split("T")[0];
        setDate(today.startsWith("2026") ? today : "2026-09-26");
        setNote("");
      }

      setTimeout(() => {
        amountInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, initialType, editingTransaction]);

  if (!isOpen) return null;

  const isSale = type === "SALE";
  const quickChips = [50, 100, 500, 1000];

  const handleQuickAddAmount = (addValue: number) => {
    const current = Number(amount) || 0;
    setAmount((current + addValue).toString());
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage("กรุณากรอกจำนวนเงินที่มากกว่า 0 บาท");
      amountInputRef.current?.focus();
      return;
    }

    if (!date) {
      setErrorMessage("กรุณาระบุวันที่ให้ถูกต้อง");
      return;
    }

    setIsSubmitting(true);

    try {
      const isEdit = !!editingTransaction;
      const url = isEdit
        ? `/api/transactions/${editingTransaction.id}`
        : "/api/transactions";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          amount: numAmount,
          date,
          note: note.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }

      const successMsg = isEdit
        ? `แก้ไขรายการ ${numAmount.toLocaleString()} บาท สำเร็จ`
        : isSale
        ? `บันทึกยอดขาย ${numAmount.toLocaleString()} บาท สำเร็จ`
        : `บันทึกการลงทุน ${numAmount.toLocaleString()} บาท สำเร็จ`;

      onSuccess(data.transaction, successMsg, isEdit);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-gray-100 dark:border-slate-800 transition-all max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white">
              {editingTransaction
                ? "✏️ แก้ไขรายการ"
                : isSale
                ? "🟢 บันทึกยอดขาย"
                : "🟠 บันทึกการลงทุน"}
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              {editingTransaction
                ? "แก้ไขข้อมูลรายการที่เลือกและคำนวณยอดใหม่ทันที"
                : "กรอกข้อมูลทางการเงินเพื่ออัปเดตยอดสะสม"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setType("SALE");
                setErrorMessage(null);
              }}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                isSale
                  ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-sm"
                  : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>ขายสินค้า (ยอดขาย)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setType("INVESTMENT");
                setErrorMessage(null);
              }}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                !isSale
                  ? "bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-sm"
                  : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <ArrowDownLeft className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>ลงทุนเพิ่ม (ซื้อของ/ทุน)</span>
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 animate-in shake">
              ⚠️ {errorMessage}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-slate-300 flex items-center justify-between">
              <span>จำนวนเงิน (บาท) *</span>
              <span className="text-[11px] text-gray-400 dark:text-slate-500 font-normal">
                {isSale ? "นำไปเพิ่มในยอดขายสะสม" : "นำไปเพิ่มในทุนสะสม"}
              </span>
            </label>
            <div className="relative">
              <input
                ref={amountInputRef}
                type="number"
                inputMode="decimal"
                step="any"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrorMessage(null);
                }}
                className="w-full text-2xl sm:text-3xl font-black py-3.5 px-4 pr-12 rounded-2xl border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-hidden transition-all placeholder:text-gray-300 dark:placeholder:text-slate-600"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400 dark:text-slate-500">
                บาท
              </span>
            </div>

            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
              {quickChips.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAddAmount(val)}
                  className="px-2.5 py-1 text-xs font-semibold text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 active:scale-95 rounded-lg transition-colors whitespace-nowrap"
                >
                  +{val.toLocaleString()}
                </button>
              ))}
              {amount && (
                <button
                  type="button"
                  onClick={() => setAmount("")}
                  className="px-2 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors ml-auto"
                >
                  ล้าง
                </button>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
              <span>วันที่ทำรายการ *</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-hidden transition-all bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
              <span>หมายเหตุ (ไม่บังคับ)</span>
            </label>
            <input
              type="text"
              placeholder={
                isSale
                  ? "เช่น ยอดขายหน้าร้าน, ออเดอร์เหมา"
                  : "เช่น ซื้อเส้นมาม่า, ซื้อผักและไข่"
              }
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-hidden transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 px-4 rounded-2xl text-white font-extrabold text-base shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${
                isSale
                  ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 dark:shadow-none"
                  : "bg-amber-500 hover:bg-amber-600 shadow-amber-200 dark:shadow-none"
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>กำลังบันทึกข้อมูล...</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 stroke-[2.5]" />
                  <span>
                    {editingTransaction
                      ? "บันทึกการแก้ไข"
                      : isSale
                      ? "บันทึกยอดขาย"
                      : "บันทึกการลงทุน"}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
