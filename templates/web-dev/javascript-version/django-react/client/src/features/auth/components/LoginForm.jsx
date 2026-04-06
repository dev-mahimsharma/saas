import React, { useState } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Card } from '@/components/ui/Card/Card';
import styles from './LoginForm.module.css';
import { useAuth } from '../hooks/useAuth';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, loading } = useAuth();

  const onSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      handleLogin({ username, password });
    }
  };

  return (
    <div className={styles.wrapper}>
      <Card className={styles.container}>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Please enter your details to sign in.</p>
        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <Input 
              id="username"
              type="text" 
              placeholder="Enter your username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <Input 
              id="password"
              type="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          <Button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
