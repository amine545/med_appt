import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FindDoctorSearch from '../FindDoctorSearch/FindDoctorSearch.jsx';
import DoctorCard from '../DoctorCard/DoctorCard.jsx';
import '../InstantConsultationBooking/InstantConsultation.css';

const portraitUrlForName = (name) => {
  let h = 0;
  for (let i = 0; i < name.length; i += 1) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0;
  }
  const gender = h % 2 === 0 ? 'women' : 'men';
  const idx = h % 99;
  return `https://randomuser.me/api/portraits/${gender}/${idx}.jpg`;
};

const withAvatarFallback = (list) =>
  list.map((d) => {
    const p = typeof d.profilePic === 'string' ? d.profilePic.trim() : '';
    const useExisting =
      p &&
      (p.startsWith('http') || p.startsWith('/') || p.startsWith('data:'));
    return {
      ...d,
      profilePic: useExisting ? p : portraitUrlForName(d.name),
    };
  });

const BookingConsultation = () => {
  const [searchParams] = useSearchParams();
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [isSearched, setIsSearched] = useState(false);

  useEffect(() => {
    fetch('https://api.npoint.io/9a5543d36f1460da2f63')
      .then((res) => res.json())
      .then((data) => {
        const doctorsList = withAvatarFallback(data);
        const speciality = searchParams.get('speciality');
        if (speciality) {
          const filtered = doctorsList.filter(
            (doctor) =>
              doctor.speciality.toLowerCase() === speciality.toLowerCase()
          );
          setFilteredDoctors(filtered);
          setIsSearched(true);
        } else {
          setFilteredDoctors([]);
          setIsSearched(false);
        }
      })
      .catch((err) => console.log(err));
  }, [searchParams]);

  return (
    <center>
      <div className="searchpage-container">
        <FindDoctorSearch showMarketing resultsPath="/booking-consultation" />
        <div className="search-results-container">
          {isSearched ? (
            <center>
              <h2>
                {filteredDoctors.length} doctors are available{' '}
                {searchParams.get('location')}
              </h2>
              <h3>
                Book appointments with minimum wait-time & verified doctor
                details
              </h3>
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <div
                    className="doctorcard"
                    key={`${doctor.name}-${doctor.speciality}`}
                  >
                    <DoctorCard {...doctor} />
                  </div>
                ))
              ) : (
                <p>No doctors found.</p>
              )}
            </center>
          ) : (
            ''
          )}
        </div>
      </div>
    </center>
  );
};

export default BookingConsultation;