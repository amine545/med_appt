import React, { useMemo, useState } from 'react';
import './AppointmentForm.css';

const TIME_SLOTS = [
  '09:00 AM – 10:00 AM',
  '10:00 AM – 11:00 AM',
  '11:00 AM – 12:00 PM',
  '02:00 PM – 03:00 PM',
  '03:00 PM – 04:00 PM',
  '04:00 PM – 05:00 PM',
];

const digitsOnly = (s) => s.replace(/\D/g, '');

const AppointmentForm = ({
  doctorName,
  doctorSpeciality,
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [formError, setFormError] = useState('');

  const minDate = useMemo(() => {
    const t = new Date();
    return t.toISOString().split('T')[0];
  }, []);

  const reset = () => {
    setName('');
    setPhoneNumber('');
    setAppointmentDate('');
    setTimeSlot('');
    setFormError('');
  };

  const validate = () => {
    const n = name.trim();
    const p = phoneNumber.trim();
    const d = appointmentDate.trim();
    const slot = timeSlot.trim();

    if (!n) {
      setFormError('Please enter your name.');
      return false;
    }
    if (digitsOnly(p).length < 10) {
      setFormError('Please enter a valid phone number (at least 10 digits).');
      return false;
    }
    if (!d) {
      setFormError('Please choose a date for your appointment.');
      return false;
    }
    if (d < minDate) {
      setFormError('Appointment date cannot be in the past.');
      return false;
    }
    if (!slot) {
      setFormError('Please select a time slot.');
      return false;
    }
    setFormError('');
    return true;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: name.trim(),
      phoneNumber: phoneNumber.trim(),
      appointmentDate,
      timeSlot,
    });
    reset();
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="appointment-form"
      noValidate
    >
      {(doctorName || doctorSpeciality) && (
        <div className="form-doctor">
          {doctorName ? <strong>{doctorName}</strong> : null}
          {doctorName && doctorSpeciality ? ' · ' : null}
          {doctorSpeciality ? <span>{doctorSpeciality}</span> : null}
        </div>
      )}

      {formError ? <div className="form-error">{formError}</div> : null}

      <div className="form-group">
        <label htmlFor="appt-name">Name:</label>
        <input
          type="text"
          id="appt-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
      </div>
      <div className="form-group">
        <label htmlFor="appt-phone">Phone Number:</label>
        <input
          type="tel"
          id="appt-phone"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          autoComplete="tel"
        />
      </div>
      <div className="form-group">
        <label htmlFor="appt-date">Date of Appointment:</label>
        <input
          type="date"
          id="appt-date"
          value={appointmentDate}
          min={minDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="appt-slot">Book Time Slot:</label>
        <select
          id="appt-slot"
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
        >
          <option value="">Select a time slot</option>
          {TIME_SLOTS.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </div>
      <div className="form-actions">
        <button type="submit">Book Now</button>
        {typeof onCancel === 'function' ? (
          <button
            type="button"
            className="secondary"
            onClick={() => {
              reset();
              onCancel();
            }}
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
};

export default AppointmentForm;
