import { useState, useEffect } from "react";

import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';

import { Form, Modal, Stack, Button } from "react-bootstrap";
import axios from "axios";

function Edit ({ id, onUpdate }) {
    const [show, setShow] = useState(false);
    const [validate, setValidate] = useState({});

    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
        
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const editAdmin = async () => {
        try {
            const { data } = await axios.get('http://localhost:3000/api/admin/manage/edit/' + id, {
                withCredentials: true
            });

            const payload = data.result;

            setUsername(payload.username);
            setFirstname(payload.firstname);
            setLastname(payload.lastname);
            setEmail(payload.email);
        } catch (error) {
            console.error(error);
        }

    }

    useEffect(() => {
        editAdmin();
    }, []);

    const handleSubmit = async () => {
        try {
            await axios.patch('http://localhost:3000/api/admin/manage/update/' + id, {
                username: username,
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: password
            }, { withCredentials: true });

            onUpdate();
            handleClose();
        } catch (error) {
            console.error(error);
            if(error.response?.status === 422) {
                const { errors } = error.response?.data;
                setValidate(errors);
            }
        }
    }

    return (
        <>
            <IconButton aria-label="editAdmin" size="medium" color="primary" onClick={handleShow}>
                <EditIcon fontSize="inherit" />
            </IconButton>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Admin</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={async (e) => {
                        e.preventDefault();
                        await handleSubmit();
                    }}>
                        <div className="mb-2">
                            <Form.Group className="mb-1" controlId="input_username">
                                <Form.Label>Username : </Form.Label>
                                <Form.Control placeholder="Masukkan username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </Form.Group>
                            <Form.Text>{ validate.username && <p style={{ color: "red", fontSize: '0.8rem' }} className='mt-1 text-start'>{validate.username}</p> }</Form.Text>
                        </div>
                        <Stack direction="horizontal" gap={2}>
                            <div className="mb-2">
                                <Form.Group className="mb-1" controlId="input_firstname">
                                    <Form.Label>Nama depan : </Form.Label>
                                    <Form.Control placeholder="Masukkan firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                                </Form.Group>
                                <Form.Text>{ validate.firstname && <p style={{ color: "red", fontSize: '0.8rem' }} className='mt-1 text-start'>{validate.firstname}</p> }</Form.Text>
                            </div>
                            <div className="mb-2">
                                <Form.Group className="mb-1" controlId="input_lastname">
                                    <Form.Label>Nama belakang : </Form.Label>
                                    <Form.Control placeholder="Masukkan lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} />
                                </Form.Group>
                                <Form.Text>{ validate.lastname && <p style={{ color: "red", fontSize: '0.8rem' }} className='mt-1 text-start'>{validate.lastname}</p> }</Form.Text>
                            </div>
                        </Stack>
                        <div className="mb-2">
                            <Form.Group className="mb-1" controlId="input_email">
                                <Form.Label>Email : </Form.Label>
                                <Form.Control type="email" placeholder="Masukkan email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </Form.Group>
                            <Form.Text>{ validate.email && <p style={{ color: "red", fontSize: '0.8rem' }} className='mt-1 text-start'>{validate.email}</p> }</Form.Text>
                        </div>
                        <div className="mb-2">
                            <Form.Group className="mb-1" controlId="input_password">
                                <Form.Label>Password : </Form.Label>
                                <Form.Control type="password" placeholder="Masukkan password" value={password} onChange={(e) => {
                                    // if(e.target.value == '') {
                                    //     e.target.value = null;
                                    // }
                                    setPassword(e.target.value)
                                }} />
                                <Form.Text className="text-danger">
                                    *Dapat dikosongkan!
                                </Form.Text>
                            </Form.Group>
                            <Form.Text>{ validate.password && <p style={{ color: "red", fontSize: '0.8rem' }} className='mt-1 text-start'>{validate.password}</p> }</Form.Text>
                        </div>
                        <Stack direction="horizontal" className="d-flex justify-content-end mt-3" gap={1}>
                            <Button variant="secondary" onClick={handleClose}>Close</Button>
                            <Button type="submit" variant="primary">Submit</Button>
                        </Stack>
                    </Form>
                </Modal.Body>
            </Modal>
        </>


    )
}

export default Edit;