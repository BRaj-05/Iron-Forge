"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/FormField";
import { theme } from "@/lib/theme";
import { apiRoutes } from "@/config/api-routes";

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

  async function handleSignup() {
    if (!form.fullName || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(apiRoutes.auth.register, {
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

      router.push("/login");

    } catch {
      setError("Server error. Try again.");
    }

    setLoading(false);
  }

  return (
    <div style={wrapperStyle}>
      <Card accent={theme.accent} style={cardStyle}>
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

        <Input
          label="Full name"
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) =>
            setForm({ ...form, fullName: e.target.value })
          }
        />

        <Input
          label="Email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <Input label="Password" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <div style={twoColumnStyle}>
          <Input label="Date of birth" type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
          <Select label="Sex" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
            <option value="">Sex</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </Select>
        </div>

        <div style={twoColumnStyle}>
          <Input label="Height cm" type="number" min="1" placeholder="Height cm" value={form.heightCm} onChange={(e) => setForm({ ...form, heightCm: e.target.value })} />
          <Input label="Weight kg" type="number" min="1" placeholder="Weight kg" value={form.weightKg} onChange={(e) => setForm({ ...form, weightKg: e.target.value })} />
        </div>

        <Input label="Phone number" placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Input label="Address" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <Input label="Emergency contact" placeholder="Emergency contact" value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} />

        <Button
          onClick={handleSignup}
          disabled={loading}
          style={{
            ...buttonStyle,
          }}
        >
          {loading ? "Creating..." : "CREATE ACCOUNT"}
        </Button>

        <div style={footerStyle}>
          Already have an account?{" "}
          <Button
            variant="ghost"
            style={linkStyle}
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
        </div>
      </Card>
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
  padding: 24,
};

const cardStyle = {
  width: "min(100%, 680px)",
  display: "grid",
  gap: 14,
};

const buttonStyle = {
  width: "100%",
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
  fontWeight: 600,
  minHeight: 0,
  padding: 0,
  boxShadow: "none",
};

const twoColumnStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
};
