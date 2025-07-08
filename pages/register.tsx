import React, { useState } from 'react';
import TopBar from './topbar';
import { Alert,Slide } from '@mui/material';
export default function Register() {
    const [form, setForm] = useState({
        username: '',
        password: '',
        email: '',
        lastName: '',
        isStaff: false,
      });
    
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value,
        }));
      };
  const [alert, setAlert] = useState<{ severity: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      setAlert({ severity: 'success', message: '✅ Registered in successfully!' });
    } else {
        setAlert({ severity: 'error', message: `❌ ${data.message}` });
    }
  };

  return (
    <>
    <TopBar/>
    <div className="register-container">
      <h1>Register</h1>
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
      <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input name="username" value={form.username} onChange={handleChange} required />
          </label>
          <label>
            Password:
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Last Name:
            <input name="lastName" value={form.lastName} onChange={handleChange} />
          </label>
          <label>
            <input
              type="checkbox"
              name="isStaff"
              checked={form.isStaff}
              onChange={handleChange}
            />
            Is Staff
          </label>

          <button type="submit">Register</button>
        </form>
    </div>
    </>
  );
}
