import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/api/axiosInstance';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const nav = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/login', { email, password });
            login(data.token, data.user);
            nav('/dashboard');
        } catch (err) { alert('Login failed'); }
    };

    return (
        <div className="container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required/>
                </div>
                <div className="form-group">
                    <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required/>
                </div>
                <button type="submit" className="btn">Login</button>
            </form>
        </div>
    );
};
