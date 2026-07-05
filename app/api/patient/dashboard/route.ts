import { connectdb } from "@/backend/lib/db";
import { verifyAuth, unauthorized } from "@/backend/lib/auth";
import Patient from "@/backend/models/patients";
import Appointment from "@/backend/models/appointment";
import HealthRecord from "@/backend/models/healthRecord";
import Prescription from "@/backend/models/prescription";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const payload = verifyAuth(req);
  if (!payload) return unauthorized();

  await connectdb();

  const patient = await Patient.findOne({ userId: payload.userId });

  if (!patient) {
    return NextResponse.json({
      upcomingCount: 0,
      todayAppointments: [],
      recordsCount: 0,
      prescriptionsCount: 0,
    });
  }

  const patientId = patient._id;

  // today's date range (midnight to midnight)
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [upcomingCount, todayAppointments, recordsCount, prescriptionsCount] =
    await Promise.all([
      Appointment.countDocuments({ patientID: patientId, status: "Scheduled" }),
      Appointment.find({
        patientID: patientId,
        date: { $gte: todayStart, $lte: todayEnd },
      }).sort({ date: 1 }),
      HealthRecord.countDocuments({ patientId }),
      Prescription.countDocuments({ patientId }),
    ]);

  return NextResponse.json({
    upcomingCount,
    todayAppointments,
    recordsCount,
    prescriptionsCount,
  });
}
