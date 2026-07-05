import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/backend/models/user";
import connectDB from "@/backend/lib/db";
import { ensurePatientProfile } from "@/backend/lib/ensure-patient";
import { rateLimit } from "@/backend/lib/rate-limit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`login:${ip}`, 10, 60_000)) { // max 10 login attempts per IP per minute — slows down brute-force guessing
    return NextResponse.json({ message: "Too many login attempts. Try again in a minute." }, { status: 429 });
  }

  try {
    await connectDB();

    const { email, password } = await req.json();
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password); // compares plaintext input against the stored hash (hashes can't be reversed)
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }

    // ensure Patient doc exists for patient users
    if (user.role === "patient") {
      await ensurePatientProfile(user._id.toString());
    }

    // sign a JWT so future requests can identify this user without re-checking the password
    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({
      message: "Login successful",
      role: user.role,
      name: user.name,
    });

    // httpOnly cookie — not readable by client JS, so it can't be stolen via XSS
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (error) {
    console.error("[login]", error);
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}
