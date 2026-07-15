import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { apiKey } from '../../../utils/env';
import { Stack } from 'react-bootstrap';

export const UpdateUserModal = ({ userId, satpels, onSuccess }) => {
  const [show, setShow] = useState(false);
  const [validate, setValidate] = useState({});

  const [satpelId, setSatpelId] = useState();
  const [timeIn, setTimeIn] = useState('');
  const [timeOut, setTimeOut] = useState('');

  const [formData, setFormData] = useState({
    username: '', firstname: '',
    lastname: '', email: '',
    password: '', satpel_id: '', 
    time_in: '', time_out: ''
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const getUser = async (id) => {
    const { data } = await axios.get(`${apiKey}/api/admin/user/${userId}`, { withCredentials: true });

    const userData = data.result;

    const rawTimeIn = userData.user.jamKerja[0].time_in || '';  
    const rawTimeOut = userData.user.jamKerja[0].time_out || '';

    const formattedTimeIn = rawTimeIn ? rawTimeIn.split('T')[1].substring(0, 5) : '';
    const formattedTimeOut = rawTimeOut ? rawTimeOut.split('T')[1].substring(0, 5) : '';

    setFormData({
        username: userData.user.username || '',
        firstname: userData.user.firstname || '',
        lastname: userData.user.lastname || '',
        email: userData.user.email || '',
        satpel_id: userData.satpel.id || '',
        time_in: formattedTimeIn || '',
        time_out: formattedTimeOut || '',
    });
  };


  const handleSubmit = async () => {
    try {
      const { data } = await axios.patch(
        `${apiKey}/api/admin/user/update/` + userId,
        {
          ...formData
        },
        {
          withCredentials: true
        }
      );
      handleClose();
      setValidate({});
    } catch (error) {
      console.error(error);
      if (error.response?.status === 422) {
        const { errors } = error.response.data;
        setValidate(errors);
      }
    }
  };

  return (
    <>
      <IconButton
        aria-label="edit"
        size="small"
        color="primary"
        onClick={() => {
          getUser();
          handleShow();
        }}
      >
        <EditIcon fontSize="inherit" />
      </IconButton>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Pengguna</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await handleSubmit();
                onSuccess();
              } catch (error) {
                console.error('Submit gagal : ', error);
              }
            }}
          >
            <div className="mb-2">
              <Form.Group className="mb-1" controlId="input_username">
                <Form.Label>Username : </Form.Label>
                <Form.Control name='username' placeholder="Masukkan username" value={formData.username} onChange={handleChange} />
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
                  <Form.Control placeholder="Masukkan firstname" name='firstname' value={formData.firstname} onChange={handleChange} />
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
                  <Form.Control placeholder="Masukkan lastname" name='lastname' value={formData.lastname} onChange={handleChange} />
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
                <Form.Control type="email" placeholder="Masukkan email" name='email' value={formData.email} onChange={handleChange} />
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
                <Form.Control type="password" placeholder="Masukkan password" name='password' onChange={handleChange} />
              </Form.Group>
              <Form.Text>
                {validate.password && (
                  <p style={{ color: 'red', fontSize: '0.8rem' }} className="mt-1 text-start">
                    {validate.password}
                  </p>
                )}
              </Form.Text>
            </div>
            <div className="mb-3">
              <Form.Group className="mb-1" controlId="inputSelectSatpel">
                <Form.Label>Satuan Pelayanan (Satpel)</Form.Label>
                <Form.Select aria-label="Select satpel" name='satpel_id' value={formData.satpel_id} onChange={handleChange}>
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
            <div className="mb-3">
              <Form.Group className="mb-1" controlId="inputTimeIn">
                <Form.Label>Jam Masuk</Form.Label>
                <Form.Control type="time" name='time_in' value={formData.time_in} onChange={handleChange} />
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
                <Form.Control type="time" name='time_out' value={formData.time_out} onChange={handleChange} />
              </Form.Group>
              <Form.Text>
                {validate.time_out && (
                  <p style={{ color: 'red', fontSize: '0.8rem' }} className="text-start">
                    {validate.time_out}
                  </p>
                )}
              </Form.Text>
            </div>
            <Modal.Footer>
              <Button variant="secondary" size="sm" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Save Changes
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
