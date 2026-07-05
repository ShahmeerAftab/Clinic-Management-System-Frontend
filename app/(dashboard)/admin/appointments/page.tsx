import AppointmentManager from "@/components/appointments/AppointmentManager";

export default function AdminAppointmentsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-ink">Appointment Management</h2>
        <p className="text-gray-500 text-sm mt-1">Book appointments and update their status.</p>
      </div>
      {/* role="admin" tells the shared manager which actions/columns to show for this user type */}
      <AppointmentManager role="admin" />
    </div>
  );
}
