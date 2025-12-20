import IconButton from "@mui/material/IconButton";
import AddIcon from '@mui/icons-material/Add';
import { Button, Form, Modal, Stack } from "react-bootstrap";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvent } from "react-leaflet";
import axios from "axios";


export default function CreateSatpel ({ onStore }) {
    const [show, setShow] = useState(false);
    const [name, setName] = useState();
    const [position, setPosition] = useState();
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function MyComponent() {
        useMapEvent('click', (e) => {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
        });
        return position ? <Marker position={position}/> : null
    }

    async function handleSubmit () {
        try {
            await axios.post('http://localhost:3000/api/admin/satpel/store', {
                name: name,
                lat: position[0],
                lng: position[1]
            }, {
                withCredentials: true
            });

            onStore();
            handleClose();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <IconButton aria-label='edit' size='large' color='primary' onClick={handleShow}>
                <AddIcon fontSize='large' />
            </IconButton>

            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Tambah Satpel</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <MapContainer center={[-1.1956427, 116.8815571]} zoom={12} className="mb-3">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MyComponent/>
                    </MapContainer>
                    <Form onSubmit={async (e) => {
                        e.preventDefault();
                        await handleSubmit();
                    }}>
                        <div className="mb-2">
                            <Form.Group className="mb-1" controlId="input_name">
                                <Form.Label>Satuan Pelayanan : </Form.Label>
                                <Form.Control placeholder="Masukkan Satuan Pelayanan" onChange={(e) => setName(e.target.value)} />
                            </Form.Group>
                            {/* <Form.Text>{ validate.username && <p style={{ color: "red", fontSize: '0.8rem' }} className='mt-1 text-start'>{validate.username}</p> }</Form.Text> */}
                        </div>
                        <div className="mb-2">
                            <Form.Group className="mb-1" controlId="input_latitude">
                                <Form.Label>Latitude : </Form.Label>
                                <Form.Control placeholder="Cont: -123456" value={position ? position[0] : ''} readOnly />
                            </Form.Group>
                            {/* <Form.Text>{ validate.username && <p style={{ color: "red", fontSize: '0.8rem' }} className='mt-1 text-start'>{validate.username}</p> }</Form.Text> */}
                        </div>
                        <div className="mb-2">
                            <Form.Group className="mb-1" controlId="input_longitude">
                                <Form.Label>Longitude : </Form.Label>
                                <Form.Control placeholder="Cont: 123456" value={position ? position[1] : ''} readOnly />
                            </Form.Group>
                            {/* <Form.Text>{ validate.username && <p style={{ color: "red", fontSize: '0.8rem' }} className='mt-1 text-start'>{validate.username}</p> }</Form.Text> */}
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