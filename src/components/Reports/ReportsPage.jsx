import ReportsLayout from '../ReportsLayout/ReportsLayout.jsx';
import ProfileCard from '../ProfileCard/ProfileCard.jsx';
import './ReportsPage.css';

/**
 * Reports route: table (ReportsLayout) + optional API-backed profile card.
 */
const ReportsPage = () => {
  return (
    <div className="reports-page" id="reports-page-root">
      <ReportsLayout />

      <section
        className="reports-page__panel"
        aria-labelledby="reports-card-heading"
        id="reports-profile-card-root"
      >
        <h2 id="reports-card-heading" className="reports-page__subtitle">
          Account summary
        </h2>
        <p className="reports-page__hint">
          Loaded from your session after sign-in. Requires API + MongoDB when using
          live data.
        </p>
        <ProfileCard mode="remote" role="Patient" />
      </section>
    </div>
  );
};

export default ReportsPage;
