import { useEffect, useState } from 'react';
import './Notification.css';

const Notification = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const handleBooked = (event) => {
      setDetails(event.detail || null);
      setVisible(true);
    };

    const handleCancelled = () => {
      setVisible(false);
      setDetails(null);
    };

    window.addEventListener('appointment:booked', handleBooked);
    window.addEventListener('appointment:cancelled', handleCancelled);

    return () => {
      window.removeEventListener('appointment:booked', handleBooked);
      window.removeEventListener('appointment:cancelled', handleCancelled);
    };
  }, []);

  return (
    <>
      {children}
      {visible && details ? (
        <div className="notification-container" role="status" aria-live="polite">
          <h4>Appointment Booked</h4>
          <p>
            <strong>Doctor:</strong> {details.doctorName}
          </p>
          <p>
            <strong>Name:</strong> {details.appointment?.name}
          </p>
          <p>
            <strong>Date:</strong>{' '}
            {details.appointment?.appointmentDate || 'Not provided'}
          </p>
          <p>
            <strong>Time:</strong> {details.appointment?.timeSlot || 'Not provided'}
          </p>
        </div>
      ) : null}
    </>
  );
};

export default Notification;
