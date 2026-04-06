import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/api/axiosInstance';
import { useNavigate } from 'react-router-dom';

export const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const nav = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/register', { email, password });
            login(data.token, data.user);
            nav('/dashboard');
        } catch (err) { alert('Register failed'); }
    };

    return (
        <div className="container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required/>
                </div>
                <div className="form-group">
                    <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required/>
                </div>
                <button type="submit" className="btn">Register</button>
            </form>
        </div>
    );
};
