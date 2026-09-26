import prisma from "./prisma";
import { Transaction, Shop, FinancialSummary, CreateTransactionDTO, TransactionType } from "./types";

// ข้อมูลจำลองตั้งต้น (Seed Data) ตามโจทย์ข้อ 20
const INITIAL_SHOP: Shop = {
  id: "shop-mama-01",
  name: "ร้านมาม่าเกาหลี",
  initialCapital: 3581,
};

const memoryShop: Shop = { ...INITIAL_SHOP };

const memoryTransactions: Transaction[] = [
  // ยอดขายตัวอย่าง 10 รายการ (รวม 12,458 บาท)
  { id: "tx-s-01", date: "2026-09-17", type: "SALE", amount: 1001, note: "ยอดขายวันเปิดร้าน", shopId: "shop-mama-01", createdAt: new Date("2026-09-17T08:00:00Z").toISOString(), updatedAt: new Date("2026-09-17T08:00:00Z").toISOString() },
  { id: "tx-s-02", date: "2026-09-18", type: "SALE", amount: 1219, note: "ยอดขายหน้าร้าน", shopId: "shop-mama-01", createdAt: new Date("2026-09-18T08:00:00Z").toISOString(), updatedAt: new Date("2026-09-18T08:00:00Z").toISOString() },
  { id: "tx-s-03", date: "2026-09-19", type: "SALE", amount: 282,  note: "วันฝนตกหนัก", shopId: "shop-mama-01", createdAt: new Date("2026-09-19T08:00:00Z").toISOString(), updatedAt: new Date("2026-09-19T08:00:00Z").toISOString() },
  { id: "tx-s-04", date: "2026-09-20", type: "SALE", amount: 1277, note: "ยอดขายช่วงเที่ยงและเย็น", shopId: "shop-mama-01", createdAt: new Date("2026-09-20T08:00:00Z").toISOString(), updatedAt: new Date("2026-09-20T08:00:00Z").toISOString() },
  { id: "tx-s-05", date: "2026-09-21", type: "SALE", amount: 1234, note: "ยอดขายหน้าร้านปกติ", shopId: "shop-mama-01", createdAt: new Date("2026-09-21T08:00:00Z").toISOString(), updatedAt: new Date("2026-09-21T08:00:00Z").toISOString() },
  { id: "tx-s-06", date: "2026-09-22", type: "SALE", amount: 1397, note: "ลูกค้ากลุ่มใหญ่สั่งเซ็ตหม้อไฟ", shopId: "shop-mama-01", createdAt: new Date("2026-09-22T08:00:00Z").toISOString(), updatedAt: new Date("2026-09-22T08:00:00Z").toISOString() },
  { id: "tx-s-07", date: "2026-09-23", type: "SALE", amount: 1059, note: "ยอดขายหน้าร้าน", shopId: "shop-mama-01", createdAt: new Date("2026-09-23T08:00:00Z").toISOString(), updatedAt: new Date("2026-09-23T08:00:00Z").toISOString() },
  { id: "tx-s-08", date: "2026-09-24", type: "SALE", amount: 1283, note: "ยอดขายวันพฤหัส", shopId: "shop-mama-01", createdAt: new Date("2026-09-24T08:00:00Z").toISOString(), updatedAt: new Date("2026-09-24T08:00:00Z").toISOString() },
  { id: "tx-s-09", date: "2026-09-25", type: "SALE", amount: 510,  note: "ปิดร้านช่วงบ่ายไปซื้อของ", shopId: "shop-mama-01", createdAt: new Date("2026-09-25T08:00:00Z").toISOString(), updatedAt: new Date("2026-09-25T08:00:00Z").toISOString() },
  { id: "tx-s-10", date: "2026-09-26", type: "SALE", amount: 3092, note: "วันเสาร์คนแน่น ยอดขายสูงสุดประจำเดือน", shopId: "shop-mama-01", createdAt: new Date("2026-09-26T08:00:00Z").toISOString(), updatedAt: new Date("2026-09-26T08:00:00Z").toISOString() },

  // เงินลงทุนเพิ่มเติมตัวอย่าง 8 รายการ (รวม 2,896 บาท)
  { id: "tx-i-01", date: "2026-09-17", type: "INVESTMENT", amount: 478,  note: "ซื้อเส้นมาม่าเกาหลีและกิมจิเพิ่ม", shopId: "shop-mama-01", createdAt: new Date("2026-09-17T09:00:00Z").toISOString(), updatedAt: new Date("2026-09-17T09:00:00Z").toISOString() },
  { id: "tx-i-02", date: "2026-09-18", type: "INVESTMENT", amount: 79,   note: "ซื้อผักกวางตุ้งและต้นหอมญี่ปุ่น", shopId: "shop-mama-01", createdAt: new Date("2026-09-18T09:00:00Z").toISOString(), updatedAt: new Date("2026-09-18T09:00:00Z").toISOString() },
  { id: "tx-i-03", date: "2026-09-19", type: "INVESTMENT", amount: 219,  note: "ซื้อไข่ไก่ 1 แผงและชีสแผ่น", shopId: "shop-mama-01", createdAt: new Date("2026-09-19T09:00:00Z").toISOString(), updatedAt: new Date("2026-09-19T09:00:00Z").toISOString() },
  { id: "tx-i-04", date: "2026-09-20", type: "INVESTMENT", amount: 1354, note: "ซื้อเนื้อหมูสไลด์และไส้กรอกตุนรอบสัปดาห์", shopId: "shop-mama-01", createdAt: new Date("2026-09-20T09:00:00Z").toISOString(), updatedAt: new Date("2026-09-20T09:00:00Z").toISOString() },
  { id: "tx-i-05", date: "2026-09-21", type: "INVESTMENT", amount: 65,   note: "ซื้อน้ำแข็งและถุงพลาสติก", shopId: "shop-mama-01", createdAt: new Date("2026-09-21T09:00:00Z").toISOString(), updatedAt: new Date("2026-09-21T09:00:00Z").toISOString() },
  { id: "tx-i-06", date: "2026-09-23", type: "INVESTMENT", amount: 252,  note: "ซื้อซอสโคชูจังและพริกป่นเกาหลี", shopId: "shop-mama-01", createdAt: new Date("2026-09-23T09:00:00Z").toISOString(), updatedAt: new Date("2026-09-23T09:00:00Z").toISOString() },
  { id: "tx-i-07", date: "2026-09-24", type: "INVESTMENT", amount: 216,  note: "ซื้อน้ำดื่มและเครื่องปรุงรส", shopId: "shop-mama-01", createdAt: new Date("2026-09-24T09:00:00Z").toISOString(), updatedAt: new Date("2026-09-24T09:00:00Z").toISOString() },
  { id: "tx-i-08", date: "2026-09-25", type: "INVESTMENT", amount: 233,  note: "ซื้อกล่องเดลิเวอรี่และช้อนส้อม", shopId: "shop-mama-01", createdAt: new Date("2026-09-25T09:00:00Z").toISOString(), updatedAt: new Date("2026-09-25T09:00:00Z").toISOString() },
];

