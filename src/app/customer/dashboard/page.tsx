"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DEFAULT_AVATAR_URL } from "@/lib/media";
import { theme } from "@/lib/theme";

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  photoUrl?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  heightCm?: number | null;
  weightKg?: number | null;
  emergencyContact?: string | null;
};
type Plan = { name: string; price: number; durationDays: number } | null;
type Subscription = { status: string; endDate: string; daysRemaining?: number } | null;
type Attendance = { id: string; checkIn: string; checkOut?: string | null };
type Payment = { id: string; amount: number; method: string; status: string; createdAt: string };
type Notification = { id: string; type: string; message: string; isRead: boolean };
type Trainer = { name: string; email: string; specialization?: string | null; photoUrl?: string | null } | null;
type Daily = {
  logDate: string;
  workout?: { workoutName: string; exercises: unknown; completed: boolean; notes?: string | null } | null;
  diet?: { meals: unknown; waterCups: number; completed: boolean; notes?: string | null } | null;
  metric?: { weightKg?: number | null; heightCm?: number | null; notes?: string | null } | null;
};

type DashboardData = {
  user: User;
  plan: Plan;
  subscription: Subscription;
  attendance: Attendance[];
  payments: Payment[];
  notifications: Notification[];
  trainer: Trainer;
  daily?: Daily;
};

