import { render, screen, fireEvent } from '@testing-library/react';
import { it, vi } from 'vitest';
import User from "../views/user/index";
import { BrowserRouter } from 'react-router-dom';
import { within } from '@testing-library/react';
import axios from 'axios';
vi.mock('axios');

const mockUsers = Array.from({ length: 12 }, (_, i) => ({
  user_id: i + 1,
  user: {
    username: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    jamKerja: [{ time_in: '08:00', time_out: '17:00' }],
  },
  satpel: {
    name: `Satpel ${i + 1}`,
  },
}));

describe('User Page', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockUsers });
    render(
      <BrowserRouter>
        <User />
      </BrowserRouter>
    );
  });
  it('should render search input with correct placeholder', () => {
    const input = screen.getByPlaceholderText('Cari pengguna');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'search');
  });

  it('renders table with correct headers', async () => {
    const table = await screen.findByRole('table', { name: /users table/i });
    const headers = within(table).getAllByRole('columnheader');
    const headerTexts = headers.map((h) => h.textContent);

    expect(headerTexts).toEqual([
      'Nama',
      'Email',
      'Satpel',
      'Jam Kerja',
      'Aksi',
    ]);
  });
});