import Button from '@mui/material/Button';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import * as XLSX from "xlsx";
import TableChartIcon from '@mui/icons-material/TableChart';
import { green } from '@mui/material/colors';
import { capitalizeFirstLetter } from '../rekap/components';

export const ExportExcelTunjangan = ({ data, fileName }) => {
  const dates = Array.from({ length: 30 }).map((_, i) => `${i + 1}`);
  const headers = [
    'Nama',
    ...dates,
    'Hadir',
    'Terlambat',
    'Pulang Sebelum Waktunya',
    'Izin',
    'Sakit',
    'Absen',
    'Potongan'
  ];

  // Mapping status dari backend ke singkatan
  const types = {
    LATE: { short: 'TL', color: 'FFF59D' },
    LEFT_EARLY: { short: 'PSW', color: 'FFAB91' },
    EXCUSED: { short: 'IZIN', color: '81D4FA' },
    SICK: { short: 'SAD', color: 'CE93D8' },
    ABSENT: { short: 'ABS', color: 'EF9A9A' },
  };

  const summaryColors = {
    Hadir: 'C8E6C9',
    Terlambat: 'FFF59D',
    Pulang: 'FFAB91',
    Izin: '81D4FA',
    Sakit: 'CE93D8',
    Absen: 'EF9A9A',
    Potongan: 'F5F5F5'
  };

  const getFormat = (date) => new Date(date);

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Rekap Tunjangan');

    // Freeze kolom pertama & baris header
    sheet.views = [{ state: 'frozen', xSplit: 1, ySplit: 1 }];

    // Tambahkan header
    sheet.addRow(headers);
    const headerRow = sheet.getRow(1);

    // Styling header
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4CAF50' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Data per user
    data.forEach((tunjangan) => {
      const rowData = [];

      rowData.push(capitalizeFirstLetter(tunjangan.username));

      // Loop 30 hari
      dates.forEach((date) => {
        const attendance = tunjangan.attendances?.find(
          (att) => getFormat(att.date).getDate() === Number(date)
        );

        if (attendance) {
          const statusCodes = [];
          attendance.attendanceLocation?.forEach((loc) => {
            const type = types[loc.status];
            if (type) {
              statusCodes.push(type.short);
            }
          });
          rowData.push(statusCodes.join(', '));
        } else {
          rowData.push('');
        }
      });

      const summary = tunjangan.summary;
      rowData.push(
        summary.PRESENT,
        summary.LATE,
        summary.LEFT_EARLY,
        summary.EXCUSED,
        summary.SICK,
        summary.ABSENT
      );

      // Hitung potongan
      const potongan =
        (summary.LATE + summary.LEFT_EARLY) * 2 +
        summary.ABSENT * 4 +
        summary.EXCUSED * 4 +
        summary.SICK * 2;

      rowData.push(potongan);

      const row = sheet.addRow(rowData);

      // Styling isi
      row.eachCell((cell, colNumber) => {
        const value = cell.value;
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };

        // Kolom nama
        if (colNumber === 1) {
          cell.font = { bold: true };
          cell.alignment = { horizontal: 'left' };
        }

        // Beri warna untuk status harian (TL, PSW, IZIN, SAD, ABS)
        if (typeof value === 'string' && value.length > 0) {
          Object.keys(types).forEach((key) => {
            const short = types[key].short;
            if (value.includes(short)) {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: `FF${types[key].color}` }
              };
            }
          });
        }
      });
    });

    // Warna untuk kolom summary (Hadir, dll)
    const colCount = headers.length;
    const startSummaryIndex = colCount - 7;
    const rows = sheet.getRows(2, sheet.rowCount - 1);

    rows?.forEach((row) => {
      row.eachCell((cell, colNumber) => {
        if (colNumber >= startSummaryIndex) {
          const summaryName = headers[colNumber - 1];
          const colorKey =
            summaryName === 'Hadir'
              ? 'Hadir'
              : summaryName === 'Terlambat'
              ? 'Terlambat'
              : summaryName === 'Pulang Sebelum Waktunya'
              ? 'Pulang'
              : summaryName === 'Izin'
              ? 'Izin'
              : summaryName === 'Sakit'
              ? 'Sakit'
              : summaryName === 'Absen'
              ? 'Absen'
              : 'Potongan';

          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: `FF${summaryColors[colorKey]}` }
          };
        }
      });
    });

    // Lebar kolom
    sheet.columns.forEach((column) => {
      column.width = 14;
    });
    sheet.getColumn(1).width = 25;

    // Simpan file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${fileName}.xlsx`);
  };

  return (
    <Button
      variant='contained'
      size='small'
      onClick={exportToExcel}
      startIcon={<TableChartIcon />}
      sx={{
        backgroundColor: green[400],
        '&:hover': { backgroundColor: green[600] },
        fontSize: '11px',
        '& .MuiButton-startIcon': { fontSize: '16px' }
      }}
    >
      Excel
    </Button>
  );
};