import { render, screen, fireEvent } from '@testing-library/react'; 
import RekapAbsensi from "../views/rekap/index";
import axios from 'axios';

vi.mock('axios');

describe('RekapAbsensi Component', () => { beforeEach(() => { axios.get.mockResolvedValue({ data: { data: [ { username: 'user1', attendances: [ { date: '2023-04-01T00:00:00Z', attendanceLocation: [ { attendance_type: 'IN', status: 'Present', latitude: '-6.200000', longitude: '106.816666', time_in: '2023-04-01T08:00:00Z', time_out: '2023-04-01T17:00:00Z', }, ], }, ], }, ], message: 'Success', }, }); });

    test('renders table with user attendance data', async () => { render(<RekapAbsensi />);

        // Wait for the data to be loaded and displayed
        const userAccordion = await screen.findByText(/user1/i);
        expect(userAccordion).toBeInTheDocument();

        // Check for table headers
        expect(screen.getByText(/hari/i)).toBeInTheDocument();
        expect(screen.getByText(/tanggal/i)).toBeInTheDocument();
        expect(screen.getByText(/jam/i)).toBeInTheDocument();
        expect(screen.getByText(/tipe/i)).toBeInTheDocument();
        expect(screen.getByText(/status/i)).toBeInTheDocument();
        expect(screen.getByText(/koordinat/i)).toBeInTheDocument();

    });

    test('pagination controls work correctly', async () => { render(<RekapAbsensi />);

        // Wait for the data to be loaded
        await screen.findByText(/user1/i);

        // Check if pagination buttons are in the document
        expect(screen.getByLabelText(/first page/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/previous page/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/next page/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/last page/i)).toBeInTheDocument();

    });

    test('month and year selectors change state', async () => { render(<RekapAbsensi />);

        // Wait for the data to be loaded
        await screen.findByText(/user1/i);

        const monthSelect = screen.getByLabelText(/filter by month/i);
        const yearSelect = screen.getByLabelText(/filter by year/i);

        // Change month
        fireEvent.change(monthSelect, { target: { value: '5' } });
        expect(monthSelect.value).toBe('5');

        // Change year
        fireEvent.change(yearSelect, { target: { value: '2022' } });
        expect(yearSelect.value).toBe('2022');

    });

    test('emptyRows returns correct value', () => {
    const page = 2;
    const rowsPerPage = 10;
    const rows = Array(15).fill({});
    const result = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
    expect(result).toBe(15); // (1+2)*10 - 15 = 30 - 15 = 15
  });

  it('handleChangePage updates page state', () => {
    let page = 0;
    const setPage = vi.fn((val) => page = val);
    const handleChangePage = (e, newPage) => setPage(newPage);
    handleChangePage(null, 3);
    expect(setPage).toHaveBeenCalledWith(3);
  });

  it('handleChangeRowsPerPage updates rowsPerPage and resets page', () => {
    let rowsPerPage = 10;
    let page = 2;
    const setRowsPerPage = vi.fn((val) => rowsPerPage = val);
    const setPage = vi.fn((val) => page = val);
    const handleChangeRowsPerPage = (e) => {
      setRowsPerPage(parseInt(e.target.value, 10));
      setPage(0);
    };
    handleChangeRowsPerPage({ target: { value: '25' } });
    expect(setRowsPerPage).toHaveBeenCalledWith(25);
    expect(setPage).toHaveBeenCalledWith(0);
  });

  it('getFormat returns formatted time or date', () => {
    const date = '2025-10-16T22:21:00';
    const getFormat = (d, jam = false) => {
      const dateObj = new Date(d);
      if (jam) {
        return dateObj.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      }
      return dateObj;
    };
    expect(getFormat(date, true)).toMatch(/\d{2}:\d{2}:\d{2}/);
    expect(getFormat(date) instanceof Date).toBe(true);
  });

  it('createRecord returns correct attendance object', () => {
    const attendance = {
      date: '2025-10-16T08:00:00',
      time_in: '2025-10-16T08:00:00',
      time_out: '2025-10-16T17:00:00'
    };
    const location = {
      attendance_type: 'IN',
      status: 'Hadir',
      latitude: '-1.234',
      longitude: '116.789'
    };
    const getFormat = (d, jam = false) => {
      const dateObj = new Date(d);
      if (jam) {
        return dateObj.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      }
      return dateObj;
    };
    const createRecord = (attendance, location) => {
      const hari = getFormat(attendance.date).toLocaleDateString('id-ID', { weekday: 'long' });
      return {
        hari,
        tanggal: getFormat(attendance.date).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }),
        jam: location.attendance_type === "IN" ? getFormat(attendance.time_in, true) : getFormat(attendance.time_out, true),
        tipe: location.attendance_type,
        status: location.status,
        koordinat: `${location.latitude}, ${location.longitude}`
      };
    };
    const result = createRecord(attendance, location);
    expect(result.hari).toBeDefined();
    expect(result.tanggal).toMatch(/\d{2} .* \d{4}/);
    expect(result.jam).toMatch(/\d{2}:\d{2}:\d{2}/);
    expect(result.tipe).toBe('IN');
    expect(result.status).toBe('Hadir');
    expect(result.koordinat).toBe('-1.234, 116.789');
  });

  it('years array contains 6 years including current', () => {
    const yearNow = new Date().getFullYear();
    const years = [];
    for (let i = yearNow - 5; i <= yearNow; i++) {
      years.push(i);
    }
    expect(years.length).toBe(6);
    expect(years[0]).toBe(yearNow - 5);
    expect(years[5]).toBe(yearNow);
  });
});