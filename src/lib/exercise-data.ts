export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type Exercise = {
  name: string;
  slug: string;
  muscleSlug: string;
  muscleGroup: string;
  targetMuscles: string[];
  secondaryMuscles: string[];
  equipment: string[];
  difficulty: Difficulty;
  goalTags: string[];
  description: string;
  steps: string[];
  postureChecklist: string[];
  breathing: string;
  commonMistakes: string[];
  safetyNotes: string[];
  setsReps: {
    beginner: string;
    intermediate: string;
    advanced: string;
  };
  alternatives: string[];
  youtubeId: string;
  imageSlot: string;
  mainBenefit: string;
};

export type MuscleGroup = {
  name: string;
  slug: string;
  focus: string;
  imageSlot: string;
  targetMuscles: string[];
  exampleExercises: string[];
  difficulty: Difficulty;
  equipmentNeeded: string[];
};

const exerciseImageMap: Record<string, string> = {
  CHEST: "https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=1400&q=85",
  BACK: "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?auto=format&fit=crop&w=1400&q=85",
  SHOULDERS: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&w=1400&q=85",
  ARMS: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1400&q=85",
  LEGS: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=1400&q=85",
  CORE: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=85",
  FULL_BODY: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1400&q=85",
};

const exercisePhotoPools: Record<string, string[]> = {
  CHEST: [
    "https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1584466977773-e625c37cdd50?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=85",
  ],
  BACK: [
    "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1596357395217-80de13130e92?auto=format&fit=crop&w=900&q=85",
  ],
  SHOULDERS: [
    "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1577221084712-45b0445d2b00?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1584863231364-2edc166de576?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1571019613576-2b22c76fd955?auto=format&fit=crop&w=900&q=85",
  ],
  ARMS: [
    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1596357395217-80de13130e92?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=900&q=85",
  ],
  LEGS: [
    "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1517964603305-11c0f6f66012?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1571019613576-2b22c76fd955?auto=format&fit=crop&w=900&q=85",
  ],
  CORE: [
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1571019613576-2b22c76fd955?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1506629905607-d9c297d0805d?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?auto=format&fit=crop&w=900&q=85",
  ],
  FULL_BODY: [
    "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?auto=format&fit=crop&w=900&q=85",
  ],
};

export function exerciseImageForSlot(slot: string) {
  return exerciseImageMap[slot] || exerciseImageMap.FULL_BODY;
}

export function exerciseImageForExercise(exercise: Pick<Exercise, "slug" | "imageSlot">) {
  const pool = exercisePhotoPools[exercise.imageSlot] || exercisePhotoPools.FULL_BODY;
  const groupIndex = exercises.filter((item) => item.imageSlot === exercise.imageSlot).findIndex((item) => item.slug === exercise.slug);
  return pool[Math.max(0, groupIndex) % pool.length];
}

const groups: Array<
  MuscleGroup & {
    secondaryMuscles: string[];
    exercises: Array<{
      name: string;
      equipment: string[];
      difficulty?: Difficulty;
      benefit: string;
      alternatives: string[];
    }>;
  }
