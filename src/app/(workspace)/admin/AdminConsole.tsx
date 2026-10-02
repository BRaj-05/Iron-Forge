"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/FormField";
import { DEFAULT_AVATAR_URL } from "@/lib/media";
import { theme } from "@/lib/theme";
import { apiRoutes } from "@/config/api-routes";

type Role = "CUSTOMER" | "TRAINER" | "OWNER";
type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  photoUrl?: string | null;
  assignedTrainerId?: string | null;
  specialization?: string | null;
};
type Plan = { id: string; name: string; durationDays: number; price: number; features: string[]; isActive: boolean };
type Subscription = { id: string; userId: string; planId: string; endDate: string; status: string };
type Payment = { id: string; userId: string; amount: number; method: string; status: string; createdAt: string };
type Attendance = { id: string; customerId: string; trainerId?: string | null; checkIn: string; checkOut?: string | null };
type Notification = { id: string; userId: string; type: string; message: string; isRead: boolean; createdAt: string };
type SupportRequest = { id: string; requesterId: string; assignedTrainerId?: string | null; type: string; subject: string; message: string; status: string; createdAt: string };

type AdminData = {
  users: User[];
  plans: Plan[];
  subscriptions: Subscription[];
  payments: Payment[];
  attendance: Attendance[];
  notifications: Notification[];
  supportRequests: SupportRequest[];
  expiringMembers: Subscription[];
};

const emptyData: AdminData = {
  users: [],
  plans: [],
  subscriptions: [],
  payments: [],
  attendance: [],
  notifications: [],
  supportRequests: [],
  expiringMembers: [],
};

function customerName(users: User[], userId: string) {
  return users.find((user) => user.id === userId)?.name || `Customer ${userId.slice(-6)}`;
}

