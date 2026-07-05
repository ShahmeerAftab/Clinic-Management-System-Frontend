import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/backend/models/user";
import connectDB from "@/backend/lib/db";
import { ensurePatientProfile } from "@/backend/lib/ensure-patient";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() }); // block duplicate accounts for the same email
    if (existing) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10); // never store plaintext passwords — only the hash is saved

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || "patient",
    });

    // auto-create Patient profile so new patients can book immediately
    if (newUser.role === "patient") {
      await ensurePatientProfile(newUser._id.toString());
    }

    return NextResponse.json(
      { message: "Account created successfully. Please log in." },
      { status: 201 }
    );
  } catch (error) {
    console.error("[signup]", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
