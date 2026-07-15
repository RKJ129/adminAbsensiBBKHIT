// react-bootstrap
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import MainCard from 'components/Card/MainCard';
import { useEffect, useState } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { ExportExcelTunjangan } from './component';
import { apiKey } from '../../utils/env';

// -----------------------|| SAMPLE ||-----------------------//

const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember"
];

export default function TunjanganPegawai() {
  const [tunjangan, setTunjangan] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const getTunjangan = async (excel = "") => {
    try {
      const { data } = await axios.get(`${apiKey}/api/admin/tunjangan`, {
        params: {
          month: selectedMonth,
          year: selectedYear,
          excel: excel
        }, 
        withCredentials: true
      });

      // console.log('Month : ', month);
      // console.log('Year : ', year);
      // console.log('Tunjangan : ', tunjangan);
      setTunjangan(data.result);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getTunjangan();
  }, [selectedMonth, selectedYear]);

  const years = [];
  const yearNow = new Date().getFullYear();
  for(let i = yearNow - 5; i <= yearNow; i++ ) {
    years.push(i);
  };

  console.log('Tunjangan : ', tunjangan);

  return (
    <Row>
      <Col sm={12}>
        <MainCard title="Tunjangan Pegawai">
          <div>
            <Row className="justify-content-end">
              <div>
                <ExportExcelTunjangan data={tunjangan} fileName='Potongan_Tunjangan' />
              </div>
            
                        <Col xs={12} sm={8} md={6} lg={3} className="rounded me-2 p-0">
                          <Form.Group className="mb-3" controlId="formSearch">
                            <Form.Control type="search" placeholder="Search" className='form-control' />
                          </Form.Group>
                        </Col>
                        <Col xs={12} sm={8} md={6} lg={2} className="rounded me-2 p-0">
                          <Form.Group>
                            <Form.Select
                              aria-label="Filter by month"
                              className="form-select"
                              value={selectedMonth}
                              onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            >
                              {months.map((month, index) => (
                                <option key={index} value={index + 1}>
                                  {month}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col xs={12} sm={8} md={6} lg={2} className="rounded me-2 p-0">
                          <Form.Group>
                            <Form.Select
                              aria-label="Filter by year"
                              className="form-select"
                              value={selectedYear}
                              onChange={(e) => setSelectedYear(Number(e.target.value))}
                            >
                            
                              {years.reverse().map((year, index) => (
                                <option key={index} value={year}>
                                  {year}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
          </div>
          <div>
            <TableContainer component={Paper}>
              <Table aria-label='tunjangan-table'>
                <TableHead>
                  <TableRow>
                    <TableCell 
                      sx={{ position: 'sticky', left: 0, zIndex: 2, backgroundColor: 'red', fontWeight: 'bold' }}>
                      Nama
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Hadir</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Terlambat</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Pulang Sebelum Waktunya</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Izin</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Sakit</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Absen</TableCell>
                    {/* {
                      Array.from({ length: 30 }).map((_, i) => (
                          <TableCell key={i}>Kolom { i + 2 }</TableCell>
                      ))
                    } */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    tunjangan.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ textTransform: 'capitalize' }}>
                            <span className='bg-primary p-1 text-white rounded-2'>
                              { item.username }
                            </span>
                          {/* <Stack direction='horizontal'>
                          </Stack> */}
                        </TableCell>
                        <TableCell>
                          <span className='bg-success px-2 py-1 rounded-2 text-white'>
                            { item.summary.PRESENT }
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className='bg-warning px-2 py-1 rounded-2 text-white'>
                            { item.summary.LATE }
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className='bg-warning px-2 py-1 rounded-2 text-white'>
                            { item.summary.LEFT_EARLY }
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className='bg-secondary px-2 py-1 rounded-2 text-white'>
                            { item.summary.EXCUSED }
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className='bg-info px-2 py-1 rounded-2 text-white'>
                            { item.summary.SICK }
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className='bg-danger px-2 py-1 rounded-2 text-white'>
                            { item.summary.ABSENT }
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </MainCard>
      </Col>
    </Row>
  );
}
