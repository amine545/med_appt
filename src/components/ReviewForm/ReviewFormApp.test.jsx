import { describe, it, expect, beforeEach } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReviewFormApp from './ReviewFormApp.jsx';

const STORAGE_KEY = 'med_appt_review_bookings';

describe('ReviewFormApp', () => {
  beforeEach(() => {
    cleanup();
    sessionStorage.removeItem(STORAGE_KEY);
  });

  it('shows the latest appointment context when the same doctor books twice', async () => {
    const user = userEvent.setup();
    render(<ReviewFormApp />);

    window.dispatchEvent(
      new CustomEvent('appointment:booked', {
        detail: {
          doctorName: 'Dr. John Doe',
          speciality: 'Cardiology',
          appointment: {
            name: 'First Patient',
            phoneNumber: '5550000001',
            appointmentDate: '2030-01-01',
            timeSlot: '09:00 AM – 10:00 AM',
          },
        },
      })
    );
    window.dispatchEvent(
      new CustomEvent('appointment:booked', {
        detail: {
          doctorName: 'Dr. John Doe',
          speciality: 'Cardiology',
          appointment: {
            name: 'Second Patient',
            phoneNumber: '5550000002',
            appointmentDate: '2030-02-02',
            timeSlot: '10:00 AM – 11:00 AM',
          },
        },
      })
    );

    await user.click(screen.getAllByRole('button', { name: /click here/i })[0]);

    await waitFor(() => {
      expect(screen.getByText('Second Patient')).toBeInTheDocument();
    });
    expect(screen.getByText(/2 appointments on file/i)).toBeInTheDocument();
    expect(screen.queryByText('First Patient')).not.toBeInTheDocument();
  });

  it('shows only the matching doctor appointment when reviewing another doctor', async () => {
    const user = userEvent.setup();
    render(<ReviewFormApp />);

    window.dispatchEvent(
      new CustomEvent('appointment:booked', {
        detail: {
          doctorName: 'Dr. John Doe',
          speciality: 'Cardiology',
          appointment: {
            name: 'John Patient',
            phoneNumber: '5550000001',
            appointmentDate: '2030-03-01',
            timeSlot: '02:00 PM – 03:00 PM',
          },
        },
      })
    );
    window.dispatchEvent(
      new CustomEvent('appointment:booked', {
        detail: {
          doctorName: 'Dr. Jane Smith',
          speciality: 'Dermatology',
          appointment: {
            name: 'Jane Patient',
            phoneNumber: '5550000999',
            appointmentDate: '2030-03-15',
            timeSlot: '03:00 PM – 04:00 PM',
          },
        },
      })
    );

    await user.click(screen.getAllByRole('button', { name: /click here/i })[1]);

    await waitFor(() => {
      expect(screen.getByText('Jane Patient')).toBeInTheDocument();
    });
    expect(screen.queryByText('John Patient')).not.toBeInTheDocument();
  });
});
