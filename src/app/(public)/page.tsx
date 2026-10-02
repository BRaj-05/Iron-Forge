"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PublicPageShell from "@/components/home/PublicPageShell";
import FadeInSection from "@/components/motion/FadeInSection";
import Card from "@/components/ui/Card";
import {
  blogPosts,
  faqItems,
  homepageShowcase,
  learningPillars,
  planCards,
  rankPreview,
  taskPreview,
  testimonials,
} from "@/lib/public-content";
import { homepageImages, homepageSlides } from "@/lib/cloudinary";
import { apiRoutes } from "@/config/api-routes";

type SiteImage = {
  _id: string;
  title: string;
  section: string;
  slot?: string;
  secureUrl: string;
  alt?: string;
};

const equipmentSlots = [
  {
    slot: "STRENGTH",
    title: "Strength Zone",
    copy: "Racks, benches, cables, plates, chest presses, and safe beginner machine paths.",
    fallback: homepageImages.equipmentStrength,
  },
  {
    slot: "CARDIO",
    title: "Cardio Deck",
    copy: "Treadmills, bikes, rowers, stair climbers, walking plans, and fat-loss conditioning.",
    fallback: homepageImages.equipmentCardio,
  },
  {
    slot: "RECOVERY",
    title: "Recovery Bay",
    copy: "Mobility tools, stretching pods, cool-down tracking, and posture-friendly recovery.",
    fallback: homepageImages.equipmentRecovery,
  },
];

