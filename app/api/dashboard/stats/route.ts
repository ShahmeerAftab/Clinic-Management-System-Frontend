import { NextResponse } from "next/server";
import connectdb from "@/backend/lib/db";
import Patient from "@/backend/models/patients";
import Appointment from "@/backend/models/appointment";
import { verifyAuth, unauthorized } from "@/backend/lib/auth";

const STAFF_ROLES = ["admin", "doctor", "receptionist"];

// staff only — clinic-wide counts shouldn't be visible to patients or the public
export async function GET(req: Request) {
  const user = verifyAuth(req);
  if (!user) return unauthorized();

  if (!STAFF_ROLES.includes(user.role)) {
    return NextResponse.json({ message: "Access denied. Staff only." }, { status: 403 });
  }

  try {
    await connectdb();

    // Start and end of today
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay   = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const [totalPatients, totalAppointments, todaysAppointments, completedAppointments] =
      await Promise.all([
        Patient.countDocuments(),
        Appointment.countDocuments(),
        Appointment.countDocuments({ date: { $gte: startOfDay, $lt: endOfDay } }),
        Appointment.countDocuments({ status: "Completed" }),
      ]);

    return NextResponse.json({
      totalPatients,
      totalAppointments,
      todaysAppointments,
      completedAppointments,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
