import { useCallback, useEffect, useState } from 'react';
import ReviewForm from './ReviewForm.jsx';

const STORAGE_KEY = 'med_appt_review_bookings';

function readStoredBookings() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Page shell for reviews: wires ReviewForm to live appointment data from
 * DoctorCard (appointment:booked) so the form can show visit context.
 */
const ReviewFormApp = () => {
  const [bookings, setBookings] = useState(readStoredBookings);

  useEffect(() => {
    const onBooked = (event) => {
      const { doctorName, speciality, appointment } = event.detail || {};
      if (!appointment || !doctorName) return;
      const entry = {
        doctorName,
        speciality: speciality || '',
        name: appointment.name,
        phoneNumber: appointment.phoneNumber,
        appointmentDate: appointment.appointmentDate,
        timeSlot: appointment.timeSlot,
      };
      setBookings((prev) => {
        const next = [...prev, { ...entry, bookedAt: Date.now() }];
        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* ignore quota */
        }
        return next;
      });
    };

    window.addEventListener('appointment:booked', onBooked);
    return () => window.removeEventListener('appointment:booked', onBooked);
  }, []);

  const getAppointmentForRow = useCallback((row) => {
    const matches = bookings.filter(
      (b) =>
        b.doctorName === row.doctorName && b.speciality === row.speciality
    );
    if (!matches.length) return null;
    const latest = matches[matches.length - 1];
    return {
      name: latest.name,
      phoneNumber: latest.phoneNumber,
      appointmentDate: latest.appointmentDate,
      timeSlot: latest.timeSlot,
      visitCount: matches.length,
    };
  }, [bookings]);

  return <ReviewForm getAppointmentForRow={getAppointmentForRow} />;
};

export default ReviewFormApp;
