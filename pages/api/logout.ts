// pages/api/logout.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const expired = serialize('session', '', {
    path: '/',
    httpOnly: true,
    maxAge: 0,
  });

  res.setHeader('Set-Cookie', expired);
  res.status(200).json({ message: 'Logged out' });
}
