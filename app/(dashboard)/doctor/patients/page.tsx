import PatientManager from "@/components/patients/PatientManager";

export default function DoctorPatientsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-ink">Patient Management</h2>
        <p className="text-gray-500 text-sm mt-1">View and manage your patients.</p>
      </div>
      {/* role="doctor" scopes the shared manager to only this doctor's own patients */}
      <PatientManager role="doctor" />
    </div>
  );
}
