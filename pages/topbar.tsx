'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';

export default function TopBar() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/me')
      .then(res => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then(data => setUser(data))
      .catch(err => {
        console.error(err);
        setError('Not logged in');
      });
  }, []);
  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };
  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box>
          <Link href="/" passHref>
            <Button color="inherit">Home</Button>
          </Link>
          <Link href="/cart" passHref>
            <Button color="inherit">Cart</Button>
          </Link>
        </Box>

        <Box>
          {user ? (
            <>
              <Typography variant="body2" sx={{ marginRight: 2 }}>
                Welcome, {user.username}
              </Typography>
              <Link href="/me" passHref>
                <Button color="inherit">Profile</Button>
              </Link>
              {user.is_staff === 1 && (
                <Link href="/create-event" passHref>
                  <Button color="inherit">Create Event</Button>
                </Link>
              )}
            <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" passHref>
                <Button color="inherit">Login</Button>
              </Link>
              <Link href="/register" passHref>
                <Button color="inherit">Sign Up</Button>
              </Link>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
