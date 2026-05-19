import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import DoctorCard from '../../DoctorCard/DoctorCard.jsx';
import './DoctorCardIC.css';
import AppointmentFormIC from '../AppointmentFormIC/AppointmentFormIC';
import { v4 as uuidv4 } from 'uuid';

const DoctorCardIC = ({
  name,
  speciality,
  experience,
  ratings,
  profilePic,
  careerProfile,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const handleCancel = (appointmentId) => {
    setAppointments((prev) =>
      prev.filter((appointment) => appointment.id !== appointmentId)
    );
  };

  const handleFormSubmit = (appointmentData) => {
    const newAppointment = {
      id: uuidv4(),
      ...appointmentData,
    };
    setAppointments((prev) => [...prev, newAppointment]);
    setShowModal(false);
  };

  const bookSlot = (
    <Popup
      style={{ backgroundColor: '#FFFFFF' }}
      trigger={
        <button
          type="button"
          className={`book-appointment-btn ${
            appointments.length > 0 ? 'cancel-appointment' : ''
          }`}
        >
          {appointments.length > 0 ? (
            <div>Cancel Appointment</div>
          ) : (
            <div>Book Appointment</div>
          )}
          <div>No Booking Fee</div>
        </button>
      }
      modal
      open={showModal}
      onClose={() => setShowModal(false)}
    >
      {() => (
        <div className="doctorbg" style={{ height: '100vh', overflow: 'scroll' }}>
          <div>
            <div className="doctor-card-profile-image-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="46"
                height="46"
                fill="currentColor"
                className="bi bi-person-fill"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              </svg>
            </div>
            <div className="doctor-card-details">
              <div className="doctor-card-detail-name">{name}</div>
              <div className="doctor-card-detail-speciality">{speciality}</div>
              <div className="doctor-card-detail-experience">
                {experience} years experience
              </div>
              <div className="doctor-card-detail-consultationfees">
                Ratings: {ratings}
              </div>
            </div>
          </div>

          {appointments.length > 0 ? (
            <>
              <h3 style={{ textAlign: 'center' }}>Appointment Booked!</h3>
              {appointments.map((appointment) => (
                <div className="bookedInfo" key={appointment.id}>
                  <p>Name: {appointment.name}</p>
                  <p>Phone Number: {appointment.phoneNumber}</p>
                  {appointment.appointmentDate ? (
                    <p>Date: {appointment.appointmentDate}</p>
                  ) : null}
                  {appointment.timeSlot ? (
                    <p>Time slot: {appointment.timeSlot}</p>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => handleCancel(appointment.id)}
                  >
                    Cancel Appointment
                  </button>
                </div>
              ))}
            </>
          ) : (
            <AppointmentFormIC
              doctorName={name}
              doctorSpeciality={speciality}
              onSubmit={handleFormSubmit}
            />
          )}
        </div>
      )}
    </Popup>
  );

  return (
    <DoctorCard
      name={name}
      speciality={speciality}
      experience={experience}
      ratings={ratings}
      profilePic={profilePic}
      careerProfile={careerProfile}
      bookSlot={bookSlot}
    />
  );
};

export default DoctorCardIC;
