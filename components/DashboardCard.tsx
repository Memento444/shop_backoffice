import React from "react";

interface DashboardCardProps {
  title: string;
  amount: string;
  unit?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  colorTheme?: "emerald" | "amber" | "indigo" | "rose" | "blue";
  isPositive?: boolean;
}

export default function DashboardCard({
  title,
  amount,
  unit = "บาท",
  subtitle,
  icon,
  colorTheme = "emerald",
  isPositive,
}: DashboardCardProps) {
  const themeStyles = {
    emerald: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-100",
    amber: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-950 dark:text-amber-100",
    indigo: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60 text-indigo-950 dark:text-indigo-100",
    rose: "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-950 dark:text-rose-100",
    blue: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60 text-blue-950 dark:text-blue-100",
  };

  const badgeStyles = {
    emerald: "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300",
    amber: "bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300",
    indigo: "bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300",
    rose: "bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300",
    blue: "bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300",
  };

  const activeTheme =
    isPositive !== undefined
      ? isPositive
        ? "emerald"
        : "rose"
      : colorTheme;

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 shadow-xs ${themeStyles[activeTheme]}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-slate-300 flex items-center gap-1.5">
          {icon}
          {title}
        </span>
        {subtitle && (
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${badgeStyles[activeTheme]}`}
          >
            {subtitle}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {amount}
        </span>
        {unit && (
          <span className="text-xs sm:text-sm font-normal text-gray-500 dark:text-slate-400">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
