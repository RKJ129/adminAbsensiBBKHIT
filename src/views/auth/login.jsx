import { Navigate, NavLink, useNavigate } from 'react-router-dom';

// react-bootstrap
import { Card, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';

// third party
import FeatherIcon from 'feather-icons-react';

// assets
import logoDark from 'assets/images/logo-dark.svg';
import { useState } from 'react';
import axios from 'axios';

// -----------------------|| SIGNIN 1 ||-----------------------//

export default function SignIn1() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validate, setValidate] = useState({});

  const login = async () => {
    try {
      const { status } = await axios.post("http://localhost:3000/api/admin/login", {
        email: email,
        password: password
      }, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      });
      console.log("Status : ", status);
      if(status === 200) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Login gagal : ", error.response);
      const { errors } = error.response.data;
      const status = error.response?.status;
      console.log('Status : ', status);
      setValidate(errors);
    }
  }
  
  return (
    <div className="auth-wrapper">
      <div className="auth-content text-center">
        <Card className="borderless">
          <Row className="align-items-center text-center">
            <Col>
              <Card.Body className="card-body">
                <img src={logoDark} alt="" className="img-fluid mb-4" />
                <h4 className="mb-3 f-w-400">Signin</h4>
                <div className='mb-3'>
                  <InputGroup>
                    <InputGroup.Text>
                      <FeatherIcon icon="mail" />
                    </InputGroup.Text>
                    <Form.Control type="email" placeholder="Email address" onChange={(e) => setEmail(e.target.value)} />
                  </InputGroup>
                  <Form.Text>{ validate.email && <p style={{ color: "red", fontSize: '0.8rem' }} className='mt-1 text-start'>{validate.email}</p> }</Form.Text>
                </div>
                <div className="mb-3">
                  <InputGroup>
                    <InputGroup.Text>
                      <FeatherIcon icon="lock" />
                    </InputGroup.Text>
                    <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                  </InputGroup>
                  <Form.Text>{ validate.password && <p style={{ color: "red", fontSize: '0.8rem' }} className='mt-1 text-start'>{validate.password}</p> }</Form.Text>
                </div>
                {/* <Form.Group>
                  <Form.Check type="checkbox" className="text-left mb-4 mt-2" label="Save Credentials." defaultChecked />
                </Form.Group> */}
                <Button className="btn btn-block btn-primary mb-4" onClick={login}>Signin</Button>
                {/* <p className="mb-2 text-muted">
                  Forgot password?{' '}
                  <NavLink to="#" className="f-w-400">
                    Reset
                  </NavLink>
                </p>
                <p className="mb-0 text-muted">
                  Don’t have an account?{' '}
                  <NavLink to="/register" className="f-w-400">
                    Signup
                  </NavLink>
                </p> */}
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
}
