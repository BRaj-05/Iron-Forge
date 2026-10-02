"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import CloudinaryUploadButton from "@/components/media/CloudinaryUploadButton";
import { theme } from "@/lib/theme";
import { apiRoutes } from "@/config/api-routes";

type SiteImage = {
  _id: string;
  title: string;
  section: ImageSection;
  slot?: ImageSlot;
  secureUrl: string;
  publicId: string;
  alt: string;
  active: boolean;
  sortOrder: number;
};

type ImageSection =
  | "HOME_HERO"
  | "EQUIPMENT"
  | "TRAINER"
  | "BRANCH"
  | "GALLERY"
  | "TRANSFORMATION"
  | "MEMBERSHIP";

type ImageSlot = string;

const sections: Array<{ label: string; value: ImageSection; hint: string }> = [
  {
    label: "Home Hero Slider",
    value: "HOME_HERO",
    hint: "Large homepage sliding photos",
  },
  {
    label: "Equipment",
    value: "EQUIPMENT",
    hint: "Strength, cardio, recovery, machines",
  },
  { label: "Trainers", value: "TRAINER", hint: "Coach profile images" },
  { label: "Branches", value: "BRANCH", hint: "Gym locations and interiors" },
  { label: "Gallery", value: "GALLERY", hint: "General website gallery" },
  {
    label: "Transformations",
    value: "TRANSFORMATION",
    hint: "Before/after member stories",
  },
  {
    label: "Memberships",
    value: "MEMBERSHIP",
    hint: "Plan banners and campaign photos",
  },
];

const placementsBySection: Record<
  ImageSection,
  Array<{ label: string; value: ImageSlot; title: string; helper: string }>
> = {
  HOME_HERO: [
    {
      label: "Hero Slide 1",
      value: "HOME_HERO_1",
      title: "Hero Slide 1",
      helper: "Main homepage opening image.",
    },
    {
      label: "Hero Slide 2",
      value: "HOME_HERO_2",
      title: "Hero Slide 2",
      helper: "Second homepage slider image.",
    },
    {
      label: "Hero Slide 3",
      value: "HOME_HERO_3",
      title: "Hero Slide 3",
      helper: "Third homepage slider image.",
    },
  ],
  EQUIPMENT: [
    {
      label: "Strength Zone",
      value: "STRENGTH",
      title: "Strength Zone",
      helper: "Card for racks, bench, cables, plates, chest/strength area.",
    },
    {
      label: "Cardio Deck",
      value: "CARDIO",
      title: "Cardio Deck",
      helper: "Card for treadmill, bikes, rowing, fat-loss equipment.",
    },
    {
      label: "Recovery Bay",
      value: "RECOVERY",
      title: "Recovery Bay",
      helper: "Card for stretching, mobility, recovery tools.",
    },
  ],
  TRAINER: [
    {
      label: "Trainer Header",
      value: "TRAINER_HEAD",
      title: "Trainer Header",
      helper: "Large trainer section/banner image.",
    },
    {
      label: "Coach 1",
      value: "TRAINER_COACH_1",
      title: "Coach 1",
      helper: "First trainer profile image.",
    },
    {
      label: "Coach 2",
      value: "TRAINER_COACH_2",
      title: "Coach 2",
      helper: "Second trainer profile image.",
    },
    {
      label: "Coach 3",
      value: "TRAINER_COACH_3",
      title: "Coach 3",
      helper: "Third trainer profile image.",
    },
  ],
  BRANCH: [
    {
      label: "Branch Exterior",
      value: "BRANCH_EXTERIOR",
      title: "Branch Exterior",
      helper: "Outside/location photo.",
    },
    {
      label: "Branch Interior",
      value: "BRANCH_INTERIOR",
      title: "Branch Interior",
      helper: "Reception/interior photo.",
    },
    {
      label: "Workout Floor",
      value: "BRANCH_FLOOR",
      title: "Workout Floor",
      helper: "Main gym floor photo.",
    },
    {
      label: "Recovery Area",
      value: "BRANCH_RECOVERY",
      title: "Recovery Area",
      helper: "Stretching/recovery corner photo.",
    },
  ],
  GALLERY: [
    { label: "Gallery 1", value: "GALLERY_1", title: "Gallery 1", helper: "General gallery slot 1." },
    { label: "Gallery 2", value: "GALLERY_2", title: "Gallery 2", helper: "General gallery slot 2." },
    { label: "Gallery 3", value: "GALLERY_3", title: "Gallery 3", helper: "General gallery slot 3." },
    { label: "Gallery 4", value: "GALLERY_4", title: "Gallery 4", helper: "General gallery slot 4." },
    { label: "Gallery 5", value: "GALLERY_5", title: "Gallery 5", helper: "General gallery slot 5." },
    { label: "Gallery 6", value: "GALLERY_6", title: "Gallery 6", helper: "General gallery slot 6." },
  ],
  TRANSFORMATION: [
    {
      label: "Before Photo",
      value: "TRANSFORMATION_BEFORE",
      title: "Transformation Before",
      helper: "Before/progress starting photo.",
    },
    {
      label: "After Photo",
      value: "TRANSFORMATION_AFTER",
      title: "Transformation After",
      helper: "After/result photo.",
    },
    {
      label: "Story Banner",
      value: "TRANSFORMATION_STORY",
      title: "Transformation Story",
      helper: "Transformation story banner.",
    },
  ],
  MEMBERSHIP: [
    {
      label: "Elite Plan",
      value: "MEMBERSHIP_ELITE",
      title: "Elite Plan",
      helper: "Image for Elite membership card.",
    },
    {
      label: "Pro Plan",
      value: "MEMBERSHIP_PRO",
      title: "Pro Plan",
      helper: "Image for Pro membership card.",
    },
    {
      label: "Select Plan",
      value: "MEMBERSHIP_SELECT",
      title: "Select Plan",
      helper: "Image for Select membership card.",
    },
  ],
};

