import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// URL prefixes that require a logged-in user (mirrors app/(dashboard)/*)
const PROTECTED_PREFIXES = ["/admin", "/doctor", "/patient", "/receptionist", "/analytics"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/doctor/:path*", "/patient/:path*", "/receptionist/:path*", "/analytics/:path*"],
};
