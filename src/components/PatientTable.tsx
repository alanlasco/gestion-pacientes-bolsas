import { Patient } from "../types/Patient";
type Props = {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (id: number) => void;
};

export default function PatientTable({ patients, onEdit, onDelete }: Props) {
  return (
    <table
      style={{
        borderCollapse: "collapse",
        width: "100%",
        backgroundColor: "#1e1e1e",
        color: "#fff",
      }}
    >
      <thead>
        <tr style={{ backgroundColor: "#333" }}>
          <th style={th}>ID</th>
          <th style={th}>Nombre</th>
          <th style={th}>DNI</th>
          <th style={th}>OC</th>
          <th style={th}>FAR</th>
          <th style={th}>Abiertas</th>
          <th style={th}>Cerradas</th>

          {/* NUEVOS INSUMOS */}
          <th style={th}>Colo</th>
          <th style={th}>Íleo</th>
          <th style={th}>Crema</th>
          <th style={th}>Polvo</th>
          <th style={th}>Uro</th>
          <th style={th}>Catéter</th>

          <th style={th}>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {patients.map((p) => (
          <tr key={p.id} style={{ textAlign: "center" }}>
            <td style={td}>{p.id}</td>
            <td style={td}>{p.nombre}</td>
            <td style={td}>{p.dni}</td>

            <td
              style={{
                ...td,
                color: p.orden_compra ? "#4caf50" : "#f44336",
                fontWeight: "bold",
              }}
            >
              {p.orden_compra ? "Sí" : "No"}
            </td>

            <td style={td}>{p.es_lejos ? "Sí" : "No"}</td>

            <td style={td}>{p.bolsas_abiertas}</td>
            <td style={td}>{p.bolsas_cerradas}</td>

            {/* NUEVOS INSUMOS */}
            <td style={td}>{p.colo_convexas}</td>
            <td style={td}>{p.ileo_convexas}</td>
            <td style={td}>{p.crema}</td>
            <td style={td}>{p.polvo_cicatrizante}</td>
            <td style={td}>{p.bolsas_urostomia}</td>
            <td style={td}>{p.cateter_uretral}</td>

            <td style={td}>
              <button onClick={() => onEdit(p)}>Editar</button>
              <button onClick={() => onDelete(p.id)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const th = {
  padding: "10px",
  border: "1px solid #555",
};

const td = {
  padding: "8px",
  border: "1px solid #555",
};
