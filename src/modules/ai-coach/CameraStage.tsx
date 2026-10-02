"use client";

import { useEffect, useRef, useState } from "react";
import type { PoseLandmarker } from "@mediapipe/tasks-vision";
import { createPoseLandmarker } from "./pose-landmarker";
import { WorkoutEngine } from "./engine";
import { visible } from "./geometry";
import type { ExerciseId, Snapshot } from "./types";
import styles from "./coach.module.css";

const connections = [
  [11, 12],
  [11, 13],
  [13, 15],
  [12, 14],
  [14, 16],
  [11, 23],
  [12, 24],
  [23, 24],
  [23, 25],
  [25, 27],
  [24, 26],
  [26, 28],
];

export default function CameraStage({
  exercise,
  paused,
  onMetrics,
  onReady,
}: {
  exercise: ExerciseId;
  paused: boolean;
  onMetrics: (snapshot: Snapshot) => void;
  onReady: (ready: boolean) => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const callbacks = useRef({ onMetrics, onReady, paused });
  const [status, setStatus] = useState("Loading posture model…");
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [engine] = useState(() => new WorkoutEngine(exercise));
  useEffect(() => {
    callbacks.current = { onMetrics, onReady, paused };
  }, [onMetrics, onReady, paused]);

  useEffect(() => {
    let disposed = false,
      frame = 0,
      stream: MediaStream | undefined,
      model: PoseLandmarker | undefined;
    let lastVideoTime = -1,
      lastInference = 0,
      lastUi = 0,
      lastReps = -1;
    engine.resetTracking();
    const element = video.current;
    function release() {
      if (!disposed) callbacks.current.onReady(false);
      cancelAnimationFrame(frame);
      stream?.getTracks().forEach((track) => track.stop());
      model?.close();
      model = undefined;
      if (element) element.srcObject = null;
    }
    async function start() {
      try {
        if (!window.isSecureContext)
          throw new Error("Camera access needs HTTPS or localhost.");
        if (!navigator.mediaDevices?.getUserMedia)
          throw new Error("This browser does not support camera access.");
        const detector = await createPoseLandmarker();
        if (disposed) {
          detector.close();
          return;
        }
        model = detector;
        const camera = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
          audio: false,
        });
        if (disposed) {
          camera.getTracks().forEach((track) => track.stop());
          return;
        }
        stream = camera;
        element!.srcObject = camera;
        await element!.play();
        if (disposed) return;
        setStatus("Camera live — position yourself in frame.");
        callbacks.current.onReady(true);
        camera.getVideoTracks().forEach((track) =>
          track.addEventListener(
            "ended",
            () => {
              if (!disposed) {
                release();
                setError("Camera disconnected. Reconnect it and retry.");
              }
            },
            { once: true },
          ),
        );
        function tick(time: number) {
          if (disposed) return;
          try {
            if (callbacks.current.paused || document.hidden)
              engine.resetTracking();
            else if (
              element &&
              element.readyState >= 2 &&
              element.currentTime !== lastVideoTime &&
              time - lastInference >= 100
            ) {
              lastVideoTime = element.currentTime;
              lastInference = time;
              const result = model!.detectForVideo(element, time);
              const points = result.landmarks[0] ?? [];
              const snapshot = engine.update(
                points,
                time,
                element.videoWidth / element.videoHeight,
              );
              const surface = canvas.current;
              const context = surface?.getContext("2d");
              if (surface && context) {
                surface.width = element.videoWidth;
                surface.height = element.videoHeight;
                context.clearRect(0, 0, surface.width, surface.height);
                context.strokeStyle =
                  snapshot.status === "WARNING" ? "#fb923c" : "#34d399";
                context.lineWidth = 3;
                for (const [a, b] of connections) {
                  if (!visible(points[a], 0.5) || !visible(points[b], 0.5)) continue;
                  context.beginPath();
                  context.moveTo(
                    points[a].x * surface.width,
                    points[a].y * surface.height,
                  );
                  context.lineTo(
                    points[b].x * surface.width,
                    points[b].y * surface.height,
                  );
                  context.stroke();
                }
                context.fillStyle = "#fff";
                points.forEach((point, index) => {
                  if (index < 11 || !visible(point, 0.5)) return;
                  context.beginPath();
                  context.arc(
                    point.x * surface.width,
                    point.y * surface.height,
                    4,
                    0,
                    Math.PI * 2,
                  );
                  context.fill();
                });
              }
              if (time - lastUi >= 200 || snapshot.reps !== lastReps) {
                callbacks.current.onMetrics(snapshot);
                lastUi = time;
                lastReps = snapshot.reps;
              }
            }
            frame = requestAnimationFrame(tick);
          } catch {
            release();
            setError("Pose tracking stopped. Retry the camera to continue.");
          }
        }
        frame = requestAnimationFrame(tick);
      } catch (reason) {
        release();
        if (!disposed)
          setError(
            reason instanceof DOMException && reason.name === "NotAllowedError"
              ? "Camera permission denied. Allow access in your browser and retry."
              : reason instanceof DOMException &&
                  reason.name === "NotFoundError"
                ? "No camera found. Connect a camera and retry."
                : reason instanceof Error
                  ? `Could not start camera/model: ${reason.message}`
                  : "Could not start camera. Check permissions and model connectivity.",
          );
      }
    }
    void start();
    return () => {
      disposed = true;
      release();
    };
  }, [engine, retry]);

  return (
    <section aria-label="Live posture camera">
      <div className={styles.camera}>
        <video ref={video} muted playsInline />
        <canvas ref={canvas} aria-hidden="true" />
      </div>
      <p role="status">{paused ? "Paused — tracking stopped" : status}</p>
      {error && (
        <div role="alert">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => {
              setError("");
              setRetry((value) => value + 1);
            }}
          >
            Retry camera
          </button>
        </div>
      )}
    </section>
  );
}
