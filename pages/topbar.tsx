'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';

export default function TopBar() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // useEffect(() => {
  //   fetch('/api/me')
  //     .then(res => {
  //       if (!res.ok) throw new Error('Not authenticated');
  //       return res.json();
  //     })
  //     .then(data => setUser(data))
  //     .catch(err => {
  //       console.error(err);
  //       setError('Not logged in');
  //     });
  // }, []);
  // const handleLogout = async () => {
  //   try {
  //     await fetch('/api/logout', { method: 'POST' });
  //     setUser(null);
  //     router.push('/login');
  //   } catch (err) {
  //     console.error('Logout failed:', err);
  //   }
  // };
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

        {/* Log in Register Update Event  */}
      </Toolbar>
    </AppBar>
  );
}
