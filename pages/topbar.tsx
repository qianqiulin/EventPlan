'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import { useAuth } from '../lib/AuthContext'; // Adjust the import path as necessary



export default function TopBar() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const {isAuthenticated} = useAuth(); // Use the custom hook to access authentication state
  const router = useRouter();
  const {setIsAuthenticated} = useAuth(); // Use the custom hook to access the setter for authentication state

  const logout = () => {
    // Clear the authentication token (e.g., cookie or localStorage)
    document.cookie = "token=; Max-Age=0; Path=/;"; // Clear the cookie
    setIsAuthenticated(false); // Update the authentication state
    router.push("/"); // Redirect to the home page
  };

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
  
        {/* Conditional rendering based on isAuthenticated */}
        <Box>
          {!isAuthenticated ? (
            <>
              <Link href="/signin" passHref>
                <Button color="inherit">Sign In</Button>
              </Link>
              <Link href="/signup" passHref>
                <Button color="inherit">Sign Up</Button>
              </Link>
            </>
          ) : (
            <>
              <Button color="inherit">Welcome</Button>
              <Button
  color="inherit"
  onClick={logout} // Use the logout function
>
  Sign Out
</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
