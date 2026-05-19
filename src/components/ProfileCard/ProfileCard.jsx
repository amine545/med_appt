import './ProfileCard.css';

const ProfileCard = ({
  name,
  email,
  phone = '—',
  role = 'Patient',
}) => {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="profile-card">
      <div className="profile-card__header">
        <div className="profile-card__avatar" aria-hidden="true">
          {initials || '?'}
        </div>
        <div>
          <h2 className="profile-card__name">{name}</h2>
          <p className="profile-card__role">{role}</p>
        </div>
      </div>
      <dl className="profile-card__details">
        <div className="profile-card__row">
          <dt>Email</dt>
          <dd>{email}</dd>
        </div>
        <div className="profile-card__row">
          <dt>Phone</dt>
          <dd>{phone}</dd>
        </div>
      </dl>
    </article>
  );
};

export default ProfileCard;
