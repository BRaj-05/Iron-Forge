"use client";
import { useState } from "react";
import AskCoach from "./AskCoach";
import PostureCoach from "./PostureCoach";
import styles from "./coach.module.css";

export default function AICoach() {
  const [tab, setTab] = useState("posture");
  return (
    <div className={`${styles.coachPage} immersive-page`}>
      <div className={styles.coach}>
        <header className={styles.hero}>
          <div><p className={styles.kicker}>IRON FORGE AI COACH</p><h1>Form feedback while you move.</h1><p>Turn your camera into a private training mirror with live rep tracking, clear cues and progress you can revisit.</p></div>
          <div className={styles.heroSignal}><span>VISION SYSTEM</span><strong>Ready when you are</strong><small>5 guided movements · local camera analysis</small></div>
        </header>
        <div className={styles.featureStrip}>
          <article><b>01</b><div><strong>Real-time posture correction</strong><span>Clear cues during each movement.</span></div></article>
          <article><b>02</b><div><strong>Beginner-friendly rep counting</strong><span>Practical range, stable transitions.</span></div></article>
          <article><b>03</b><div><strong>Private in-browser analysis</strong><span>Video frames never leave your device.</span></div></article>
        </div>
        <div className={styles.row} role="tablist" aria-label="Coach mode">
          <button
            role="tab"
            id="posture-tab"
            aria-selected={tab === "posture"}
            aria-controls="coach-panel"
            onClick={() => setTab("posture")}
          >
            Posture Coach
          </button>
          <button
            role="tab"
            id="ask-tab"
            aria-selected={tab === "ask"}
            aria-controls="coach-panel"
            onClick={() => setTab("ask")}
          >
            Ask Coach
          </button>
        </div>
        <div id="coach-panel" role="tabpanel" aria-labelledby={`${tab}-tab`}>
          {tab === "posture" ? <PostureCoach /> : <AskCoach />}
        </div>
      </div>
    </div>
  );
}
