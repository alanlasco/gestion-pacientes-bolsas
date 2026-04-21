import { useState, useEffect } from "react";
import { Patient } from "../types/Patient";

type Props = {
  onCreate: (data: Omit<Patient, "id">) => void;
  onUpdate: (data: Patient) => void;
  initialData?: Patient | null;
};

export default function PatientForm({
  onCreate,
  onUpdate,
  initialData,
}: Props) {
  const emptyForm: Omit<Patient, "id"> = {
    name: "",
    dni: "",
    oc: false,
    far: false,
    bolsas_abiertas: 0,
    bolsas_cerradas: 0,
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      const { id, ...rest } = initialData;
      setForm(rest);
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const handleChange = (key: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (initialData) {
      onUpdate({ ...form, id: initialData.id });
    } else {
      onCreate(form);
    }
    setForm(emptyForm);
  };

  return (
    <div style={container}>
      <h3 style={title}>
        {initialData ? "Editar paciente" : "Agregar paciente"}
      </h3>

      {/* Nombre */}
      <div style={field}>
        <label style={label}>Nombre</label>
        <input
          style={input}
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>

      {/* DNI */}
      <div style={field}>
        <label style={label}>DNI</label>
        <input
          style={input}
          value={form.dni}
          onChange={(e) => handleChange("dni", e.target.value)}
        />
      </div>

      {/* OC / FAR */}
      <div style={row}>
        <label style={checkboxLabel}>
          <input
            type="checkbox"
            checked={form.oc}
            onChange={(e) => handleChange("oc", e.target.checked)}
          />
          Orden de Compra (OC)
        </label>

        <label style={checkboxLabel}>
          <input
            type="checkbox"
            checked={form.far}
            onChange={(e) => handleChange("far", e.target.checked)}
          />
          FAR
        </label>
      </div>

      {/* Bolsas */}
      <div style={row}>
        <div style={field}>
          <label style={label}>Bolsas abiertas</label>
          <input
            style={input}
            type="number"
            min={0}
            value={form.bolsas_abiertas}
            onChange={(e) =>
              handleChange("bolsas_abiertas", Number(e.target.value))
            }
          />
        </div>

        <div style={field}>
          <label style={label}>Bolsas cerradas</label>
          <input
            style={input}
            type="number"
            min={0}
            value={form.bolsas_cerradas}
            onChange={(e) =>
              handleChange("bolsas_cerradas", Number(e.target.value))
            }
          />
        </div>
      </div>

      <button style={button} onClick={handleSubmit}>
        {initialData ? "Actualizar" : "Agregar"}
      </button>
    </div>
  );
}

/* ================== ESTILOS ================== */

const container: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "16px",
  borderRadius: "10px",
  maxWidth: "420px",
  background: "#f9f9f9",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const title: React.CSSProperties = {
  margin: 0,
  fontSize: "18px",
};

const field: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const row: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  justifyContent: "space-between",
};

const label: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
};

const input: React.CSSProperties = {
  padding: "7px 10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

const checkboxLabel: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "14px",
};

const button: React.CSSProperties = {
  marginTop: "8px",
  padding: "10px",
  borderRadius: "6px",
  border: "none",
  background: "#1976d2",
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
};
