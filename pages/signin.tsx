import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../lib/AuthContext";

export default function SignIn() {
  const router = useRouter();
  const { checkAuthentication } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [needsMfa, setNeedsMfa] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Step 1: submit credentials
  const handleCredsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(data?.message || "Sign-in failed");
        return;
      }

      // Expect { mfa_required: true, method: 'email' }
      if (data.mfa_required) {
        setNeedsMfa(true);
        setMsg("We emailed you a 6-digit code. Enter it below.");
      } else {
        // In this setup we always require MFA, but keep fallback:
        await checkAuthentication();
        router.push("/");
      }
    } catch (err: any) {
      setMsg(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: verify OTP
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const res = await fetch("/api/mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsg(data?.message || "Invalid code. Try again.");
        return;
      }

      // Success → server swapped pending_session → session
      await checkAuthentication();
      router.push("/admin");
    } catch (err: any) {
      setMsg(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setMsg(null);
    setLoading(true);
    try {
      const r = await fetch("/api/mfa/resend", { method: "POST" });
      if (r.ok) setMsg("Code resent. Check your email.");
      else setMsg("Could not resend code. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "4rem auto", padding: "2rem", border: "1px solid #ccc", borderRadius: 8 }}>
      <h1>Sign In</h1>

      {!needsMfa ? (
        <form onSubmit={handleCredsSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            style={{ width: "100%", marginBottom: 8, padding: 8 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            style={{ width: "100%", marginBottom: 8, padding: 8 }}
          />
          <button type="submit" disabled={loading} style={{ width: "100%", padding: 10 }}>
            {loading ? "Checking…" : "Continue"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify}>
          <p style={{ margin: "0 0 8px" }}>
            Enter the 6-digit code we sent to <b>{email}</b>.
          </p>
          <input
            inputMode="numeric"
            pattern="\d*"
            maxLength={6}
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            style={{ width: "100%", marginBottom: 8, padding: 8, letterSpacing: 4, textAlign: "center" }}
          />
          <button type="submit" disabled={loading || code.length !== 6} style={{ width: "100%", padding: 10 }}>
            {loading ? "Verifying…" : "Verify code"}
          </button>
          <button type="button" onClick={resend} disabled={loading} style={{ width: "100%", padding: 10, marginTop: 8 }}>
            Resend code
          </button>
        </form>
      )}

      {msg && <div style={{ marginTop: 12, color: "#444" }}>{msg}</div>}
    </div>
  );
}
