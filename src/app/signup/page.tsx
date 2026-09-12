"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import GlowCard from "@/components/ui/GlowCard";
import { theme } from "@/components/theme";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    heightCm: "",
    weightKg: "",
    address: "",
    emergencyContact: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationLink, setVerificationLink] = useState("");

  async function handleSignup() {
    if (!form.fullName || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");
    setVerificationLink("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      setVerificationLink("");
      router.push("/login");

    } catch {
      setError("Server error. Try again.");
    }

    setLoading(false);
  }

  return (
    <div style={wrapperStyle}>
      <GlowCard accent={theme.accent}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={titleStyle}>JOIN THE FORGE</h1>
          <p style={{ color: theme.textSecondary }}>
            Create your fitness account
          </p>
        </div>

        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        {verificationLink && <div style={successStyle}>{verificationLink}</div>}

        <input
          placeholder="Full Name"
          style={inputStyle}
          value={form.fullName}
          onChange={(e) =>
            setForm({ ...form, fullName: e.target.value })
          }
        />

        <input
          placeholder="Email"
          type="email"
          style={inputStyle}
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input type="password" placeholder="Password" style={inputStyle} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <div style={twoColumnStyle}>
          <input type="date" aria-label="Date of birth" style={inputStyle} value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
          <select style={inputStyle} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
            <option value="">Sex</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        <div style={twoColumnStyle}>
          <input type="number" min="1" placeholder="Height cm" style={inputStyle} value={form.heightCm} onChange={(e) => setForm({ ...form, heightCm: e.target.value })} />
          <input type="number" min="1" placeholder="Weight kg" style={inputStyle} value={form.weightKg} onChange={(e) => setForm({ ...form, weightKg: e.target.value })} />
        </div>

        <input placeholder="Phone number" style={inputStyle} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input placeholder="Address" style={inputStyle} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <input placeholder="Emergency contact" style={inputStyle} value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} />

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSignup}
          disabled={loading}
          style={{
            ...buttonStyle,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating..." : "CREATE ACCOUNT"}
        </motion.button>

        <div style={footerStyle}>
          Already have an account?{" "}
          <span
            style={linkStyle}
            onClick={() => router.push("/login")}
          >
            Login →
          </span>
        </div>
      </GlowCard>
    </div>
  );
}

/* ================= STYLES ================= */

const wrapperStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: theme.bg,
};

const inputStyle = {
  width: "100%",
  padding: 14,
  marginBottom: 14,
  borderRadius: 10,
  border: `1px solid ${theme.border}`,
  background: theme.surface,
  color: theme.textPrimary,
  outline: "none",
};

const buttonStyle = {
  width: "100%",
  padding: 14,
  borderRadius: 10,
  border: "none",
  background: theme.gradient,
  color: "#fff",
  fontWeight: 700,
  marginTop: 4,
};

const titleStyle = {
  fontSize: 30,
  color: theme.textPrimary,
};

const errorStyle = {
  background: "#ff4d4d20",
  border: "1px solid #ff4d4d50",
  padding: 10,
  borderRadius: 8,
  marginBottom: 14,
  color: "#ff6b6b",
  fontSize: 12,
};

const footerStyle = {
  marginTop: 16,
  fontSize: 12,
  color: theme.textSecondary,
};

const linkStyle = {
  color: theme.accent,
  cursor: "pointer",
  fontWeight: 600,
};

const twoColumnStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
};

const successStyle = {
  background: "#22c55e20",
  border: "1px solid #22c55e50",
  padding: 10,
  borderRadius: 8,
  marginBottom: 14,
  color: "#86efac",
  fontSize: 12,
};
