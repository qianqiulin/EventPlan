// hooks/useSession.ts
"use client";

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export interface Session {
  id: number;
  username: string;
}

export default function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const login = async (username: string, password: string) => {
    try {
      const res = await axios.post('/api/login', { username, password });
      setSession(res.data);
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      return false;
    }
  };

  const logout = async () => {
    await axios.post('/api/logout');
    setSession(null);
    router.push('/');
  };

  const verify = async () => {
    try {
      const res = await axios.get('/api/me');
      setSession(res.data);
    } catch {
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verify();
  }, []);

  return useMemo(() => ({
    session,
    loading,
    login,
    logout,
    verify,
  }), [session, loading]);
}
