import { Row, Col, Form, Button } from 'react-bootstrap';

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { apiKey } from '../../../utils/env';

export default function EditProfile ({ setProfile, setPreview }) {

    const [validate, setValidate] = useState({});

    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');

    const indexProfile = useCallback(async () => {
        try {
          const { data } = await axios.get(`${apiKey}/api/admin/profile`, { withCredentials: true });
          console.log('Profile data : ', data);
          setProfile(data.result);
          const payload = data.result;
          setUsername(payload.username);
          setFirstname(payload.firstname);
          setLastname(payload.lastname);
          setEmail(payload.email);
          if(payload.photo_url) {
            setPreview(payload.photo_url);
          }
        } catch (error) {
          console.error(error);
        }
      }, []);

    useEffect(() => {
        indexProfile();
    }, [indexProfile]);

    const updateProfile = async () => {
        try {
        await axios.patch(`${apiKey}/api/admin/profile/update`, {
            username: username,
            firstname: firstname,
            lastname: lastname,
            email: email
        }, { withCredentials: true });
        indexProfile();
        console.log('Berhasil update profile');
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
            <Col sm={10}>
                <Form onSubmit={async (e) => {
                    e.preventDefault();
                    updateProfile();
                }}>
                    <div className='mb-3'>
                        <Form.Group className='mb-1' controlId='inputUsername'>
                            <Form.Label>Username :</Form.Label>
                            <Form.Control type='text' placeholder='Username' value={username || ''} onChange={(e) => setUsername(e.target.value)} />
                        </Form.Group>
                        <Form.Text>{ validate.username && <p style={{ color: "red", fontSize: '0.8rem' }} className='mt-1 text-start'>{validate.username}</p> }</Form.Text>
                    </div>
                    <Row>
                        <Col sm={6}>
                            <div className='mb-3'>
                                <Form.Group className='mb-1' controlId='inputFirstname'>
                                    <Form.Label>Firstname :</Form.Label>
                                    <Form.Control type='text' placeholder='Firstname' value={firstname || ''} onChange={(e) => setFirstname(e.target.value)} />
                                </Form.Group>
                                <Form.Text>{ validate.firstname && <p style={{ color: "red", fontSize: '0.8rem' }} className='mt-1 text-start'>{validate.firstname}</p> }</Form.Text>
                            </div>
                        </Col>
                        <Col sm={6}>
                            <div className='mb-3'>
                                <Form.Group className='mb-1' controlId='inputFirstname'>
                                    <Form.Label>Lastname :</Form.Label>
                                    <Form.Control type='text' placeholder='Lastname' value={lastname || ''} onChange={(e) => setLastname(e.target.value)} />
                                </Form.Group>
                                <Form.Text>{ validate.lastname && <p style={{ color: "red", fontSize: '0.8rem' }} className='mt-1 text-start'>{validate.lastname}</p> }</Form.Text>
                            </div>
                        </Col>
                    </Row>
                    <div className='mb-3'>
                        <Form.Group className='mb-1' controlId='inputEmail'>
                            <Form.Label>Email :</Form.Label>
                            <Form.Control type='email' placeholder='name@email.com' value={email || ''} onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>
                        <Form.Text>{ validate.email && <p style={{ color: "red", fontSize: '0.8rem' }} className='mt-1 text-start'>{validate.email}</p> }</Form.Text>
                    </div>
                    <Button type='submit' variant='primary' size='lg'>Submit</Button>
                </Form>
            </Col>
        </>
    )
}