import AppointmentManager from "@/frontend/components/appointments/AppointmentManager";

export default function DoctorAppointmentsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-ink">Appointment Management</h2>
        <p className="text-gray-500 text-sm mt-1">View your scheduled appointments and update their status.</p>
      </div>
      {/* role="doctor" scopes the shared manager to only this doctor's own appointments */}
      <AppointmentManager role="doctor" />
    </div>
  );
}
