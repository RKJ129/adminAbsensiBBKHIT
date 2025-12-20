// Dashboard Admin Absensi - index.jsx
import React, { useState } from 'react';
import { Row, Col, Card, Table, Button, ProgressBar } from 'react-bootstrap';
import Chart from 'react-apexcharts';

export default function DashboardAdminAbsensi() {
  // -------------------- DUMMY DATA --------------------
  const [attendanceSummary] = useState({
    hadir: 42,
    sakit: 3,
    izin: 5,
    terlambat: 7,
    alpa: 2
  });

  const [latestAttendance] = useState([
    { nama: 'Andi', masuk: '07:58', keluar: '16:05', status: 'Hadir', satpel: 'Semayang' },
    { nama: 'Budi', masuk: '08:30', keluar: '-', status: 'Terlambat', satpel: 'APT Pranoto' },
    { nama: 'Citra', masuk: '-', keluar: '-', status: 'Sakit', satpel: 'Kariangau' },
    { nama: 'Dewi', masuk: '07:55', keluar: '16:02', status: 'Hadir', satpel: 'Loktuan' },
    { nama: 'Eko', masuk: '-', keluar: '-', status: 'Izin', satpel: 'Sungai Samarinda' }
  ]);

  const [satpelInfo] = useState([
    { nama: 'Semayang', pegawai: 14, hadir: 12 },
    { nama: 'APT Pranoto', pegawai: 10, hadir: 8 },
    { nama: 'Loktuan', pegawai: 12, hadir: 11 },
    { nama: 'Sungai Samarinda', pegawai: 8, hadir: 5 }
  ]);

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

  const barChartData = {
    series: [
      {
        name: 'Jumlah Kehadiran',
        data: [35, 40, 32, 45]
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
              {latestAttendance.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.nama}</td>
                  <td>{row.masuk}</td>
                  <td>{row.keluar}</td>
                  <td>
                    <span
                      className={`badge ${
                        row.status === 'Hadir'
                          ? 'bg-success'
                          : row.status === 'Terlambat'
                          ? 'bg-info'
                          : row.status === 'Sakit'
                          ? 'bg-danger'
                          : row.status === 'Izin'
                          ? 'bg-warning text-dark'
                          : 'bg-secondary'
                      }`}
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
            <Button variant="outline-success" size="sm" className="me-2">
              Ekspor Excel
            </Button>
            <Button variant="outline-danger" size="sm">
              Ekspor PDF
            </Button>
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
