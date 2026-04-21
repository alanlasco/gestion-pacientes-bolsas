import * as XLSX from "xlsx";

type Props = {
  data: any[];
  filename?: string;
};

export default function ExportButton({ data, filename = "pacientes" }: Props) {
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Pacientes");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.xlsx`;
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return <button onClick={exportToExcel}>Exportar Excel</button>;
}
