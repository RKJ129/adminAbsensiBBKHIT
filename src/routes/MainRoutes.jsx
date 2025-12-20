import { lazy } from 'react';

import AdminLayout from 'layouts/AdminLayout';
import GuestLayout from 'layouts/GuestLayout';
import PrivateRoute from '../components/Routes/privateRoute';
import User from '../views/user';
import ManageAdmin from '../views/admin';
import TunjanganPegawai from '../views/tunjangan';
import Profile from '../views/profile';
import MonitorPegawai from '../views/monitor';

const DashboardSales = lazy(() => import('../views/dashboard/index'));
const DashboardAdminAbsensi = lazy(() => import('../views/dashboard/index'))

const Typography = lazy(() => import('../views/ui-elements/basic/BasicTypography'));
const Color = lazy(() => import('../views/ui-elements/basic/BasicColor'));

const FeatherIcon = lazy(() => import('../views/ui-elements/icons/Feather'));
const FontAwesome = lazy(() => import('../views/ui-elements/icons/FontAwesome'));
const MaterialIcon = lazy(() => import('../views/ui-elements/icons/Material'));

const Login = lazy(() => import('../views/auth/login'));
const Register = lazy(() => import('../views/auth/register'));

const Sample = lazy(() => import('../views/sample'));

const Rekap = lazy(() => import('../views/rekap'));
const Satpel = lazy(() => import('../views/satpel'));

const MainRoutes = {
  // element
  path: '/',
  children: [
    {
      path: '/',
      element: <AdminLayout />,
      children: [
        {
          index: true,
          path: '/dashboard',
          element: (
            <PrivateRoute roles={['admin', 'superadmin']}>
              <DashboardAdminAbsensi />
            </PrivateRoute>
          ),
        },
        {
          path: '/rekap',
          element: (
            <PrivateRoute roles={['admin', 'superadmin']}>
              <Rekap />
            </PrivateRoute>
          ),
        },
        {
          index: true,
          path: '/pengguna',
          element: (
            <PrivateRoute roles={['admin', 'superadmin']}>
              <User />
            </PrivateRoute>
          ),
        },
        {
          index: true,
          path: '/admin',
          element: (
            <PrivateRoute roles={['superadmin']}>
              <ManageAdmin />
            </PrivateRoute>
          ),
        },
        {
          index: true,
          path: '/tunjangan',
          element: <TunjanganPegawai />,
          roles: ['admin', 'superadmin']
        },
        {
          index: true,
          path: '/satpel',
          element: (
            <PrivateRoute roles={['superadmin']}>
              <Satpel />
            </PrivateRoute>
          ),
          roles: ['superadmin']
        },
        {
          index: true,
          path: '/profile',
          element: <Profile />,
          roles: ['admin', 'superadmin']
        },
        {
          path: '/typography',
          element: <Typography />,
        },
        {
          path: '/color',
          element: <Color />
        },
        {
          path: '/icons/Feather',
          element: <FeatherIcon />
        },
        {
          path: '/icons/font-awesome-5',
          element: <FontAwesome />
        },
        {
          path: '/icons/material',
          element: <MaterialIcon />
        },
        {
          path: '/sample-page',
          element: <Sample />
        },
        {
          path: '/monitor-pegawai',
          element:  (
            <PrivateRoute roles={['superadmin']}>
              <MonitorPegawai />
            </PrivateRoute>
          ),
        },
        {
          path: '*',
          element: <h1>Not Found</h1>
        }
      ]
    },
    {
      path: '/',
      element: <GuestLayout />,
      children: [
        {
          path: '/login',
          element: <Login />
        },
        {
          path: '/register',
          element: <Register />
        }
      ]
    }
  ]
};

export default MainRoutes;
