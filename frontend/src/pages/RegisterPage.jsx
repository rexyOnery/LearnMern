import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from '../components/Alert.jsx';
import { Loader } from '../components/Loader.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { clearAuthMessage, registerUser } from '../store/authSlice.js';

export const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isAuthenticated, status } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => () => dispatch(clearAuthMessage()), [dispatch]);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(registerUser(form));
  };

  return (
    <section className="page-grid auth-grid">
      <div className="page-heading">
        <span className="eyebrow">New workspace</span>
        <h1>Create an account</h1>
        <p>
          Registration creates the auth identity in the auth database. Profile
          data is created later by the user service when the dashboard loads.
        </p>
      </div>

      <form className="panel auth-panel" onSubmit={handleSubmit}>
        <Alert tone="danger">{error}</Alert>

        <label>
          Name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ada Lovelace"
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="ada@example.com"
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
            minLength="8"
            required
          />
        </label>

        <button type="submit" className="primary-button" disabled={status === 'loading'}>
          {status === 'loading' ? <Loader label="Creating account" /> : 'Register'}
        </button>

        <p className="form-note">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
};
