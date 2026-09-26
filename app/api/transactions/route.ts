import { NextRequest, NextResponse } from "next/server";
import {
  getTransactions,
  createTransaction,
  getFinancialSummary,
  restoreTransaction,
} from "@/lib/transactions-store";
import { TransactionType } from "@/lib/types";

// GET /api/transactions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || undefined;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;
    const search = searchParams.get("search") || undefined;

    const transactions = await getTransactions({
      type,
      startDate,
      endDate,
      search,
    });

    const summary = await getFinancialSummary();

    return NextResponse.json({
      success: true,
      transactions,
      summary,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch transactions";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// POST /api/transactions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // กรณี Undo / Restore
    if (body.action === "RESTORE" && body.transaction) {
      const restored = await restoreTransaction(body.transaction);
      const summary = await getFinancialSummary();
      return NextResponse.json({
        success: true,
        transaction: restored,
        summary,
        message: "กู้คืนรายการสำเร็จ",
      });
    }

    const { type, amount, date, note } = body;

    // 1. Validation: ตรวจสอบประเภท
    if (!type || (type !== "SALE" && type !== "INVESTMENT")) {
      return NextResponse.json(
        { success: false, error: "ประเภทรายการต้องเป็น SALE หรือ INVESTMENT เท่านั้น" },
        { status: 400 }
      );
    }

    // 2. Validation: จำนวนเงินต้องเป็นตัวเลขและมากกว่า 0
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "จำนวนเงินต้องมากกว่า 0 บาท" },
        { status: 400 }
      );
    }

    // 3. Validation: วันที่ต้องถูกต้อง
    if (!date || isNaN(new Date(date).getTime())) {
      return NextResponse.json(
        { success: false, error: "รูปแบบวันที่ไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    const created = await createTransaction({
      type: type as TransactionType,
      amount: numAmount,
      date,
      note: typeof note === "string" ? note.trim() : undefined,
    });

    const summary = await getFinancialSummary();

    return NextResponse.json(
      {
        success: true,
        transaction: created,
        summary,
        message:
          created.type === "SALE"
            ? `บันทึกยอดขาย ${created.amount.toLocaleString()} บาทเรียบร้อย`
            : `บันทึกการลงทุน ${created.amount.toLocaleString()} บาทเรียบร้อย`,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create transaction";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