export default function HomePage() {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    fetch(apiRoutes.content.images, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setImages(Array.isArray(data) ? data : []))
      .catch(() => setImages([]));
  }, []);

  const slides = useMemo(() => {
    const heroImages = images.filter((image) => image.section === "HOME_HERO");
    if (!heroImages.length) return homepageSlides;

    return heroImages.slice(0, 5).map((image, index) => ({
      ...homepageSlides[index % homepageSlides.length],
      kicker: image.title,
      image: image.secureUrl,
    }));
  }, [images]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  function imageForSlot(slot: string, fallback: string) {
    const exact = images.find(
      (image) => image.section === "EQUIPMENT" && image.slot === slot,
    );

    return exact?.secureUrl || fallback;
  }

  const currentSlide = slides[activeSlide % slides.length] || slides[0];

  return (
    <PublicPageShell>
      <section className="if-section if-hero">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.image}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.85 }}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `linear-gradient(90deg, rgba(10,10,15,.98), rgba(10,10,15,.78), rgba(10,10,15,.35)), url(${currentSlide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 0,
            }}
          />
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          style={{ position: "relative", zIndex: 1 }}
        >
          <p className="if-kicker">{currentSlide.kicker}</p>
          <h1 className="if-title">Train smarter. Move better. Run the gym sharper.</h1>
          <p className="if-copy">
            Iron Forge combines gym learning, yoga guidance, nutrition habits,
            AI coaching, trainer booking, Cloudinary media, XP, ranks, and
            admin control into one premium fitness system.
          </p>

          <div className="if-actions">
            <Link href="/signup" className="if-button">
              Start Learning
            </Link>
            <Link href="/equipment" className="if-button-secondary">
              Explore Equipment
            </Link>
            <Link href="/plans" className="if-button-secondary">
              View Plans
            </Link>
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="if-card if-float"
          style={{ zIndex: 1 }}
        >
          <span className="if-tag">Today&apos;s Forge Score</span>
          <div className="if-score-orb">
            <strong>92</strong>
            <span>Score</span>
          </div>
          <div style={{ display: "grid", gap: 10, marginTop: 22 }}>
            <ScoreLine label="Strength" value="+40 XP" />
            <ScoreLine label="Attendance" value="18 day streak" />
            <ScoreLine label="Rank" value="#14 this week" />
          </div>
        </motion.aside>
      </section>

      <section className="if-section">
        <p className="if-kicker">Fitness Education Stack</p>
        <h2 className="if-title-sm">A member should never feel lost on the gym floor.</h2>
        <div className="if-grid" style={{ marginTop: 28 }}>
          {learningPillars.map((pillar, index) => (
            <motion.article
              key={pillar.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="if-card"
            >
              <span className="if-tag">{pillar.label}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.copy}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="if-section">
        <p className="if-kicker">Cloudinary Gym Floor</p>
        <h2 className="if-title-sm">Photos become editable business content, not hard-coded decoration.</h2>
        <p className="if-copy">
          Admin can upload images to Cloudinary and assign exact slots. These
          public cards read the latest active media from MongoDB.
        </p>
        <div className="if-grid-lg" style={{ marginTop: 30 }}>
          {equipmentSlots.map((item) => (
            <article
              key={item.slot}
              className="if-photo-card"
              style={{
                backgroundImage: `linear-gradient(180deg, transparent, rgba(0,0,0,.86)), url(${imageForSlot(item.slot, item.fallback)})`,
              }}
            >
              <div className="if-photo-card-body">
                <span className="if-tag">{item.slot}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="if-section">
        <div className="if-grid-lg">
          {homepageShowcase.map((item) => (
            <article key={item.title} className="if-card">
              <span className="if-tag">{item.kicker}</span>
              <h2>{item.title}</h2>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="if-section">
        <p className="if-kicker">Mission Stack</p>
        <h2 className="if-title-sm">Daily work becomes a clean score, not a messy habit list.</h2>
        <div className="if-grid-lg" style={{ marginTop: 28 }}>
          <div className="if-card">
            <h3>Workout + Diet Tasks</h3>
            <div style={{ display: "grid", gap: 12 }}>
              {taskPreview.map((task) => (
                <div key={task.title} className="if-row">
                  <span className="if-badge">{task.xp}</span>
                  <div>
                    <strong>{task.title}</strong>
                    <p className="if-muted">{task.note}</p>
                  </div>
                  <span style={{ color: "#FBBF24", fontWeight: 900 }}>
                    {task.goal}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="if-card">
            <h3>Live Rank Preview</h3>
            <div style={{ display: "grid", gap: 12 }}>
              {rankPreview.slice(0, 3).map((user, index) => (
                <div key={user.name} className="if-row">
                  <span className="if-badge">{index + 1}</span>
                  <div>
                    <strong>{user.name}</strong>
                    <p className="if-muted">
                      Level {user.level} - {user.streak} streak
                    </p>
                  </div>
                  <span style={{ color: "#FBBF24", fontWeight: 900 }}>
                    {user.xp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="if-section">
        <p className="if-kicker">Memberships</p>
        <h2 className="if-title-sm">Plans for gym, yoga, combo training, and premium coaching.</h2>
        <div className="if-grid" style={{ marginTop: 28 }}>
          {planCards.map((plan) => (
            <article key={plan.name} className="if-card">
              <span className="if-tag">{plan.tag}</span>
              <h3>{plan.name}</h3>
              <strong style={{ color: "#FBBF24", fontSize: 34 }}>{plan.price}</strong>
              <p style={{ marginTop: 12 }}>{plan.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <FadeInSection className="if-section">
        <p className="if-kicker">What our members say</p>
        <h2 className="if-title-sm">Placeholder quotes while real testimonial collection is added.</h2>
        <div className="if-grid" style={{ marginTop: 28 }}>
          {testimonials.map((item) => (
            <Card key={item.name}>
              <span className="if-tag">{item.label}</span>
              <p style={{ fontSize: 18, lineHeight: 1.7 }}>&quot;{item.quote}&quot;</p>
              <strong>{item.name}</strong>
            </Card>
          ))}
        </div>
      </FadeInSection>

      <FadeInSection className="if-section">
        <p className="if-kicker">Tips & Guides</p>
        <h2 className="if-title-sm">Quick reads for training, nutrition, and consistency.</h2>
        <div className="if-grid" style={{ marginTop: 28 }}>
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
              <Card>
                <span className="if-tag">{post.readTime}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </Card>
            </Link>
          ))}
        </div>
      </FadeInSection>

      <section className="if-section">
        <p className="if-kicker">FAQ</p>
        <h2 className="if-title-sm">Clear answers before the platform gets bigger.</h2>
        <div className="if-grid" style={{ marginTop: 28 }}>
          {faqItems.map((item) => (
            <article key={item.q} className="if-card">
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </article>
          ))}
        </div>
      </section>
    </PublicPageShell>
  );
}

function ScoreLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="if-row" style={{ gridTemplateColumns: "1fr auto" }}>
      <span className="if-muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
