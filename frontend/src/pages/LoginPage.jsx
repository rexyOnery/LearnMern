import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Alert } from '../components/Alert.jsx';
import { Loader } from '../components/Loader.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { clearAuthMessage, loginUser } from '../store/authSlice.js';

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { error, isAuthenticated, status } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    }
  }, [isAuthenticated, location.state?.from?.pathname, navigate]);

  useEffect(() => () => dispatch(clearAuthMessage()), [dispatch]);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <section className="page-grid auth-grid">
      <div className="page-heading">
        <span className="eyebrow">Authentication</span>
        <h1>Login through the API Gateway</h1>
        <p>
          Credentials are sent to `/api/auth/login`; the gateway forwards the
          request to the auth service and the frontend stores the returned JWT.
        </p>
      </div>

      <form className="panel auth-panel" onSubmit={handleSubmit}>
        <Alert tone="danger">{error}</Alert>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 8 characters"
            required
          />
        </label>

        <button type="submit" className="primary-button" disabled={status === 'loading'}>
          {status === 'loading' ? <Loader label="Signing in" /> : 'Login'}
        </button>

        <p className="form-note">
          Need an account? <Link to="/register">Create one</Link>
        </p>
      </form>
    </section>
  );
};
