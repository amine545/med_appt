import React, { useMemo, useState } from 'react';
import './FindDoctorSearch.css';
import { useNavigate } from 'react-router-dom';

const ALL_SPECIALITIES = [
  'Dentist',
  'Gynecologist/obstetrician',
  'General Physician',
  'Dermatologist',
  'Ear-nose-throat (ent) Specialist',
  'Homeopath',
  'Ayurveda',
];

const FindDoctorSearch = ({
  showMarketing = true,
  resultsPath = '/instant-consultation',
}) => {
  const [doctorResultHidden, setDoctorResultHidden] = useState(true);
  const [searchDoctor, setSearchDoctor] = useState('');
  const navigate = useNavigate();

  const visibleSpecialities = useMemo(() => {
    const q = searchDoctor.trim().toLowerCase();
    if (!q) return ALL_SPECIALITIES;
    return ALL_SPECIALITIES.filter((s) => s.toLowerCase().includes(q));
  }, [searchDoctor]);

  const handleDoctorSelect = (speciality) => {
    setSearchDoctor(speciality);
    setDoctorResultHidden(true);
    navigate(
      `${resultsPath}?speciality=${encodeURIComponent(speciality)}`
    );
  };

  return (
    <div className="finddoctor">
      <center>
        <h1>Find a doctor and Consult instantly</h1>
        {showMarketing ? (
          <div>
            <i
              style={{ color: '#000000', fontSize: '20rem' }}
              className="fa fa-user-md"
              aria-hidden="true"
            />
          </div>
        ) : null}
        <div
          className="home-search-container"
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <div className="doctor-search-box">
            <input
              type="text"
              className="search-doctor-input-box"
              placeholder="Search doctors, clinics, hospitals, etc."
              onFocus={() => setDoctorResultHidden(false)}
              onBlur={() => setDoctorResultHidden(true)}
              value={searchDoctor}
              onChange={(e) => setSearchDoctor(e.target.value)}
            />
            <div className="findiconimg">
              <img
                className="findIcon"
                src={`${import.meta.env.BASE_URL}images/search.svg`}
                alt=""
              />
            </div>
            <div
              className="search-doctor-input-results"
              hidden={doctorResultHidden}
            >
              {visibleSpecialities.map((speciality) => (
                <div
                  className="search-doctor-result-item"
                  key={speciality}
                  onMouseDown={() => handleDoctorSelect(speciality)}
                >
                  <span>
                    <img
                      src={`${import.meta.env.BASE_URL}images/search.svg`}
                      alt=""
                      style={{ height: '10px', width: '10px' }}
                      width="12"
                    />
                  </span>
                  <span>{speciality}</span>
                  <span>SPECIALITY</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </center>
    </div>
  );
};

export default FindDoctorSearch;
