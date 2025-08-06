import React, { useState } from "react";
import { useRouter } from "next/router";
import { enqueueSnackbar } from "notistack";

export default function SignUp() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        enqueueSnackbar("Sign-up successful 🎉", { variant: "success" });
        router.push("/signin");
      } else {
        const j = await res.json().catch(() => ({}));
        enqueueSnackbar(j?.message || "Error signing up", { variant: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  /** shared input style */
  const inputStyle: React.CSSProperties = {
    width: "100%",
    marginBottom: 8,
    padding: 8,
    borderRadius: 4,
    border: "1px solid #999",
  };

  return (
    <div style={{ maxWidth: 400, margin: "4rem auto", padding: "2rem", border: "1px solid #ccc",
                 borderRadius: 8, boxShadow: "0 2px 6px rgba(0,0,0,.1)" }}>
      <h1 style={{ textAlign: "center" }}>Create an account</h1>

      <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          autoComplete="username"
          value={form.username}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          style={inputStyle}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 10,
            border: "none",
            borderRadius: 4,
            background: loading ? "#9dbb6e" : "#86af49",
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 600,
          }}
        >
          {loading ? "Creating…" : "Sign Up"}
        </button>
      </form>

      <p style={{ marginTop: 16, textAlign: "center", fontSize: 14 }}>
        Already have an account?{" "}
        <span
          onClick={() => router.push("/signin")}
          style={{ color: "blue", cursor: "pointer", fontWeight: 600 }}
        >
          Sign In
        </span>
      </p>
    </div>
  );
}