> = [
  {
    name: "Chest",
    slug: "chest",
    focus: "Pressing strength, upper-body size, and shoulder-safe pushing mechanics.",
    imageSlot: "CHEST",
    targetMuscles: ["Pectoralis major", "Upper chest", "Lower chest"],
    secondaryMuscles: ["Front delts", "Triceps", "Serratus anterior"],
    exampleExercises: ["Bench Press", "Incline Dumbbell Press", "Cable Crossover"],
    difficulty: "Beginner",
    equipmentNeeded: ["Bench", "Dumbbells", "Barbell", "Cable machine", "Chest press machine"],
    exercises: [
      { name: "Bench Press", equipment: ["Barbell", "Bench"], difficulty: "Intermediate", benefit: "Builds horizontal pressing strength.", alternatives: ["Machine Chest Press", "Push Up"] },
      { name: "Incline Dumbbell Press", equipment: ["Dumbbells", "Incline bench"], benefit: "Targets upper chest with independent arm control.", alternatives: ["Incline Machine Press", "Incline Push Up"] },
      { name: "Pec Deck Fly", equipment: ["Pec deck machine"], benefit: "Teaches chest contraction without complex setup.", alternatives: ["Cable Fly", "Dumbbell Fly"] },
      { name: "Cable Crossover", equipment: ["Cable machine"], difficulty: "Intermediate", benefit: "Keeps tension on the chest through the full arc.", alternatives: ["Resistance Band Fly", "Pec Deck Fly"] },
      { name: "Push Up", equipment: ["Bodyweight"], difficulty: "Beginner", benefit: "Builds practical chest strength anywhere.", alternatives: ["Incline Push Up", "Knee Push Up"] },
      { name: "Machine Chest Press", equipment: ["Chest press machine"], difficulty: "Beginner", benefit: "Best first step for beginners learning chest pressing.", alternatives: ["Bench Press", "Dumbbell Press"] },
      { name: "Decline Bench Press", equipment: ["Barbell", "Decline bench"], difficulty: "Advanced", benefit: "Emphasizes lower chest and strong pressing stability.", alternatives: ["Dip", "Decline Push Up"] },
      { name: "Dumbbell Pullover", equipment: ["Dumbbell", "Bench"], difficulty: "Intermediate", benefit: "Trains chest expansion and shoulder control.", alternatives: ["Cable Pullover", "Straight Arm Pulldown"] },
    ],
  },
  {
    name: "Back",
    slug: "back",
    focus: "Rows, pulls, posture, and lat development.",
    imageSlot: "BACK",
    targetMuscles: ["Lats", "Rhomboids", "Traps", "Erectors"],
    secondaryMuscles: ["Biceps", "Rear delts", "Core"],
    exampleExercises: ["Lat Pulldown", "Seated Cable Row", "Deadlift"],
    difficulty: "Beginner",
    equipmentNeeded: ["Cable machine", "Pull-up bar", "Barbell", "Dumbbells", "Row machine"],
    exercises: [
      { name: "Lat Pulldown", equipment: ["Cable machine"], difficulty: "Beginner", benefit: "Teaches vertical pulling before pull-ups.", alternatives: ["Assisted Pull Up", "Band Pulldown"] },
      { name: "Seated Cable Row", equipment: ["Cable row"], difficulty: "Beginner", benefit: "Builds mid-back strength and posture.", alternatives: ["Machine Row", "One Arm Dumbbell Row"] },
      { name: "Pull Up", equipment: ["Pull-up bar"], difficulty: "Advanced", benefit: "Develops strong lats and body control.", alternatives: ["Assisted Pull Up", "Lat Pulldown"] },
      { name: "Bent Over Row", equipment: ["Barbell"], difficulty: "Intermediate", benefit: "Builds dense back strength with hip stability.", alternatives: ["Chest Supported Row", "Cable Row"] },
      { name: "One Arm Dumbbell Row", equipment: ["Dumbbell", "Bench"], benefit: "Lets each side of the back work independently.", alternatives: ["Cable Row", "Machine Row"] },
      { name: "Deadlift", equipment: ["Barbell"], difficulty: "Advanced", benefit: "Trains posterior chain strength from floor to lockout.", alternatives: ["Romanian Deadlift", "Trap Bar Deadlift"] },
      { name: "Straight Arm Pulldown", equipment: ["Cable machine"], benefit: "Isolates lats without elbow bending.", alternatives: ["Band Pulldown", "Dumbbell Pullover"] },
      { name: "Chest Supported Row", equipment: ["Incline bench", "Dumbbells"], difficulty: "Beginner", benefit: "Reduces lower-back stress while rowing.", alternatives: ["Machine Row", "Seated Cable Row"] },
    ],
  },
  {
    name: "Shoulders",
    slug: "shoulders",
    focus: "Overhead strength, side delts, rear delts, and shoulder control.",
    imageSlot: "SHOULDERS",
    targetMuscles: ["Front delts", "Side delts", "Rear delts"],
    secondaryMuscles: ["Triceps", "Traps", "Rotator cuff"],
    exampleExercises: ["Shoulder Press", "Lateral Raise", "Face Pull"],
    difficulty: "Beginner",
    equipmentNeeded: ["Dumbbells", "Cable machine", "Shoulder press machine", "Bands"],
    exercises: [
      { name: "Dumbbell Shoulder Press", equipment: ["Dumbbells"], benefit: "Builds overhead pressing strength with natural arm path.", alternatives: ["Machine Shoulder Press", "Landmine Press"] },
      { name: "Machine Shoulder Press", equipment: ["Shoulder press machine"], difficulty: "Beginner", benefit: "Simple and stable overhead pressing for new lifters.", alternatives: ["Dumbbell Shoulder Press", "Arnold Press"] },
      { name: "Lateral Raise", equipment: ["Dumbbells"], difficulty: "Beginner", benefit: "Builds side delts for shoulder width.", alternatives: ["Cable Lateral Raise", "Machine Lateral Raise"] },
      { name: "Cable Lateral Raise", equipment: ["Cable machine"], benefit: "Keeps tension on side delts from the bottom.", alternatives: ["Dumbbell Lateral Raise", "Machine Lateral Raise"] },
      { name: "Rear Delt Fly", equipment: ["Dumbbells"], benefit: "Balances pressing by training rear delts.", alternatives: ["Reverse Pec Deck", "Face Pull"] },
      { name: "Face Pull", equipment: ["Cable machine", "Rope"], difficulty: "Beginner", benefit: "Supports posture and shoulder health.", alternatives: ["Band Face Pull", "Rear Delt Fly"] },
      { name: "Arnold Press", equipment: ["Dumbbells"], difficulty: "Intermediate", benefit: "Combines rotation and pressing for delt development.", alternatives: ["Dumbbell Shoulder Press", "Machine Press"] },
      { name: "Front Raise", equipment: ["Dumbbells"], difficulty: "Beginner", benefit: "Targets front delts with light controlled movement.", alternatives: ["Cable Front Raise", "Plate Raise"] },
    ],
  },
  {
    name: "Biceps",
    slug: "biceps",
    focus: "Elbow flexion, arm size, and controlled pulling assistance.",
    imageSlot: "ARMS",
    targetMuscles: ["Biceps brachii", "Brachialis"],
    secondaryMuscles: ["Forearms", "Front delts"],
    exampleExercises: ["Dumbbell Curl", "Preacher Curl", "Hammer Curl"],
    difficulty: "Beginner",
    equipmentNeeded: ["Dumbbells", "EZ bar", "Cable machine", "Preacher bench"],
    exercises: [
      { name: "Dumbbell Curl", equipment: ["Dumbbells"], difficulty: "Beginner", benefit: "Basic biceps builder with easy setup.", alternatives: ["Cable Curl", "EZ Bar Curl"] },
      { name: "EZ Bar Curl", equipment: ["EZ bar"], benefit: "Allows heavier curls with wrist-friendly grip.", alternatives: ["Dumbbell Curl", "Cable Curl"] },
      { name: "Hammer Curl", equipment: ["Dumbbells"], difficulty: "Beginner", benefit: "Builds brachialis and forearm thickness.", alternatives: ["Rope Hammer Curl", "Cross Body Curl"] },
      { name: "Preacher Curl", equipment: ["Preacher bench", "EZ bar"], benefit: "Locks the upper arm for stricter curls.", alternatives: ["Machine Preacher Curl", "Spider Curl"] },
      { name: "Cable Curl", equipment: ["Cable machine"], difficulty: "Beginner", benefit: "Keeps constant tension through the curl.", alternatives: ["Dumbbell Curl", "Band Curl"] },
      { name: "Incline Dumbbell Curl", equipment: ["Dumbbells", "Incline bench"], difficulty: "Intermediate", benefit: "Trains biceps from a stretched position.", alternatives: ["Spider Curl", "Cable Curl"] },
      { name: "Concentration Curl", equipment: ["Dumbbell"], difficulty: "Beginner", benefit: "Improves mind-muscle connection and strict form.", alternatives: ["Preacher Curl", "Cable Curl"] },
      { name: "Spider Curl", equipment: ["Incline bench", "Dumbbells"], difficulty: "Intermediate", benefit: "Keeps shoulders out of the curl.", alternatives: ["Preacher Curl", "Concentration Curl"] },
    ],
  },
  {
    name: "Triceps",
    slug: "triceps",
    focus: "Elbow extension, pressing support, and upper-arm size.",
    imageSlot: "ARMS",
    targetMuscles: ["Long head", "Lateral head", "Medial head"],
    secondaryMuscles: ["Chest", "Shoulders", "Forearms"],
    exampleExercises: ["Rope Pushdown", "Overhead Extension", "Close Grip Bench"],
    difficulty: "Beginner",
    equipmentNeeded: ["Cable machine", "Dumbbells", "Barbell", "Bench"],
    exercises: [
      { name: "Rope Pushdown", equipment: ["Cable machine", "Rope"], difficulty: "Beginner", benefit: "Easy triceps isolation with joint-friendly control.", alternatives: ["Straight Bar Pushdown", "Band Pushdown"] },
      { name: "Overhead Dumbbell Extension", equipment: ["Dumbbell"], benefit: "Targets the long head through a deep stretch.", alternatives: ["Cable Overhead Extension", "Skull Crusher"] },
      { name: "Close Grip Bench Press", equipment: ["Barbell", "Bench"], difficulty: "Intermediate", benefit: "Builds triceps strength with pressing carryover.", alternatives: ["Machine Dip", "Push Up Close Grip"] },
      { name: "Skull Crusher", equipment: ["EZ bar", "Bench"], difficulty: "Intermediate", benefit: "Trains elbow extension with a strong stretch.", alternatives: ["Cable Extension", "Dumbbell Extension"] },
      { name: "Cable Overhead Extension", equipment: ["Cable machine", "Rope"], benefit: "Keeps long-head tension without heavy joint stress.", alternatives: ["Overhead Dumbbell Extension", "Band Extension"] },
      { name: "Bench Dip", equipment: ["Bench"], difficulty: "Beginner", benefit: "Bodyweight triceps practice with simple setup.", alternatives: ["Machine Dip", "Close Grip Push Up"] },
      { name: "Machine Dip", equipment: ["Dip machine"], difficulty: "Beginner", benefit: "Stable dip pattern for triceps without bodyweight load.", alternatives: ["Bench Dip", "Close Grip Bench"] },
      { name: "Single Arm Cable Pushdown", equipment: ["Cable machine"], benefit: "Fixes side-to-side triceps control.", alternatives: ["Rope Pushdown", "Band Pushdown"] },
    ],
  },
  {
    name: "Legs",
    slug: "legs",
    focus: "Quads, hamstrings, glutes, calves, and lower-body strength.",
    imageSlot: "LEGS",
    targetMuscles: ["Quads", "Hamstrings", "Glutes", "Calves"],
    secondaryMuscles: ["Core", "Adductors", "Lower back"],
    exampleExercises: ["Squat", "Leg Press", "Romanian Deadlift"],
    difficulty: "Beginner",
    equipmentNeeded: ["Barbell", "Leg press", "Dumbbells", "Machines"],
    exercises: [
      { name: "Squat", equipment: ["Barbell", "Rack"], difficulty: "Intermediate", benefit: "Builds full lower-body strength.", alternatives: ["Goblet Squat", "Leg Press"] },
      { name: "Leg Press", equipment: ["Leg press machine"], difficulty: "Beginner", benefit: "Trains legs with stable support.", alternatives: ["Goblet Squat", "Hack Squat"] },
      { name: "Romanian Deadlift", equipment: ["Barbell"], benefit: "Builds hamstrings, glutes, and hip hinge control.", alternatives: ["Dumbbell RDL", "Hip Hinge Drill"] },
      { name: "Leg Extension", equipment: ["Leg extension machine"], difficulty: "Beginner", benefit: "Isolates quads with simple movement.", alternatives: ["Bodyweight Squat", "Split Squat"] },
      { name: "Lying Leg Curl", equipment: ["Leg curl machine"], difficulty: "Beginner", benefit: "Isolates hamstrings safely.", alternatives: ["Seated Leg Curl", "Stability Ball Curl"] },
      { name: "Walking Lunge", equipment: ["Bodyweight", "Dumbbells"], benefit: "Builds single-leg control and conditioning.", alternatives: ["Reverse Lunge", "Split Squat"] },
      { name: "Hip Thrust", equipment: ["Barbell", "Bench"], benefit: "Strong glute builder with less knee stress.", alternatives: ["Glute Bridge", "Cable Pull Through"] },
      { name: "Standing Calf Raise", equipment: ["Calf raise machine"], difficulty: "Beginner", benefit: "Builds calf strength and ankle control.", alternatives: ["Seated Calf Raise", "Single Leg Calf Raise"] },
    ],
  },
  {
    name: "Abs/Core",
    slug: "core",
    focus: "Bracing, anti-rotation, posture, and trunk endurance.",
    imageSlot: "CORE",
    targetMuscles: ["Rectus abdominis", "Obliques", "Transverse abdominis"],
    secondaryMuscles: ["Hip flexors", "Lower back", "Glutes"],
    exampleExercises: ["Plank", "Cable Crunch", "Pallof Press"],
    difficulty: "Beginner",
    equipmentNeeded: ["Bodyweight", "Cable machine", "Mat", "Medicine ball"],
    exercises: [
      { name: "Plank", equipment: ["Bodyweight", "Mat"], difficulty: "Beginner", benefit: "Teaches bracing and trunk endurance.", alternatives: ["Knee Plank", "Dead Bug"] },
      { name: "Cable Crunch", equipment: ["Cable machine", "Rope"], benefit: "Loads spinal flexion with control.", alternatives: ["Machine Crunch", "Reverse Crunch"] },
      { name: "Hanging Knee Raise", equipment: ["Pull-up bar"], difficulty: "Intermediate", benefit: "Builds lower abs and hip control.", alternatives: ["Captain Chair Raise", "Reverse Crunch"] },
      { name: "Dead Bug", equipment: ["Bodyweight", "Mat"], difficulty: "Beginner", benefit: "Teaches core control without spine strain.", alternatives: ["Bird Dog", "Knee Plank"] },
      { name: "Pallof Press", equipment: ["Cable machine"], difficulty: "Beginner", benefit: "Builds anti-rotation strength.", alternatives: ["Band Pallof Press", "Side Plank"] },
      { name: "Russian Twist", equipment: ["Medicine ball"], benefit: "Trains rotation control when done slowly.", alternatives: ["Cable Wood Chop", "Side Plank"] },
      { name: "Ab Wheel Rollout", equipment: ["Ab wheel"], difficulty: "Advanced", benefit: "Develops advanced anti-extension strength.", alternatives: ["Stability Ball Rollout", "Plank"] },
      { name: "Side Plank", equipment: ["Bodyweight", "Mat"], difficulty: "Beginner", benefit: "Strengthens obliques and lateral stability.", alternatives: ["Pallof Press", "Suitcase Carry"] },
    ],
  },
  {
    name: "Full Body",
    slug: "full-body",
    focus: "Compound patterns, conditioning, and efficient beginner sessions.",
    imageSlot: "FULL_BODY",
    targetMuscles: ["Quads", "Glutes", "Back", "Chest", "Core"],
    secondaryMuscles: ["Shoulders", "Arms", "Calves"],
    exampleExercises: ["Kettlebell Swing", "Farmer Carry", "Burpee"],
    difficulty: "Beginner",
    equipmentNeeded: ["Dumbbells", "Kettlebell", "Cable machine", "Bodyweight"],
    exercises: [
      { name: "Farmer Carry", equipment: ["Dumbbells"], difficulty: "Beginner", benefit: "Builds grip, posture, and full-body tension.", alternatives: ["Suitcase Carry", "Trap Bar Carry"] },
      { name: "Kettlebell Swing", equipment: ["Kettlebell"], difficulty: "Intermediate", benefit: "Trains hip power and conditioning.", alternatives: ["Hip Hinge Drill", "Dumbbell Swing"] },
      { name: "Burpee", equipment: ["Bodyweight"], difficulty: "Intermediate", benefit: "Full-body conditioning with no equipment.", alternatives: ["Step Back Burpee", "Squat Thrust"] },
      { name: "Dumbbell Thruster", equipment: ["Dumbbells"], difficulty: "Intermediate", benefit: "Combines squat and press for conditioning.", alternatives: ["Goblet Squat to Press", "Machine Circuit"] },
      { name: "Sled Push", equipment: ["Sled"], benefit: "Low-skill conditioning with leg drive.", alternatives: ["Incline Walk", "Farmer Carry"] },
      { name: "Battle Rope Waves", equipment: ["Battle ropes"], benefit: "Upper-body conditioning with core bracing.", alternatives: ["Row Erg", "Medicine Ball Slam"] },
      { name: "Medicine Ball Slam", equipment: ["Medicine ball"], benefit: "Power and conditioning with simple coordination.", alternatives: ["Battle Rope Waves", "Kettlebell Swing"] },
      { name: "Cable Wood Chop", equipment: ["Cable machine"], benefit: "Rotational core training with full-body coordination.", alternatives: ["Pallof Press", "Medicine Ball Throw"] },
    ],
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildExercise(
  group: (typeof groups)[number],
  item: (typeof groups)[number]["exercises"][number],
  index: number,
): Exercise {
  const difficulty = item.difficulty || (index % 3 === 0 ? "Beginner" : index % 3 === 1 ? "Intermediate" : "Beginner");

  return {
    name: item.name,
    slug: slugify(item.name),
    muscleSlug: group.slug,
    muscleGroup: group.name,
    targetMuscles: group.targetMuscles,
    secondaryMuscles: group.secondaryMuscles,
    equipment: item.equipment,
    difficulty,
    goalTags: [
      "muscle gain",
      index % 2 === 0 ? "beginner" : "strength",
      group.slug === "core" ? "posture" : "fat loss support",
    ],
    description: `${item.name} is a ${group.name.toLowerCase()} exercise used for ${item.benefit.toLowerCase()}`,
    steps: [
      `Set up the ${item.equipment[0].toLowerCase()} so your body feels stable before the first rep.`,
      `Brace your core and move through the target ${group.name.toLowerCase()} range without rushing.`,
      "Pause briefly where tension is highest, then return under control.",
      "Stop the set when form changes, not when the ego wants one more rep.",
    ],
    postureChecklist: [
      "Neck neutral and eyes steady.",
      "Ribs down, core lightly braced.",
      "Shoulders controlled, not shrugged into the ears.",
      "Reps look the same from first to last.",
    ],
    breathing: "Inhale during the easier/lowering phase. Exhale during the effort phase without losing posture.",
    commonMistakes: [
      "Using momentum instead of controlled reps.",
      "Choosing load before learning the movement path.",
      "Letting joints drift into painful positions.",
    ],
    safetyNotes: [
      "Warm up with lighter sets before working weight.",
      "Pain is a stop signal. Ask a trainer if the movement feels sharp or unstable.",
      "Medical conditions, injury, or dizziness need professional guidance.",
    ],
    setsReps: {
      beginner: "2-3 sets of 10-12 controlled reps",
      intermediate: "3-4 sets of 8-12 reps",
      advanced: "4-5 sets with planned load progression",
    },
    alternatives: item.alternatives,
    youtubeId: "",
    imageSlot: group.imageSlot,
    mainBenefit: item.benefit,
  };
}

export const muscleGroups: MuscleGroup[] = groups.map((group) => ({
  name: group.name,
  slug: group.slug,
  focus: group.focus,
  imageSlot: group.imageSlot,
  targetMuscles: group.targetMuscles,
  exampleExercises: group.exampleExercises,
  difficulty: group.difficulty,
  equipmentNeeded: group.equipmentNeeded,
}));

export const exercises: Exercise[] = groups.flatMap((group) =>
  group.exercises.map((item, index) => buildExercise(group, item, index)),
);

export function getMuscleGroup(slug: string) {
  return muscleGroups.find((group) => group.slug === slug);
}

export function getExercisesByMuscle(slug: string) {
  return exercises.filter((exercise) => exercise.muscleSlug === slug);
}

export function getExerciseBySlug(slug: string) {
  return exercises.find((exercise) => exercise.slug === slug);
}

export function getRelatedExercises(exercise: Exercise, limit = 4) {
  return exercises
    .filter(
      (item) =>
        item.slug !== exercise.slug &&
        (item.muscleSlug === exercise.muscleSlug ||
          item.goalTags.some((tag) => exercise.goalTags.includes(tag))),
    )
    .slice(0, limit);
}
