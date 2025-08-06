import type { NextApiRequest, NextApiResponse } from 'next';
import { parse, serialize } from 'cookie';
import jwt, { Secret } from 'jsonwebtoken';
import crypto from 'crypto';
import { sendLoginCode } from '@/lib/mailer';

function sha256(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex');
}
function generateCode() {
  return String(Math.floor(100000 + Math.random()*900000));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const pending = cookies['pending_session'];
  if (!pending) return res.status(401).json({ message: 'No pending session' });

  let payload: any;
  try { payload = jwt.verify(pending, process.env.JWT_SECRET as Secret); }
  catch { return res.status(401).json({ message: 'Pending session expired' }); }

  const code = generateCode();
  await sendLoginCode(payload.email, code);

  const pepper = process.env.OTP_PEPPER || '';
  const otp_hash = sha256(code + pepper);

  const renewed = jwt.sign(
    { ...payload, otp_hash, tries: 3 },
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
  return res.status(200).json({ ok: true });
}