export async function getShop(): Promise<Shop> {
  try {
    const shop = await prisma.shop.findFirst();
    if (shop) {
      return {
        id: shop.id,
        name: shop.name,
        initialCapital: Number(shop.initialCapital),
      };
    }
  } catch {
    // ถ้ายังไม่ได้ต่อ DB ให้ใช้ข้อมูลในหน่วยความจำ
  }
  return memoryShop;
}

export async function getTransactions(filter?: {
  type?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}): Promise<Transaction[]> {
  try {
    const where: Record<string, unknown> = {};
    if (filter?.type && (filter.type === "SALE" || filter.type === "INVESTMENT")) {
      where.type = filter.type;
    }
    if (filter?.startDate || filter?.endDate) {
      const dateFilter: Record<string, Date> = {};
      if (filter?.startDate) dateFilter.gte = new Date(filter.startDate);
      if (filter?.endDate) dateFilter.lte = new Date(filter.endDate);
      where.date = dateFilter;
    }
    if (filter?.search) {
      where.note = { contains: filter.search, mode: "insensitive" };
    }

    const rows = await prisma.transaction.findMany({
      where,
      orderBy: { date: "desc" },
    });

    if (rows && rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        date: r.date.toISOString().split("T")[0],
        type: r.type as TransactionType,
        amount: Number(r.amount),
        note: r.note,
        shopId: r.shopId,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      }));
    }
  } catch {
    // Fallback to in-memory store
  }

  // Filter in-memory
  let result = [...memoryTransactions];
  if (filter?.type && (filter.type === "SALE" || filter.type === "INVESTMENT")) {
    result = result.filter((t) => t.type === filter.type);
  }
  if (filter?.startDate) {
    result = result.filter((t) => t.date >= filter.startDate!);
  }
  if (filter?.endDate) {
    result = result.filter((t) => t.date <= filter.endDate!);
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    result = result.filter((t) => t.note?.toLowerCase().includes(q));
  }

  return result.sort((a, b) => b.date.localeCompare(a.date));
}

