// react-bootstrap
import Box from '@mui/material/Box';
import Form from 'react-bootstrap/Form';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import MainCard from 'components/Card/MainCard';
import { useEffect, useState } from 'react';
<<<<<<< HEAD
import { Row, Col } from 'react-bootstrap';
=======
import { Row, Col, Stack, Button } from 'react-bootstrap';
>>>>>>> master
import { TablePaginationActions } from '../rekap';
import PropTypes from 'prop-types';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
<<<<<<< HEAD
import { UserModal } from './component';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
=======
import { UpdateUserModal } from './components/update';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { apiKey } from '../../utils/env';
import Create from './components/create';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ImportExcel from './components/importExcel';
>>>>>>> master

dayjs.extend(utc);

// -----------------------|| SAMPLE ||-----------------------//

const getFormat = (date) => {
<<<<<<< HEAD
  if(!date) return '';
=======
  if (!date) return '';
>>>>>>> master

  return dayjs(date).utc().format('HH:mm');
};

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
<<<<<<< HEAD
  rowsPerPage: PropTypes.number.isRequired,
}

export default function User() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const getUsers = async () => {
    const { data } = await axios.get('http://localhost:3000/api/admin/users', {
=======
  rowsPerPage: PropTypes.number.isRequired
};

export default function User() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [satpels, setSatpels] = useState([]);

  const getUsers = async () => {
    const { data } = await axios.get(`${apiKey}/api/admin/users`, {
>>>>>>> master
      withCredentials: true,
      params: {
        search: search
      }
    });
<<<<<<< HEAD
    setUsers(data.data);
  }
=======

    setUsers(data.data);
  };

>>>>>>> master
  useEffect(() => {
    getUsers();
  }, [search]);

<<<<<<< HEAD
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;
=======
  useEffect(() => {
    const getSatpels = async () => {
      const { data } = await axios.get(`${apiKey}/api/admin/satpels`, {
        withCredentials: true
      });

      console.log('Satpels : ', data.data);
      setSatpels(data.data);
    };

    getSatpels();
  }, []);

  const destroy = async (id) => {
    try {
      const { data } = await axios.delete(`${apiKey}/api/admin/user/destroy/` + id, { withCredentials: true });
      getUsers();
    } catch (error) {
      console.error(error);
    }
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;
>>>>>>> master

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Row>
      <Col sm={12}>
        <MainCard title="Pengguna">
<<<<<<< HEAD
          <Box sx={{ display: 'flex', justifyContent: 'end', marginBottom: '1rem' }}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Control type="search" placeholder="Cari pengguna" onChange={(e) => setSearch(e.target.value)} />
            </Form.Group>
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label='users table'>
              <TableHead>
                <TableRow>
                  <TableCell style={{fontWeight: 'bold' }}>Nama</TableCell>
                  <TableCell style={{fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell style={{fontWeight: 'bold' }}>Satpel</TableCell>
                  <TableCell style={{fontWeight: 'bold' }}>Jam Kerja</TableCell>
                  <TableCell style={{fontWeight: 'bold' }}>Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {
                users?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{ item.user.username }</TableCell>
                    <TableCell>{ item.user.email }</TableCell>
                    <TableCell>{ item.satpel.name }</TableCell>
=======
          <Stack direction="horizontal" gap={3}>
            <div className="p2">
              <Create onStore={getUsers} />
              <ImportExcel />
            </div>
            <div className="p-2 ms-auto">
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Control type="search" placeholder="Cari pengguna" onChange={(e) => setSearch(e.target.value)} />
              </Form.Group>
            </div>
          </Stack>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="users table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold' }}>Nama</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Satpel</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Jam Kerja</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.user.username}</TableCell>
                    <TableCell>{item.user.email}</TableCell>
                    <TableCell>{item.satpel.name}</TableCell>
>>>>>>> master
                    <TableCell>
                      {getFormat(item.user.jamKerja[0]?.time_in)}
                      &nbsp;-&nbsp;
                      {getFormat(item.user.jamKerja[0]?.time_out)}
                    </TableCell>
                    <TableCell>
<<<<<<< HEAD
                      <UserModal userId={item.user_id} onSuccess={getUsers} />
                    </TableCell>
                  </TableRow>
                ))
              }
              </TableBody>
              <TableFooter>
                <TableRow>
                {
                  users?.length >= 10 && (
                  <TablePagination 
                    rowsPerPageOptions={[10, 25, 50, { label: 'All', value: -1 }]}
                    colSpan={3}
                    count={users.length}
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
                  )
                }
=======
                      <UpdateUserModal userId={item.user_id} satpels={satpels} onSuccess={getUsers} />
                      <IconButton aria-label="delete" size="medium" color="primary" onClick={() => destroy(item.user_id)}>
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  {users?.length >= 10 && (
                    <TablePagination
                      rowsPerPageOptions={[10, 25, 50, { label: 'All', value: -1 }]}
                      colSpan={3}
                      count={users.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      slotProps={{
                        select: {
                          inputProps: {
                            'aria-label': 'rows per page'
                          },
                          native: true
                        }
                      }}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                    />
                  )}
>>>>>>> master
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </MainCard>
      </Col>
    </Row>
  );
}
