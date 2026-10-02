const { test } = require("node:test");
const assert = require("node:assert/strict");
require("ts-node").register({
  transpileOnly: true,
  compilerOptions: { module: "CommonJS", moduleResolution: "node" },
});
const {
  WorkoutEngine,
  formScore,
} = require("../src/modules/ai-coach/engine.ts");
const { calculateAngle } = require("../src/modules/ai-coach/geometry.ts");
const { sessionSchema } = require("../src/modules/ai-coach/validation.ts");

function pose(exercise, degrees) {
  const points = Array.from({ length: 33 }, () => ({
    x: 0,
    y: 0,
    visibility: 0,
  }));
  const angle = (degrees * Math.PI) / 180;
  for (const offset of [0, 1]) {
    const put = (index, x, y) => {
      points[index + offset] = { x: x + offset * 0.01, y, visibility: 0.99 };
    };
    put(11, 0.4, 0.2);
    put(23, 0.4, 0.4);
    put(25, 0.4, 0.6);
    put(27, 0.4 + 0.15 * Math.sin(angle), 0.6 - 0.15 * Math.cos(angle));
    put(13, 0.4, 0.4);
    put(15, 0.4 + 0.15 * Math.sin(angle), 0.4 - 0.15 * Math.cos(angle));
    if (exercise === "SHOULDER_PRESS") {
      put(11, 0.4, 0.4);
      put(23, 0.4, 0.7);
      put(13, 0.4, 0.25);
      put(15, 0.4 + 0.15 * Math.sin(angle), 0.25 + 0.15 * Math.cos(angle));
    }
    if (exercise === "PUSH_UP") {
      put(11, 0.2, 0.4);
      put(23, 0.5, 0.4);
      put(27, 0.8, 0.4);
      put(13, 0.3, 0.5);
      const base = (-3 * Math.PI) / 4 + angle;
      put(15, 0.3 + 0.14 * Math.cos(base), 0.5 + 0.14 * Math.sin(base));
    }
  }
  return points;
}

for (const exercise of [
  "SQUAT",
  "PUSH_UP",
  "BICEPS_CURL",
  "SHOULDER_PRESS",
  "LUNGE",
]) {
  test(`${exercise}: complete cycles count once, held positions do not`, () => {
    const engine = new WorkoutEngine(exercise);
    let time = 0,
      snapshot;
    const hold = (angle, frames = 8) => {
      for (let i = 0; i < frames; i++)
        snapshot = engine.update(pose(exercise, angle), (time += 100));
    };
    const start = exercise === "SHOULDER_PRESS" ? 70 : 175;
    const peak = exercise === "SHOULDER_PRESS" ? 175 : 35;
    hold(start);
    assert.equal(snapshot.reps, 0);
    hold(peak);
    assert.equal(snapshot.reps, 0);
    hold(start);
    assert.equal(snapshot.reps, 1);
    hold(start, 20);
    assert.equal(snapshot.reps, 1);
    hold(peak);
    hold(start);
    assert.equal(snapshot.reps, 2);
    hold(peak);
    engine.update([], (time += 100));
    hold(start);
    assert.equal(snapshot.reps, 2, "lost pose cancels an incomplete rep");
  });
}

test("low confidence and brief threshold crossings never count", () => {
  const engine = new WorkoutEngine("SQUAT");
  let result;
  for (let i = 0; i < 50; i++)
    result = engine.update(pose("SQUAT", i % 2 ? 35 : 175), i * 100);
  assert.equal(result.reps, 0);
  const hidden = pose("SQUAT", 175).map((p) => ({ ...p, visibility: 0.2 }));
  result = engine.update(hidden, 5100);
  assert.equal(result.status, "PARTIAL_POSE");
  result = engine.update(hidden, 5800);
  assert.equal(result.status, "NO_POSE");
});

