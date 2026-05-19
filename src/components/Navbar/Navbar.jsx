import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const STORAGE_NAME = 'med_appt_user_name';
const STORAGE_EMAIL = 'med_appt_user_email';
const STORAGE_PHONE = 'med_appt_user_phone';
const STORAGE_TOKEN = 'auth-token';

function readUserFromStorage() {
  if (typeof window === 'undefined') {
    return { name: '', loggedIn: false };
  }
  const token = sessionStorage.getItem(STORAGE_TOKEN);
  const medName = sessionStorage.getItem(STORAGE_NAME);
  const legacyName = sessionStorage.getItem('name');
  const email = sessionStorage.getItem('email');
  const loggedIn = Boolean(token || email);
  const displayName =
    medName ||
    legacyName ||
    (email ? email.split('@')[0] : '') ||
    (token ? 'Member' : '');
  return { name: displayName, loggedIn };
}

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState(() => readUserFromStorage().name);
  const [loggedIn, setLoggedIn] = useState(() => readUserFromStorage().loggedIn);
  const menuRef = useRef(null);

  useEffect(() => {
    const sync = () => {
      const { name, loggedIn: ok } = readUserFromStorage();
      setUserName(name);
      setLoggedIn(ok);
    };
    sync();
    window.addEventListener('med_appt-user-updated', sync);
    return () => window.removeEventListener('med_appt-user-updated', sync);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (e) => {
      if (!menuRef.current?.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [menuOpen]);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_TOKEN);
    sessionStorage.removeItem(STORAGE_NAME);
    sessionStorage.removeItem(STORAGE_EMAIL);
    sessionStorage.removeItem(STORAGE_PHONE);
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('phone');
    window.dispatchEvent(new Event('med_appt-user-updated'));
    setLoggedIn(false);
    setUserName('');
    setMenuOpen(false);
    navigate('/');
  }, [navigate]);

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          Med Appt
        </Link>
        <nav className="navbar__links" aria-label="Main">
          <Link to="/instant-consultation">Instant consultation</Link>
          <Link to="/booking-consultation">Book consultation</Link>
          <Link to="/reviews">Reviews</Link>
        </nav>
        <div className="navbar__user">
          {loggedIn ? (
            <>
              <div className="navbar__user-row">
                <div className="navbar__menu" ref={menuRef}>
                  <button
                    type="button"
                    className="navbar__welcome"
                    aria-expanded={menuOpen}
                    aria-haspopup="true"
                    aria-controls="profile-menu"
                    id="profile-menu-button"
                    onClick={() => setMenuOpen((o) => !o)}
                  >
                    Welcome, {userName}
                    <span className="navbar__chevron" aria-hidden="true">
                      ▾
                    </span>
                  </button>
                  {menuOpen ? (
                    <div
                      className="navbar__dropdown"
                      id="profile-menu"
                      role="menu"
                      aria-labelledby="profile-menu-button"
                    >
                      <Link
                        to="/profile"
                        className="navbar__dropdown-link"
                        role="menuitem"
                        onClick={() => setMenuOpen(false)}
                      >
                        Your Profile
                      </Link>
                    </div>
                  ) : null}
                </div>
                <button type="button" className="navbar__logout" onClick={logout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="navbar__signin">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
