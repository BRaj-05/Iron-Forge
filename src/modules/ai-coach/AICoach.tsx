"use client";
import { useState } from "react";
import AskCoach from "./AskCoach";
import PostureCoach from "./PostureCoach";
import styles from "./coach.module.css";

export default function AICoach() {
  const [tab, setTab] = useState("posture");
  return (
    <div className="dashboard-page">
      <div className={styles.coach}>
        <p>IRON FORGE AI COACH</p>
        <h1>Train smarter. Fix your form in real time.</h1>
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
