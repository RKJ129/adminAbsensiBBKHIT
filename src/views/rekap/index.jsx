// react-bootstrap
import axios from 'axios';
import MainCard from 'components/Card/MainCard';
import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Row, Col } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import PropTypes from 'prop-types';

// import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { ExcelExport, PDFExport } from './components';
import Stack from '@mui/material/Stack';
import { apiKey } from '../../utils/env';

// -----------------------|| SAMPLE ||-----------------------//

export function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
}

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

export default function RekapAbsensi() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); 
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); 

  const [rekap, setRekap] = useState([]);
  const [message, setMessage] = useState("");

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = (rows) => {
    return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  useEffect(() => {
    const getRekap = async () => {
      const { data } = await axios.get(`${apiKey}/api/admin/rekap`, {
        withCredentials: true,
        params: {
          month: selectedMonth,
          year: selectedYear
        }
      });

      console.log('Rekap Data : ', data.data);
      setRekap(data.data);
      setMessage(data.message);
    }

    getRekap();
  }, [selectedMonth, selectedYear]);

  function getFormat (date, jam = false) {
    const dateString = new Date(date);
    if(jam) {
      const time = dateString.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      return time;
    }

    return dateString;

  }

  function createRecord(attendance, location) {
    const hari = getFormat(attendance.date).toLocaleDateString('id-ID', { weekday: 'long' });

    return {
      hari: hari,
      tanggal: getFormat(attendance.date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }),
      jam: location.attendance_type === "IN" ? getFormat(attendance.time_in, true) : getFormat(attendance.time_out, true),
      tipe: location.attendance_type,
      status: location.status,
      koordinat: `${location.latitude}, ${location.longitude}`
    }
  }

  const groupedRows = rekap.map(item => {
    const records = [];

    item.attendances.forEach(attendance => {
      attendance.attendanceLocation.forEach(location => {
        records.push(createRecord(attendance, location));
      });
    });

    return {
      name: item.username,
      records
    }
  });

  console.log('Grouped Row : ', groupedRows);

  const years = [];
  const yearNow = new Date().getFullYear();
  for(let i = yearNow - 5; i <= yearNow; i++ ) {
    years.push(i);
  }

  return (
    <Row>
      <Col sm={12}>
        <MainCard title="Data Rekap Absensi">

          <Row className="justify-content-end">
            <Stack direction='row' spacing={1}>
              <ExcelExport data={groupedRows} fileName="RekapAbsensi" />
              <PDFExport sheetData={groupedRows}/>
            </Stack>

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

          <TableContainer component={Paper} id='table-rekap'>
            <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                {/* <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>No</TableCell> */}
                <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Hari</TableCell>
                <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Tanggal</TableCell>
                <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Jam</TableCell>
                <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Tipe</TableCell>
                <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Koordinat (Lat, Long)</TableCell>
              </TableRow>
            </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={6} style={{ padding: 0, borderBottom: "none" }}>
                    <Accordion>
                      {groupedRows.map((item, idx) => (
                        <Accordion.Item eventKey={idx.toString()} key={idx}>
                          <Accordion.Header>
                            <strong style={{ textTransform: "capitalize" }}>
                              {item.name}
                            </strong>
                          </Accordion.Header>
                          <Accordion.Body>
                            <Table size="small">
                              <TableBody>
                                { (rowsPerPage > 0 
                                  ? item.records.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                  : item.records)
                                  .map((record, i) => (
                                  <TableRow key={i} style={{ textAlign: 'left' }}>
                                    {/* <TableCell>{i + 1}</TableCell> */}
                                    <TableCell>{record.hari}</TableCell>
                                    <TableCell>{record.tanggal}</TableCell>
                                    <TableCell>{record.jam}</TableCell>
                                    <TableCell>{record.tipe}</TableCell>
                                    <TableCell>{record.status}</TableCell>
                                    <TableCell>{record.koordinat}</TableCell>
                                  </TableRow>
                                ))}

                                {
                                  
                                  emptyRows(item.records) > 0 && (
                                    <TableRow style={{ height: 53 * emptyRows }}>
                                      <TableCell colSpan={6}></TableCell>
                                    </TableRow>
                                  )
                                }
                              </TableBody>
                              <TableFooter>
                              <TableRow>
                                <TablePagination
                                  rowsPerPageOptions={[10, 15, 30, 50, { label: 'All', value: -1 }]}
                                  colSpan={3}
                                  count={item.records.length}
                                  rowsPerPage={rowsPerPage}
                                  page={page}
                                  slotProps={{
                                    select: {
                                      inputProps: {
                                        'aria-label': 'rows per page',
                                      },
                                      native: true,
                                    },
                                  }}    
                                  onPageChange={handleChangePage}
                                  onRowsPerPageChange={handleChangeRowsPerPage}
                                  ActionsComponent={TablePaginationActions}
                                />
                              </TableRow>
                              </TableFooter>
                            </Table>
                          </Accordion.Body>
                        </Accordion.Item>
                      ))}
                    </Accordion>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard>
      </Col>
    </Row>
  );
}
