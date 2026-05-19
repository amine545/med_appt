import { useCallback, useEffect, useState } from 'react';
import { API_URL } from '../../config.js';
import './ProfileCard.css';

const emptyUser = { name: '', email: '', phone: '—' };

/**
 * @param {'props' | 'remote'} [mode='props'] — remote: GET /api/auth/user using session (assignment: fetch in ProfileCard).
 */
const ProfileCard = ({
  mode = 'props',
  name,
  email,
  phone = '—',
  role = 'Patient',
}) => {
  const [remoteUser, setRemoteUser] = useState(emptyUser);
  const [loading, setLoading] = useState(mode === 'remote');
  const [error, setError] = useState('');

  const loadFromApi = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const authtoken = sessionStorage.getItem('auth-token');
      const sessionEmail = sessionStorage.getItem('email');
      if (!authtoken || !sessionEmail) {
        setRemoteUser(emptyUser);
        setError('Sign in to load your profile card from the database.');
        return;
      }
      const response = await fetch(`${API_URL}/api/auth/user`, {
        headers: {
          Authorization: `Bearer ${authtoken}`,
          Email: sessionEmail,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const user = await response.json();
      setRemoteUser({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '—',
      });
    } catch (e) {
      console.error(e);
      setRemoteUser(emptyUser);
      setError('Could not reach the API. Start the server and MongoDB, then try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mode !== 'remote') return undefined;
    loadFromApi();
    const onSync = () => loadFromApi();
    window.addEventListener('med_appt-user-updated', onSync);
    return () => window.removeEventListener('med_appt-user-updated', onSync);
  }, [mode, loadFromApi]);

  const display =
    mode === 'remote'
      ? remoteUser
      : {
          name: name ?? '',
          email: email ?? '',
          phone: phone ?? '—',
        };

  const initials = (display.name || '?')
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (mode === 'remote' && loading) {
    return (
      <article
        className="profile-card profile-card--loading"
        aria-busy="true"
      >
        <p className="profile-card__status">Loading profile from database…</p>
      </article>
    );
  }

  if (mode === 'remote' && error) {
    return (
      <article className="profile-card profile-card--error">
        <p className="profile-card__status">{error}</p>
      </article>
    );
  }

  return (
    <article className="profile-card" data-profile-card-mode={mode}>
      <div className="profile-card__header">
        <div className="profile-card__avatar" aria-hidden="true">
          {initials || '?'}
        </div>
        <div>
          <h2 className="profile-card__name">{display.name || '—'}</h2>
          <p className="profile-card__role">{role}</p>
        </div>
      </div>
      <dl className="profile-card__details">
        <div className="profile-card__row">
          <dt>Email</dt>
          <dd>{display.email || '—'}</dd>
        </div>
        <div className="profile-card__row">
          <dt>Phone</dt>
          <dd>{display.phone}</dd>
        </div>
      </dl>
    </article>
  );
};

export default ProfileCard;
