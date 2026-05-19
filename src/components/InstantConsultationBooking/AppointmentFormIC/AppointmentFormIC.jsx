import { useState } from 'react';

const AppointmentFormIC = ({ doctorName, doctorSpeciality, onSubmit }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onSubmit === 'function') {
      onSubmit({ name, phoneNumber });
    }
    setName('');
    setPhoneNumber('');
  };

  return (
    <form onSubmit={handleSubmit} className="appointment-form">
      {(doctorName || doctorSpeciality) && (
        <div className="form-doctor">
          {doctorName ? <strong>{doctorName}</strong> : null}
          {doctorName && doctorSpeciality ? ' · ' : null}
          {doctorSpeciality ? <span>{doctorSpeciality}</span> : null}
        </div>
      )}
      <div className="form-group">
        <label htmlFor="ic-name">Name:</label>
        <input
          type="text"
          id="ic-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="ic-phone">Phone Number:</label>
        <input
          type="tel"
          id="ic-phone"
          value={phoneNumber}
          onChange={(e) =>
            setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))
          }
          pattern="[0-9]{10}"
          required
        />
      </div>
      <button type="submit">Book Now</button>
    </form>
  );
};

export default AppointmentFormIC;