export default function CustomerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    heightCm: "",
    weightKg: "",
    emergencyContact: "",
  });
  const [dailyForm, setDailyForm] = useState({
    workoutName: "Today strength plan",
    exerciseOne: "Bench Press",
    exerciseTwo: "Lat Pulldown",
    exerciseThree: "Squat",
    exerciseOneSets: "3",
    exerciseOneReps: "10",
    exerciseOneWeight: "",
    exerciseTwoSets: "3",
    exerciseTwoReps: "10",
    exerciseTwoWeight: "",
    exerciseThreeSets: "3",
    exerciseThreeReps: "10",
    exerciseThreeWeight: "",
    workoutCompleted: false,
    workoutNotes: "",
    breakfast: "",
    lunch: "",
    dinner: "",
    waterCups: "6",
    dietCompleted: false,
    metricNotes: "",
  });

  async function loadData() {
    setError("");
    try {
      const response = await fetch("/api/dashboard/customer", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not load dashboard.");
      setData(payload);
      setProfileForm({
        name: payload.user?.name || "",
        phone: payload.user?.phone || "",
        address: payload.user?.address || "",
        dateOfBirth: payload.user?.dateOfBirth ? payload.user.dateOfBirth.slice(0, 10) : "",
        gender: payload.user?.gender || "",
        heightCm: payload.user?.heightCm ? String(payload.user.heightCm) : "",
        weightKg: payload.user?.weightKg ? String(payload.user.weightKg) : "",
        emergencyContact: payload.user?.emergencyContact || "",
      });
      if (payload.daily?.workout || payload.daily?.diet || payload.daily?.metric) {
        const exercises = Array.isArray(payload.daily.workout?.exercises) ? payload.daily.workout.exercises : [];
        const meals = Array.isArray(payload.daily.diet?.meals) ? payload.daily.diet.meals : [];
        setDailyForm((current) => ({
          ...current,
          workoutName: payload.daily.workout?.workoutName || current.workoutName,
          exerciseOne: exercises[0]?.name || current.exerciseOne,
          exerciseTwo: exercises[1]?.name || current.exerciseTwo,
          exerciseThree: exercises[2]?.name || current.exerciseThree,
          exerciseOneSets: String(exercises[0]?.sets ?? current.exerciseOneSets),
          exerciseOneReps: String(exercises[0]?.reps ?? current.exerciseOneReps),
          exerciseOneWeight: String(exercises[0]?.weightKg ?? current.exerciseOneWeight),
          exerciseTwoSets: String(exercises[1]?.sets ?? current.exerciseTwoSets),
          exerciseTwoReps: String(exercises[1]?.reps ?? current.exerciseTwoReps),
          exerciseTwoWeight: String(exercises[1]?.weightKg ?? current.exerciseTwoWeight),
          exerciseThreeSets: String(exercises[2]?.sets ?? current.exerciseThreeSets),
          exerciseThreeReps: String(exercises[2]?.reps ?? current.exerciseThreeReps),
          exerciseThreeWeight: String(exercises[2]?.weightKg ?? current.exerciseThreeWeight),
          workoutCompleted: Boolean(payload.daily.workout?.completed),
          workoutNotes: payload.daily.workout?.notes || "",
          breakfast: meals[0]?.food || current.breakfast,
          lunch: meals[1]?.food || current.lunch,
          dinner: meals[2]?.food || current.dinner,
          waterCups: String(payload.daily.diet?.waterCups ?? current.waterCups),
          dietCompleted: Boolean(payload.daily.diet?.completed),
          metricNotes: payload.daily.metric?.notes || "",
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function uploadPhoto(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.set("file", file);
    const response = await fetch("/api/upload", { method: "POST", body: formData });
    const payload = await response.json();
    if (!response.ok) setError(payload.error || "Photo upload failed.");
    await loadData();
    setUploading(false);
  }

  async function saveProfile() {
    setSavingProfile(true);
    setError("");
    const response = await fetch("/api/dashboard/customer", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...profileForm,
        dateOfBirth: profileForm.dateOfBirth || null,
        heightCm: profileForm.heightCm || null,
        weightKg: profileForm.weightKg || null,
      }),
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Could not save profile.");
    } else {
      await loadData();
    }
    setSavingProfile(false);
  }

  async function markAttendance() {
    setError("");
    const response = await fetch("/api/attendance/checkin", { method: "POST" });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Could not mark attendance.");
      return;
    }
    await loadData();
  }

  async function saveDailyLog() {
    setError("");
    const exercises = [
      { name: dailyForm.exerciseOne, sets: dailyForm.exerciseOneSets, reps: dailyForm.exerciseOneReps, weightKg: dailyForm.exerciseOneWeight || 0, done: dailyForm.workoutCompleted },
      { name: dailyForm.exerciseTwo, sets: dailyForm.exerciseTwoSets, reps: dailyForm.exerciseTwoReps, weightKg: dailyForm.exerciseTwoWeight || 0, done: dailyForm.workoutCompleted },
      { name: dailyForm.exerciseThree, sets: dailyForm.exerciseThreeSets, reps: dailyForm.exerciseThreeReps, weightKg: dailyForm.exerciseThreeWeight || 0, done: dailyForm.workoutCompleted },
    ].filter((exercise) => exercise.name.trim());

    const meals = [
      { name: "Breakfast", food: dailyForm.breakfast || "Not entered", done: Boolean(dailyForm.breakfast) },
      { name: "Lunch", food: dailyForm.lunch || "Not entered", done: Boolean(dailyForm.lunch) },
      { name: "Dinner", food: dailyForm.dinner || "Not entered", done: Boolean(dailyForm.dinner) },
    ];

    const response = await fetch("/api/customer/daily-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workoutName: dailyForm.workoutName,
        exercises,
        workoutCompleted: dailyForm.workoutCompleted,
        workoutNotes: dailyForm.workoutNotes,
        meals,
        waterCups: dailyForm.waterCups,
        dietCompleted: dailyForm.dietCompleted,
        dietNotes: `${dailyForm.breakfast} ${dailyForm.lunch} ${dailyForm.dinner}`.trim(),
        weightKg: profileForm.weightKg,
        heightCm: profileForm.heightCm,
        metricNotes: dailyForm.metricNotes,
      }),
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Could not save daily log.");
      return;
    }
    await loadData();
  }

  if (loading) return <main style={styles.page}>Loading your member dashboard...</main>;
  if (error && !data) return <main style={styles.page}><div style={styles.error}>{error}</div></main>;
  if (!data) return null;

  const showBanner = data.subscription?.status === "EXPIRING_SOON" || data.subscription?.status === "EXPIRED";

  return (
    <main style={styles.page}>
      {showBanner && (
        <section style={styles.banner}>
          <strong>{data.subscription?.status === "EXPIRED" ? "Membership expired" : "Membership expiring soon"}</strong>
          <span>
            {data.subscription?.status === "EXPIRED"
              ? "Renew your plan to keep attendance and trainer access active."
              : `${data.subscription?.daysRemaining ?? 0} days remaining. Renew early to avoid interruption.`}
          </span>
          <a href="/plans" style={styles.bannerLink}>Renew</a>
        </section>
      )}

      {error && <div style={styles.error}>{error}</div>}

      <section style={styles.hero}>
        <div style={styles.profile}>
          <Image src={data.user.photoUrl || DEFAULT_AVATAR_URL} alt="" width={72} height={72} unoptimized style={styles.avatar} />
          <div>
            <p style={styles.eyebrow}>CUSTOMER</p>
            <h1 style={styles.title}>{data.user.name}</h1>
            <p style={styles.muted}>{data.user.email}</p>
          </div>
        </div>
        <label style={styles.uploadButton}>
          {uploading ? "Uploading..." : "Update photo"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            disabled={uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) uploadPhoto(file);
            }}
          />
        </label>
      </section>

      <section style={styles.stats}>
        <Stat label="Plan" value={data.plan?.name || "No active plan"} />
        <Stat label="Status" value={data.subscription?.status || "NONE"} />
        <Stat label="Ends" value={data.subscription ? new Date(data.subscription.endDate).toLocaleDateString() : "Not set"} />
        <Stat label="Check-ins" value={data.attendance.length} />
      </section>

      <section style={styles.mandatoryPanel}>
        <div>
          <p style={styles.eyebrow}>DAILY REQUIRED</p>
          <h2 style={styles.panelTitle}>Attendance, workout, diet, and body tracking</h2>
          <p style={styles.muted}>
            Your trainer can see exercise, diet, age, sex, height, weight, and progress notes.
            Phone, email, address, and emergency contact stay private to you and the owner.
          </p>
        </div>
        <button onClick={markAttendance} style={styles.checkButton}>Mark today attendance</button>
      </section>

      <section style={styles.grid}>
        <Panel title="Today workout">
          <div style={styles.formGridWide}>
            <input placeholder="Workout name" value={dailyForm.workoutName} onChange={(event) => setDailyForm({ ...dailyForm, workoutName: event.target.value })} style={styles.input} />
            {[1, 2, 3].map((item) => {
              const nameKey = item === 1 ? "exerciseOne" : item === 2 ? "exerciseTwo" : "exerciseThree";
              const setsKey = item === 1 ? "exerciseOneSets" : item === 2 ? "exerciseTwoSets" : "exerciseThreeSets";
              const repsKey = item === 1 ? "exerciseOneReps" : item === 2 ? "exerciseTwoReps" : "exerciseThreeReps";
              const weightKey = item === 1 ? "exerciseOneWeight" : item === 2 ? "exerciseTwoWeight" : "exerciseThreeWeight";
              return (
                <div key={item} style={styles.exerciseRow}>
                  <input placeholder={`Exercise ${item}`} value={dailyForm[nameKey]} onChange={(event) => setDailyForm({ ...dailyForm, [nameKey]: event.target.value })} style={styles.input} />
                  <input type="number" min="0" placeholder="Sets" value={dailyForm[setsKey]} onChange={(event) => setDailyForm({ ...dailyForm, [setsKey]: event.target.value })} style={styles.input} />
                  <input type="number" min="0" placeholder="Reps" value={dailyForm[repsKey]} onChange={(event) => setDailyForm({ ...dailyForm, [repsKey]: event.target.value })} style={styles.input} />
                  <input type="number" min="0" placeholder="Kg" value={dailyForm[weightKey]} onChange={(event) => setDailyForm({ ...dailyForm, [weightKey]: event.target.value })} style={styles.input} />
                </div>
              );
            })}
            <textarea placeholder="What did you actually do today?" value={dailyForm.workoutNotes} onChange={(event) => setDailyForm({ ...dailyForm, workoutNotes: event.target.value })} style={styles.textarea} />
            <label style={styles.checkbox}><input type="checkbox" checked={dailyForm.workoutCompleted} onChange={(event) => setDailyForm({ ...dailyForm, workoutCompleted: event.target.checked })} /> Workout completed</label>
          </div>
        </Panel>

        <Panel title="Today diet">
          <div style={styles.formGrid}>
            <input placeholder="Breakfast" value={dailyForm.breakfast} onChange={(event) => setDailyForm({ ...dailyForm, breakfast: event.target.value })} style={styles.input} />
            <input placeholder="Lunch" value={dailyForm.lunch} onChange={(event) => setDailyForm({ ...dailyForm, lunch: event.target.value })} style={styles.input} />
            <input placeholder="Dinner" value={dailyForm.dinner} onChange={(event) => setDailyForm({ ...dailyForm, dinner: event.target.value })} style={styles.input} />
            <input type="number" min="0" max="40" placeholder="Water cups" value={dailyForm.waterCups} onChange={(event) => setDailyForm({ ...dailyForm, waterCups: event.target.value })} style={styles.input} />
            <textarea placeholder="Weight, energy, soreness, notes" value={dailyForm.metricNotes} onChange={(event) => setDailyForm({ ...dailyForm, metricNotes: event.target.value })} style={styles.textarea} />
            <label style={styles.checkbox}><input type="checkbox" checked={dailyForm.dietCompleted} onChange={(event) => setDailyForm({ ...dailyForm, dietCompleted: event.target.checked })} /> Diet plan followed</label>
            <button onClick={saveDailyLog} style={styles.saveButton}>Save daily log</button>
          </div>
        </Panel>

        <Panel title="Personal details">
          <div style={styles.formGrid}>
            <input placeholder="Name" value={profileForm.name} onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })} style={styles.input} />
            <input placeholder="Phone number" value={profileForm.phone} onChange={(event) => setProfileForm({ ...profileForm, phone: event.target.value })} style={styles.input} />
            <input type="date" aria-label="Date of birth" value={profileForm.dateOfBirth} onChange={(event) => setProfileForm({ ...profileForm, dateOfBirth: event.target.value })} style={styles.input} />
            <select value={profileForm.gender} onChange={(event) => setProfileForm({ ...profileForm, gender: event.target.value })} style={styles.input}>
              <option value="">Sex</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
            <input type="number" min="1" placeholder="Height cm" value={profileForm.heightCm} onChange={(event) => setProfileForm({ ...profileForm, heightCm: event.target.value })} style={styles.input} />
            <input type="number" min="1" placeholder="Weight kg" value={profileForm.weightKg} onChange={(event) => setProfileForm({ ...profileForm, weightKg: event.target.value })} style={styles.input} />
            <input placeholder="Address" value={profileForm.address} onChange={(event) => setProfileForm({ ...profileForm, address: event.target.value })} style={styles.input} />
            <input placeholder="Emergency contact" value={profileForm.emergencyContact} onChange={(event) => setProfileForm({ ...profileForm, emergencyContact: event.target.value })} style={styles.input} />
            <button onClick={saveProfile} disabled={savingProfile} style={styles.saveButton}>
              {savingProfile ? "Saving..." : "Save profile"}
            </button>
          </div>
        </Panel>

        <Panel title="Trainer">
          {data.trainer ? (
            <div style={styles.list}>
              <strong>{data.trainer.name}</strong>
              <span>{data.trainer.specialization || "General training"}</span>
              <span>{data.trainer.email}</span>
            </div>
          ) : <span style={styles.muted}>No trainer assigned yet.</span>}
        </Panel>

        <Panel title="Recent attendance">
          <div style={styles.list}>
            {data.attendance.length ? data.attendance.slice(0, 8).map((item) => (
              <span key={item.id}>{new Date(item.checkIn).toLocaleString()}</span>
            )) : <span style={styles.muted}>No check-ins yet.</span>}
          </div>
        </Panel>

        <Panel title="Payments">
          <div style={styles.list}>
            {data.payments.length ? data.payments.slice(0, 8).map((item) => (
              <span key={item.id}>{item.status} - ${item.amount} - {item.method}</span>
            )) : <span style={styles.muted}>No payments yet.</span>}
          </div>
        </Panel>

        <Panel title="Notifications">
          <div style={styles.list}>
            {data.notifications.length ? data.notifications.map((item) => (
              <span key={item.id}>{item.message}</span>
            )) : <span style={styles.muted}>No notifications.</span>}
          </div>
        </Panel>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={styles.stat}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={styles.panel}>
      <h2 style={styles.panelTitle}>{title}</h2>
      {children}
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: "clamp(18px, 3vw, 32px)", color: theme.textPrimary },
  banner: { border: `1px solid ${theme.gold}`, background: `${theme.gold}14`, borderRadius: 10, padding: 16, marginBottom: 18, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" },
  bannerLink: { color: theme.gold, fontWeight: 900, marginLeft: "auto" },
  error: { border: `1px solid ${theme.danger}`, background: `${theme.danger}12`, color: theme.danger, borderRadius: 10, padding: 12, marginBottom: 18 },
  hero: { border: `1px solid ${theme.border}`, background: theme.surface, borderRadius: 10, padding: 22, display: "flex", justifyContent: "space-between", gap: 18, alignItems: "center", marginBottom: 18 },
  profile: { display: "flex", gap: 16, alignItems: "center" },
  avatar: { width: 72, height: 72, borderRadius: "50%", objectFit: "cover", display: "grid", placeItems: "center", background: theme.gradient, color: "#fff", fontWeight: 900, fontSize: 22 },
  eyebrow: { color: theme.accent, fontSize: 12, letterSpacing: 2, fontWeight: 900 },
  title: { margin: "4px 0", fontSize: 38 },
  muted: { color: theme.textSecondary },
  uploadButton: { border: `1px solid ${theme.border}`, borderRadius: 8, padding: "11px 14px", cursor: "pointer", color: theme.textPrimary, background: theme.surfaceAlt, fontWeight: 900 },
  input: { width: "100%", padding: 12, borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.surfaceAlt, color: theme.textPrimary },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 },
  formGridWide: { display: "grid", gap: 10 },
  exerciseRow: { display: "grid", gridTemplateColumns: "minmax(150px, 1fr) 72px 72px 82px", gap: 8 },
  textarea: { width: "100%", minHeight: 86, padding: 12, borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.surfaceAlt, color: theme.textPrimary, resize: "vertical" },
  checkbox: { color: theme.textSecondary, display: "flex", alignItems: "center", gap: 8 },
  saveButton: { border: "none", borderRadius: 8, background: theme.gradient, color: "#fff", cursor: "pointer", padding: "12px 14px", fontWeight: 900 },
  stats: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14, marginBottom: 18 },
  mandatoryPanel: { border: `1px solid ${theme.accent}80`, background: `linear-gradient(135deg, ${theme.accent}18, rgba(17,17,24,0.92))`, borderRadius: 10, padding: 18, marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, flexWrap: "wrap" },
  checkButton: { border: "none", borderRadius: 8, background: theme.gradientGreen, color: "#fff", cursor: "pointer", padding: "12px 16px", fontWeight: 900, whiteSpace: "nowrap" },
  stat: { border: `1px solid ${theme.border}`, background: theme.surface, borderRadius: 10, padding: 18, display: "grid", gap: 8 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 },
  panel: { border: `1px solid ${theme.border}`, background: theme.surface, borderRadius: 10, padding: 18 },
  panelTitle: { margin: "0 0 14px", fontSize: 22 },
  list: { display: "grid", gap: 8, color: theme.textSecondary },
};
