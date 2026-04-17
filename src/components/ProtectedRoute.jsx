import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { session, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="spinner spinner-lg" />
          <p>Verifying access…</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin
  if (!isAdmin) {
    return (
      <div className="access-denied">
        <div className="access-denied-card">
          <div className="access-denied-icon">⛔</div>
          <h2>Access Denied</h2>
          <p>
            You do not have admin privileges. Please contact your administrator
            for access.
          </p>
          <button
            className="btn-primary"
            onClick={() => {
              window.location.href = '/login';
            }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return children;
}
