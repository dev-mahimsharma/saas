import { useAuth } from '@/hooks/useAuth';

export const Dashboard = () => {
    const { user } = useAuth();
    return (
        <div className="container">
            <h2>Welcome, {user?.email}</h2>
            <p>This is a protected dashboard area.</p>
        </div>
    );
};
