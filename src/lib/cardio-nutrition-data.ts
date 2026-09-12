export type CardioWorkout = {
  name: string;
  slug: string;
  type: string;
  intensity: "Low" | "Moderate" | "High";
  duration: string;
  goalTags: string[];
  beginnerPlan: string[];
  intermediatePlan: string[];
  advancedPlan: string[];
  safetyNotes: string[];
  equipment: string;
  youtubeId: string;
  imageSlot: string;
  calorieNote: string;
};

export type NutritionPlan = {
  name: string;
  slug: string;
  goal: string;
  dietType: string;
  caloriesRange: string;
  proteinTarget: string;
  meals: {
    breakfast: string;
    lunch: string;
    snack: string;
    dinner: string;
  };
  notes: string[];
  warnings: string[];
  trainerApproved: boolean;
  isActive: boolean;
};

const imageMap: Record<string, string> = {
  CARDIO_TREADMILL:
    "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1400&q=85",
  CARDIO_CYCLING:
    "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?auto=format&fit=crop&w=1400&q=85",
  CARDIO_ROWING:
    "https://images.unsplash.com/photo-1517964603305-11c0f6f66012?auto=format&fit=crop&w=1400&q=85",
  CARDIO_JUMP_ROPE:
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=85",
  CARDIO_HIIT:
    "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=1400&q=85",
  NUTRITION:
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1400&q=85",
};

export function learningImageForSlot(slot: string) {
  return imageMap[slot] || imageMap.NUTRITION;
}

export const cardioWorkouts: CardioWorkout[] = [
  {
    name: "Incline Treadmill Walk",
    slug: "incline-treadmill-walk",
    type: "Treadmill",
    intensity: "Moderate",
    duration: "25-40 minutes",
    goalTags: ["fat loss support", "beginner", "heart health"],
    beginnerPlan: ["5 min easy warm-up", "15 min incline 4-7%", "5 min easy cooldown"],
    intermediatePlan: ["5 min warm-up", "25 min incline 6-10%", "5 min cooldown"],
    advancedPlan: ["10 min warm-up", "35 min incline intervals", "5 min cooldown"],
    safetyNotes: ["Hold rails only for balance, not bodyweight support.", "Reduce incline if knees or back hurt."],
    equipment: "Treadmill",
    youtubeId: "",
    imageSlot: "CARDIO_TREADMILL",
    calorieNote: "Calories vary by body weight, speed, incline, and fitness level.",
  },
  {
    name: "Stationary Bike Base Ride",
    slug: "stationary-bike-base-ride",
    type: "Cycling",
    intensity: "Low",
    duration: "20-45 minutes",
    goalTags: ["low impact", "beginner", "fat loss support"],
    beginnerPlan: ["5 min easy spin", "15 min comfortable pace", "3 min cooldown"],
    intermediatePlan: ["5 min warm-up", "25 min steady ride", "5 min cooldown"],
    advancedPlan: ["10 rounds: 1 min hard, 2 min easy", "5 min cooldown"],
    safetyNotes: ["Set seat height so knees do not collapse inward.", "Avoid high resistance if knee pain appears."],
    equipment: "Stationary bike",
    youtubeId: "",
    imageSlot: "CARDIO_CYCLING",
    calorieNote: "Use calories as an estimate, not a precise target.",
  },
  {
    name: "Rowing Technique Builder",
    slug: "rowing-technique-builder",
    type: "Rowing",
    intensity: "Moderate",
    duration: "12-25 minutes",
    goalTags: ["full body", "conditioning", "posture"],
    beginnerPlan: ["5 min technique practice", "8 rounds: 30 sec row, 60 sec easy", "Cooldown"],
    intermediatePlan: ["5 min warm-up", "12 min steady row", "4 min cooldown"],
    advancedPlan: ["6 rounds: 250m hard, 90 sec easy", "Cooldown"],
    safetyNotes: ["Push with legs before pulling arms.", "Keep spine long; do not yank with lower back."],
    equipment: "Rowing machine",
    youtubeId: "",
    imageSlot: "CARDIO_ROWING",
    calorieNote: "Rowing estimates change quickly with technique and pace.",
  },
  {
    name: "Jump Rope Starter",
    slug: "jump-rope-starter",
    type: "Jump rope",
    intensity: "High",
    duration: "8-15 minutes",
    goalTags: ["coordination", "conditioning", "athletic"],
    beginnerPlan: ["10 rounds: 20 sec jump, 40 sec rest", "Stop before shin pain"],
    intermediatePlan: ["12 rounds: 30 sec jump, 30 sec rest"],
    advancedPlan: ["10 rounds: 45 sec jump, 15 sec rest"],
    safetyNotes: ["Avoid if ankle, knee, or shin pain is active.", "Use soft landings and low jumps."],
    equipment: "Jump rope",
    youtubeId: "",
    imageSlot: "CARDIO_JUMP_ROPE",
    calorieNote: "High impact does not mean better for everyone.",
  },
  {
    name: "Stair Climber Strength Cardio",
    slug: "stair-climber-strength-cardio",
    type: "Stair climber",
    intensity: "Moderate",
    duration: "12-25 minutes",
    goalTags: ["legs", "glutes", "conditioning"],
    beginnerPlan: ["5 min easy", "8 min steady climb", "3 min cooldown"],
    intermediatePlan: ["5 min warm-up", "15 min moderate climb", "Cooldown"],
    advancedPlan: ["10 rounds: 1 min hard climb, 1 min easy"],
    safetyNotes: ["Stand tall instead of leaning on handles.", "Step down if dizzy or breathless."],
    equipment: "Stair climber",
    youtubeId: "",
    imageSlot: "CARDIO_TREADMILL",
    calorieNote: "Glute/leg fatigue may arrive before cardio fatigue.",
  },
  {
    name: "Beginner HIIT Circuit",
    slug: "beginner-hiit-circuit",
    type: "HIIT",
    intensity: "High",
    duration: "10-18 minutes",
    goalTags: ["fat loss support", "time efficient", "conditioning"],
    beginnerPlan: ["4 rounds: 30 sec work, 60 sec rest", "Use low-impact moves"],
    intermediatePlan: ["6 rounds: 40 sec work, 40 sec rest"],
    advancedPlan: ["8 rounds: 45 sec work, 20 sec rest"],
    safetyNotes: ["HIIT is not for every day.", "Avoid breath-holding and stop for chest pain or dizziness."],
    equipment: "Bodyweight or light equipment",
    youtubeId: "",
    imageSlot: "CARDIO_HIIT",
    calorieNote: "HIIT calorie burn is often overestimated; recovery matters.",
  },
];

