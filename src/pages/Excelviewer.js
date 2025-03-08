import { getDownloadURL, ref } from "firebase/storage";
import { useContext, useEffect, useState } from "react";
import { storage } from "../firebase/db";
import * as XLSX from "xlsx";
import { DataContext } from "../App";

const ExcelViewer = () => {
  const [data, setData] = useState([]);
  const { excelFile } = useContext(DataContext);

  useEffect(() => {
    console.log(excelFile);
    const fetchExcelFile = async () => {
      try {
        if (!excelFile) {
          console.error("No Excel file specified.");
          return;
        }

        let fileURL = excelFile; // Directly use it if it's a full URL

        // Check if it's a filename, not a URL
        if (!excelFile.startsWith("https://")) {
          const fileRef = ref(storage, `forms/${excelFile}`);
          fileURL = await getDownloadURL(fileRef);
        }

        console.log("Download URL:", fileURL);

        const response = await fetch(fileURL);
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);

        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);

        setData(parsedData);
      } catch (error) {
        console.error("Error fetching the Excel file:", error);
      }
    };

    fetchExcelFile();
  }, [excelFile]);

  return (
    <div>
      <h2>Excel File Data</h2>
      <table border="1">
        <thead>
          {data.length > 0 && (
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, i) => (
                <td key={i}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExcelViewer;
