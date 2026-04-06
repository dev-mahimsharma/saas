import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const Navbar = () => {
    const { user, logout } = useAuth();
    return (
        <nav className="nav">
            <Link to="/">Home</Link>
            {user ? (
                <>
                    <Link to="/dashboard">Dashboard</Link>
                    <button onClick={logout} className="btn">Logout</button>
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            )}
        </nav>
    );
};
