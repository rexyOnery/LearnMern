import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice.js';
import { useAuth } from '../hooks/useAuth.js';

export const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand">
          <div className="brand-mark">M</div>
          <div>
            <p>MERN Grid</p>
            <span>Microservices starter</span>
          </div>
        </div>

        <nav className="nav-list">
          {isAuthenticated && (
            <NavLink to="/dashboard" className="nav-link">
              Dashboard
            </NavLink>
          )}
          <NavLink to="/products" className="nav-link">
            Products
          </NavLink>
          {!isAuthenticated && (
            <>
              <NavLink to="/login" className="nav-link">
                Login
              </NavLink>
              <NavLink to="/register" className="nav-link">
                Register
              </NavLink>
            </>
          )}
        </nav>

        <div className="session-panel">
          {isAuthenticated ? (
            <>
              <span className="eyebrow">Signed in</span>
              <strong>{user?.name || 'User'}</strong>
              <button type="button" className="ghost-button" onClick={handleLogout}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <span className="eyebrow">Gateway</span>
              <strong>/api</strong>
              <span className="muted">All frontend requests use one public entry point.</span>
            </>
          )}
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};
