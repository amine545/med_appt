import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config.js';
import './Sign_Up.css';

const Sign_Up = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  });
  const [showerr, setShowerr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setFormData((prev) => ({
        ...prev,
        phone: value.replace(/\D/g, '').slice(0, 10),
      }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const register = async (e) => {
    e.preventDefault();
    setShowerr('');

    const { name, phone, email, password } = formData;

    if (!/^[A-Za-z\s]{2,}$/.test(name.trim())) {
      setShowerr('Please enter a valid name (letters and spaces, min 2 chars).');
      return;
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      setShowerr('Phone number must be exactly 10 digits.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setShowerr('Please enter a valid email address.');
      return;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password)) {
      setShowerr('Password must be at least 8 characters with letters and numbers.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, password }),
      });
      const json = await response.json();

      if (!response.ok) {
        const message =
          json?.error?.[0]?.msg || json?.error || 'Registration failed.';
        setShowerr(message);
        return;
      }

      if (json.authtoken) {
        sessionStorage.setItem('auth-token', json.authtoken);
        sessionStorage.setItem('name', name);
        sessionStorage.setItem('phone', phone);
        sessionStorage.setItem('email', email);
        window.dispatchEvent(new Event('med_appt-user-updated'));
        navigate('/');
      } else {
        setShowerr('Registration succeeded but no token was returned.');
      }
    } catch (err) {
      console.error(err);
      setShowerr('Could not reach the server. Is it running on port 8181?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ marginTop: '5%' }}>
      <div className="signup-grid">
        <div className="signup-text">
          <h1>Sign Up</h1>
        </div>
        <div className="signup-text1" style={{ textAlign: 'left' }}>
          Already a member?{' '}
          <span>
            <a href="/login" style={{ color: '#2190FF' }}>
              Login
            </a>
          </span>
        </div>
        <div className="signup-form">
          <form id="signupForm" onSubmit={register} noValidate>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                className="form-control"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                name="phone"
                id="phone"
                className="form-control"
                placeholder="Enter your phone number"
                maxLength="10"
                pattern="[0-9]{10}"
                inputMode="numeric"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                className="form-control"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                className="form-control"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            {showerr && (
              <div
                className="err"
                role="alert"
                style={{ color: '#b00020', marginBottom: 12 }}
              >
                {showerr}
              </div>
            )}
            <div className="btn-group">
              <button
                type="submit"
                className="btn btn-primary mb-2 mr-1 waves-effect waves-light"
                disabled={loading}
              >
                {loading ? 'Submitting…' : 'Submit'}
              </button>
              <button
                type="reset"
                className="btn btn-danger mb-2 waves-effect waves-light"
                onClick={() =>
                  setFormData({ name: '', phone: '', email: '', password: '' })
                }
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Sign_Up;
