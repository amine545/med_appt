import React, { useEffect, useState } from 'react';
import './InstantConsultation.css';
import { useSearchParams } from 'react-router-dom';
import FindDoctorSearchIC from './FindDoctorSearchIC/FindDoctorSearchIC';
import DoctorCardIC from './DoctorCardIC/DoctorCardIC';

/** Stable “headshot” per doctor — RandomUser portrait set (realistic photos). */
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

const InstantConsultation = () => {
    const [searchParams] = useSearchParams();
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [isSearched, setIsSearched] = useState(false);
    
    const getDoctorsDetails = () => {
        fetch('https://api.npoint.io/9a5543d36f1460da2f63')
        .then(res => res.json())
        .then((data) => {
            const doctorsList = withAvatarFallback(data);
            if (searchParams.get('speciality')) {
                const filtered = doctorsList.filter(
                    (doctor) =>
                        doctor.speciality.toLowerCase() ===
                        searchParams.get('speciality').toLowerCase()
                );
                setFilteredDoctors(filtered);
                setIsSearched(true);
            } else {
                setFilteredDoctors([]);
                setIsSearched(false);
            }
            setDoctors(doctorsList);
        })
        .catch(err => console.log(err));
    }
    const handleSearch = (searchText) => {

        if (searchText === '') {
            setFilteredDoctors([]);
            setIsSearched(false);
            } else {
                
            const filtered = doctors.filter(
                (doctor) =>
                // 
                doctor.speciality.toLowerCase().includes(searchText.toLowerCase())
                
            );
                
            setFilteredDoctors(filtered);
            setIsSearched(true);
        }
    };
    useEffect(() => {
        getDoctorsDetails();
        // const authtoken = sessionStorage.getItem("auth-token");
        // if (!authtoken) {
        //     navigate("/login");
        // }
    }, [searchParams])

    return (
        <center>
            <div  className="searchpage-container">
            <FindDoctorSearchIC onSearch={handleSearch} />
            <div className="search-results-container">
            {isSearched ? (
                <center>
                    <h2>{filteredDoctors.length} doctors are available {searchParams.get('location')}</h2>
                    <h3>Book appointments with minimum wait-time & verified doctor details</h3>
                    {filteredDoctors.length > 0 ? (
                    filteredDoctors.map(doctor => <DoctorCardIC className="doctorcard" {...doctor} key={doctor.name} />)
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
    )
}

export default InstantConsultation