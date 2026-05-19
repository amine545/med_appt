import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
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
  bookSlot,
  onBookClick,
  onAppointmentSubmit,
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [profilePic]);

  const hasImage =
    typeof profilePic === 'string' &&
    profilePic.trim() !== '' &&
    (profilePic.startsWith('http') ||
      profilePic.startsWith('/') ||
      profilePic.startsWith('data:'));

  const defaultBookSlot = (
    <Popup
      modal
      onOpen={() => onBookClick?.()}
      trigger={
        <button type="button" className="book-appointment-btn">
          <div>Book Appointment</div>
          <div>No Booking Fee</div>
        </button>
      }
    >
      {(close) => (
        <div style={{ padding: 16, minWidth: 300, maxWidth: '90vw' }}>
          <AppointmentForm
            doctorName={name}
            doctorSpeciality={speciality}
            onSubmit={(data) => {
              onAppointmentSubmit?.(data);
              close();
            }}
            onCancel={close}
          />
        </div>
      )}
    </Popup>
  );

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
        {bookSlot ?? defaultBookSlot}
      </div>
    </div>
  );
};

export default DoctorCard;
