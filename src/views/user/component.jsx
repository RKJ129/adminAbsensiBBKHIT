import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from "axios";


export const UserModal = ({ userId, onSuccess }) => {
    const [show, setShow] = useState(false);
    const [satpels, setSatpels] = useState([]);
    const [validate, setValidate] = useState({});

    const [satpelId, setSatpelId] = useState();
    const [timeIn, setTimeIn] = useState('');
    const [timeOut, setTimeOut] = useState('');
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    useEffect(() => {
        const getSatpel = async () => {
            const { data } = await axios.get('http://localhost:3000/api/admin/satpels', {
                withCredentials: true
            });

            setSatpels(data.data);
        }

        getSatpel();
    }, []);

    const handleSubmit = async () => {
        try {
            const { data } = await axios.post('http://localhost:3000/api/admin/store/' + userId, {
                satpel_id: satpelId,
                time_in: timeIn,
                time_out: timeOut
            }, {
                withCredentials: true
            });
            handleClose();
            setValidate({});
            console.log('Result store pengguna : ', data);
        } catch (error) {
            if(error.response?.status === 422) {
                const { errors } = error.response.data;
                setValidate(errors);
            }
        }
    };

    return (
        <>
            <IconButton aria-label='edit' size='small' color='primary' onClick={handleShow}>
                <EditIcon fontSize='inherit'/>
            </IconButton>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Pengguna</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={async (e)  => {
                        e.preventDefault();
                        try {
                            await handleSubmit();
                            onSuccess();
                        } catch(error) {
                            console.error('Submit gagal : ', error);
                        }
                    }}>
                        <div className="mb-3">
                            <Form.Group className="mb-1" controlId="inputSelectSatpel">
                                <Form.Label>Satuan Pelayanan (Satpel)</Form.Label>
                                <Form.Select aria-label="Select satpel" onChange={(e) => setSatpelId(e.target.value)}>
                                    <option>Pilih Satuan Pelayanan</option>
                                    {
                                        satpels.map((satpel, index) => (
                                            <option value={satpel.id} key={index}>{ satpel.name }</option>
                                        ))
                                    }
                                </Form.Select>
                            </Form.Group>
                            <Form.Text>{ validate.satpel_id && <p style={{ color: "red", fontSize: '0.8rem' }} className='text-start'>{validate.satpel_id}</p> }</Form.Text>
                        </div>
                        <div className="mb-3">
                            <Form.Group className="mb-1" controlId="inputTimeIn">
                                <Form.Label>Jam Masuk</Form.Label>
                                <Form.Control type="time" onChange={(e) => setTimeIn(e.target.value)} />
                            </Form.Group>
                            <Form.Text>{ validate.time_in && <p style={{ color: "red", fontSize: '0.8rem' }} className='text-start'>{validate.time_in}</p> }</Form.Text>
                        </div>
                        <div className="mb-3">
                            <Form.Group className="mb-1" controlId="inputTimeOut">
                                <Form.Label>Jam Keluar</Form.Label>
                                <Form.Control type="time" onChange={(e) => setTimeOut(e.target.value)} />
                            </Form.Group>
                            <Form.Text>{ validate.time_out && <p style={{ color: "red", fontSize: '0.8rem' }} className='text-start'>{validate.time_out}</p> }</Form.Text>
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
    )
}