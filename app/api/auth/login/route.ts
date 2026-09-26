import { NextResponse } from "next/server";
import { verifyOwnerPassword, COOKIE_NAME, COOKIE_MAX_AGE } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "กรุณาระบุรหัสผ่านเจ้าของร้าน" },
        { status: 400 }
      );
    }

    const isValid = verifyOwnerPassword(password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "รหัสผ่านไม่ถูกต้อง เฉพาะเจ้าของร้านเท่านั้นที่เข้าได้" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "เข้าสู่ระบบสำเร็จ ยินดีต้อนรับเจ้าของร้าน",
    });

    response.cookies.set(COOKIE_NAME, "authorized_owner", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์" },
      { status: 500 }
    );
  }
}
