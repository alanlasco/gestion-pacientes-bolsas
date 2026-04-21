import { Patient } from "../types/Patient";

export const patientsMock: Patient[] = [
  {
    id: 1,
    name: "Juan Perez",
    dni: "12345678",
    oc: true,
    far: false,
    bolsas_abiertas: 2,
    bolsas_cerradas: 5,
  },

  {
    id: 2,
    name: "Maria Lopez",
    dni: "87654321",
    oc: false,
    far: true,
    bolsas_abiertas: 0,
    bolsas_cerradas: 3,
  },
  {
    id: 3,
    name: "Carlos Gomez",
    dni: "11223344",
    oc: true,
    far: true,
    bolsas_abiertas: 1,
    bolsas_cerradas: 0,
  },
  {
    id: 4,
    name: "Ana Torres",
    dni: "00000000",
    oc: false,
    far: false,
    bolsas_abiertas: 10,
    bolsas_cerradas: 0,
  },
  {
    id: 5,
    name: "Luis Martinez",
    dni: "99999999",
    oc: true,
    far: false,
    bolsas_abiertas: 0,
    bolsas_cerradas: 0,
  },
  {
    id: 6,
    name: "Alan",
    dni: "39914382",
    oc: true,
    far: false,
    bolsas_abiertas: 0,
    bolsas_cerradas: 0,
  },
];
export const defaultPatient: Omit<Patient, "id"> = {
  name: "",
  dni: "",
  oc: false,
  far: false,
  bolsas_abiertas: 0,
  bolsas_cerradas: 0,
};
