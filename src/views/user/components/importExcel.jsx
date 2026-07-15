import { useState } from 'react';
import ExcelJS from "exceljs";

export default function ImportExcel() {

    const handleImport = async (e) => {
        /** @type {File} */ 
        const fileExcel = e.target.target;
        console.log("File Excel : ", fileExcel);
        return;

        try {
            const workbook = new ExcelJS.Workbook();
            const buffer = await fileExcel.arrayBuffer();
            const dataExcel = await workbook.xlsx.load(buffer);

            const worksheet = workbook.getWorksheet(1);
            const rowData = [];

            worksheet.eachRow((row, number) => {
                rowData.push(row.values);
            })
    
            console.log("Worksheet Excel : ", worksheet);
            console.log("File Excel : ", fileExcel);
            console.log("Data Excel : ", rowData);
        } catch (error) {
            console.error(error);
        }

    }



  return (
    <>
    <input type="file" name="importExcel" id="importExcel" accept='.xlsx' onChange={handleImport} />
    </>
  );
}
