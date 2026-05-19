import ProfileForm from '../ProfileForm/ProfileForm.jsx';
import './ProfilePage.css';

const ProfilePage = () => {
  return (
    <div className="profile-page">
      <h1 className="profile-page__title">Your profile</h1>
      <ProfileForm />
    </div>
  );
};

export default ProfilePage;
