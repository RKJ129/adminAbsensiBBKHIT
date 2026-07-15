import { useCallback, useEffect, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';

import Form from 'react-bootstrap/Form';

import { Modal, Stack, Button } from 'react-bootstrap';
import axios from 'axios';
import { apiKey } from '../../../utils/env';

const CreateUser = ({ onStore }) => {
  const [show, setShow] = useState(false);
  const [validate, setValidate] = useState({});
  const [satpels, setSatpels] = useState([]);

  const [username, setUsername] = useState();
  const [firstname, setFirstname] = useState();
  const [lastname, setLastname] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [satpelId, setSatpelId] = useState();
  const [timeIn, setTimeIn] = useState('');
  const [timeOut, setTimeOut] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async () => {
    try {
      await axios.post(
        `${apiKey}/api/admin/user/store`,
        {
          username: username,
          firstname: firstname,
          lastname: lastname,
          email: email,
          password: password,
          satpel_id: satpelId,
          time_in: timeIn,
          time_out: timeOut
        },
        { withCredentials: true }
      );

      onStore();
      handleClose();
    } catch (error) {
      console.error(error);
      if (error.response?.status === 422) {
        const { errors } = error.response?.data;
        setValidate(errors);
      }
    }
  };

  useEffect(() => {
    const getSatpel = async () => {
      const { data } = await axios.get(`${apiKey}/api/admin/satpels`, {
        withCredentials: true
      });

      setSatpels(data.data);
    };

    getSatpel();
  }, []);

  return (
    <>
      <IconButton aria-label="edit" size="large" color="primary" onClick={handleShow}>
        <AddIcon fontSize="large" />
      </IconButton>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Pengguna</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={async (e) => {
              e.preventDefault();
              await handleSubmit();
            }}
          >
            <div className="mb-2">
              <Form.Group className="mb-1" controlId="input_username">
                <Form.Label>Username : </Form.Label>
                <Form.Control placeholder="Masukkan username" onChange={(e) => setUsername(e.target.value)} />
              </Form.Group>
              <Form.Text>
                {validate.username && (
                  <p style={{ color: 'red', fontSize: '0.8rem' }} className="mt-1 text-start">
                    {validate.username}
                  </p>
                )}
              </Form.Text>
            </div>
            <Stack direction="horizontal" gap={2}>
              <div className="mb-2">
                <Form.Group className="mb-1" controlId="input_firstname">
                  <Form.Label>Nama depan : </Form.Label>
                  <Form.Control placeholder="Masukkan firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                </Form.Group>
                <Form.Text>
                  {validate.firstname && (
                    <p style={{ color: 'red', fontSize: '0.8rem' }} className="mt-1 text-start">
                      {validate.firstname}
                    </p>
                  )}
                </Form.Text>
              </div>
              <div className="mb-2">
                <Form.Group className="mb-1" controlId="input_lastname">
                  <Form.Label>Nama belakang : </Form.Label>
                  <Form.Control placeholder="Masukkan lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} />
                </Form.Group>
                <Form.Text>
                  {validate.lastname && (
                    <p style={{ color: 'red', fontSize: '0.8rem' }} className="mt-1 text-start">
                      {validate.lastname}
                    </p>
                  )}
                </Form.Text>
              </div>
            </Stack>
            <div className="mb-2">
              <Form.Group className="mb-1" controlId="input_email">
                <Form.Label>Email : </Form.Label>
                <Form.Control type="email" placeholder="Masukkan email" onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Text>
                {validate.email && (
                  <p style={{ color: 'red', fontSize: '0.8rem' }} className="mt-1 text-start">
                    {validate.email}
                  </p>
                )}
              </Form.Text>
            </div>
            <div className="mb-2">
              <Form.Group className="mb-1" controlId="input_password">
                <Form.Label>Password : </Form.Label>
                <Form.Control type="password" placeholder="Masukkan password" onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
              <Form.Text>
                {validate.password && (
                  <p style={{ color: 'red', fontSize: '0.8rem' }} className="mt-1 text-start">
                    {validate.password}
                  </p>
                )}
              </Form.Text>
            </div>
            <div className="mb-2">
              <Form.Group className="mb-1" controlId="inputSelectSatpel">
                <Form.Label>Satuan Pelayanan (Satpel)</Form.Label>
                <Form.Select aria-label="Select satpel" onChange={(e) => setSatpelId(e.target.value)}>
                  <option>Pilih Satuan Pelayanan</option>
                  {satpels.map((satpel, index) => (
                    <option value={satpel.id} key={index}>
                      {satpel.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Text>
                {validate.satpel_id && (
                  <p style={{ color: 'red', fontSize: '0.8rem' }} className="text-start">
                    {validate.satpel_id}
                  </p>
                )}
              </Form.Text>
            </div>
            <div className="mb-2">
              <Form.Group className="mb-1" controlId="inputTimeIn">
                <Form.Label>Jam Masuk</Form.Label>
                <Form.Control type="time" onChange={(e) => setTimeIn(e.target.value)} />
              </Form.Group>
              <Form.Text>
                {validate.time_in && (
                  <p style={{ color: 'red', fontSize: '0.8rem' }} className="text-start">
                    {validate.time_in}
                  </p>
                )}
              </Form.Text>
            </div>
            <div className="mb-3">
              <Form.Group className="mb-1" controlId="inputTimeOut">
                <Form.Label>Jam Keluar</Form.Label>
                <Form.Control type="time" onChange={(e) => setTimeOut(e.target.value)} />
              </Form.Group>
              <Form.Text>
                {validate.time_out && (
                  <p style={{ color: 'red', fontSize: '0.8rem' }} className="text-start">
                    {validate.time_out}
                  </p>
                )}
              </Form.Text>
            </div>
            <Stack direction="horizontal" className="d-flex justify-content-end mt-3" gap={1}>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button type="submit" variant="primary">
                Submit
              </Button>
            </Stack>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreateUser;
