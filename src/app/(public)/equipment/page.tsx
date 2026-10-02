"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PublicPageShell from "@/components/home/PublicPageShell";
import Button from "@/components/ui/Button";
import { homepageImages } from "@/lib/cloudinary";
import { apiRoutes } from "@/config/api-routes";

type SiteImage = {
  _id: string;
  title: string;
  section: string;
  slot?: string;
  secureUrl: string;
};

type EquipmentCard = {
  slot: string;
  name: string;
  desc: string;
  image: string;
  focus: string;
  bestFor: string[];
  avoid: string[];
  routine: string[];
};

const equipment: EquipmentCard[] = [
  {
    slot: "STRENGTH",
    name: "Strength Zone",
    desc: "Racks, benches, cables, plates, and machine stations.",
    image: homepageImages.equipmentStrength,
    focus: "Chest, back, legs, shoulders, arms, and full-body strength.",
    bestFor: [
      "Chest: machine press, bench press, incline dumbbell press, cable fly.",
      "Muscle gain: 3-4 sets of 8-12 reps with controlled form.",
      "Fat-loss support: strength training helps preserve muscle while body weight drops.",
    ],
    avoid: [
      "Do not start heavy without warm-up sets.",
      "Avoid ego lifting when form breaks or joints hurt.",
      "If diabetic, avoid fasted intense training unless your doctor has guided glucose management.",
    ],
    routine: [
      "Beginner chest: machine press 3x10, incline dumbbell press 3x10, cable fly 2x12.",
      "Beginner full-body: leg press, chest press, seated row, shoulder press.",
      "Rest 60-120 seconds between working sets.",
    ],
  },
  {
    slot: "CARDIO",
    name: "Cardio Deck",
    desc: "Treadmills, bikes, rowers, stair climbers, and conditioning tools.",
    image: homepageImages.equipmentCardio,
    focus: "Fat-loss support, stamina, heart health, and daily calorie burn.",
    bestFor: [
      "Fat reduction: incline walk, cycling, rowing, or elliptical for 25-40 minutes.",
      "Beginner: zone-2 cardio where you can still speak in short sentences.",
      "Busy members: 10-minute warm-up plus 15-minute interval finisher.",
    ],
    avoid: [
      "Do not start with all-out sprints if you are new or overweight.",
      "Avoid high-impact running with knee, ankle, or back pain.",
      "If diabetic, carry fast carbs and monitor symptoms during longer cardio.",
    ],
    routine: [
      "Fat-loss base: 30 minutes incline walk, 4-5 days weekly.",
      "Intervals: 1 minute hard, 2 minutes easy, repeat 6-8 rounds.",
      "Pair cardio with protein-rich meals and a steady calorie deficit.",
    ],
  },
  {
    slot: "RECOVERY",
    name: "Recovery Bay",
    desc: "Mobility mats, stretching areas, recovery tools, and cooldown space.",
    image: homepageImages.equipmentRecovery,
    focus: "Mobility, flexibility, posture, pain reduction, and cool-down.",
    bestFor: [
      "After workout: 8-12 minutes stretching for trained muscles.",
      "Desk posture: hip flexor, hamstring, chest, and upper-back mobility.",
      "Recovery: foam rolling, breathing drills, light walking.",
    ],
    avoid: [
      "Do not force painful stretches.",
      "Avoid deep static stretching before heavy lifting.",
      "If you have nerve pain, swelling, or injury, get professional guidance.",
    ],
    routine: [
      "Cool-down: 5 minutes easy bike, then 6 mobility moves.",
      "Hold stretches 20-40 seconds and breathe slowly.",
      "Use recovery days for walking, mobility, and light technique practice.",
    ],
  },
];

const nutritionGuides = [
  {
    title: "Fat loss",
    copy: "Protein at every meal, vegetables, measured carbs, low-sugar drinks, and no starvation crash diets.",
  },
  {
    title: "Diabetes-aware",
    copy: "High-fiber carbs, dal or beans, vegetables, lean protein, unsweetened drinks, and personal medical guidance.",
  },
  {
    title: "Muscle gain",
    copy: "Enough protein, quality carbs around training, progressive lifting, and steady sleep.",
  },
];