export default function AdminConsole() {
  const [data, setData] = useState<AdminData>(emptyData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [trainerForm, setTrainerForm] = useState({ name: "", email: "", password: "", specialization: "" });
  const [planForm, setPlanForm] = useState({ name: "", durationDays: 30, price: 0, features: "" });
  const [assignmentForm, setAssignmentForm] = useState({ customerId: "", trainerId: "" });
  const [renewalForm, setRenewalForm] = useState({ customerId: "", planId: "" });

  async function loadData() {
    setError("");
    try {
      const response = await fetch(apiRoutes.admin.overview, { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not load admin data.");
      setData(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load admin data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const trainers = useMemo(() => data.users.filter((user) => user.role === "TRAINER"), [data.users]);
  const customers = useMemo(() => data.users.filter((user) => user.role === "CUSTOMER"), [data.users]);

  async function createTrainer() {
    const response = await fetch(apiRoutes.admin.users, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...trainerForm, role: "TRAINER" }),
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Could not create trainer.");
      return;
    }
    setTrainerForm({ name: "", email: "", password: "", specialization: "" });
    await loadData();
  }

  async function savePlan() {
    const response = await fetch(apiRoutes.admin.plans, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...planForm,
        features: planForm.features.split(",").map((feature) => feature.trim()).filter(Boolean),
        isActive: true,
      }),
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Could not save plan.");
      return;
    }
    setPlanForm({ name: "", durationDays: 30, price: 0, features: "" });
    await loadData();
  }

  async function toggleUser(user: User) {
    await fetch(apiRoutes.admin.user(user.id), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !user.isActive }),
    });
    await loadData();
  }

  async function assignTrainer() {
    if (!assignmentForm.customerId || !assignmentForm.trainerId) {
      setError("Choose a customer and trainer first.");
      return;
    }

    const response = await fetch(apiRoutes.admin.user(assignmentForm.customerId), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignedTrainerId: assignmentForm.trainerId }),
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Could not assign trainer.");
      return;
    }
    setAssignmentForm({ customerId: "", trainerId: "" });
    await loadData();
  }

  async function renewSubscription() {
    if (!renewalForm.customerId || !renewalForm.planId) {
      setError("Choose a customer and plan first.");
      return;
    }

    const response = await fetch(apiRoutes.admin.subscriptions, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: renewalForm.customerId, planId: renewalForm.planId }),
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Could not renew subscription.");
      return;
    }
    setRenewalForm({ customerId: "", planId: "" });
    await loadData();
  }

  if (loading) return <main style={styles.page}>Loading owner console...</main>;

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>OWNER</p>
          <h1 style={styles.title}>Admin Control Center</h1>
        </div>
        <Button onClick={loadData} style={styles.button}>Refresh</Button>
      </header>

      {error && <div style={styles.error}>{error}</div>}

      <section style={styles.stats}>
        <Stat label="Users" value={data.users.length} />
        <Stat label="Trainers" value={trainers.length} />
        <Stat label="Members" value={customers.length} />
        <Stat label="Expiring/Expired" value={data.expiringMembers.length} />
      </section>

      <section id="users" style={styles.panel}>
        <h2 style={styles.panelTitle}>Users</h2>
        <div style={styles.table}>
          {data.users.map((user) => (
            <div key={user.id} style={styles.row}>
            <Image src={user.photoUrl || DEFAULT_AVATAR_URL} alt="" width={38} height={38} unoptimized style={styles.avatar} />
              <span>{user.name}</span>
              <span>{user.email}</span>
              <strong>{user.role}</strong>
              <Button onClick={() => toggleUser(user)} variant="secondary" style={styles.smallButton}>
                {user.isActive ? "Deactivate" : "Activate"}
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section id="trainers" style={styles.panel}>
        <h2 style={styles.panelTitle}>Create Trainer</h2>
        <div style={styles.formGrid}>
          <Input label="Trainer name" placeholder="Trainer name" value={trainerForm.name} onChange={(event) => setTrainerForm({ ...trainerForm, name: event.target.value })} />
          <Input label="Trainer email" placeholder="trainer@example.com" value={trainerForm.email} onChange={(event) => setTrainerForm({ ...trainerForm, email: event.target.value })} />
          <Input label="Temporary password" placeholder="Temporary password" type="password" value={trainerForm.password} onChange={(event) => setTrainerForm({ ...trainerForm, password: event.target.value })} />
          <Input label="Specialization" placeholder="Specialization" value={trainerForm.specialization} onChange={(event) => setTrainerForm({ ...trainerForm, specialization: event.target.value })} />
          <Button onClick={createTrainer} style={styles.button}>Create trainer</Button>
        </div>
      </section>

      <section id="assignments" style={styles.panel}>
        <h2 style={styles.panelTitle}>Assign Trainer</h2>
        <div style={styles.formGrid}>
          <Select label="Customer" value={assignmentForm.customerId} onChange={(event) => setAssignmentForm({ ...assignmentForm, customerId: event.target.value })}>
            <option value="">Customer</option>
            {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
          </Select>
          <Select label="Trainer" value={assignmentForm.trainerId} onChange={(event) => setAssignmentForm({ ...assignmentForm, trainerId: event.target.value })}>
            <option value="">Trainer</option>
            {trainers.map((trainer) => <option key={trainer.id} value={trainer.id}>{trainer.name}</option>)}
          </Select>
          <Button onClick={assignTrainer} style={styles.button}>Save assignment</Button>
        </div>
      </section>

      <section id="plans" style={styles.panel}>
        <h2 style={styles.panelTitle}>Plans</h2>
        <div style={styles.formGrid}>
          <Input label="Plan name" placeholder="Plan name" value={planForm.name} onChange={(event) => setPlanForm({ ...planForm, name: event.target.value })} />
          <Input label="Days" placeholder="Days" type="number" value={planForm.durationDays} onChange={(event) => setPlanForm({ ...planForm, durationDays: Number(event.target.value) })} />
          <Input label="Price" placeholder="Price" type="number" value={planForm.price} onChange={(event) => setPlanForm({ ...planForm, price: Number(event.target.value) })} />
          <Input label="Features" placeholder="Features, comma separated" value={planForm.features} onChange={(event) => setPlanForm({ ...planForm, features: event.target.value })} />
          <Button onClick={savePlan} style={styles.button}>Save plan</Button>
        </div>
        <div style={styles.cards}>
          {data.plans.map((plan) => (
            <article key={plan.id} style={styles.card}>
              <strong>{plan.name}</strong>
              <span>{plan.durationDays} days</span>
              <span>${plan.price}</span>
            </article>
          ))}
        </div>
      </section>

      <section id="subscriptions" style={styles.panel}>
        <h2 style={styles.panelTitle}>Subscription Renewal</h2>
        <div style={styles.formGrid}>
          <Select label="Customer" value={renewalForm.customerId} onChange={(event) => setRenewalForm({ ...renewalForm, customerId: event.target.value })}>
            <option value="">Customer</option>
            {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
          </Select>
          <Select label="Plan" value={renewalForm.planId} onChange={(event) => setRenewalForm({ ...renewalForm, planId: event.target.value })}>
            <option value="">Plan</option>
            {data.plans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name} - ${plan.price}</option>)}
          </Select>
          <Button onClick={renewSubscription} style={styles.button}>Create renewal</Button>
        </div>
        <div style={styles.list}>
          {data.subscriptions.map((item) => (
            <span key={item.id}>{customerName(data.users, item.userId)} - {item.status} - ends {new Date(item.endDate).toLocaleDateString()}</span>
          ))}
        </div>
      </section>

      <DataList id="payments" title="Payments" rows={data.payments.map((item) => `${item.status} - $${item.amount} - ${item.method}`)} />
      <DataList id="attendance" title="Attendance" rows={data.attendance.map((item) => `${new Date(item.checkIn).toLocaleString()} - customer ${item.customerId.slice(-6)}`)} />
      <DataList
        id="requests"
        title="Customer Requests"
        rows={data.supportRequests.map((item) => `${item.status} - ${item.type} - ${customerName(data.users, item.requesterId)}: ${item.subject} - ${item.message}`)}
      />
      <DataList id="notifications" title="Notifications" rows={data.notifications.map((item) => `${item.type}: ${item.message}`)} />
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div style={styles.stat}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function DataList({ id, title, rows }: { id: string; title: string; rows: string[] }) {
  return (
    <section id={id} style={styles.panel}>
      <h2 style={styles.panelTitle}>{title}</h2>
      <div style={styles.list}>
        {rows.length ? rows.map((row, index) => <span key={`${row}-${index}`}>{row}</span>) : <span style={styles.muted}>No records yet.</span>}
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: 32, color: theme.textPrimary, background: theme.bg, minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", marginBottom: 24 },
  eyebrow: { color: theme.accent, fontSize: 12, letterSpacing: 2, fontWeight: 900 },
  title: { fontSize: 44, margin: 0 },
  stats: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 18 },
  stat: { border: `1px solid ${theme.border}`, background: theme.surface, borderRadius: 10, padding: 18, display: "grid", gap: 8 },
  panel: { border: `1px solid ${theme.border}`, background: theme.surface, borderRadius: 10, padding: 20, marginBottom: 18 },
  panelTitle: { fontSize: 24, margin: "0 0 16px" },
  table: { display: "grid", gap: 10 },
  row: { display: "grid", gridTemplateColumns: "44px minmax(140px, 1fr) minmax(180px, 1fr) 110px 120px", gap: 12, alignItems: "center", padding: 12, borderRadius: 8, background: theme.surfaceAlt },
  avatar: { width: 38, height: 38, borderRadius: "50%", display: "grid", placeItems: "center", objectFit: "cover", background: theme.gradient, color: "#fff", fontWeight: 900 },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10, alignItems: "center" },
  button: { padding: "12px 16px", alignSelf: "end" },
  smallButton: { minHeight: 38, padding: "9px 10px" },
  cards: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginTop: 16 },
  card: { display: "grid", gap: 8, padding: 14, border: `1px solid ${theme.border}`, borderRadius: 8, background: theme.surfaceAlt },
  list: { display: "grid", gap: 8, color: theme.textSecondary },
  muted: { color: theme.textMuted },
  error: { padding: 12, marginBottom: 16, borderRadius: 8, border: `1px solid ${theme.danger}`, color: theme.danger, background: `${theme.danger}12` },
};
