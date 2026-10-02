export const poseAssets = {
  wasm: "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm",
  model:
    "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
};

export async function createPoseLandmarker() {
  const { FilesetResolver, PoseLandmarker } = await import(
    "@mediapipe/tasks-vision"
  );
  const files = await FilesetResolver.forVisionTasks(poseAssets.wasm);
  return PoseLandmarker.createFromOptions(files, {
    baseOptions: { modelAssetPath: poseAssets.model, delegate: "CPU" },
    runningMode: "VIDEO",
    numPoses: 1,
    minPoseDetectionConfidence: 0.7,
    minPosePresenceConfidence: 0.7,
    minTrackingConfidence: 0.7,
  });
}
