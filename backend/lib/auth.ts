// JWT verification — server-only, import in API routes only

import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export type JwtPayload = {
  userId: string;
  role: string;
  email: string;
};

// Reads the httpOnly "token" cookie set by /api/auth/login
function getTokenCookie(req: Request): string | null {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|; )token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function verifyAuth(req: Request): JwtPayload | null {
  const token = getTokenCookie(req);
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded as JwtPayload;
  } catch {
    return null;
  }
}

export function unauthorized(message = "Unauthorized. Please log in.") {
  return NextResponse.json({ message }, { status: 401 });
}
