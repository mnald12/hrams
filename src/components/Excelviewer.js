import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const ExcelViewer = ({ fileUrl }) => {
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchExcel = async () => {
      try {
        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length > 0) {
          setColumns(jsonData[0]);
          setTableData(jsonData.slice(1));
        }
      } catch (error) {
        console.error("Error reading Excel file:", error);
      }
    };

    if (fileUrl) {
      fetchExcel();
    }
  }, [fileUrl]);

  return (
    <div className="overflow-auto border rounded-lg p-2 max-h-[600px]">
      {tableData.length > 0 ? (
        <table className="table-auto w-full border border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="border px-2 py-1 text-left">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, i) => (
              <tr key={i}>
                {columns.map((_, j) => (
                  <td key={j} className="border px-2 py-1">
                    {row[j] || ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">Loading or no data found...</p>
      )}
    </div>
  );
};

export default ExcelViewer;