export default function EquipmentPage() {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [selected, setSelected] = useState<EquipmentCard | null>(null);

  useEffect(() => {
    fetch(apiRoutes.content.images, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setImages(Array.isArray(data) ? data : []))
      .catch(() => setImages([]));
  }, []);

  const visualPool = useMemo(
    () => images.filter((image) => image.section === "EQUIPMENT"),
    [images],
  );

  function imageForSlot(item: EquipmentCard) {
    const exact = visualPool.find((image) => image.slot === item.slot);
    return exact?.secureUrl || item.image;
  }

  const cards = equipment.map((item) => ({
    ...item,
    image: imageForSlot(item),
  }));

  return (
    <PublicPageShell>
      <section className="if-section if-hero-full">
        <p className="if-kicker">Equipment Library</p>
        <h1 className="if-title">The gym floor should teach before it intimidates.</h1>
        <p className="if-copy">
          Click a zone to learn what it trains, which exercises fit your goal,
          what to avoid, and how Cloudinary-powered visuals can keep the floor
          fresh without code edits.
        </p>
      </section>

      <section className="if-section" style={{ paddingTop: 0 }}>
        <div className="if-grid-lg">
          {cards.map((item) => (
            <motion.article
              key={item.name}
              whileHover={{ y: -8 }}
              onClick={() => setSelected(item)}
              className="if-photo-card"
              style={{
                cursor: "pointer",
                backgroundImage: `linear-gradient(180deg, transparent, rgba(0,0,0,.86)), url(${item.image})`,
              }}
            >
              <div className="if-photo-card-body">
                <span className="if-tag">Open guide</span>
                <h2>{item.name}</h2>
                <p>{item.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="if-section" style={{ paddingTop: 0 }}>
        <div className="if-card">
          <span className="if-tag">Nutrition Quick Guide</span>
          <h2 className="if-title-sm">
            Training guidance gets better when food habits are visible too.
          </h2>
          <div className="if-grid" style={{ marginTop: 24 }}>
            {nutritionGuides.map((guide) => (
              <article key={guide.title} className="if-card">
                <h3>{guide.title}</h3>
                <p>{guide.copy}</p>
              </article>
            ))}
          </div>
          <p className="if-muted" style={{ marginTop: 18 }}>
            Nutrition and medical-condition content is general education, not a
            diagnosis or personal medical diet plan.
          </p>
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,.74)",
              zIndex: 100,
              display: "grid",
              placeItems: "center",
              padding: 20,
            }}
          >
            <motion.div
              initial={{ y: 28, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 18, scale: 0.98 }}
              onClick={(event) => event.stopPropagation()}
              className="if-card"
              style={{ width: "min(1120px, 100%)", maxHeight: "88vh", overflow: "auto" }}
            >
              <Button
                onClick={() => setSelected(null)}
                variant="secondary"
                style={{ float: "right", minHeight: 42 }}
              >
                Close
              </Button>
              <div
                className="if-photo-card"
                style={{
                  minHeight: 320,
                  marginBottom: 24,
                  backgroundImage: `linear-gradient(180deg, transparent, rgba(0,0,0,.86)), url(${selected.image})`,
                }}
              />
              <span className="if-tag">{selected.focus}</span>
              <h2 className="if-title-sm">{selected.name}</h2>
              <div className="if-grid" style={{ marginTop: 24 }}>
                <GuideBlock title="Best For" items={selected.bestFor} />
                <GuideBlock title="Avoid / Be Careful" items={selected.avoid} />
                <GuideBlock title="Sample Routine" items={selected.routine} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PublicPageShell>
  );
}

function GuideBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="if-card">
      <h3>{title}</h3>
      {items.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </article>
  );
}
