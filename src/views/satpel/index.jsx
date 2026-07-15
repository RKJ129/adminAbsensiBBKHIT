// react-bootstrap
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import MainCard from 'components/Card/MainCard';
import { Row, Col, Stack, Form } from 'react-bootstrap';
import TableFooter from '@mui/material/TableFooter';
import CreateSatpel from './components/create';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import EditSatpel from './components/edit';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { apiKey } from '../../utils/env';

// -----------------------|| SAMPLE ||-----------------------//

export default function Satpel() {
  const [satpel, setSatpel] = useState([]);

  const init = useCallback(async () => {
    try {
      const { data } = await axios.get(`${apiKey}/api/admin/satpel/index`, {
        withCredentials: true
      });
      const payload = data.result;
      setSatpel(payload);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  const destroy = async (id) => {
    try {
      await axios.delete(`${apiKey}/api/admin/satpel/destroy/` + id, { withCredentials: true });
  
      init();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Row>
      <Col sm={12}>
        <MainCard title="Satuan Pelayanan">
          <Stack direction='horizontal' gap={3}>
            <div className='p2'>
              <CreateSatpel onStore={init} />
            </div>
            <div className='p-2 ms-auto'>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Control type="search" placeholder="Cari pengguna" onChange={(e) => setSearch(e.target.value)} />
              </Form.Group>
            </div>
          </Stack>
          {/* Table Start */}
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label='users table'>
              <TableHead>
                <TableRow>
                  <TableCell style={{fontWeight: 'bold' }}>Nama</TableCell>
                  <TableCell style={{fontWeight: 'bold' }}>Latitude</TableCell>
                  <TableCell style={{fontWeight: 'bold' }}>Longitude</TableCell>
                  <TableCell style={{fontWeight: 'bold' }}>Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  satpel.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell>{ data.name }</TableCell>
                      <TableCell>{ data.latitude }</TableCell>
                      <TableCell>{ data.longitude }</TableCell>
                      <TableCell>
                        {/* <ResetPasssword id={data.id} /> */}
                          <EditSatpel id={data.id} onUpdate={init} />
                          <IconButton aria-label='delete' size='medium' color='primary' onClick={() => destroy(data.id)}>
                            <DeleteIcon fontSize='inherit' />
                          </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
              <TableFooter>
                <TableRow>
                  {/* {
                    users.length >= 10 && (
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
                  } */}
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
          {/* Table End */}
        </MainCard>
      </Col>
    </Row>
  );
}
