// react-bootstrap
import MainCard from 'components/Card/MainCard';
import { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { io } from 'socket.io-client';

// -----------------------|| SAMPLE ||-----------------------//

const socket = io('http://localhost:3000');

export default function MonitorPegawai() {

  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // buka halaman beri tahu server
    socket.emit('admin:subscribe');

    socket.on('disconnect', () => {
      socket.emit('admin:unsubscribe');
      console.log('Admin disconnected!');
    });

    // beritahu server kalau halaman di tutup
    return () => {
      socket.emit('admin:unsubscribe');
      // socket.disconnect();
    }
  }, []);

  // menerima lokasi dari user
  useEffect(() => {
    socket.on('user:location', (data) => {
      console.log('Lokasi User : ', data);
      setLocations(data);
    })
  }, []);

  return (
    <Row>
      <Col>
        <MapContainer center={[-1.1956427, 116.8815571]} zoom={12} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {
            locations.map((loc, index) => (
              <Marker key={index} position={[loc.latitude, loc.longitude]}>
                <Popup>
                  { loc.username }
                </Popup>
              </Marker>
            ))
          }
        </MapContainer>
      </Col>
      {/* <Col sm={12} className='mt-3'>
        <MainCard title="Monitor Pegawai">
          <Col sm={4}>
          <ul>
            <li className='bg-success text-white'>Randi</li>
          </ul>
          </Col>
        </MainCard>
      </Col> */}
    </Row>
  );
}