export async function createTransaction(dto: CreateTransactionDTO): Promise<Transaction> {
  const shop = await getShop();
  const dateObj = new Date(dto.date);

  try {
    const created = await prisma.transaction.create({
      data: {
        shopId: shop.id,
        type: dto.type,
        amount: dto.amount,
        date: dateObj,
        note: dto.note || null,
      },
    });

    return {
      id: created.id,
      date: created.date.toISOString().split("T")[0],
      type: created.type as TransactionType,
      amount: Number(created.amount),
      note: created.note,
      shopId: created.shopId,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };
  } catch {
    const newTx: Transaction = {
      id: "tx-" + Date.now(),
      date: dto.date,
      type: dto.type,
      amount: dto.amount,
      note: dto.note || null,
      shopId: shop.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryTransactions.unshift(newTx);
    return newTx;
  }
}

export async function updateTransaction(
  id: string,
  dto: Partial<CreateTransactionDTO>
): Promise<Transaction | null> {
  try {
    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        ...(dto.type ? { type: dto.type } : {}),
        ...(dto.amount ? { amount: dto.amount } : {}),
        ...(dto.date ? { date: new Date(dto.date) } : {}),
        ...(dto.note !== undefined ? { note: dto.note || null } : {}),
      },
    });

    return {
      id: updated.id,
      date: updated.date.toISOString().split("T")[0],
      type: updated.type as TransactionType,
      amount: Number(updated.amount),
      note: updated.note,
      shopId: updated.shopId,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  } catch {
    const idx = memoryTransactions.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    const existing = memoryTransactions[idx];
    const updated: Transaction = {
      ...existing,
      ...(dto.type ? { type: dto.type } : {}),
      ...(dto.amount ? { amount: dto.amount } : {}),
      ...(dto.date ? { date: dto.date } : {}),
      ...(dto.note !== undefined ? { note: dto.note || null } : {}),
      updatedAt: new Date().toISOString(),
    };
    memoryTransactions[idx] = updated;
    return updated;
  }
}

export async function deleteTransaction(id: string): Promise<Transaction | null> {
  try {
    const deleted = await prisma.transaction.delete({
      where: { id },
    });
    return {
      id: deleted.id,
      date: deleted.date.toISOString().split("T")[0],
      type: deleted.type as TransactionType,
      amount: Number(deleted.amount),
      note: deleted.note,
      shopId: deleted.shopId,
      createdAt: deleted.createdAt.toISOString(),
      updatedAt: deleted.updatedAt.toISOString(),
    };
  } catch {
    const idx = memoryTransactions.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    const removed = memoryTransactions.splice(idx, 1)[0];
    return removed;
  }
}

export async function restoreTransaction(tx: Transaction): Promise<Transaction> {
  try {
    await prisma.transaction.create({
      data: {
        id: tx.id,
        shopId: tx.shopId,
        type: tx.type,
        amount: tx.amount,
        date: new Date(tx.date),
        note: tx.note || null,
      },
    });
    return tx;
  } catch {
    memoryTransactions.unshift(tx);
    return tx;
  }
}

export async function getFinancialSummary(): Promise<FinancialSummary> {
  const shop = await getShop();
  const txs = await getTransactions();

  const todayStr = "2026-09-26";

  let todaySales = 0;
  let cumulativeSales = 0;
  let additionalInvestments = 0;

  for (const t of txs) {
    if (t.type === "SALE") {
      cumulativeSales += t.amount;
      if (t.date === todayStr) {
        todaySales += t.amount;
      }
    } else if (t.type === "INVESTMENT") {
      additionalInvestments += t.amount;
    }
  }

  const cumulativeCapital = shop.initialCapital + additionalInvestments;
  const margin = cumulativeSales - cumulativeCapital;
  const marginPercentage =
    cumulativeSales > 0 ? (margin / cumulativeSales) * 100 : 0;

  return {
    todaySales,
    cumulativeSales,
    initialCapital: shop.initialCapital,
    additionalInvestments,
    cumulativeCapital,
    margin,
    marginPercentage,
    transactionCount: txs.length,
  };
}
