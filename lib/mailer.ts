import nodemailer from 'nodemailer';

const PORT = Number(process.env.SMTP_PORT || 587);

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: PORT,
  secure: PORT === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendLoginCode(to: string, code: string) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER!;
  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto;">
      <h2>Your login code</h2>
      <p>Use this 6-digit code to finish signing in:</p>
      <div style="font-size: 28px; letter-spacing: 6px; font-weight: 700;">${code}</div>
      <p style="color:#555">This code expires in 10 minutes.</p>
    </div>
  `;
  await transporter.sendMail({ from, to, subject: 'Your Chivent login code', html });
}