export const nutritionPlans: NutritionPlan[] = [
  {
    name: "Muscle Gain Indian Plan",
    slug: "muscle-gain-indian-plan",
    goal: "Muscle gain",
    dietType: "Indian mixed",
    caloriesRange: "Maintenance + 250-400 kcal",
    proteinTarget: "1.6-2.2 g/kg body weight",
    meals: {
      breakfast: "Oats or poha with eggs/paneer/tofu and fruit.",
      lunch: "Rice/roti, dal, chicken/paneer/tofu, vegetables, curd.",
      snack: "Banana, curd, nuts, or protein shake if needed.",
      dinner: "Roti/rice, protein serving, vegetables, and salad.",
    },
    notes: ["Progress lifts slowly.", "Add calories only if weight is not increasing after 2 weeks."],
    warnings: ["Do not force-feed if digestion is poor.", "Kidney disease needs medical diet guidance."],
    trainerApproved: false,
    isActive: true,
  },
  {
    name: "Fat Loss Balanced Plate",
    slug: "fat-loss-balanced-plate",
    goal: "Fat loss",
    dietType: "Flexible",
    caloriesRange: "Small calorie deficit",
    proteinTarget: "1.6-2.0 g/kg target body weight",
    meals: {
      breakfast: "Eggs/tofu/paneer, fruit, oats or sprouts.",
      lunch: "Lean protein, dal/beans, salad, one measured carb serving.",
      snack: "Buttermilk, fruit, roasted chana, or curd.",
      dinner: "Protein and vegetables with lighter carbs if activity was low.",
    },
    notes: ["Do not skip meals to compensate.", "Track consistency more than perfection."],
    warnings: ["Crash diets can trigger overeating.", "Medical conditions need qualified diet advice."],
    trainerApproved: false,
    isActive: true,
  },
  {
    name: "Vegetarian High Protein Budget",
    slug: "vegetarian-high-protein-budget",
    goal: "High protein",
    dietType: "Vegetarian",
    caloriesRange: "Goal dependent",
    proteinTarget: "Use dal, curd, paneer, tofu, soy, sprouts, chana",
    meals: {
      breakfast: "Besan chilla, curd, sprouts, or oats with milk.",
      lunch: "Roti/rice, dal, curd, vegetables, paneer/tofu when possible.",
      snack: "Roasted chana, peanuts in measured amount, fruit.",
      dinner: "Soy/tofu/paneer, vegetables, dal, salad.",
    },
    notes: ["Combine cereals and pulses.", "Distribute protein across the day."],
    warnings: ["Soy/paneer portions should match digestion and goals."],
    trainerApproved: false,
    isActive: true,
  },
  {
    name: "Pre And Post Workout Meals",
    slug: "pre-and-post-workout-meals",
    goal: "Training energy",
    dietType: "General",
    caloriesRange: "Depends on goal",
    proteinTarget: "20-40g protein near workout window if possible",
    meals: {
      breakfast: "If training morning: banana plus curd or eggs/tofu after.",
      lunch: "Carbs, protein, and vegetables 2-3 hours before training.",
      snack: "Banana, toast, or light snack 45-90 minutes before.",
      dinner: "Protein, carbs if needed, vegetables, hydration.",
    },
    notes: ["Avoid very heavy meals immediately before training.", "Hydrate before and after."],
    warnings: ["Diabetes medication and workout timing need doctor guidance."],
    trainerApproved: false,
    isActive: true,
  },
  {
    name: "Maintenance Habit Plan",
    slug: "maintenance-habit-plan",
    goal: "Maintenance",
    dietType: "Flexible",
    caloriesRange: "Maintenance calories",
    proteinTarget: "Moderate protein every meal",
    meals: {
      breakfast: "Simple protein breakfast with fruit or whole grains.",
      lunch: "Balanced plate: protein, carbs, vegetables, curd/salad.",
      snack: "Fruit, nuts, curd, or tea without heavy sweets.",
      dinner: "Light balanced dinner; avoid late fried snacks.",
    },
    notes: ["Use meal timing that you can repeat.", "Keep water visible through the day."],
    warnings: ["This is general education, not personal medical nutrition."],
    trainerApproved: false,
    isActive: true,
  },
];

export function getCardioBySlug(slug: string) {
  return cardioWorkouts.find((workout) => workout.slug === slug);
}

export function getNutritionBySlug(slug: string) {
  return nutritionPlans.find((plan) => plan.slug === slug);
}
