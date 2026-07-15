import axios from "axios";
import { useState } from "react";
import { Button, Col, Form } from "react-bootstrap"
import { apiKey } from "../../../utils/env";


export default function ChangePassword () {
    const [validate, setValidate] = useState({});

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePassword = async () => {
        try {
            const { data } = await axios.patch(`${apiKey}/api/admin/profile/change-password`, {
                old_password: oldPassword,
                new_password: newPassword,
                confirm_password: confirmPassword,
            }, { withCredentials: true });

            const payload = data.message;
            setNewPassword('');
            // console.log('Payload Change Password : ', payload);
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
                <Form onSubmit={(e) => {
                    e.preventDefault();
                    handleChangePassword();
                }}>
                    <div className="mb-3">
                        <Form.Group className="mb-1" controlId="inputOldPassword">
                            <Form.Label>Password Lama :</Form.Label>
                            <Form.Control type="password" placeholder="Masukkan password lama" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                        </Form.Group>
                        <Form.Text>{ validate.old_password && <p style={{ color: "red", fontSize: '0.8rem' }} className='mt-1 text-start'>{validate.old_password}</p> }</Form.Text>
                    </div>
                    <div className="mb-3">
                        <Form.Group className="mb-1" controlId="inputNewPassword">
                            <Form.Label>Password Baru :</Form.Label>
                            <Form.Control type="password" placeholder="Masukkan password baru" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                            <Form.Text>{ validate.new_password && <p style={{ color: "red", fontSize: '0.8rem' }} className='mt-1 text-start'>{validate.new_password}</p> }</Form.Text>
                        </Form.Group>
                    </div>
                    <div className="mb-3">
                        <Form.Group className="mb-1" controlId="inputConfirmNewPassword">
                            <Form.Label>Konfirmasi Password Baru :</Form.Label>
                            <Form.Control type="password" placeholder="Konfirmasi password baru" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            <Form.Text>{ validate.confirm_password && <p style={{ color: "red", fontSize: '0.8rem' }} className='mt-1 text-start'>{validate.confirm_password}</p> }</Form.Text>
                        </Form.Group>
                    </div>
                    <Button type="submit" variant="primary" size="lg">Submit</Button>
                </Form>
            </Col>
        </>
    )
}