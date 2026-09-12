export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "",
};

export function cloudinaryImageUrl(publicId: string, options = "f_auto,q_auto") {
  if (!cloudinaryConfig.cloudName || !publicId) return "";

  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${options}/${publicId}`;
}

export function cloudinaryOrFallback(
  publicId: string | undefined,
  fallback: string,
  options = "f_auto,q_auto,w_2200",
) {
  return publicId ? cloudinaryImageUrl(publicId, options) || fallback : fallback;
}

const fallbackImages = {
  hero:
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2200&q=85",
  heroPerformance:
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=2200&q=85",
  heroCoaching:
    "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=2200&q=85",
  equipmentStrength:
    "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?auto=format&fit=crop&w=1200&q=85",
  equipmentCardio:
    "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1200&q=85",
  equipmentRecovery:
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=85",
};

export const homepageImages = {
  hero: cloudinaryOrFallback(
    process.env.NEXT_PUBLIC_CLOUDINARY_HOME_HERO_1,
    fallbackImages.hero,
    "f_auto,q_auto,w_2400,c_fill",
  ),
  heroPerformance: cloudinaryOrFallback(
    process.env.NEXT_PUBLIC_CLOUDINARY_HOME_HERO_2,
    fallbackImages.heroPerformance,
    "f_auto,q_auto,w_2400,c_fill",
  ),
  heroCoaching: cloudinaryOrFallback(
    process.env.NEXT_PUBLIC_CLOUDINARY_HOME_HERO_3,
    fallbackImages.heroCoaching,
    "f_auto,q_auto,w_2400,c_fill",
  ),
  equipmentStrength: cloudinaryOrFallback(
    process.env.NEXT_PUBLIC_CLOUDINARY_EQUIPMENT_STRENGTH,
    fallbackImages.equipmentStrength,
    "f_auto,q_auto,w_1400,c_fill",
  ),
  equipmentCardio: cloudinaryOrFallback(
    process.env.NEXT_PUBLIC_CLOUDINARY_EQUIPMENT_CARDIO,
    fallbackImages.equipmentCardio,
    "f_auto,q_auto,w_1400,c_fill",
  ),
  equipmentRecovery: cloudinaryOrFallback(
    process.env.NEXT_PUBLIC_CLOUDINARY_EQUIPMENT_RECOVERY,
    fallbackImages.equipmentRecovery,
    "f_auto,q_auto,w_1400,c_fill",
  ),
};

export const homepageSlides = [
  {
    kicker: "AI PERFORMANCE FLOOR",
    title: "Train harder. Track smarter. Rank higher.",
    copy: "Live attendance, equipment media, workout missions, scores, rankings, and coaching in one premium gym operating system.",
    image: homepageImages.hero,
  },
  {
    kicker: "SMART STRENGTH ZONE",
    title: "Every lift becomes measurable progress.",
    copy: "Turn your gym into a data-rich member experience with XP, streaks, goals, and progress-ready dashboards.",
    image: homepageImages.heroPerformance,
  },
  {
    kicker: "COACHING INTELLIGENCE",
    title: "A sharper member journey from day one.",
    copy: "Prepare for AI workout guidance, nutrition insights, renewal alerts, and trainer-led personalization.",
    image: homepageImages.heroCoaching,
  },
];

export async function uploadToCloudinary(file: File, folder = "iron-forge") {
  if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
    throw new Error(
      "Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET",
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinaryConfig.uploadPreset);
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Cloudinary upload failed");
  }

  return data as {
    secure_url: string;
    public_id: string;
    width: number;
    height: number;
    format: string;
  };
}
