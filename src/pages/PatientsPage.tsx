import { useState } from "react";
import { Patient } from "../types/Patient";
import { patientsMock } from "../data/PatientsMock";
import PatientTable from "../components/PatientTable";
import PatientForm from "../components/PatientForm";
import ExportButton from "../components/ExportButton";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>(patientsMock);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const [searchDni, setSearchDni] = useState("");
  const [showOnlyOC, setShowOnlyOC] = useState(false);

  // ---------------- CRUD ----------------

  const addPatient = (newPatient: Omit<Patient, "id">) => {
    const newId = patients.length
      ? Math.max(...patients.map((p) => p.id)) + 1
      : 1;

    setPatients((prev) => [...prev, { ...newPatient, id: newId }]);
  };

  const updatePatient = (updated: Patient) => {
    setPatients((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setEditingPatient(null);
  };

  const deletePatient = (id: number) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  // ---------------- FILTROS ----------------

  const filteredPatients = patients
    .filter((p) => (searchDni ? p.dni.includes(searchDni) : true))
    .filter((p) => (showOnlyOC ? p.oc : true));

  // ---------------- UI ----------------

  return (
    <div style={{ padding: "20px" }}>
      <h1>Pacientes</h1>

      {/* FORM */}
      <PatientForm
        onCreate={addPatient}
        onUpdate={updatePatient}
        initialData={editingPatient}
      />

      {/* FILTROS */}
      <div style={{ margin: "20px 0", display: "flex", gap: "10px" }}>
        <input
          placeholder="Buscar por DNI"
          value={searchDni}
          onChange={(e) => setSearchDni(e.target.value)}
        />

        <button onClick={() => setShowOnlyOC((prev) => !prev)}>
          {showOnlyOC ? "Mostrar Todos" : "Solo OC"}
        </button>
      </div>

      {/* EXPORT */}
      <div style={{ marginBottom: "20px" }}>
        <ExportButton data={filteredPatients} filename="pacientes" />
      </div>

      {/* TABLA */}
      <PatientTable
        patients={filteredPatients}
        onEdit={setEditingPatient}
        onDelete={deletePatient}
      />
    </div>
  );
}
