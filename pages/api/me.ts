// pages/api/me.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import { openDb } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = parse(req.headers.cookie || '');
  const sessionId = cookies.session;

  if (!sessionId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const db = await openDb();
  const user = await db.get('SELECT id, username, email, is_staff FROM auth_user WHERE id = ?', sessionId);

  if (!user) {
    return res.status(401).json({ message: 'Invalid session' });
  }

  res.status(200).json(user);
}
