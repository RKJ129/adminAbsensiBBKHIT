// react-bootstrap
import { Row, Col, Card, Form, Button, Image, Stack } from 'react-bootstrap';

import EmailIcon from '@mui/icons-material/Email';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

import EditProfile from './components/editProfile';
import ChangePassword from './components/changePassword';

// -----------------------|| SAMPLE ||-----------------------//

export default function Profile() {
  const [profile, setProfile] = useState({});
  const [preview, setPreview] = useState("default-profile.jpeg");
  const [activeTab, setActiveTab] = useState("profile");

  const handleFileChange = async (e) => {

    const file = e.target.files[0];
    if(!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const { data } = await axios.patch('http://localhost:3000/api/admin/profile/update-photo', formData, {
        headers: {
          "Content-Type": 'multipart/form-data'
        },
        withCredentials: true
      });

      const photo = data.result.photo_url;
      setPreview(photo);
    } catch (error) {
      console.error(error);
    }

    e.target.value = null;
  }

  return (
    <Row className='pt-4'>
      <Col sm={12} lg={8} xs={{ order: 2 }} md={{ order: 1 }}>
        <Card>
          <Card.Body>
            <div className=' position-relative' style={{ marginBottom: '2.5rem' }}>
              <div className='d-flex align-items-center position-absolute bg-primary rounded-3 px-1' style={{ top: '-3rem', left: '-0.65rem', width: '105%' }}>
                <a  
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('profile');
                  }}
                  className={`px-2 py-1 m-2 rounded text-white ${
                    activeTab === "profile" ? "bg-danger" : ""
                  }`}

                  style={{ transition: 'background-color 0.3s, color 0.3s' }}
                >
                  Edit Profile
                </a>
                <a  
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('password');
                  }}
                  className={`px-3 py-1 m-2 rounded text-white ${
                    activeTab === "password" ? "bg-danger" : ""
                  }`}

                  style={{ transition: 'background-color 0.3s, color 0.3s' }}
                >
                  Ubah Password
                </a>
              
              </div>
            </div>

            {
              activeTab === 'profile' ? 
                <EditProfile setProfile={setProfile} setPreview={setPreview} />
                :
                <ChangePassword />
            }

            

          </Card.Body>
        </Card>
      </Col>
      
      <Col sm={4} xs={{ order: 1 }} md={{ order: 2 }}>
        <Card className='rounded'>
          <div className='w-100 rounded bg-primary' style={{ height: '7rem' }}>
          </div>
          <div className='position-relative' style={{ marginBottom: '4.2rem' }}>
          <div className='position-absolute start-50 translate-middle' style={{ top: '-0.5rem' }}>
            <Image src={'http://localhost:3000/image/' + preview} roundedCircle style={{ objectFit: 'cover' }} width='155px' height='155px' />
            <div 
              className=''
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                borderRadius: '50%',
                transition: 'opacity 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = 1)}
              onMouseLeave={e => (e.currentTarget.style.opacity = 0)}
              onClick={() => document.getElementById('photoInput').click()}
            >
              <Stack direction='horizontal' gap={1} className='justify-content-center'>
                <PhotoCameraIcon/>
                <small>Ubah foto</small>
              </Stack>
            </div>
              
              <input 
                id='photoInput'
                type='file'
                name='photo'
                accept='image/*'
                className='d-none'
                onChange={handleFileChange}
              />

          </div>
          </div>
          <Card.Body className='text-center text-capitalize'>
            <Card.Text className='fw-bold mb-3 text-primary' style={{ fontSize: '18px' }}>{ profile.firstname} {profile.lastname}</Card.Text>
            <Card.Text className='fw-medium text-secondary' style={{ fontSize: '0.85rem' }}>{ profile.username }</Card.Text>
            <Stack direction='horizontal' gap={2} className=' justify-content-center mb-4'>
              <EmailIcon fontSize='small' />
              <Card.Text className='fw-normal text-lowercase' style={{ fontSize: '0.8rem' }}>{ profile.email }</Card.Text>
            </Stack>
              <Stack direction='horizontal' gap={2} className='justify-content-center'>
                  <Card.Text className='fw-medium mb-1 bg-primary text-white px-2 py-1 rounded-2' style={{ fontSize: '0.8rem' }}>Administrator</Card.Text>
                  <Card.Text className='fw-medium mb-1 bg-danger text-white px-2 py-1 rounded-2' style={{ fontSize: '0.8rem' }}>Superadmin</Card.Text>

              </Stack>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
