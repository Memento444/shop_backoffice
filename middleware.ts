import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get(COOKIE_NAME);
  const isAuthenticated = session && session.value === "authorized_owner";

  // เส้นทางที่ไม่ต้องตรวจสอบ (Public Assets / Auth Routes)
  const isPublicRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/icon.svg" ||
    pathname === "/manifest.json" ||
    pathname === "/favicon.ico";

  // หากผู้ใช้ล็อกอินอยู่แล้วแต่พยายามเข้าหน้า /login ให้ส่งกลับไปหน้าแรก
  if (pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // หากเป็น Public Route ปล่อยผ่านได้เลย
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // หากยังไม่ได้ล็อกอิน
  if (!isAuthenticated) {
    // ถ้าเป็น API call ให้ตอบ 401 Unauthorized
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: กรุณาเข้าสู่ระบบด้วยรหัสเจ้าของร้าน" },
        { status: 401 }
      );
    }

    // ถ้าเป็นหน้าเว็บทั่วไป ให้ Redirect ไปหน้า Login
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
