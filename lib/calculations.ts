import { Transaction, Shop } from "./types";

export interface DailySummaryItem {
  date: string;
  sales: number;
  investments: number;
  margin: number;
  transactionCount: number;
}

export interface PeriodReport {
  periodLabel: string;
  totalSales: number;
  totalInvestments: number;
  margin: number;
  marginPercentage: number;
  activeSellingDays: number;
  averageSalesPerDay: number;
  bestDay: { date: string; amount: number } | null;
  worstDay: { date: string; amount: number } | null;
  dailySummaries: DailySummaryItem[];
}

export interface MilestoneInfo {
  type: "milestone" | "record" | "growth" | "info";
  message: string;
  icon: string;
}

export function calculateDailySummaries(transactions: Transaction[]): DailySummaryItem[] {
  const map = new Map<string, { sales: number; investments: number; count: number }>();

  for (let i = 0; i < transactions.length; i++) {
    const t = transactions[i];
    const existing = map.get(t.date) || { sales: 0, investments: 0, count: 0 };
    if (t.type === "SALE") {
      existing.sales += t.amount;
    } else if (t.type === "INVESTMENT") {
      existing.investments += t.amount;
    }
    existing.count += 1;
    map.set(t.date, existing);
  }

  const result: DailySummaryItem[] = [];
  map.forEach((data, date) => {
    result.push({
      date,
      sales: data.sales,
      investments: data.investments,
      margin: data.sales - data.investments,
      transactionCount: data.count,
    });
  });

  return result.sort((a, b) => b.date.localeCompare(a.date));
}

export function calculatePeriodReport(
  transactions: Transaction[],
  _shop: Shop,
  period: "today" | "7days" | "thisMonth" | "lastMonth" | "thisYear" | "all" | "custom",
  customStart?: string,
  customEnd?: string
): PeriodReport {
  const todayStr = "2026-09-26";
  const todayDate = new Date(todayStr);

  let filtered = [...transactions];
  let periodLabel = "ทั้งหมด";

  if (period === "today") {
    periodLabel = "วันนี้";
    filtered = filtered.filter((t) => t.date === todayStr);
  } else if (period === "7days") {
    periodLabel = "7 วันล่าสุด";
    const sevenDaysAgo = new Date(todayDate);
    sevenDaysAgo.setDate(todayDate.getDate() - 6);
    const minDateStr = sevenDaysAgo.toISOString().split("T")[0];
    filtered = filtered.filter((t) => t.date >= minDateStr && t.date <= todayStr);
  } else if (period === "thisMonth") {
    periodLabel = "เดือนนี้ (ก.ย. 2026)";
    const yearMonth = todayStr.substring(0, 7);
    filtered = filtered.filter((t) => t.date.startsWith(yearMonth));
  } else if (period === "lastMonth") {
    periodLabel = "เดือนที่แล้ว (ส.ค. 2026)";
    filtered = filtered.filter((t) => t.date.startsWith("2026-08"));
  } else if (period === "thisYear") {
    periodLabel = "ปีนี้ (2026)";
    const year = todayStr.substring(0, 4);
    filtered = filtered.filter((t) => t.date.startsWith(year));
  } else if (period === "custom" && customStart && customEnd) {
    periodLabel = `${customStart} ถึง ${customEnd}`;
    filtered = filtered.filter((t) => t.date >= customStart && t.date <= customEnd);
  }

  const dailySummaries = calculateDailySummaries(filtered);

  let totalSales = 0;
  let totalInvestments = 0;

  for (let i = 0; i < dailySummaries.length; i++) {
    totalSales += dailySummaries[i].sales;
    totalInvestments += dailySummaries[i].investments;
  }

  const daysWithSales = dailySummaries.filter((d) => d.sales > 0);
  let bestDay: { date: string; amount: number } | null = null;
  let worstDay: { date: string; amount: number } | null = null;

  if (daysWithSales.length > 0) {
    const sortedBySales = [...daysWithSales].sort((a, b) => b.sales - a.sales);
    bestDay = { date: sortedBySales[0].date, amount: sortedBySales[0].sales };
    worstDay = {
      date: sortedBySales[sortedBySales.length - 1].date,
      amount: sortedBySales[sortedBySales.length - 1].sales,
    };
  }

  const activeSellingDays = daysWithSales.length;
  const averageSalesPerDay = activeSellingDays > 0 ? totalSales / activeSellingDays : 0;
  const margin = totalSales - totalInvestments;
  const marginPercentage = totalSales > 0 ? (margin / totalSales) * 100 : 0;

  return {
    periodLabel,
    totalSales,
    totalInvestments,
    margin,
    marginPercentage,
    activeSellingDays,
    averageSalesPerDay,
    bestDay,
    worstDay,
    dailySummaries,
  };
}

export function detectMilestones(
  transactions: Transaction[],
  _shop: Shop,
  cumulativeSales: number
): MilestoneInfo[] {
  const milestones: MilestoneInfo[] = [];
  const todayStr = "2026-09-26";

  if (cumulativeSales >= 100000) {
    milestones.push({
      type: "milestone",
      message: "🎉 ยอดขายสะสมทะลุ 100,000 บาทแล้ว ยอดเยี่ยมมาก!",
      icon: "🎉",
    });
  } else if (cumulativeSales >= 50000) {
    milestones.push({
      type: "milestone",
      message: "🎉 ยอดขายสะสมทะลุ 50,000 บาทแล้ว ก้าวสู่เป้าหมายต่อไป!",
      icon: "✨",
    });
  } else if (cumulativeSales >= 10000) {
    milestones.push({
      type: "milestone",
      message: "🎉 ยอดขายสะสมทะลุ 10,000 บาทแรกเรียบร้อย!",
      icon: "🔥",
    });
  }

  const thisMonthSales = transactions
    .filter((t) => t.type === "SALE" && t.date.startsWith("2026-09"))
    .map((t) => ({ date: t.date, amount: t.amount }));

  const todaySaleTotal = thisMonthSales
    .filter((t) => t.date === todayStr)
    .reduce((sum, cur) => sum + cur.amount, 0);

  if (todaySaleTotal > 0) {
    const dailyMap = new Map<string, number>();
    for (let i = 0; i < thisMonthSales.length; i++) {
      const s = thisMonthSales[i];
      dailyMap.set(s.date, (dailyMap.get(s.date) || 0) + s.amount);
    }

    let isMaxToday = true;
    dailyMap.forEach((val, date) => {
      if (date !== todayStr && val >= todaySaleTotal) {
        isMaxToday = false;
      }
    });

    if (isMaxToday && dailyMap.size > 1) {
      milestones.push({
        type: "record",
        message: `🔥 วันนี้ขายได้สูงที่สุดในเดือนนี้ (${todaySaleTotal.toLocaleString()} บาท)!`,
        icon: "🔥",
      });
    }
  }

  if (milestones.length === 0) {
    milestones.push({
      type: "info",
      message: "🍜 ยินดีต้อนรับสู่ระบบหลังบ้านร้านมาม่าเกาหลี พร้อมบันทึกทุกยอดขาย",
      icon: "🍜",
    });
  }

  return milestones;
}
