import { useEffect, useState } from "react";
import { Patient } from "../types/Patient";
import PatientTable from "../components/PatientTable";
import PatientForm from "../components/PatientForm";
import ExportButton from "../components/ExportButton";

const API_URL =
  "https://2f4b728b-dafb-4a23-994d-be37b9e37d59-00-2z7uz7ksfh2o3.janeway.replit.dev/";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const [searchDni, setSearchDni] = useState("");

  // 🔥 NUEVO SISTEMA DE FILTROS
  const [filters, setFilters] = useState({
    onlyOC: false,
    onlyFar: false,
    bolsasAbiertas: false,
    bolsasCerradas: false,
  });

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

  // ---------------- UPDATE ----------------
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

    .filter((p) => (filters.onlyOC ? p.orden_compra === 1 : true))

    .filter((p) => (filters.onlyFar ? p.es_lejos === 1 : true))

    .filter((p) => (filters.bolsasAbiertas ? p.bolsas_abiertas > 0 : true))

    .filter((p) => (filters.bolsasCerradas ? p.bolsas_cerradas > 0 : true));

  // ---------------- UI ----------------
  return (
    <div style={{ padding: "20px" }}>
      <h1>Pacientes</h1>

      <PatientForm
        onCreate={addPatient}
        onUpdate={updatePatient}
        initialData={editingPatient}
      />

      {/* FILTROS */}
      <div
        style={{
          margin: "20px 0",
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          placeholder="Buscar por DNI"
          value={searchDni}
          onChange={(e) => setSearchDni(e.target.value)}
        />

        <label>
          <input
            type="checkbox"
            checked={filters.onlyOC}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                onlyOC: e.target.checked,
              }))
            }
          />
          Solo OC
        </label>

        <label>
          <input
            type="checkbox"
            checked={filters.onlyFar}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                onlyFar: e.target.checked,
              }))
            }
          />
          Solo FAR
        </label>

        <label>
          <input
            type="checkbox"
            checked={filters.bolsasAbiertas}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                bolsasAbiertas: e.target.checked,
              }))
            }
          />
          Bolsas abiertas
        </label>

        <label>
          <input
            type="checkbox"
            checked={filters.bolsasCerradas}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                bolsasCerradas: e.target.checked,
              }))
            }
          />
          Bolsas cerradas
        </label>
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
