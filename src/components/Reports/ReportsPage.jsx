import ProfileCard from '../ProfileCard/ProfileCard.jsx';
import './ReportsPage.css';

/**
 * Reports / summary area for the capstone: shows copy plus ProfileCard
 * loading the signed-in user from the API (see ProfileCard mode="remote").
 */
const ReportsPage = () => {
  return (
    <div className="reports-page" id="reports-page-root">
      <header className="reports-page__header">
        <h1 className="reports-page__title">Your health reports</h1>
        <p className="reports-page__lede">
          This page summarizes the account we keep on file for your care journey.
          The card below is loaded directly from the database using the same session
          you use after signing in—name, email, and phone stay in sync with your
          profile.
        </p>
      </header>

      <section
        className="reports-page__panel"
        aria-labelledby="reports-card-heading"
        id="reports-profile-card-root"
      >
        <h2 id="reports-card-heading" className="reports-page__subtitle">
          Account summary (from database)
        </h2>
        <p className="reports-page__hint">
          Sign in first if you see an error—MongoDB and <code>node index</code> in
          the <code>server</code> folder must be running for live data.
        </p>
        <ProfileCard mode="remote" role="Patient" />
      </section>

      <section className="reports-page__notes" aria-labelledby="reports-notes-heading">
        <h2 id="reports-notes-heading" className="reports-page__subtitle">
          What you can do next
        </h2>
        <ul className="reports-page__list">
          <li>Book or review appointments under <strong>Book consultation</strong>.</li>
          <li>Use <strong>Instant consultation</strong> for quick specialty search.</li>
          <li>Leave feedback on the <strong>Reviews</strong> page after a visit.</li>
          <li>
            Update personal details anytime under <strong>Your Profile</strong> in
            the header menu.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default ReportsPage;
