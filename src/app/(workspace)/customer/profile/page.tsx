"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Camera, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHeading from "@/components/ui/PageHeading";
import { Input, Select } from "@/components/ui/FormField";
import { DEFAULT_AVATAR_URL } from "@/lib/media";
import { apiRequest, jsonRequest } from "@/modules/customer/api";
import { useCustomerDashboard } from "@/modules/customer/useCustomerDashboard";
import { apiRoutes } from "@/config/api-routes";

const emptyForm = { name: "", phone: "", address: "", dateOfBirth: "", gender: "", heightCm: "", weightKg: "", emergencyContact: "" };

export default function CustomerProfilePage() {
  const { data, loading, error, refresh } = useCustomerDashboard();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  useEffect(() => { if (data) setForm({ name: data.user.name || "", phone: data.user.phone || "", address: data.user.address || "", dateOfBirth: data.user.dateOfBirth?.slice(0, 10) || "", gender: data.user.gender || "", heightCm: data.user.heightCm ? String(data.user.heightCm) : "", weightKg: data.user.weightKg ? String(data.user.weightKg) : "", emergencyContact: data.user.emergencyContact || "" }); }, [data]);
  function update(key: keyof typeof form, value: string) { setForm((current) => ({ ...current, [key]: value })); }
  async function save() {
    setSaving(true);
    try { await jsonRequest(apiRoutes.customer.dashboard, "PATCH", { ...form, dateOfBirth: form.dateOfBirth || null, heightCm: form.heightCm || null, weightKg: form.weightKg || null }); toast.success("Profile updated."); await refresh(); }
    catch (reason) { toast.error(reason instanceof Error ? reason.message : "Could not save your profile."); }
    finally { setSaving(false); }
  }
  async function upload(file: File) {
    setUploading(true);
    try { const body = new FormData(); body.set("file", file); await apiRequest(apiRoutes.customer.profilePhoto, { method: "POST", body }); toast.success("Profile photo updated."); await refresh(); }
    catch (reason) { toast.error(reason instanceof Error ? reason.message : "Could not upload the photo."); }
    finally { setUploading(false); }
  }
  if (loading) return <div className="skeleton dashboard-title-skeleton" />;
  if (!data) return <Card className="dashboard-error">{error || "Could not load profile."}</Card>;
  return <div className="dashboard-page compact-page">
    <PageHeading eyebrow="My account" title="Your profile" description="Keep your personal and fitness details accurate so your plan stays useful." />
    <section className="profile-layout">
      <Card className="profile-summary">
        <div className="profile-photo-wrap"><Image src={data.user.photoUrl || DEFAULT_AVATAR_URL} alt={`${data.user.name}'s profile`} width={120} height={120} unoptimized /><label className="profile-photo-action" title="Update photo"><Camera size={17} /><input type="file" hidden accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); }} /></label></div>
        <h2>{data.user.name}</h2><p>{data.user.email}</p><span className="profile-role"><ShieldCheck size={15} /> Iron Forge member</span>
        <div className="profile-privacy"><ShieldCheck size={18} /><div><strong>Your information is private</strong><p>Contact and emergency details are only visible to you and authorized gym staff.</p></div></div>
      </Card>
      <Card className="profile-form-card">
        <div className="dashboard-panel-heading"><div><h2>Personal details</h2><p>Information used for your account and gym support.</p></div></div>
        <div className="profile-form-grid">
          <Input label="Full name" value={form.name} onChange={(event) => update("name", event.target.value)} />
          <Input label="Phone number" value={form.phone} onChange={(event) => update("phone", event.target.value)} />
          <Input label="Date of birth" type="date" value={form.dateOfBirth} onChange={(event) => update("dateOfBirth", event.target.value)} />
          <Select label="Gender" value={form.gender} onChange={(event) => update("gender", event.target.value)}><option value="">Select</option><option>Female</option><option>Male</option><option>Other</option><option>Prefer not to say</option></Select>
          <Input label="Height (cm)" type="number" min="1" value={form.heightCm} onChange={(event) => update("heightCm", event.target.value)} />
          <Input label="Weight (kg)" type="number" min="1" value={form.weightKg} onChange={(event) => update("weightKg", event.target.value)} />
          <Input label="Address" value={form.address} onChange={(event) => update("address", event.target.value)} />
          <Input label="Emergency contact" value={form.emergencyContact} onChange={(event) => update("emergencyContact", event.target.value)} />
        </div>
        <div className="profile-form-actions"><Button onClick={() => void save()} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button></div>
      </Card>
    </section>
  </div>;
}
