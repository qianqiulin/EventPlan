import type { NextApiRequest, NextApiResponse } from 'next';
import { openDb } from '@/lib/db';
import { pbkdf2Sync, randomBytes } from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const {
    username,
    password,
    email,
    lastName,
    isStaff
  } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  try {
    const db = await openDb();
    const existing = await db.get('SELECT * FROM auth_user WHERE username = ? OR email = ?', username, email);
    if (existing) {
      return res.status(409).json({ message: 'Username or email already exists.' });
    }

    const salt = randomBytes(16).toString('hex');
    const hash = pbkdf2Sync(password, salt, 600000, 32, 'sha256').toString('base64');
    const hashedPassword = `pbkdf2_sha256$600000$${salt}$${hash}`;
    const now = new Date().toISOString();

    await db.run(
        `INSERT INTO auth_user 
        (password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined)
        VALUES (?, NULL, 0, ?, '', ?, ?, ?, 1, ?)`,
        hashedPassword,
        username,
        lastName || '',
        email,
        isStaff ? 1 : 0,
        now
      );

    res.status(201).json({ username });
  } catch (err) {
    console.error('❌ Error inserting user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
