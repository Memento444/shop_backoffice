import { NextRequest, NextResponse } from "next/server";
import {
  updateTransaction,
  deleteTransaction,
  getFinancialSummary,
} from "@/lib/transactions-store";
import { CreateTransactionDTO } from "@/lib/types";

// PUT /api/transactions/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { type, amount, date, note } = body;

    const updateData: Partial<CreateTransactionDTO> = {};
    if (type !== undefined) {
      if (type !== "SALE" && type !== "INVESTMENT") {
        return NextResponse.json(
          { success: false, error: "ประเภทรายการไม่ถูกต้อง" },
          { status: 400 }
        );
      }
      updateData.type = type;
    }

    if (amount !== undefined) {
      const numAmount = Number(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return NextResponse.json(
          { success: false, error: "จำนวนเงินต้องมากกว่า 0 บาท" },
          { status: 400 }
        );
      }
      updateData.amount = numAmount;
    }

    if (date !== undefined) {
      if (isNaN(new Date(date).getTime())) {
        return NextResponse.json(
          { success: false, error: "รูปแบบวันที่ไม่ถูกต้อง" },
          { status: 400 }
        );
      }
      updateData.date = date;
    }

    if (note !== undefined) {
      updateData.note = note;
    }

    const updated = await updateTransaction(id, updateData);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "ไม่พบรายการที่ต้องการแก้ไข" },
        { status: 404 }
      );
    }

    const summary = await getFinancialSummary();

    return NextResponse.json({
      success: true,
      transaction: updated,
      summary,
      message: "แก้ไขข้อมูลเรียบร้อยแล้ว",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update transaction";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// DELETE /api/transactions/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const deleted = await deleteTransaction(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "ไม่พบรายการที่ต้องการลบ" },
        { status: 404 }
      );
    }

    const summary = await getFinancialSummary();

    return NextResponse.json({
      success: true,
      transaction: deleted,
      summary,
      message: "ลบรายการเรียบร้อยแล้ว",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete transaction";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
