export type Patient = {
  id: number;
  dni: string;
  nombre: string;
  orden_compra: number;
  es_lejos: number;

  estado: "activo" | "baja";
  motivo_baja: string | null;
  fecha_baja: string | null;

  prescripcion_inicio: string;
  prescripcion_vencimiento: string;

  bolsas_abiertas: number;
  bolsas_cerradas: number;
  colo_convexas: number;
  ileo_convexas: number;
  crema: number;
  polvo_cicatrizante: number;
  bolsas_urostomia: number;
  cateter_uretral: number;
};
