import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import PublicPageShell from "@/components/home/PublicPageShell";
import FadeInSection from "@/components/motion/FadeInSection";
import Card from "@/components/ui/Card";
import { DEFAULT_AVATAR_URL } from "@/lib/media";
import { prisma } from "@/infrastructure/prisma/client";
import { theme } from "@/lib/theme";

export default async function TeamPage() {
  const trainers = await prisma.user.findMany({
    where: { role: "TRAINER", isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, email: true, phone: true, photoUrl: true, specialization: true, experienceYrs: true, bio: true },
  });

  return (
    <PublicPageShell>
      <section className="if-section if-hero-full">
        <p className="if-kicker">Trainer Team</p>
        <h1 className="if-title">Meet the people behind the follow-up.</h1>
        <p className="if-copy">
          Trainer profiles use real seeded/admin data where it exists, with a
          default avatar fallback when a photo has not been uploaded yet.
        </p>
      </section>

      <FadeInSection className="if-section" style={{ paddingTop: 0 }}>
        <div className="if-grid">
          {trainers.length ? trainers.map((trainer) => (
            <Card key={trainer.id}>
              <div style={styles.photoWrap}>
                <Image
                  src={trainer.photoUrl || DEFAULT_AVATAR_URL}
                  alt={`${trainer.name} trainer`}
                  fill
                  sizes="(max-width: 800px) 100vw, 33vw"
                  unoptimized
                  style={{ objectFit: "cover" }}
                />
              </div>
              <span className="if-tag">{trainer.specialization || "Fitness coach"}</span>
              <h2>{trainer.name}</h2>
              <p>{trainer.bio || `${trainer.experienceYrs || 0}+ years of coaching experience in the Iron Forge trainer system.`}</p>
              <div style={styles.actions}>
                <a href={`mailto:${trainer.email}`} style={styles.iconLink} aria-label={`Email ${trainer.name}`}>
                  <Mail size={18} />
                </a>
                <a href={`tel:${trainer.phone || "+919876543210"}`} style={styles.iconLink} aria-label={`Call ${trainer.name}`}>
                  <Phone size={18} />
                </a>
              </div>
            </Card>
          )) : (
            <Card>
              <h2>No active trainers yet</h2>
              <p>Trainer cards will appear here after the owner creates trainer accounts.</p>
            </Card>
          )}
        </div>
      </FadeInSection>
    </PublicPageShell>
  );
}

const styles: Record<string, React.CSSProperties> = {
  photoWrap: {
    position: "relative",
    width: "100%",
    aspectRatio: "16 / 10",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 18,
    background: theme.surfaceAlt,
  },
  actions: { display: "flex", gap: 10, marginTop: 18 },
  iconLink: {
    width: 40,
    height: 40,
    display: "grid",
    placeItems: "center",
    borderRadius: 10,
    border: `1px solid ${theme.border}`,
    color: theme.textPrimary,
    textDecoration: "none",
  },
};
