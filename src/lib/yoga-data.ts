export type YogaDifficulty = "Beginner" | "Intermediate" | "Advanced";

export type YogaCategory = {
  name: string;
  slug: string;
  focus: string;
  imageSlot: string;
  bodyParts: string[];
  safetyNote: string;
};

export type YogaAsana = {
  name: string;
  sanskritName: string;
  slug: string;
  categories: string[];
  bodyParts: string[];
  goalTags: string[];
  difficulty: YogaDifficulty;
  duration: string;
  benefits: string[];
  steps: string[];
  breathing: string;
  contraindications: string[];
  modifications: string[];
  commonMistakes: string[];
  advancedVariation: string;
  youtubeId: string;
  imageSlot: string;
  isActive: boolean;
};

const yogaImageMap: Record<string, string> = {
  YOGA_FLEXIBILITY:
    "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=1400&q=85",
  YOGA_POSTURE:
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=85",
  YOGA_FAT_LOSS:
    "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=1400&q=85",
  YOGA_STRESS:
    "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=1400&q=85",
  YOGA_BACK:
    "https://images.unsplash.com/photo-1599447292461-8d77b9a927bc?auto=format&fit=crop&w=1400&q=85",
  YOGA_THYROID:
    "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?auto=format&fit=crop&w=1400&q=85",
  YOGA_HYPERTENSION:
    "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?auto=format&fit=crop&w=1400&q=85",
  YOGA_BEGINNER:
    "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=1400&q=85",
};

export function yogaImageForSlot(slot: string) {
  return yogaImageMap[slot] || yogaImageMap.YOGA_BEGINNER;
}

export const yogaCategories: YogaCategory[] = [
  {
    name: "Flexibility",
    slug: "flexibility",
    focus: "Gentle range-of-motion work for hamstrings, hips, shoulders, and spine.",
    imageSlot: "YOGA_FLEXIBILITY",
    bodyParts: ["Hips", "Hamstrings", "Shoulders", "Spine"],
    safetyNote: "Stretch slowly. Sharp pain means stop and modify.",
  },
  {
    name: "Posture Correction",
    slug: "posture",
    focus: "Mobility and awareness drills for desk posture, rounded shoulders, and spinal control.",
    imageSlot: "YOGA_POSTURE",
    bodyParts: ["Upper back", "Chest", "Neck", "Core"],
    safetyNote: "This supports posture awareness; it does not replace medical care for pain.",
  },
  {
    name: "Fat Loss Support",
    slug: "fat-loss-support",
    focus: "Active flows that support movement consistency, breathing, and calorie expenditure.",
    imageSlot: "YOGA_FAT_LOSS",
    bodyParts: ["Full body", "Core", "Legs"],
    safetyNote: "Yoga may support activity habits, but fat loss still depends on overall nutrition and activity.",
  },
  {
    name: "Stress Relief",
    slug: "stress-relief",
    focus: "Slow breathing, gentle holds, and calming poses for general relaxation.",
    imageSlot: "YOGA_STRESS",
    bodyParts: ["Nervous system", "Hips", "Back"],
    safetyNote: "If anxiety, panic, or depression is severe, speak with a qualified professional.",
  },
  {
    name: "Back Support",
    slug: "back-support",
    focus: "Gentle spinal mobility and core awareness for general back comfort.",
    imageSlot: "YOGA_BACK",
    bodyParts: ["Lower back", "Glutes", "Core", "Hips"],
    safetyNote: "Avoid deep bends during acute pain, nerve symptoms, or injury unless cleared by a professional.",
  },
  {
    name: "Thyroid General Wellness",
    slug: "thyroid-wellness",
    focus: "Calm breathing and gentle movement that may support general wellness routines.",
    imageSlot: "YOGA_THYROID",
    bodyParts: ["Neck", "Shoulders", "Spine"],
    safetyNote: "Yoga does not cure thyroid conditions. Follow your doctor for diagnosis and medication.",
  },
  {
    name: "Hypertension Gentle Yoga",
    slug: "hypertension-gentle",
    focus: "Slow, non-straining poses and breathing for general relaxation support.",
    imageSlot: "YOGA_HYPERTENSION",
    bodyParts: ["Full body", "Breath", "Spine"],
    safetyNote: "Avoid breath-holding and intense inversions. Consult your doctor for blood pressure guidance.",
  },
  {
    name: "Beginner Yoga",
    slug: "beginner",
    focus: "Simple poses that teach alignment, breathing, and confidence.",
    imageSlot: "YOGA_BEGINNER",
    bodyParts: ["Full body", "Hips", "Shoulders"],
    safetyNote: "Use props, reduce range, and learn slowly before deeper versions.",
  },
];

