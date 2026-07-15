// Dashboard Admin Absensi - index.jsx
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Button, ProgressBar } from 'react-bootstrap';
import Chart from 'react-apexcharts';
import axios from 'axios';
import { apiKey } from '../../utils/env';
import { ExcelExport, PDFExport } from '../rekap/components';

export default function DashboardAdminAbsensi() {

  const [attendances, setAttendances] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`${apiKey}/api/admin/dashboard`, { withCredentials: true });
      setAttendances(data);

    }
    fetchData();
  }, []);

  // -------------------- DATA --------------------
  const todaySummary = attendances?.todaySummary;
  const attendanceSummary = {
    hadir: todaySummary?.PRESENT ?? 0,
    sakit: todaySummary?.SICK ?? 0,
    izin: todaySummary?.EXCUSED ?? 0,
    terlambat: todaySummary?.LATE ?? 0,
    alpa: todaySummary?.ABSENT ?? 0
  };

  const satpelInfo = [];
  attendances?.pegawaiSatpel.map(data => {
    const satpel = {
      nama: data.satpelName,
      pegawai: data.totalPegawai,
      hadir: data.hadir
    }
    satpelInfo.push(satpel);
  });

  // -------------------- CHART DATA --------------------
  const pieChartData = {
    series: [
      attendanceSummary.hadir,
      attendanceSummary.sakit,
      attendanceSummary.izin,
      attendanceSummary.terlambat,
      attendanceSummary.alpa
    ],
    options: {
      labels: ['Hadir', 'Sakit', 'Izin', 'Terlambat', 'Alpa'],
      colors: ['#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6c757d'],
      legend: { position: 'bottom' },
      dataLabels: { enabled: true }
    }
  };

  const chartData = [];
  attendances?.weekly.map(data => {
    const present = data.summary.PRESENT;
    const late = data.summary.LATE;
    chartData.push(present + late);
  });

  const barChartData = {
    series: [
      {
        name: 'Jumlah Kehadiran',
        data: chartData
      }
    ],
    options: {
      chart: { type: 'bar', height: 300 },
      xaxis: { categories: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'] },
      colors: ['#007bff'],
      plotOptions: {
        bar: {
          borderRadius: 5,
          columnWidth: '50%'
        }
      }
    }
  };

  // start status color map
  const statusColor = {
    Hadir: "bg-success",
    Terlambat: "bg-info",
    "Pulang SW": "bg-primary",
    Izin: "bg-warning",
    Sakit: "bg-danger",
    Absen: "bg-secondary"
  }
  // end status color map

  // -------------------- UI LAYOUT --------------------
  return (
    <div className="p-3">
      {/* ===================== 1. RINGKASAN KEHADIRAN ===================== */}
      <h4 className="mb-3 fw-bold">Ringkasan Kehadiran Hari Ini</h4>
      <Row className="mb-3">
        {Object.entries(attendanceSummary).map(([key, value], index) => (
          <Col key={index} sm={6} md={4} lg={2} className="mb-3">
            <Card className="text-center shadow-sm">
              <Card.Body>
                <h6 className="text-muted text-capitalize">{key}</h6>
                <h3 className="fw-bold mb-0">{value}</h3>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Distribusi Kehadiran Hari Ini</h5>
          <Chart type="pie" series={pieChartData.series} options={pieChartData.options} height={300} />
        </Card.Body>
      </Card>

      {/* ===================== 2. DAFTAR KEHADIRAN TERBARU ===================== */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">Daftar Kehadiran Terbaru</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive hover className="align-middle">
            <thead>
              <tr>
                <th>Nama Pegawai</th>
                <th>Jam Masuk</th>
                <th>Jam Keluar</th>
                <th>Status</th>
                <th>Satpel</th>
              </tr>
            </thead>
            <tbody>
              {attendances?.kehadiranBaru.map((row, idx) => (
                <tr key={idx}>
                  <td className='capitalize'>{row.name}</td>
                  <td>{row.time_in}</td>
                  <td>{row.time_out}</td>
                  <td>
                    <span
                    className={ `badge ${ statusColor[row.status] ?? "bg-secondary" }` }
                    >
                      {row.status}
                    </span>
                  </td>
                  <td>{row.satpel}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* ===================== 3. REKAP BULANAN & LAPORAN ===================== */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Rekap Absensi Bulanan</h5>
          <div>
            {/* <Button variant="outline-success" size="sm" className="me-2">
              Ekspor Excel
            </Button>
            <Button variant="outline-danger" size="sm">
              Ekspor PDF
            </Button> */}
          </div>
        </Card.Header>
        <Card.Body>
          <Chart type="bar" series={barChartData.series} options={barChartData.options} height={300} />
        </Card.Body>
      </Card>

      {/* ===================== 4. INFORMASI SATPEL ===================== */}
      <h4 className="fw-bold mb-3">Informasi Satpel</h4>
      <Row>
        {satpelInfo.map((satpel, index) => {
          const percent = Math.round((satpel.hadir / satpel.pegawai) * 100);
          const variant =
            percent >= 85 ? 'success' : percent >= 60 ? 'warning' : 'danger';
          return (
            <Col md={6} lg={4} className="mb-3" key={index}>
              <Card className="shadow-sm">
                <Card.Body>
                  <h6 className="fw-bold">{satpel.nama}</h6>
                  <p className="mb-1">
                    Pegawai: {satpel.pegawai} | Hadir: {satpel.hadir}
                  </p>
                  <ProgressBar now={percent} variant={variant} label={`${percent}%`} />
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
