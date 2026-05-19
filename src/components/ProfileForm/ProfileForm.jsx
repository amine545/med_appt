import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config.js';
import './ProfileForm.css';

const ProfileForm = () => {
  const [userDetails, setUserDetails] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [updatedDetails, setUpdatedDetails] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const navigate = useNavigate();

  const fetchUserProfile = useCallback(async () => {
    try {
      const authtoken = sessionStorage.getItem('auth-token');
      const email = sessionStorage.getItem('email');

      if (!authtoken) {
        setLoading(false);
        navigate('/login');
        return;
      }

      if (!email) {
        setLoading(false);
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/auth/user`, {
        headers: {
          Authorization: `Bearer ${authtoken}`,
          Email: email,
        },
      });

      if (response.ok) {
        const user = await response.json();
        setUserDetails(user);
        setUpdatedDetails(user);
        setLoadError('');
        sessionStorage.setItem('name', user.name || '');
        sessionStorage.setItem('phone', user.phone || '');
        sessionStorage.setItem('med_appt_user_name', user.name || '');
        sessionStorage.setItem('med_appt_user_phone', user.phone || '');
        sessionStorage.setItem('med_appt_user_email', user.email || '');
        window.dispatchEvent(new Event('med_appt-user-updated'));
      } else {
        throw new Error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error(error);
      setLoadError('Could not load profile. Is the server running and are you logged in?');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const authtoken = sessionStorage.getItem('auth-token');
    if (!authtoken) {
      setLoading(false);
      navigate('/login');
      return;
    }
    fetchUserProfile();
  }, [navigate, fetchUserProfile]);

  const handleEdit = () => {
    setUpdatedDetails({ ...userDetails });
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    setUpdatedDetails({
      ...updatedDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const authtoken = sessionStorage.getItem('auth-token');
      const email = sessionStorage.getItem('email');

      if (!authtoken || !email) {
        navigate('/login');
        return;
      }

      const payload = {
        name: updatedDetails.name,
        phone: updatedDetails.phone,
      };

      const response = await fetch(`${API_URL}/api/auth/user`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authtoken}`,
          'Content-Type': 'application/json',
          Email: email,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.authtoken) {
          sessionStorage.setItem('auth-token', data.authtoken);
        }

        sessionStorage.setItem('name', updatedDetails.name);
        sessionStorage.setItem('phone', updatedDetails.phone);
        sessionStorage.setItem('med_appt_user_name', updatedDetails.name);
        sessionStorage.setItem('med_appt_user_phone', updatedDetails.phone);
        sessionStorage.setItem('med_appt_user_email', updatedDetails.email);
        window.dispatchEvent(new Event('med_appt-user-updated'));
        setEditMode(false);
        alert('Profile Updated Successfully!');
        navigate('/');
      } else {
        const errBody = await response.json().catch(() => ({}));
        console.error(errBody);
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error(error);
      alert('Update failed. Check name (min 4 chars) and phone (10 digits).');
    }
  };

  if (loading) {
    return (
      <div className="profile-container profile-container--centered">
        <p>Loading profile…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="profile-container profile-container--centered">
        <p className="profile-form__error">{loadError}</p>
        <button type="button" onClick={() => navigate('/login')}>
          Go to login
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {editMode ? (
        <form className="profile-form" onSubmit={handleSubmit}>
          <label className="profile-form__field">
            Name
            <input
              type="text"
              name="name"
              value={updatedDetails.name}
              onChange={handleInputChange}
              required
              minLength={4}
            />
          </label>
          <label className="profile-form__field">
            Phone
            <input
              type="text"
              name="phone"
              value={updatedDetails.phone}
              onChange={handleInputChange}
              required
              minLength={10}
              maxLength={20}
            />
          </label>
          <label className="profile-form__field">
            Email
            <input
              type="email"
              name="email"
              value={userDetails.email}
              disabled
              readOnly
            />
          </label>
          <button type="submit" className="profile-form__save">
            Save
          </button>
        </form>
      ) : (
        <div className="profile-details">
          <h1>Welcome, {userDetails.name}</h1>
          <p>
            <b>Email:</b> {userDetails.email}
          </p>
          <p>
            <b>Phone:</b> {userDetails.phone}
          </p>
          <button type="button" className="profile-form__edit" onClick={handleEdit}>
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileForm;