export default function AdminMediaPage() {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [section, setSection] = useState<ImageSection>("HOME_HERO");
  const [slot, setSlot] = useState<ImageSlot>("HOME_HERO_1");
  const [title, setTitle] = useState("");
  const [alt, setAlt] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const selectedSection = useMemo(
    () => sections.find((item) => item.value === section),
    [section],
  );
  const placements = placementsBySection[section];
  const selectedPlacement = useMemo(
    () => placements.find((item) => item.value === slot) || placements[0],
    [placements, slot],
  );

  async function fetchImages() {
    setLoading(true);
    const res = await fetch(apiRoutes.content.images, { cache: "no-store" });
    const data = await res.json();
    setImages(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchImages();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function saveUploadedImage(upload: {
    secure_url: string;
    public_id: string;
  }) {
    setSaving(true);
    setMessage("");

    const res = await fetch(apiRoutes.content.images, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim() || selectedPlacement?.title || selectedSection?.label || "Website image",
        alt: alt.trim() || title.trim() || selectedPlacement?.title,
        section,
        slot,
        sortOrder: Number(sortOrder || 0),
        secureUrl: upload.secure_url,
        publicId: upload.public_id,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Could not save image metadata.");
      setSaving(false);
      return;
    }

    setImages((prev) => [data, ...prev]);
    setTitle("");
    setAlt("");
    setSortOrder("0");
    setMessage("Image uploaded to Cloudinary and saved to MongoDB.");
    await fetchImages();
    setSaving(false);
  }

  async function syncCloudinaryFolder() {
    setSaving(true);
    setMessage("");

    const res = await fetch(apiRoutes.admin.mediaSync, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Could not sync Cloudinary folder.");
      setSaving(false);
      return;
    }

    await fetchImages();
    setMessage(`${data.message} Folder: ${data.folder}`);
    setSaving(false);
  }

  async function toggleActive(image: SiteImage) {
    const res = await fetch(apiRoutes.content.images, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: image._id, active: !image.active }),
    });

    const data = await res.json();
    if (res.ok) {
      setImages((prev) =>
        prev.map((item) => (item._id === image._id ? data : item)),
      );
    }
  }

  async function moveToCurrentSection(image: SiteImage) {
    const res = await fetch(apiRoutes.content.images, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: image._id,
        section,
        slot,
        active: true,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setImages((prev) =>
        prev.map((item) => (item._id === image._id ? data : item)),
      );
      setMessage(`${image.title} is now active in ${selectedSection?.label}.`);
    } else {
      setMessage(data.error || "Could not move image.");
    }
  }

  async function deleteImage(id: string) {
    const res = await fetch(apiRoutes.content.images, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setImages((prev) => prev.filter((item) => item._id !== id));
    }
  }

  return (
    <main style={styles.page}>
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.header}
      >
        <div>
          <p style={styles.eyebrow}>CLOUDINARY MEDIA CONTROL</p>
          <h1 style={styles.title}>Website Photos</h1>
          <p style={styles.copy}>
            Upload once from admin. Cloudinary stores the file, MongoDB stores
            where it belongs, and the website updates automatically.
          </p>
        </div>
        <button onClick={fetchImages} style={styles.refreshButton}>
          Refresh
        </button>
      </motion.div>

      <section style={styles.uploadPanel}>
        <div style={styles.formGrid}>
          <label style={styles.field}>
            <span style={styles.label}>Section</span>
            <select
              value={section}
              onChange={(event) => {
                const nextSection = event.target.value as ImageSection;
                const nextPlacement = placementsBySection[nextSection][0];
                setSection(nextSection);
                setSlot(nextPlacement.value);
                setTitle((current) => current || nextPlacement.title);
              }}
              style={styles.input}
            >
              {sections.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Image Title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Main gym floor"
              style={styles.input}
            />
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Sort Order</span>
            <input
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              type="number"
              style={styles.input}
            />
          </label>
        </div>

        <label style={{ ...styles.field, marginTop: 14 }}>
            <span style={styles.label}>Image Place</span>
            <select
              value={slot}
              onChange={(event) => {
                const nextSlot = event.target.value as ImageSlot;
                setSlot(nextSlot);
                const selectedSlot = placements.find(
                  (item) => item.value === nextSlot,
                );
                setTitle((current) => current || selectedSlot?.title || "");
              }}
              style={styles.input}
            >
              {placements.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <span style={styles.placeHint}>{selectedPlacement?.helper}</span>
          </label>

        <div style={styles.placeGrid}>
          {placements.map((item) => {
            const active = item.value === slot;
            const assigned = images.find(
              (image) =>
                image.section === section &&
                image.slot === item.value &&
                image.active,
            );

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  setSlot(item.value);
                  setTitle((current) => current || item.title);
                }}
                style={{
                  ...styles.placeCard,
                  borderColor: active ? `${theme.accent}80` : theme.border,
                  background: active ? `${theme.accent}14` : theme.surfaceAlt,
                }}
              >
                <strong>{item.label}</strong>
                <span>{assigned ? "Image assigned" : "Empty slot"}</span>
              </button>
            );
          })}
        </div>

        <label style={{ ...styles.field, marginTop: 14 }}>
          <span style={styles.label}>Alt Text</span>
          <input
            value={alt}
            onChange={(event) => setAlt(event.target.value)}
            placeholder="Describe the photo for accessibility"
            style={styles.input}
          />
        </label>

        <div style={styles.uploadFooter}>
          <div>
            <strong style={styles.sectionName}>{selectedSection?.label}</strong>
            <p style={styles.hint}>{selectedSection?.hint}</p>
          </div>
          <CloudinaryUploadButton
            folder={`iron-forge/${section.toLowerCase()}`}
            label={saving ? "Saving..." : "Upload To Cloudinary"}
            onUploaded={saveUploadedImage}
          />
          <button
            type="button"
            onClick={syncCloudinaryFolder}
            disabled={saving}
            style={styles.syncButton}
          >
            Sync Cloudinary Folder
          </button>
        </div>

        {message && <p style={styles.message}>{message}</p>}
      </section>

      <section style={styles.gallery}>
        {loading ? (
          <p style={styles.empty}>Loading media...</p>
        ) : images.length === 0 ? (
          <p style={styles.empty}>No website images uploaded yet.</p>
        ) : (
          images.map((image, index) => (
            <motion.article
              key={image._id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              style={styles.imageCard}
            >
              <div
                style={{
                  ...styles.preview,
                  backgroundImage: `url(${image.secureUrl})`,
                }}
              />
              <div style={styles.imageBody}>
                <div>
                  <p style={styles.imageTitle}>{image.title}</p>
                  <p style={styles.imageMeta}>
                    {image.section}
                    {image.slot ? ` / ${image.slot}` : ""} -{" "}
                    {image.active ? "VISIBLE" : "HIDDEN"}
                  </p>
                </div>
                <div style={styles.actions}>
                  {image.section !== section && (
                    <button
                      onClick={() => moveToCurrentSection(image)}
                      style={{
                        ...styles.smallButton,
                        color: theme.accent,
                        borderColor: `${theme.accent}55`,
                      }}
                    >
                      Use Here
                    </button>
                  )}
                  <button
                    onClick={() => toggleActive(image)}
                    style={{
                      ...styles.smallButton,
                      color: image.active ? theme.green : theme.textSecondary,
                      borderColor: image.active ? `${theme.green}55` : theme.border,
                    }}
                  >
                    {image.active ? "Visible" : "Show"}
                  </button>
                  <button
                    onClick={() => deleteImage(image._id)}
                    style={{
                      ...styles.smallButton,
                      color: theme.danger,
                      borderColor: `${theme.danger}55`,
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.article>
          ))
        )}
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: 32,
    background: theme.bg,
    color: theme.textPrimary,
  },
  header: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 20,
    marginBottom: 24,
  },
  eyebrow: {
    color: theme.accent,
    fontFamily: "'Space Mono', monospace",
    fontSize: 10,
    letterSpacing: 4,
    marginBottom: 6,
  },
  title: {
    fontSize: 48,
    lineHeight: 1,
    margin: 0,
  },
  copy: {
    maxWidth: 680,
    color: theme.textSecondary,
    lineHeight: 1.7,
    marginTop: 10,
  },
  refreshButton: {
    border: `1px solid ${theme.border}`,
    background: theme.surface,
    color: theme.textPrimary,
    borderRadius: 10,
    padding: "11px 16px",
    cursor: "pointer",
  },
  uploadPanel: {
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: 18,
    padding: 22,
    marginBottom: 24,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 160px",
    gap: 14,
  },
  field: {
    display: "grid",
    gap: 8,
  },
  label: {
    color: theme.textSecondary,
    fontFamily: "'Space Mono', monospace",
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  input: {
    width: "100%",
    border: `1px solid ${theme.border}`,
    background: theme.surfaceAlt,
    color: theme.textPrimary,
    borderRadius: 10,
    padding: "12px 13px",
    outline: "none",
  },
  placeHint: {
    color: theme.textMuted,
    fontSize: 12,
    lineHeight: 1.5,
  },
  placeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 10,
    marginTop: 14,
  },
  placeCard: {
    border: `1px solid ${theme.border}`,
    borderRadius: 12,
    color: theme.textPrimary,
    cursor: "pointer",
    display: "grid",
    gap: 6,
    padding: 14,
    textAlign: "left",
  },
  uploadFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
    marginTop: 18,
    paddingTop: 18,
    borderTop: `1px solid ${theme.border}`,
  },
  syncButton: {
    border: `1px solid ${theme.accent}55`,
    background: `${theme.accent}12`,
    color: theme.accent,
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 900,
    padding: "12px 18px",
  },
  sectionName: {
    color: theme.textPrimary,
  },
  hint: {
    color: theme.textMuted,
    margin: "5px 0 0",
    fontSize: 13,
  },
  message: {
    color: theme.green,
    margin: "14px 0 0",
    fontSize: 13,
  },
  gallery: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
  },
  empty: {
    color: theme.textSecondary,
  },
  imageCard: {
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: 16,
    overflow: "hidden",
  },
  preview: {
    aspectRatio: "16 / 10",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  imageBody: {
    padding: 14,
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
  },
  imageTitle: {
    margin: 0,
    fontWeight: 800,
  },
  imageMeta: {
    margin: "5px 0 0",
    color: theme.textMuted,
    fontFamily: "'Space Mono', monospace",
    fontSize: 10,
  },
  actions: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
  },
  smallButton: {
    border: `1px solid ${theme.border}`,
    background: "transparent",
    borderRadius: 8,
    padding: "7px 9px",
    cursor: "pointer",
    fontSize: 12,
  },
};
