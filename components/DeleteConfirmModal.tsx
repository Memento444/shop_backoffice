"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
import { Transaction } from "@/lib/types";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  transaction,
  isLoading,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  if (!isOpen || !transaction) return null;

  const isSale = transaction.type === "SALE";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-gray-100 dark:border-slate-800 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
            ยืนยันการลบรายการนี้?
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            ระบบจะคำนวณยอดขายสะสมและทุนสะสมใหม่ทันที
          </p>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-slate-400">ประเภท:</span>
            <span
              className={`font-bold ${
                isSale ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"
              }`}
            >
              {isSale ? "ยอดขายสินค้า" : "เงินลงทุนเพิ่ม"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-slate-400">จำนวนเงิน:</span>
            <span className="font-extrabold text-gray-900 dark:text-white">
              {transaction.amount.toLocaleString()} บาท
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-slate-400">วันที่:</span>
            <span className="text-gray-700 dark:text-slate-300 font-medium">
              {transaction.date}
            </span>
          </div>
          {transaction.note && (
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-slate-400">หมายเหตุ:</span>
              <span className="text-gray-700 dark:text-slate-300 truncate max-w-[180px]">
                {transaction.note}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="py-3 px-4 rounded-xl border border-gray-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 active:scale-95 transition-all"
          >
            ยกเลิก
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-xs sm:text-sm font-bold text-white shadow-sm shadow-rose-200 dark:shadow-none flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>ยืนยันลบ</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
