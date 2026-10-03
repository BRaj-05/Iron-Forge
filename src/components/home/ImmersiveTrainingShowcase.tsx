"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Play, ShieldCheck } from "lucide-react";
import { experienceSlides, liveForgeMetrics, trustedVideoGuides } from "@/lib/experience-media";

export default function ImmersiveTrainingShowcase() {
  const [active, setActive] = useState(0);
  const [metricStep, setMetricStep] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0);

  useEffect(() => {
    const slideTimer = window.setInterval(
      () => setActive((value) => (value + 1) % experienceSlides.length),
      4600,
    );
    const metricTimer = window.setInterval(
      () => setMetricStep((value) => (value + 1) % 4),
      2200,
    );
    return () => {
      window.clearInterval(slideTimer);
      window.clearInterval(metricTimer);
    };
  }, []);

  const orderedSlides = useMemo(
    () =>
      experienceSlides.map((slide, index) => ({
        slide,
        offset: (index - active + experienceSlides.length) % experienceSlides.length,
      })),
    [active],
  );

  const activeVideo = trustedVideoGuides[videoIndex];

  function move(delta: number) {
    setActive((current) => (current + delta + experienceSlides.length) % experienceSlides.length);
  }

  return (
    <section className="if-section immersive-showcase" aria-labelledby="live-forge-title">
      <div className="immersive-heading">
        <div>
          <p className="if-kicker">Live Forge Experience</p>
          <h2 id="live-forge-title" className="if-title-sm">A front page that feels alive, not like a template.</h2>
          <p className="if-copy">
            Training visuals, live-changing readiness signals, and trusted video guidance sit in one fast,
            interactive layer.
          </p>
        </div>
        <div className="immersive-controls" aria-label="Training showcase controls">
          <button type="button" onClick={() => move(-1)} aria-label="Previous training slide"><ChevronLeft /></button>
          <button type="button" onClick={() => move(1)} aria-label="Next training slide"><ChevronRight /></button>
        </div>
      </div>

      <div className="immersive-stage">
        <div className="immersive-carousel" aria-live="polite">
          {orderedSlides.map(({ slide, offset }, index) => {
            const visibleOffset = offset > 2 ? offset - experienceSlides.length : offset;
            const distance = Math.abs(visibleOffset);
            return (
              <motion.article
                key={slide.title}
                className="immersive-card"
                animate={{
                  x: visibleOffset * 210,
                  rotateY: visibleOffset * -18,
                  rotateZ: visibleOffset * 1.4,
                  scale: distance === 0 ? 1 : Math.max(0.74, 0.9 - distance * 0.08),
                  opacity: distance > 2 ? 0 : distance === 0 ? 1 : 0.62,
                  zIndex: 10 - distance,
                }}
                transition={{ type: "spring", stiffness: 130, damping: 20 }}
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(6,7,10,.08), rgba(6,7,10,.88)), url(${slide.image})`,
                  pointerEvents: distance === 0 ? "auto" : "none",
                }}
                aria-hidden={distance !== 0}
              >
                <span className="immersive-source">{slide.source}</span>
                <div>
                  <p>{slide.eyebrow}</p>
                  <h3>{slide.title}</h3>
                  <span>{slide.copy}</span>
                  <Link href={slide.href}>Explore <ArrowUpRight size={16} /></Link>
                </div>
              </motion.article>
            );
          })}
        </div>

        <aside className="immersive-live-panel">
          <div className="immersive-live-head">
            <span><i /> Live readiness</span>
            <small>Demo parameters</small>
          </div>
          <div className="immersive-metric-list">
            {liveForgeMetrics.map((metric) => {
              const value = metric.values[metricStep % metric.values.length];
              return (
                <div key={metric.label} className="immersive-metric">
                  <div><span>{metric.label}</span><strong>{value}{metric.suffix}</strong></div>
                  <div className="immersive-meter"><motion.span animate={{ width: `${value}%` }} transition={{ duration: .65 }} /></div>
                </div>
              );
            })}
          </div>
          <div className="immersive-pulse-card">
            <span>Next focus</span>
            <AnimatePresence mode="wait">
              <motion.strong
                key={metricStep}
                initial={{ opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -7 }}
              >
                {["Upper-body power", "Hip mobility", "Zone-2 conditioning", "Recovery + sleep"][metricStep % 4]}
              </motion.strong>
            </AnimatePresence>
          </div>
        </aside>
      </div>

      <div className="trusted-video-shell">
        <div className="trusted-video-copy">
          <p className="if-kicker">Trusted free-to-watch guidance</p>
          <h3>Learn inside Iron Forge without re-uploading somebody else&apos;s video.</h3>
          <p>
            These are embedded from official YouTube channels using privacy-enhanced mode. The original publisher
            keeps control of the video.
          </p>
          <div className="trusted-video-tabs">
            {trustedVideoGuides.map((video, index) => (
              <button
                type="button"
                key={video.videoId}
                className={index === videoIndex ? "is-active" : ""}
                onClick={() => setVideoIndex(index)}
              >
                <Play size={15} />
                <span>{video.publisher}</span>
              </button>
            ))}
          </div>
          <div className="trusted-video-note"><ShieldCheck size={17} /><span>{activeVideo.note}</span></div>
        </div>

        <div className="trusted-video-frame">
          <iframe
            key={activeVideo.videoId}
            src={`https://www.youtube-nocookie.com/embed/${activeVideo.videoId}?rel=0`}
            title={activeVideo.title}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
