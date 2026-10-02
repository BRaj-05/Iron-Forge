"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Exercise, MuscleGroup } from "@/lib/exercise-data";
import { exerciseImageForExercise, exercisePath } from "@/lib/exercise-data";

export default function MuscleExerciseShowcase({
  group,
  exercises,
}: {
  group: MuscleGroup;
  exercises: Exercise[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const active = exercises[activeIndex];

  const select = useCallback(
    (nextIndex: number) => {
      const normalized = (nextIndex + exercises.length) % exercises.length;
      setDirection(normalized >= activeIndex ? 1 : -1);
      setActiveIndex(normalized);
    },
    [activeIndex, exercises.length],
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") select(activeIndex + 1);
      if (event.key === "ArrowLeft") select(activeIndex - 1);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, select]);

  if (!active) return null;

  return (
    <section className="exercise-showcase" aria-label={`${group.name} exercise gallery`}>
      <div className="exercise-showcase-heading">
        <div>
          <p className="if-kicker">Explore the movement</p>
          <h2 className="if-title-sm">One exercise. Full focus.</h2>
        </div>
        <div className="exercise-showcase-count">
          <strong>{String(activeIndex + 1).padStart(2, "0")}</strong>
          <span>/ {String(exercises.length).padStart(2, "0")}</span>
        </div>
      </div>

      <div className="exercise-stage">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.article
            key={active.slug}
            custom={direction}
            variants={{
              enter: (slideDirection: number) => ({ opacity: 0, x: slideDirection * 90, scale: 0.985 }),
              center: { opacity: 1, x: 0, scale: 1 },
              exit: (slideDirection: number) => ({ opacity: 0, x: slideDirection * -70, scale: 0.985 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="exercise-slide"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70) select(activeIndex + 1);
              if (info.offset.x > 70) select(activeIndex - 1);
            }}
          >
            <div className="exercise-slide-media">
              <Image
                src={exerciseImageForExercise(active)}
                alt={`${active.name} demonstration`}
                fill
                priority
                unoptimized
                sizes="(max-width: 900px) 100vw, 58vw"
                className="exercise-slide-image"
              />
              <div className="exercise-slide-shade" />
              <span className="exercise-slide-number">{String(activeIndex + 1).padStart(2, "0")}</span>
            </div>

            <div className="exercise-slide-copy">
              <span className="if-tag">{active.difficulty}</span>
              <p className="exercise-slide-label">{group.name} · {active.equipment.join(" · ")}</p>
              <h3>{active.name}</h3>
              <p>{active.description}</p>
              <dl className="exercise-slide-facts">
                <div><dt>Target</dt><dd>{active.targetMuscles.slice(0, 2).join(", ")}</dd></div>
                <div><dt>Start with</dt><dd>{active.setsReps.beginner}</dd></div>
              </dl>
              <Link href={exercisePath(active)} className="if-button">
                Open full exercise guide <ArrowRight size={17} />
              </Link>
            </div>
          </motion.article>
        </AnimatePresence>

        <button className="exercise-arrow is-left" onClick={() => select(activeIndex - 1)} aria-label="Previous exercise">
          <ChevronLeft />
        </button>
        <button className="exercise-arrow is-right" onClick={() => select(activeIndex + 1)} aria-label="Next exercise">
          <ChevronRight />
        </button>
      </div>

      <div className="exercise-filmstrip" role="tablist" aria-label="Choose an exercise">
        {exercises.map((exercise, index) => (
          <button
            key={exercise.slug}
            role="tab"
            aria-selected={index === activeIndex}
            className={`exercise-filmstrip-item ${index === activeIndex ? "is-active" : ""}`}
            onClick={() => select(index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{exercise.name}</strong>
          </button>
        ))}
      </div>

      <Link href="/gym" className="exercise-back-link">
        <ArrowLeft size={16} /> Back to all muscle groups
      </Link>
    </section>
  );
}
