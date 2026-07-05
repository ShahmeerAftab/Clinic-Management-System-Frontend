import PatientManager from "@/components/patients/PatientManager";

export default function ReceptionistPatientsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-ink">Patient Management</h2>
        <p className="text-gray-500 text-sm mt-1">Register new patients and manage existing records.</p>
      </div>
      {/* role="receptionist" tells the shared manager which actions/columns to show for this user type */}
      <PatientManager role="receptionist" />
    </div>
  );
}
