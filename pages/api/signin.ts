import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import { createHash } from "crypto";
import { supabase } from "@/lib/supabase";
import { sendLoginCode } from "@/lib/mailer";
import { serialize } from "cookie";

function sha256(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6 digits
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
    const { password, email } = req.body as { email?: string; password?: string };
    if (!email || !password) return res.status(400).json({ message: "Missing email or password" });

    const emailNorm = email.trim().toLowerCase();

    // Fetch user (ensure your server-side Supabase client has service role key if RLS blocks this)
    const { data: user, error } = await supabase
      .from("usersVig")
      .select("id, email, password, role")
      .eq("email", emailNorm)
      .limit(1)
      .single();

    if (error || !user) return res.status(404).json({ message: "User not found" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid password" });

    // Generate and email OTP
    const code = generateCode();
    try {
      await sendLoginCode(user.email, code);
    } catch (e) {
      console.error("sendLoginCode failed:", e);
      return res.status(500).json({ message: "Failed to send code. Try again later." });
    }

    // Store only a hash of the OTP in the pending JWT
    const pepper = process.env.OTP_PEPPER || "";
    const otp_hash = sha256(code + pepper);

    const pending = jwt.sign(
      {
        user_id: user.id,
        username: user.email, // or a username column if you have it
        email: user.email,
        amr: ["pwd"],
        otp_hash,
        tries: 3,
      },
      process.env.JWT_SECRET as Secret,
      { expiresIn: "10m" }
    );

    // Set short-lived pending cookie (10 minutes)
    const cookie = serialize("pending_session", pending, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 10,
      path: "/",
    });

    res.setHeader("Set-Cookie", cookie);

    // Tell the client to show the OTP step
    return res.status(200).json({ mfa_required: true, method: "email" });
  } catch (err) {
    console.error("signin error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
