import type { NextApiRequest, NextApiResponse } from 'next';
import { parse, serialize } from 'cookie';
import jwt, { Secret } from 'jsonwebtoken';
import crypto from 'crypto';

function sha256(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
    const pending = cookies['pending_session'];
    if (!pending) return res.status(401).json({ message: 'No pending session' });

    let payload: any;
    try {
      payload = jwt.verify(pending, process.env.JWT_SECRET as Secret);
    } catch {
      return res.status(401).json({ message: 'Pending session expired' });
    }

    const { code } = req.body;
    if (!code) return res.status(400).json({ message: 'Missing code' });

    const pepper = process.env.OTP_PEPPER || '';
    const candidate = sha256(String(code) + pepper);

    if (candidate !== payload.otp_hash) {
      const tries = (payload.tries ?? 1) - 1;
      if (tries <= 0) {
        // lock out this pending attempt
        res.setHeader('Set-Cookie', serialize('pending_session', '', { httpOnly: true, path: '/', maxAge: 0 }));
        return res.status(401).json({ message: 'Invalid code. Please start over.' });
      }
      // re-issue pending with decremented tries (same exp window)
      const renewed = jwt.sign(
        { ...payload, tries },
        process.env.JWT_SECRET as Secret,
        { expiresIn: '10m' }
      );
      res.setHeader('Set-Cookie', serialize('pending_session', renewed, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 10,
        path: '/',
      }));
      return res.status(401).json({ message: 'Invalid code', triesRemaining: tries });
    }

    // SUCCESS → swap cookies
    const session = jwt.sign(
      { user_id: payload.user_id, username: payload.username, amr: ['pwd', 'email-otp'] },
      process.env.JWT_SECRET as Secret,
      { expiresIn: '7d' }
    );

    res.setHeader('Set-Cookie', [
      serialize('pending_session', '', { httpOnly: true, path: '/', maxAge: 0 }),
      serialize('session', session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
    ]);

    return res.status(200).json({ message: 'MFA passed' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
}
