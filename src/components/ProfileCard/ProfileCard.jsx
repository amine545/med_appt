import { useCallback, useEffect, useState } from 'react';
import { API_URL } from '../../config.js';
import './ProfileCard.css';

const emptyUser = { name: '', email: '', phone: '' };

/**
 * @param {'props' | 'remote'} [mode='props']
 *   remote: GET /api/auth/user using session; PUT /api/auth/user on save.
 */
const ProfileCard = ({
  mode = 'props',
  name,
  email,
  phone = '—',
  role = 'Patient',
  editable = true,
}) => {
  const [remoteUser, setRemoteUser] = useState(emptyUser);
  const [loading, setLoading] = useState(mode === 'remote');
  const [error, setError] = useState('');

  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState(emptyUser);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

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
      const next = {
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      };
      setRemoteUser(next);
      setDraft(next);
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

  const propsUser = {
    name: name ?? '',
    email: email ?? '',
    phone: phone ?? '—',
  };
  const display = mode === 'remote' ? remoteUser : propsUser;

  const initials = (display.name || '?')
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const startEdit = () => {
    setSaveError('');
    setDraft(mode === 'remote' ? remoteUser : propsUser);
    setEditMode(true);
  };

  const cancelEdit = () => {
    setSaveError('');
    setEditMode(false);
  };

  const onChange = (e) => {
    const { name: field, value } = e.target;
    setDraft((prev) => ({
      ...prev,
      [field]: field === 'phone' ? value.replace(/\D/g, '').slice(0, 15) : value,
    }));
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setSaveError('');

    if ((draft.name || '').trim().length < 4) {
      setSaveError('Name must be at least 4 characters.');
      return;
    }
    if ((draft.phone || '').length < 10) {
      setSaveError('Phone must be at least 10 digits.');
      return;
    }

    if (mode !== 'remote') {
      setRemoteUser(draft);
      setEditMode(false);
      return;
    }

    setSaving(true);
    try {
      const authtoken = sessionStorage.getItem('auth-token');
      const sessionEmail = sessionStorage.getItem('email');
      const response = await fetch(`${API_URL}/api/auth/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authtoken}`,
          Email: sessionEmail,
        },
        body: JSON.stringify({
          name: draft.name.trim(),
          phone: draft.phone,
        }),
      });
      if (!response.ok) {
        const json = await response.json().catch(() => ({}));
        throw new Error(json?.error || 'Failed to update profile.');
      }
      sessionStorage.setItem('name', draft.name.trim());
      sessionStorage.setItem('phone', draft.phone);
      window.dispatchEvent(new Event('med_appt-user-updated'));
      setRemoteUser(draft);
      setEditMode(false);
    } catch (err) {
      console.error(err);
      setSaveError(err.message || 'Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

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

  if (editMode) {
    return (
      <article className="profile-card" data-profile-card-mode={`${mode}-edit`}>
        <form className="profile-card__edit" onSubmit={saveEdit} noValidate>
          <h2 className="profile-card__name">Edit profile</h2>
          {saveError && (
            <div
              className="profile-card__status"
              role="alert"
              style={{ color: '#b91c1c', marginBottom: 8 }}
            >
              {saveError}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="pc-name">Name</label>
            <input
              id="pc-name"
              name="name"
              type="text"
              value={draft.name}
              onChange={onChange}
              minLength={4}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="pc-phone">Phone</label>
            <input
              id="pc-phone"
              name="phone"
              type="tel"
              value={draft.phone}
              onChange={onChange}
              minLength={10}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="pc-email">Email</label>
            <input
              id="pc-email"
              name="email"
              type="email"
              value={draft.email}
              readOnly
            />
          </div>
          <div className="form-actions" style={{ display: 'flex', gap: 8 }}>
            <button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              className="secondary"
              onClick={cancelEdit}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
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
          <dd>{display.phone || '—'}</dd>
        </div>
      </dl>
      {editable && (
        <div
          className="profile-card__actions"
          style={{ marginTop: 16, textAlign: 'right' }}
        >
          <button type="button" onClick={startEdit}>
            Edit
          </button>
        </div>
      )}
    </article>
  );
};

export default ProfileCard;
