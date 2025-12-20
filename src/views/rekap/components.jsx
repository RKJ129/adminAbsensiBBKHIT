import { saveAs } from 'file-saver';
import ExcelJS from "exceljs";
import * as XLSX from "xlsx";
import { jsPDF } from 'jspdf'
import { autoTable } from 'jspdf-autotable'
import Button from '@mui/material/Button';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import { red, lightGreen, green } from '@mui/material/colors';
import TextField from '@mui/material/TextField';

const headers = ['Hari', 'Tanggal', 'Jam', 'Tipe', 'Status', 'Koordinat'];
export function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export const ExcelExport = ({ data, fileName }) => {

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Data Absensi');

    // Header
    sheet.columns = [
      { header: 'Hari', key: 'hari', width: 12 },
      { header: 'Tanggal', key: 'tanggal', width: 15 },
      { header: 'Jam', key: 'jam', width: 10 },
      { header: 'Tipe', key: 'tipe', width: 10 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Koordinat', key: 'koordinat', width: 25 },
    ];

    // Header style
    sheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4CAF50' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Isi data
    data.forEach(user => {
      // nama user
      const rowNumber = sheet.lastRow.number + 1;
      sheet.mergeCells(`A${rowNumber}:F${rowNumber}`);
      const nameCell = sheet.getCell(`A${rowNumber}`);
      nameCell.value = capitalizeFirstLetter(user.name);
      nameCell.font = { bold: true, size: 13 };
      nameCell.alignment = { horizontal: 'center' };

      // data absensi
      user.records.forEach(rec => {
        sheet.addRow({
          hari: rec.hari,
          tanggal: rec.tanggal,
          jam: rec.jam,
          tipe: rec.tipe,
          status: rec.status,
          koordinat: rec.koordinat,
        });
      });
    });

    // Border semua isi
    sheet.eachRow((row, rowNumber) => {
      row.eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    // Simpan file
    const exportToExcel = async () => {
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `${fileName}.xlsx`);
    }

    return (
      <Button 
      variant='contained' 
      size='small' 
      onClick={exportToExcel}
      startIcon={<TableChartIcon />}
      sx={{
        backgroundColor: green[400],
        '&:hover': {
          backgroundColor: green[600]
        },
        fontSize: '11px',
        '& .MuiButton-startIcon': {
          fontSize: '16px', // ukuran icon
        },
      }}
      >
      Excel
      </Button>
    )
}

export const  PDFExport = ({ sheetData }) => {
  const exportToPDF = () => {
    const doc = new jsPDF();
    const totalPages = sheetData.length;

    sheetData.forEach((user, index) => {
      if (index > 0) doc.addPage();

      // Judul
      doc.setFontSize(14);
      doc.text("Laporan Absensi", 14, 15);
      doc.setFontSize(12);
      doc.text(`Nama: ${user.name}`, 14, 25);   

      // Header & Body tabel
      const headers = [["Hari", "Tanggal", "Jam", "Tipe", "Status"]];
      const body = user.records.map(r => [
        r.hari,
        r.tanggal,
        r.jam,
        r.tipe,
        r.status,
      ]);

      autoTable(doc, {
        head: headers,
        body: body,
        startY: 35,
        theme: "striped",
        headStyles: { fillColor: [22, 160, 133] },
      });

      // Footer halaman
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(10);
      doc.text(
        `Halaman ${index + 1} dari ${totalPages}`,
        doc.internal.pageSize.width - 50,
        pageHeight - 10
      );
    });

    doc.save("laporan-absensi.pdf");
  };

  return (
    <Button 
      variant='contained' 
      size='small' 
      onClick={exportToPDF}
      startIcon={<PictureAsPdfIcon />}
      sx={{
        backgroundColor: red[400],
        '&:hover': {
          backgroundColor: red[600]
        },
        fontSize: '11px',
        '& .MuiButton-startIcon': {
          fontSize: '16px', // ukuran icon
        },
      }}
      >
      PDF
      </Button>
  )
}