test("push-up accepts beginner depth, tolerates brief pose loss, and counts on return to top", () => {
  const engine = new WorkoutEngine("PUSH_UP");
  let time = 0, result;
  const hold = (angle, frames = 8, confidence = 0.99) => {
    for (let i = 0; i < frames; i++) {
      const points = pose("PUSH_UP", angle).map((point) => point.visibility ? { ...point, visibility: confidence } : point);
      result = engine.update(points, (time += 100));
    }
  };
  hold(158);
  hold(138, 4);
  hold(118);
  assert.equal(result.reps, 0, "bottom alone is not a repetition");
  result = engine.update([], (time += 100));
  assert.equal(result.status, "PARTIAL_POSE");
  hold(138, 4, 0.55);
  hold(158, 8, 0.55);
  assert.equal(result.reps, 1);
  hold(147, 5); hold(149, 5); hold(147, 5); hold(149, 5);
  assert.equal(result.reps, 1, "threshold noise cannot double count");
});


test("beginner push-up with moderate depth counts", () => {
  const engine = new WorkoutEngine("PUSH_UP");
  let time = 0, result;
  const hold = (angle, frames = 8) => {
    for (let i = 0; i < frames; i++)
      result = engine.update(pose("PUSH_UP", angle), (time += 100));
  };
  hold(156);
  hold(136, 4);
  hold(120);
  hold(136, 4);
  hold(156);
  assert.equal(result.reps, 1);
});

test("standing elbow curl cannot count as a push-up", () => {
  const engine = new WorkoutEngine("PUSH_UP");
  let result, time = 0;
  for (const angle of [170, 170, 90, 90, 170, 170]) {
    for (let i = 0; i < 5; i++) {
      const points = pose("PUSH_UP", angle);
      for (const offset of [0, 1]) {
        points[11 + offset] = { x: .4, y: .2, visibility: .99 };
        points[23 + offset] = { x: .4, y: .5, visibility: .99 };
        points[25 + offset] = { x: .4, y: .7, visibility: .99 };
        points[27 + offset] = { x: .4, y: .9, visibility: .99 };
      }
      result = engine.update(points, (time += 100));
    }
  }
  assert.equal(result.reps, 0);
});

test("sustained form warnings lower the score and aggregate once per attempt", () => {
  const engine = new WorkoutEngine("SQUAT");
  let time = 0,
    snapshot;
  const hold = (angle, bad = false) => {
    for (let i = 0; i < 10; i++) {
      const points = pose("SQUAT", angle);
      if (bad) {
        points[11] = { x: 0.7, y: 0.3, visibility: 0.99 };
        points[12] = { x: 0.71, y: 0.3, visibility: 0.99 };
      }
      snapshot = engine.update(points, (time += 100));
    }
  };
  hold(175);
  hold(35, true);
  hold(175);
  assert.equal(snapshot.reps, 1);
  assert.equal(snapshot.goodReps, 0);
  assert.equal(snapshot.issues[0].count, 1);
  hold(35);
  hold(175);
  assert.equal(snapshot.reps, 2);
  assert.equal(snapshot.formScore, 50);
});

test("angles correct for image aspect and reject zero-length limbs", () => {
  assert.equal(
    calculateAngle({ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 1 }),
    null,
  );
  assert.ok(
    Math.abs(
      calculateAngle({ x: 0.5, y: 1 }, { x: 0, y: 0 }, { x: 1, y: 0 }, 2) - 45,
    ) < 0.001,
  );
  assert.equal(formScore(10, 8), 80);
});

test("session validation rejects spoofed ownership and inconsistent totals", () => {
  const valid = {
    clientSessionId: "ef6d6f9e-1bde-4f29-a731-2ae3dcf5e360",
    exercise: "SQUAT",
    targetSets: 3,
    targetReps: 10,
    completedReps: 8,
    goodReps: 7,
    issues: [],
    durationSeconds: 30,
    startedAt: "2026-01-01T10:00:00.000Z",
    endedAt: "2026-01-01T10:00:30.000Z",
  };
  assert.equal(sessionSchema.safeParse(valid).success, true);
  for (const invalid of [
    { ...valid, customerId: "someone-else" },
    { ...valid, goodReps: 9 },
    { ...valid, completedReps: 31 },
    { ...valid, targetReps: 1.5 },
    { ...valid, endedAt: valid.startedAt },
  ]) {
    assert.equal(sessionSchema.safeParse(invalid).success, false);
  }
});
