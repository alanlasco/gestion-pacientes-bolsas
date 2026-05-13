import { useEffect, useState } from "react";
import { Patient } from "../types/Patient";
import PatientTable from "../components/PatientTable";
import PatientForm from "../components/PatientForm";
import ExportButton from "../components/ExportButton";
import "../styles/patientsPage.css";

const API_URL =
  //   "https://c805e0e1-c8f7-4c62-b03a-3c8e0805a49f-00-azq9xy3uy68u.worf.replit.dev/pacientes";
  "https://3fa8cafc-8142-4fe8-ae56-510bf5854f76-00-nv3kzwlxbxiz.worf.replit.dev/pacientes";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const [searchDni, setSearchDni] = useState("");
  const [searchNombre, setSearchNombre] = useState("");
  //  NUEVO SISTEMA DE FILTROS
  const [filters, setFilters] = useState({
    oc: "all",
    estado: "all",
    far: false,

    motivoBaja: "all",

    bolsasAbiertas: false,
    bolsasCerradas: false,
    coloConvexas: false,
    ileoConvexas: false,
    crema: false,
    polvoCicatrizante: false,
    bolsasUrostomia: false,
    cateterUretral: false,
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

    // OC
    .filter((p) => {
      if (filters.oc === "oc") {
        return p.orden_compra === 1;
      }

      if (filters.oc === "sin_oc") {
        return p.orden_compra === 0;
      }

      return true;
    })

    // ESTADO
    .filter((p) => {
      if (filters.estado === "activo") {
        return p.estado === "activo";
      }

      if (filters.estado === "baja") {
        return p.estado === "baja";
      }

      return true;
    })

    // FAR
    .filter((p) => (filters.far ? p.es_lejos === 1 : true))
    // MOTIVO BAJA
    .filter((p) => {
      if (filters.motivoBaja === "all") {
        return true;
      }

      return p.motivo_baja === filters.motivoBaja;
    })

    // COLO CONVEXAS
    .filter((p) => (filters.coloConvexas ? p.colo_convexas > 0 : true))

    // ÍLEO CONVEXAS
    .filter((p) => (filters.ileoConvexas ? p.ileo_convexas > 0 : true))

    // CREMA
    .filter((p) => (filters.crema ? p.crema > 0 : true))

    // POLVO CICATRIZANTE
    .filter((p) =>
      filters.polvoCicatrizante ? p.polvo_cicatrizante > 0 : true,
    )

    // BOLSAS UROSTOMÍA
    .filter((p) => (filters.bolsasUrostomia ? p.bolsas_urostomia > 0 : true))

    // CATÉTER URETRAL
    .filter((p) => (filters.cateterUretral ? p.cateter_uretral > 0 : true))

    // BOLSAS ABIERTAS
    .filter((p) => (filters.bolsasAbiertas ? p.bolsas_abiertas > 0 : true))

    // BOLSAS CERRADAS
    .filter((p) => (filters.bolsasCerradas ? p.bolsas_cerradas > 0 : true))
    .filter((p) =>
      searchNombre
        ? p.nombre.toLowerCase().includes(searchNombre.toLowerCase())
        : true,
    );

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
          {/* BUSCADOR */}

          {/* OC */}
          <select
            value={filters.oc}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                oc: e.target.value,
              }))
            }
          >
            <option value="oc">Solo OC</option>
            <option value="sin_oc">Sin OC</option>
          </select>

          {/* ESTADO */}
          <select
            value={filters.estado}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                estado: e.target.value,
              }))
            }
          >
            <option value="all">Estado</option>
            <option value="activo">Activos</option>
            <option value="baja">Inactivos</option>
          </select>
          {/* MOTIVO BAJA */}
          <select
            value={filters.motivoBaja}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                motivoBaja: e.target.value,
              }))
            }
          >
            <option value="all">Todos los motivos</option>
            <option value="fallecido">Fallecido</option>
            <option value="no_vino_mas">No vino más</option>
            <option value="reconstruido">Reconstruido</option>
          </select>
          {/* FAR */}
          <label>
            <input
              type="checkbox"
              checked={filters.far}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  far: e.target.checked,
                }))
              }
            />
            De Lejos
          </label>

          {/* BOLSAS ABIERTAS */}
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

          {/* BOLSAS CERRADAS */}
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
          <label>
            <input
              type="checkbox"
              checked={filters.coloConvexas}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  coloConvexas: e.target.checked,
                }))
              }
            />
            Colo convexas
          </label>

          <label>
            <input
              type="checkbox"
              checked={filters.ileoConvexas}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  ileoConvexas: e.target.checked,
                }))
              }
            />
            Íleo convexas
          </label>

          <label>
            <input
              type="checkbox"
              checked={filters.crema}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  crema: e.target.checked,
                }))
              }
            />
            Crema
          </label>

          <label>
            <input
              type="checkbox"
              checked={filters.polvoCicatrizante}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  polvoCicatrizante: e.target.checked,
                }))
              }
            />
            Polvo cicatrizante
          </label>

          <label>
            <input
              type="checkbox"
              checked={filters.bolsasUrostomia}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  bolsasUrostomia: e.target.checked,
                }))
              }
            />
            Bolsas urostomía
          </label>

          <label>
            <input
              type="checkbox"
              checked={filters.cateterUretral}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  cateterUretral: e.target.checked,
                }))
              }
            />
            Catéter uretral
          </label>
        </div>
      </div>
      {/* EXPORT */}
      <div style={{ marginBottom: "20px" }}>
        <ExportButton data={filteredPatients} filename="pacientes" />
        <input
          className="searchers"
          placeholder="Buscar por DNI"
          value={searchDni}
          onChange={(e) => setSearchDni(e.target.value)}
        />
        <input
          className="searchers"
          placeholder="Buscar por nombre"
          value={searchNombre}
          onChange={(e) => setSearchNombre(e.target.value)}
        />
      </div>

      {/* TABLA */}
      <PatientTable
        patients={filteredPatients}
        onEdit={(patient) => {
          setEditingPatient(patient);

          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
        onDelete={deletePatient}
      />
    </div>
  );
}
