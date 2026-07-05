import AppointmentManager from "@/frontend/components/appointments/AppointmentManager";

export default function ReceptionistAppointmentsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-ink">Appointment Management</h2>
        <p className="text-gray-500 text-sm mt-1">Book new appointments and manage their status.</p>
      </div>
      {/* role="receptionist" tells the shared manager which actions/columns to show for this user type */}
      <AppointmentManager role="receptionist" />
    </div>
  );
}
