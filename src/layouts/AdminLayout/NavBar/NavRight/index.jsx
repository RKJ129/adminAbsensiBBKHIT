import { Link, useNavigate } from 'react-router-dom';

// react-bootstrap
import { ListGroup, Dropdown, Form } from 'react-bootstrap';

// third party
import FeatherIcon from 'feather-icons-react';

// assets
import avatar2 from 'assets/images/user/avatar-2.jpg';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../../contexts/AuthContext';

// -----------------------|| NAV RIGHT ||-----------------------//

export default function NavRight() {
  const [user, setUser] = useState({});
  const { logout, userRole } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/admin/me', { withCredentials: true });
        console.log('Berhasil set auth user');

        const payload = response.data.result;
        setUser(payload);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  const navigate = useNavigate();

  // const logout = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:3000/api/admin/logout', { withCredentials: true });
  //     navigate('/login');
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  }

  return (
    <ListGroup as="ul" bsPrefix=" " className="list-unstyled">
      <ListGroup.Item as="li" bsPrefix=" " className="pc-h-item">
        <Dropdown>
          {/* <Dropdown.Toggle as="a" variant="link" className="pc-head-link arrow-none me-0">
            <i className="material-icons-two-tone">search</i>
          </Dropdown.Toggle> */}
          <Dropdown.Menu className="dropdown-menu-end pc-h-dropdown drp-search">
            <Form className="px-3">
              <div className="form-group mb-0 d-flex align-items-center">
                <FeatherIcon icon="search" />
                <Form.Control type="search" className="border-0 shadow-none" placeholder="Search here. . ." />
              </div>
            </Form>
          </Dropdown.Menu>
        </Dropdown>
      </ListGroup.Item>
      <ListGroup.Item as="li" bsPrefix=" " className="pc-h-item">
        <Dropdown className="drp-user">
          <Dropdown.Toggle as="a" variant="link" className="pc-head-link arrow-none me-0 user-name">
            <img src={ `http://localhost:3000/image/${user.photo_url ?? 'default-profile.jpeg'} ` } alt="userimage" className="user-avatar" />
            <span>
              <span className="user-name text-capitalize">{ user.username }</span>
              <span className="user-desc">{ userRole == 'admin' ? 'Administrator' : 'Superadmin' }</span>
            </span>
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu-end pc-h-dropdown">
            {/* <Dropdown.Header className="pro-head">
              <h5 className="text-overflow m-0">
                <span className="badge bg-light-success">Pro</span>
              </h5>
            </Dropdown.Header> */}
            <Link to="/profile" className="dropdown-item">
              <i className="feather icon-user" /> Profile
            </Link>
            {/* <Link to="/auth/signin-2" className="dropdown-item">
              <i className="feather icon-lock" /> Lock Screen
            </Link> */}
            <Link to="#" className="dropdown-item" onClick={handleLogout}>
              <i className="material-icons-two-tone">chrome_reader_mode</i> Logout
            </Link>
          </Dropdown.Menu>
        </Dropdown>
      </ListGroup.Item>
    </ListGroup>
  );
}
