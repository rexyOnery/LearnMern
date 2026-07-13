import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Alert } from '../components/Alert.jsx';
import { Loader } from '../components/Loader.jsx';
import { useAuth } from '../hooks/useAuth.js';
import {
  clearAuthMessage,
  fetchProfile,
  updateProfile
} from '../store/authSlice.js';

export const DashboardPage = () => {
  const dispatch = useDispatch();
  const { error, profile, profileStatus, successMessage, user } = useAuth();
  const [form, setForm] = useState({ name: '', bio: '', location: '' });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        bio: profile.bio || '',
        location: profile.location || ''
      });
    }
  }, [profile]);

  useEffect(() => () => dispatch(clearAuthMessage()), [dispatch]);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(updateProfile(form));
  };

  return (
    <section className="page-stack">
      <div className="page-heading">
        <span className="eyebrow">Protected route</span>
        <h1>Dashboard</h1>
        <p>
          The dashboard calls `/api/users/profile`. The gateway verifies the JWT,
          adds identity headers, and forwards the request to the user service.
        </p>
      </div>

      <div className="stats-grid">
        <div className="metric">
          <span>Auth identity</span>
          <strong>{user?.email || 'Unknown'}</strong>
        </div>
        <div className="metric">
          <span>Profile status</span>
          <strong>{profileStatus}</strong>
        </div>
        <div className="metric">
          <span>Gateway route</span>
          <strong>/api/users</strong>
        </div>
      </div>

      <form className="panel profile-panel" onSubmit={handleSubmit}>
        <div>
          <h2>Profile</h2>
          <p className="muted">Sample protected update endpoint.</p>
        </div>

        <Alert tone="danger">{error}</Alert>
        <Alert tone="success">{successMessage}</Alert>

        {profileStatus === 'loading' && !profile ? (
          <Loader label="Loading profile" />
        ) : (
          <div className="form-grid">
            <label>
              Name
              <input name="name" value={form.name} onChange={handleChange} />
            </label>

            <label>
              Location
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Lagos, NG"
              />
            </label>

            <label className="wide-field">
              Bio
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows="4"
                placeholder="What should other services know about this user?"
              />
            </label>
          </div>
        )}

        <button
          type="submit"
          className="primary-button"
          disabled={profileStatus === 'loading'}
        >
          {profileStatus === 'loading' ? <Loader label="Saving" /> : 'Save profile'}
        </button>
      </form>
    </section>
  );
};
