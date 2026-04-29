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
    nombre: "",
    dni: "",
    orden_compra: 0,
    es_lejos: 0,

    estado: "activo",
    motivo_baja: null,
    fecha_baja: null,

    prescripcion_inicio: "",
    prescripcion_vencimiento: "",

    bolsas_abiertas: 0,
    bolsas_cerradas: 0,
    colo_convexas: 0,
    ileo_convexas: 0,
    crema: 0,
    polvo_cicatrizante: 0,
    bolsas_urostomia: 0,
    cateter_uretral: 0,
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

      <div style={layout}>
        {/* IZQUIERDA */}
        <div style={column}>
          {/* Nombre */}
          <div style={field}>
            <label style={label}>Nombre</label>
            <input
              style={input}
              value={form.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
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
                checked={form.orden_compra === 1}
                onChange={(e) =>
                  handleChange("orden_compra", e.target.checked ? 1 : 0)
                }
              />
              Orden de Compra
            </label>

            <label style={checkboxLabel}>
              <input
                type="checkbox"
                checked={form.es_lejos === 1}
                onChange={(e) =>
                  handleChange("es_lejos", e.target.checked ? 1 : 0)
                }
              />
              FAR
            </label>
          </div>

          {/* Fechas */}
          <div style={row}>
            <div style={field}>
              <label style={label}>Inicio prescripción</label>
              <input
                style={input}
                type="date"
                value={form.prescripcion_inicio}
                onChange={(e) => {
                  const inicio = e.target.value;

                  let vencimiento = "";
                  if (inicio) {
                    const date = new Date(inicio);
                    date.setMonth(date.getMonth() + 6);
                    vencimiento = date.toISOString().split("T")[0];
                  }

                  setForm((prev) => ({
                    ...prev,
                    prescripcion_inicio: inicio,
                    prescripcion_vencimiento: vencimiento,
                  }));
                }}
              />
            </div>

            <div style={field}>
              <label style={label}>Vencimiento</label>
              <input
                style={input}
                type="date"
                value={form.prescripcion_vencimiento}
                disabled
              />
            </div>
          </div>
        </div>

        {/* DERECHA */}
        <div style={column}>
          {/* Bolsas */}
          <div style={row}>
            <div style={field}>
              <label style={label}>Bolsas abiertas</label>
              <input
                style={input}
                type="number"
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
                value={form.bolsas_cerradas}
                onChange={(e) =>
                  handleChange("bolsas_cerradas", Number(e.target.value))
                }
              />
            </div>
          </div>

          {/* Otros insumos */}
          <div style={row}>
            <div style={field}>
              <label style={label}>Colo convexas</label>
              <input
                style={input}
                type="number"
                value={form.colo_convexas}
                onChange={(e) =>
                  handleChange("colo_convexas", Number(e.target.value))
                }
              />
            </div>

            <div style={field}>
              <label style={label}>Íleo convexas</label>
              <input
                style={input}
                type="number"
                value={form.ileo_convexas}
                onChange={(e) =>
                  handleChange("ileo_convexas", Number(e.target.value))
                }
              />
            </div>
          </div>

          <div style={row}>
            <div style={field}>
              <label style={label}>Crema</label>
              <input
                style={input}
                type="number"
                value={form.crema}
                onChange={(e) => handleChange("crema", Number(e.target.value))}
              />
            </div>

            <div style={field}>
              <label style={label}>Polvo cicatrizante</label>
              <input
                style={input}
                type="number"
                value={form.polvo_cicatrizante}
                onChange={(e) =>
                  handleChange("polvo_cicatrizante", Number(e.target.value))
                }
              />
            </div>
          </div>

          <div style={row}>
            <div style={field}>
              <label style={label}>Bolsas urostomía</label>
              <input
                style={input}
                type="number"
                value={form.bolsas_urostomia}
                onChange={(e) =>
                  handleChange("bolsas_urostomia", Number(e.target.value))
                }
              />
            </div>

            <div style={field}>
              <label style={label}>Catéter uretral</label>
              <input
                style={input}
                type="number"
                value={form.cateter_uretral}
                onChange={(e) =>
                  handleChange("cateter_uretral", Number(e.target.value))
                }
              />
            </div>
          </div>

          {/* BOTÓN */}
          <button style={button} onClick={handleSubmit}>
            {initialData ? "Actualizar" : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================== ESTILOS ================== */

const container: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "16px",
  borderRadius: "10px",
  maxWidth: "50rem",
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
const layout: React.CSSProperties = {
  display: "flex",
  gap: "20px",
  alignItems: "flex-start",
};

const column: React.CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};
