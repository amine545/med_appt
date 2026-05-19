import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { v4 as uuidv4 } from 'uuid';
import AppointmentForm from '../AppointmentForm/AppointmentForm.jsx';
import './DoctorCard.css';

const PlaceholderAvatar = () => (
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
);

const RatingRow = ({ ratings }) => {
  const n = Number(ratings);
  if (!Number.isNaN(n) && n >= 0 && n <= 5) {
    const rounded = Math.round(n);
    return (
      <div
        className="doctor-card-detail-consultationfees"
        aria-label={`Rating ${rounded} of 5`}
      >
        <span className="doctor-card-rating-stars">
          {[1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className={i <= rounded ? 'star filled' : 'star'}
              aria-hidden="true"
            >
              ★
            </span>
          ))}
        </span>
      </div>
    );
  }
  return (
    <div className="doctor-card-detail-consultationfees">
      Ratings: {ratings}
    </div>
  );
};

const DoctorCard = ({
  name,
  speciality,
  experience,
  ratings,
  profilePic,
  careerProfile,
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    setImageFailed(false);
  }, [profilePic]);

  const hasImage =
    typeof profilePic === 'string' &&
    profilePic.trim() !== '' &&
    (profilePic.startsWith('http') ||
      profilePic.startsWith('/') ||
      profilePic.startsWith('data:'));

  const handleCancel = (appointmentId) => {
    const cancelledAppointment = appointments.find(
      (appointment) => appointment.id === appointmentId
    );
    setAppointments((prev) =>
      prev.filter((appointment) => appointment.id !== appointmentId)
    );
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('appointment:cancelled', {
          detail: {
            appointmentId,
            doctorName: name,
            appointment: cancelledAppointment || null,
          },
        })
      );
    }
  };

  return (
    <div className="doctor-card-container">
      <div className="doctor-card-details-container">
        <div className="doctor-card-profile-image-container">
          {hasImage && !imageFailed ? (
            <img
              src={profilePic}
              alt={`${name} portrait`}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <PlaceholderAvatar />
          )}
        </div>
        <div className="doctor-card-details">
          <div className="doctor-card-detail-name">{name}</div>
          <div className="doctor-card-detail-speciality">{speciality}</div>
          <div className="doctor-card-detail-experience">
            {experience} years experience
          </div>
          <RatingRow ratings={ratings} />
        </div>
        {careerProfile ? (
          <p className="doctor-card-career">{careerProfile}</p>
        ) : null}
      </div>

      <div className="doctor-card-options-container">
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
        >
          {(close) => (
            <div
              className="doctorbg"
              style={{ height: '100vh', overflow: 'scroll' }}
            >
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
                <AppointmentForm
                  doctorName={name}
                  doctorSpeciality={speciality}
                  onSubmit={(data) => {
                    const newAppointment = { id: uuidv4(), ...data };
                    setAppointments((prev) => [
                      ...prev,
                      newAppointment,
                    ]);
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(
                        new CustomEvent('appointment:booked', {
                          detail: {
                            doctorName: name,
                            speciality,
                            appointment: newAppointment,
                          },
                        })
                      );
                    }
                    close();
                  }}
                  onCancel={close}
                />
              )}
            </div>
          )}
        </Popup>
      </div>
    </div>
  );
};

export default DoctorCard;
