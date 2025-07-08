import React, { useState } from 'react';
import { useRouter } from 'next/router';
import TopBar from './topbar';
import { Alert,Slide } from '@mui/material';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState<{ severity: 'success' | 'error'; message: string } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username:username, password }),
    });
    const data = await res.json();
    if (res.ok) {
        setAlert({ severity: 'success', message: '✅ Logged in successfully!' });
        setTimeout(() => router.push('/'), 1500);
      } else {
        setAlert({ severity: 'error', message: `❌ ${data.message}` });
        setTimeout(() => setAlert(null), 2500);
      }
    };

  return (
    <>
    <TopBar/>
    
    <div className="login-container">
      <h1>Login</h1>
      {alert && (
        <Slide direction="left" in={true} mountOnEnter unmountOnExit>
          <div
            style={{
              position: 'fixed',
              top: 20,
              right: 20,
              zIndex: 9999,
              minWidth: '300px',
            }}
          >
            <Alert severity={alert.severity} variant="filled" onClose={() => setAlert(null)}>
              {alert.message}
            </Alert>
          </div>
        </Slide>
      )}
      <form onSubmit={handleLogin} className="login-form">
        <label>Username:</label>
        <input
          type="username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </div>
    </>
  );
}