export const yogaAsanas: YogaAsana[] = [
  {
    name: "Mountain Pose",
    sanskritName: "Tadasana",
    slug: "mountain-pose",
    categories: ["beginner", "posture"],
    bodyParts: ["Feet", "Core", "Spine", "Shoulders"],
    goalTags: ["posture", "beginner", "balance"],
    difficulty: "Beginner",
    duration: "30-60 seconds",
    benefits: [
      "Builds standing posture awareness.",
      "Teaches even weight through both feet.",
      "Helps prepare for other standing poses.",
    ],
    steps: [
      "Stand with feet hip-width apart or gently together.",
      "Spread weight across heels, big toes, and little toes.",
      "Lengthen through the spine without locking the knees.",
      "Relax shoulders down and keep the chin level.",
    ],
    breathing: "Breathe slowly through the nose and keep the ribs relaxed.",
    contraindications: ["Use wall support if balance feels unstable."],
    modifications: ["Stand near a wall or keep feet wider for balance."],
    commonMistakes: ["Locking the knees.", "Lifting the ribs too high.", "Clenching the toes."],
    advancedVariation: "Practice eyes-closed balance only when safe and stable.",
    youtubeId: "",
    imageSlot: "YOGA_POSTURE",
    isActive: true,
  },
  {
    name: "Cat Cow",
    sanskritName: "Marjaryasana Bitilasana",
    slug: "cat-cow",
    categories: ["beginner", "back-support", "stress-relief"],
    bodyParts: ["Spine", "Neck", "Shoulders"],
    goalTags: ["back support", "mobility", "beginner"],
    difficulty: "Beginner",
    duration: "6-10 slow rounds",
    benefits: [
      "Encourages gentle spinal movement.",
      "Can help warm up the back before training.",
      "Pairs movement with breathing.",
    ],
    steps: [
      "Start on hands and knees with wrists under shoulders.",
      "Inhale and gently arch the spine, looking slightly forward.",
      "Exhale and round the spine, letting the head relax.",
      "Move slowly without forcing the lower back or neck.",
    ],
    breathing: "Inhale into cow. Exhale into cat.",
    contraindications: ["Pad wrists if sensitive.", "Avoid large range during acute back pain."],
    modifications: ["Do it seated with hands on thighs if wrists hurt."],
    commonMistakes: ["Moving too fast.", "Dumping pressure into wrists.", "Forcing the neck."],
    advancedVariation: "Add small circles through the hips and shoulders.",
    youtubeId: "",
    imageSlot: "YOGA_BACK",
    isActive: true,
  },
  {
    name: "Downward Facing Dog",
    sanskritName: "Adho Mukha Svanasana",
    slug: "downward-facing-dog",
    categories: ["flexibility", "posture", "fat-loss-support"],
    bodyParts: ["Hamstrings", "Calves", "Shoulders", "Back"],
    goalTags: ["flexibility", "upper body", "mobility"],
    difficulty: "Beginner",
    duration: "20-45 seconds",
    benefits: [
      "Stretches the posterior chain.",
      "Builds shoulder and core endurance.",
      "Useful transition in active yoga flows.",
    ],
    steps: [
      "Start on hands and knees.",
      "Tuck toes and lift hips up and back.",
      "Bend knees slightly if hamstrings are tight.",
      "Press hands evenly and lengthen the spine.",
    ],
    breathing: "Take steady breaths and soften the jaw.",
    contraindications: ["Modify with hands on a bench for wrist pain or high blood pressure concerns."],
    modifications: ["Bend knees or place hands on blocks/bench."],
    commonMistakes: ["Rounding the spine to straighten legs.", "Shrugging shoulders.", "Holding breath."],
    advancedVariation: "Add slow alternating heel pedals or three-legged dog.",
    youtubeId: "",
    imageSlot: "YOGA_FLEXIBILITY",
    isActive: true,
  },
  {
    name: "Child Pose",
    sanskritName: "Balasana",
    slug: "child-pose",
    categories: ["stress-relief", "beginner", "back-support"],
    bodyParts: ["Back", "Hips", "Shoulders"],
    goalTags: ["relaxation", "recovery", "beginner"],
    difficulty: "Beginner",
    duration: "45-120 seconds",
    benefits: [
      "Provides a quiet resting position.",
      "May gently relax the back and hips.",
      "Supports slower breathing practice.",
    ],
    steps: [
      "Kneel on the mat and sit hips toward heels.",
      "Fold forward and rest arms forward or beside the body.",
      "Let the forehead rest on mat, block, or folded towel.",
      "Come out slowly if knees or hips feel compressed.",
    ],
    breathing: "Breathe into the back ribs with a slow exhale.",
    contraindications: ["Use props for knee pain.", "Avoid deep compression during pregnancy unless guided."],
    modifications: ["Place a pillow under chest or between hips and heels."],
    commonMistakes: ["Forcing hips to heels.", "Ignoring knee discomfort.", "Holding breath."],
    advancedVariation: "Walk hands to each side for a side-body stretch.",
    youtubeId: "",
    imageSlot: "YOGA_STRESS",
    isActive: true,
  },
  {
    name: "Cobra Pose",
    sanskritName: "Bhujangasana",
    slug: "cobra-pose",
    categories: ["posture", "back-support", "thyroid-wellness"],
    bodyParts: ["Chest", "Spine", "Shoulders"],
    goalTags: ["posture", "chest opening", "spinal mobility"],
    difficulty: "Beginner",
    duration: "10-25 seconds",
    benefits: [
      "Opens chest and front shoulders.",
      "Builds gentle back extension awareness.",
      "Can balance long sitting when performed softly.",
    ],
    steps: [
      "Lie on the stomach with hands near lower ribs.",
      "Press tops of feet down and keep elbows close.",
      "Lift chest slightly using back effort more than hands.",
      "Keep neck long and lower slowly.",
    ],
    breathing: "Inhale to lift gently, exhale to lower or soften.",
    contraindications: ["Avoid during acute back pain, pregnancy, or abdominal surgery recovery unless cleared."],
    modifications: ["Use baby cobra with very small lift."],
    commonMistakes: ["Pushing too high with hands.", "Pinching the lower back.", "Throwing head backward."],
    advancedVariation: "Progress to upward-facing dog only with strong shoulder control.",
    youtubeId: "",
    imageSlot: "YOGA_POSTURE",
    isActive: true,
  },
  {
    name: "Bridge Pose",
    sanskritName: "Setu Bandhasana",
    slug: "bridge-pose",
    categories: ["back-support", "posture", "thyroid-wellness"],
    bodyParts: ["Glutes", "Hamstrings", "Spine", "Chest"],
    goalTags: ["glutes", "posture", "beginner"],
    difficulty: "Beginner",
    duration: "20-40 seconds",
    benefits: [
      "Strengthens glutes and posterior chain.",
      "Opens the front body gently.",
      "Can support posture awareness.",
    ],
    steps: [
      "Lie on back with knees bent and feet hip-width.",
      "Press feet down and lift hips slowly.",
      "Keep knees tracking forward and ribs controlled.",
      "Lower one vertebra at a time if comfortable.",
    ],
    breathing: "Breathe steadily without clenching the jaw.",
    contraindications: ["Avoid if neck pain increases.", "Use caution with uncontrolled blood pressure."],
    modifications: ["Place a block under the sacrum for supported bridge."],
    commonMistakes: ["Overarching lower back.", "Letting knees collapse inward.", "Turning head while lifted."],
    advancedVariation: "Try single-leg bridge only after stable basic bridge.",
    youtubeId: "",
    imageSlot: "YOGA_BACK",
    isActive: true,
  },
  {
    name: "Warrior Two",
    sanskritName: "Virabhadrasana II",
    slug: "warrior-two",
    categories: ["fat-loss-support", "beginner", "flexibility"],
    bodyParts: ["Legs", "Hips", "Shoulders", "Core"],
    goalTags: ["strength endurance", "hips", "balance"],
    difficulty: "Beginner",
    duration: "20-45 seconds each side",
    benefits: [
      "Builds leg endurance and hip awareness.",
      "Encourages upright posture under effort.",
      "Useful in active flows.",
    ],
    steps: [
      "Step feet wide and turn front toes forward.",
      "Bend front knee toward the second toe.",
      "Reach arms wide and keep torso tall.",
      "Press both feet into the floor.",
    ],
    breathing: "Use slow breaths while holding the leg effort.",
    contraindications: ["Shorten stance if hips, knees, or ankles feel strained."],
    modifications: ["Reduce knee bend or practice near a wall."],
    commonMistakes: ["Front knee collapsing inward.", "Leaning torso forward.", "Shoulders tensing up."],
    advancedVariation: "Move between warrior two and side angle slowly.",
    youtubeId: "",
    imageSlot: "YOGA_FAT_LOSS",
    isActive: true,
  },
  {
    name: "Tree Pose",
    sanskritName: "Vrikshasana",
    slug: "tree-pose",
    categories: ["beginner", "posture", "stress-relief"],
    bodyParts: ["Feet", "Hips", "Core"],
    goalTags: ["balance", "focus", "posture"],
    difficulty: "Beginner",
    duration: "20-45 seconds each side",
    benefits: [
      "Improves balance practice.",
      "Builds hip and foot awareness.",
      "Encourages calm focus.",
    ],
    steps: [
      "Stand tall and shift weight into one foot.",
      "Place the other foot on ankle, calf, or inner thigh.",
      "Avoid pressing directly into the knee.",
      "Bring hands to chest or reach overhead.",
    ],
    breathing: "Slow nasal breathing helps steadiness.",
    contraindications: ["Use wall support if balance is unstable."],
    modifications: ["Keep toes of lifted foot on the floor like a kickstand."],
    commonMistakes: ["Foot pressing into knee.", "Holding breath.", "Gripping the standing foot."],
    advancedVariation: "Add gentle arm movement while holding balance.",
    youtubeId: "",
    imageSlot: "YOGA_POSTURE",
    isActive: true,
  },
  {
    name: "Seated Forward Fold",
    sanskritName: "Paschimottanasana",
    slug: "seated-forward-fold",
    categories: ["flexibility", "stress-relief"],
    bodyParts: ["Hamstrings", "Calves", "Back"],
    goalTags: ["flexibility", "calm", "posterior chain"],
    difficulty: "Beginner",
    duration: "30-90 seconds",
    benefits: [
      "Stretches hamstrings and back body.",
      "Can support calm breathing practice.",
      "Teaches folding from the hips.",
    ],
    steps: [
      "Sit with legs forward and spine tall.",
      "Bend knees if hamstrings feel tight.",
      "Hinge forward from hips, not by forcing the head down.",
      "Rest hands where they naturally reach.",
    ],
    breathing: "Exhale slowly and soften without bouncing.",
    contraindications: ["Avoid deep folding with disc injury, acute sciatica, or strong back pain."],
    modifications: ["Sit on folded blanket and bend knees."],
    commonMistakes: ["Rounding aggressively.", "Bouncing into the stretch.", "Pulling toes too hard."],
    advancedVariation: "Use a strap and gradually lengthen legs while keeping spine long.",
    youtubeId: "",
    imageSlot: "YOGA_FLEXIBILITY",
    isActive: true,
  },
  {
    name: "Legs Up The Wall",
    sanskritName: "Viparita Karani",
    slug: "legs-up-the-wall",
    categories: ["stress-relief", "hypertension-gentle", "beginner"],
    bodyParts: ["Legs", "Back", "Breath"],
    goalTags: ["relaxation", "recovery", "gentle"],
    difficulty: "Beginner",
    duration: "2-6 minutes",
    benefits: [
      "Gentle recovery position after long standing.",
      "Supports relaxation breathing.",
      "Can reduce general leg heaviness for some people.",
    ],
    steps: [
      "Sit sideways near a wall.",
      "Lie back and swing legs up the wall.",
      "Rest arms comfortably and soften the shoulders.",
      "Come out slowly by rolling to one side.",
    ],
    breathing: "Use relaxed, natural breathing with longer exhales.",
    contraindications: [
      "Consult a doctor for glaucoma, serious eye pressure issues, uncontrolled blood pressure, or pregnancy concerns.",
    ],
    modifications: ["Move hips farther from the wall or place a pillow under knees."],
    commonMistakes: ["Forcing hips against the wall.", "Staying despite tingling or numbness.", "Holding breath."],
    advancedVariation: "Add gentle ankle circles or supported butterfly legs.",
    youtubeId: "",
    imageSlot: "YOGA_HYPERTENSION",
    isActive: true,
  },
  {
    name: "Corpse Pose",
    sanskritName: "Savasana",
    slug: "corpse-pose",
    categories: ["stress-relief", "beginner", "hypertension-gentle"],
    bodyParts: ["Full body", "Breath"],
    goalTags: ["relaxation", "recovery", "breathing"],
    difficulty: "Beginner",
    duration: "3-8 minutes",
    benefits: [
      "Creates a quiet recovery finish.",
      "Supports body awareness and relaxed breathing.",
      "Helps transition out of training.",
    ],
    steps: [
      "Lie on the back with legs comfortable.",
      "Let arms rest slightly away from the body.",
      "Relax the face, shoulders, hands, and belly.",
      "Return by moving fingers and rolling to one side.",
    ],
    breathing: "Natural breathing; do not force breath retention.",
    contraindications: ["Use side-lying or seated rest if lying flat is uncomfortable."],
    modifications: ["Place a pillow under knees or head."],
    commonMistakes: ["Trying too hard to relax.", "Holding breath.", "Getting up abruptly."],
    advancedVariation: "Add guided body scan or box breathing without strain.",
    youtubeId: "",
    imageSlot: "YOGA_STRESS",
    isActive: true,
  },
  {
    name: "Triangle Pose",
    sanskritName: "Trikonasana",
    slug: "triangle-pose",
    categories: ["flexibility", "posture"],
    bodyParts: ["Hamstrings", "Hips", "Spine", "Side body"],
    goalTags: ["flexibility", "balance", "posture"],
    difficulty: "Intermediate",
    duration: "20-40 seconds each side",
    benefits: [
      "Stretches side body and hamstrings.",
      "Builds standing alignment awareness.",
      "Encourages hip and spine control.",
    ],
    steps: [
      "Stand wide and turn front foot forward.",
      "Reach forward, then lower hand to shin, block, or thigh.",
      "Open chest gently without twisting the neck.",
      "Press through both feet and breathe.",
    ],
    breathing: "Breathe steadily into the side ribs.",
    contraindications: ["Avoid deep range with dizziness, acute back pain, or unstable balance."],
    modifications: ["Use a block and keep gaze down or forward."],
    commonMistakes: ["Collapsing into the lower hand.", "Locking the front knee.", "Forcing the neck upward."],
    advancedVariation: "Use a longer stance and reach top arm overhead.",
    youtubeId: "",
    imageSlot: "YOGA_FLEXIBILITY",
    isActive: true,
  },
];

export function getYogaCategory(slug: string) {
  return yogaCategories.find((category) => category.slug === slug);
}

export function getAsanasByCategory(slug: string) {
  return yogaAsanas.filter((asana) => asana.categories.includes(slug));
}

export function getAsanaBySlug(slug: string) {
  return yogaAsanas.find((asana) => asana.slug === slug);
}

export function getRelatedAsanas(asana: YogaAsana, limit = 4) {
  return yogaAsanas
    .filter(
      (item) =>
        item.slug !== asana.slug &&
        item.categories.some((category) => asana.categories.includes(category)),
    )
    .slice(0, limit);
}
