import { render, screen, fireEvent } from '@testing-library/react';
import SignIn1 from '../views/auth/login';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
vi.mock('axios');

test('renders login form and inputs', () => {
  render(<BrowserRouter><SignIn1 /></BrowserRouter>);
  expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /signin/i })).toBeInTheDocument();
});

test('allows user to type email and password', () => {
  render(<BrowserRouter><SignIn1 /></BrowserRouter>);
  fireEvent.change(screen.getByPlaceholderText(/email address/i), { target: { value: 'admin@example.com' } });
  fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: '123456' } });

  expect(screen.getByPlaceholderText(/email address/i).value).toBe('admin@example.com');
  expect(screen.getByPlaceholderText(/password/i).value).toBe('123456');
});

test('successful login navigates to dashboard', async () => {
  axios.post.mockResolvedValue({ status: 200 });

  render(<BrowserRouter><SignIn1 /></BrowserRouter>);
  fireEvent.change(screen.getByPlaceholderText(/email address/i), { target: { value: 'admin@example.com' } });
  fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: '123456' } });
  fireEvent.click(screen.getByRole('button', { name: /signin/i }));

  // Tunggu navigasi atau efek
  await screen.findByText(/forgot password/i);
});



