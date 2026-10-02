import type { Point } from "./types";

/**
 * MediaPipe visibility fluctuates during fast movement. 0.55 is deliberately
 * tolerant enough for workout tracking while still rejecting weak landmarks.
 */
export function visible(point?: Point, minVisibility = 0.55): point is Point {
  return (
    !!point &&
    Number.isFinite(point.x) &&
    Number.isFinite(point.y) &&
    (point.visibility ?? 0) >= minVisibility &&
    point.x >= -0.05 &&
    point.x <= 1.05 &&
    point.y >= -0.05 &&
    point.y <= 1.05
  );
}

export function strongVisible(point?: Point): point is Point {
  return visible(point, 0.7);
}

/** Pixel aspect correction matters because normalized x/y use different units. */
export function calculateAngle(
  a: Point,
  b: Point,
  c: Point,
  aspect = 1,
): number | null {
  const u = [(a.x - b.x) * aspect, a.y - b.y];
  const v = [(c.x - b.x) * aspect, c.y - b.y];
  const denominator = Math.hypot(...u) * Math.hypot(...v);
  if (!Number.isFinite(denominator) || denominator < 1e-8) return null;

  return (
    (Math.acos(
      Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1]) / denominator)),
    ) *
      180) /
    Math.PI
  );
}

export function torsoLean(shoulder: Point, hip: Point, aspect: number) {
  return (
    (Math.atan2(
      Math.abs(shoulder.x - hip.x) * aspect,
      Math.abs(shoulder.y - hip.y),
    ) *
      180) /
    Math.PI
  );
}

export function horizontalBodyRatio(a: Point, b: Point, aspect: number) {
  const horizontal = Math.abs(a.x - b.x) * aspect;
  const vertical = Math.abs(a.y - b.y);
  return horizontal / Math.max(vertical, 0.03);
}
