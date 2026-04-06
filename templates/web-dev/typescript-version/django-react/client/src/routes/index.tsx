import { Routes, Route } from 'react-router-dom';
import { LoginForm } from '@/features/auth/components/LoginForm';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('access_token');
  return token ? <>{children}</> : <LoginForm />;
}

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <PrivateRoute>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Dashboard</h1>
            <p>Welcome to the clean architecture dashboard.</p>
            <button onClick={() => {
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              window.location.href = '/login';
            }}>Logout</button>
          </div>
        </PrivateRoute>
      } />
      <Route path="/login" element={<LoginForm />} />
    </Routes>
  );
};
