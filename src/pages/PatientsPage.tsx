import { useEffect, useState } from "react";
import { Patient } from "../types/Patient";
import PatientTable from "../components/PatientTable";
import PatientForm from "../components/PatientForm";
import ExportButton from "../components/ExportButton";

const API_URL =
  "https://c805e0e1-c8f7-4c62-b03a-3c8e0805a49f-00-azq9xy3uy68u.worf.replit.dev/pacientes";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const [searchDni, setSearchDni] = useState("");
  const [showOnlyOC, setShowOnlyOC] = useState(false);

  // ---------------- FETCH ----------------
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setPatients(data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  // ---------------- CREATE ----------------
  const addPatient = async (newPatient: Omit<Patient, "id">) => {
    try {
      console.log("ENVIANDO:", newPatient);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPatient),
      });

      console.log("STATUS:", res.status);

      const text = await res.text();
      console.log("RAW RESPONSE:", text);

      if (!res.ok) {
        throw new Error("Error en el POST");
      }

      const created = JSON.parse(text);

      setPatients((prev) => [
        ...prev,
        {
          ...newPatient,
          id: created.id,
        },
      ]);
    } catch (error) {
      console.error("Error creating patient:", error);
    }
  };
  // ---------------- DELETE ----------------
  const deletePatient = async (id: number) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      setPatients((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };
  const updatePatient = async (updated: Patient) => {
    try {
      const res = await fetch(`${API_URL}/${updated.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updated),
      });

      if (!res.ok) {
        throw new Error("Error en update");
      }

      // 🔥 merge seguro
      setPatients((prev) =>
        prev.map((p) =>
          p.id === updated.id
            ? {
                ...p,
                ...updated,
              }
            : p,
        ),
      );

      setEditingPatient(null);
    } catch (error) {
      console.error("Error updating patient:", error);
    }
  };
  // ---------------- FILTROS ----------------
  const filteredPatients = patients
    .filter((p) => (searchDni ? p.dni.includes(searchDni) : true))
    .filter((p) => (showOnlyOC ? p.orden_compra === 1 : true));

  // ---------------- UI ----------------
  return (
    <div style={{ padding: "20px" }}>
      <h1>Pacientes</h1>

      <PatientForm
        onCreate={addPatient}
        onUpdate={updatePatient}
        initialData={editingPatient}
      />

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

      <div style={{ marginBottom: "20px" }}>
        <ExportButton data={filteredPatients} filename="pacientes" />
      </div>

      <PatientTable
        patients={filteredPatients}
        onEdit={setEditingPatient}
        onDelete={deletePatient}
      />
    </div>
  );
}
