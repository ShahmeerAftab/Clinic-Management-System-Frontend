import { connectdb } from "@/backend/lib/db";
import User from "@/backend/models/user";
import { NextResponse } from "next/server";
import { verifyAuth, unauthorized } from "@/backend/lib/auth";

const STAFF_ROLES = ["admin", "doctor", "receptionist"];

export const GET = async (req: Request) => {
  const user = verifyAuth(req);
  if (!user) return unauthorized();

  const url = new URL(req.url);
  const role = url.searchParams.get("role");

  // patients may only look up doctors (for booking); everything else is staff-only
  if (!STAFF_ROLES.includes(user.role) && role !== "doctor") {
    return NextResponse.json({ message: "Access denied. Staff only." }, { status: 403 });
  }

  await connectdb();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = {};
  if (role) filter.role = role;

  // never expose password hashes
  const users = await User.find(filter)
    .select("name email role specialization")
    .lean();

  return NextResponse.json(users);
};
