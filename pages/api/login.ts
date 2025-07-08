import type { NextApiRequest, NextApiResponse } from 'next';
import { openDb } from '@/lib/db';
import { pbkdf2Sync } from 'crypto';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { username, password } = req.body;
  const db = await openDb();
  const user = await db.get('SELECT * FROM auth_user WHERE username = ?', username);

  if (!user) {
    return res.status(401).json({ message: 'Invalid username' });
  }

  const [algo, iterations, salt, hash] = user.password.split('$');
  const derived = pbkdf2Sync(password, salt, parseInt(iterations), 32, 'sha256').toString('base64');

  if (derived !== hash) {
    return res.status(401).json({ message: 'Invalid password' });
  }
  const cookie = serialize('session', String(user.id), {
    path: '/',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  res.setHeader('Set-Cookie', cookie);
  res.status(200).json({ id: user.id, username: user.username });
}
