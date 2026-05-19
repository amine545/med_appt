import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../config.js';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || data.errors?.[0]?.msg || 'Login failed');
        return;
      }
      if (data.authtoken) {
        sessionStorage.setItem('auth-token', data.authtoken);
        sessionStorage.setItem('email', email);
        window.dispatchEvent(new Event('med_appt-user-updated'));
        navigate('/profile');
      } else {
        setError('No token returned');
      }
    } catch (err) {
      console.error(err);
      setError('Cannot reach server. Run `node index` in the server folder.');
    }
  };

  return (
    <div className="login-page">
      <h1 className="login-page__title">Log in</h1>
      <form className="login-page__form" onSubmit={handleSubmit}>
        <label className="login-page__field">
          Email
          <input
            type="email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            required
            autoComplete="email"
          />
        </label>
        <label className="login-page__field">
          Password
          <input
            type="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        {error ? <p className="login-page__error">{error}</p> : null}
        <button type="submit" className="login-page__submit">
          Sign in
        </button>
      </form>
      <p className="login-page__footer">
        <Link to="/">Back to home</Link>
      </p>
    </div>
  );
};

export default Login;
