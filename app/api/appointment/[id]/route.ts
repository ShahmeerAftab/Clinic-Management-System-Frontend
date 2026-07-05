import { connectdb } from "@/backend/lib/db";
import Appointment from "@/backend/models/appointment";
import { NextResponse } from "next/server";
import { verifyAuth, unauthorized } from "@/backend/lib/auth";

const STAFF_ROLES = ["admin", "doctor", "receptionist"]; // roles allowed to manage appointments

// staff only
export const PUT = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const user = verifyAuth(req); // decodes the JWT from the cookie, or null if missing/invalid
  if (!user) return unauthorized();
  if (!STAFF_ROLES.includes(user.role)) {
    return NextResponse.json({ message: "Access denied. Staff only." }, { status: 403 });
  }

  const { id } = await params; // dynamic route params are async in this Next.js version
  await connectdb();

  const body = await req.json();
  const updated = await Appointment.findByIdAndUpdate(id, body, { new: true }); // { new: true } returns the updated doc instead of the old one
  if (!updated) return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  return NextResponse.json(updated);
};

// staff only
export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const user = verifyAuth(req);
  if (!user) return unauthorized();
  if (!STAFF_ROLES.includes(user.role)) {
    return NextResponse.json({ message: "Access denied. Staff only." }, { status: 403 });
  }

  const { id } = await params;
  await connectdb();

  const deleted = await Appointment.findByIdAndDelete(id);
  if (!deleted) return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  return NextResponse.json({ message: "Appointment deleted" });
};
