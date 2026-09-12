export const publicNavLinks = [
  { label: "Gym", href: "/gym" },
  { label: "Yoga", href: "/yoga" },
  { label: "Cardio", href: "/cardio" },
  { label: "Nutrition", href: "/nutrition" },
  { label: "Equipment", href: "/equipment" },
  { label: "Daily Score", href: "/daily-score" },
  { label: "Rank", href: "/rank" },
  { label: "Tasks", href: "/tasks" },
  { label: "Plans", href: "/plans" },
];

export const learningPillars = [
  {
    title: "Gym Exercise Library",
    label: "Strength",
    copy: "Muscle-by-muscle training paths for chest, back, shoulders, arms, legs, and core with form-first guidance.",
  },
  {
    title: "Yoga & Mobility",
    label: "Movement",
    copy: "Goal-based yoga flows for flexibility, posture, stress relief, and general wellness with clear safety notes.",
  },
  {
    title: "Cardio Zone",
    label: "Conditioning",
    copy: "Treadmill, cycling, rowing, walking, and HIIT formats explained by intensity and beginner readiness.",
  },
  {
    title: "Nutrition Rhythm",
    label: "Meals",
    copy: "Daily meal checkpoints, hydration targets, protein goals, and education-first diet charts for common fitness goals.",
  },
];

export const homepageShowcase = [
  {
    kicker: "Gym Learning",
    title: "Know what to train before touching the machine.",
    copy: "Members can learn the target muscle, common mistakes, and safer beginner alternatives before a set begins.",
  },
  {
    kicker: "AI Coach Preview",
    title: "A calm answer box for confused beginners.",
    copy: "Exercise, yoga, diet, posture, and equipment questions can be answered with safe fallback guidance when AI keys are missing.",
  },
  {
    kicker: "Trainer Sessions",
    title: "Book a call instead of guessing through pain.",
    copy: "Trainer and yoga expert booking is planned around session status, meeting links, notes, and admin oversight.",
  },
];

export const planCards = [
  {
    name: "Gym Basic",
    price: "₹999",
    tag: "Starter",
    copy: "Single-center access, check-ins, daily score, and beginner workout missions.",
    features: ["Gym access", "Daily score", "Workout missions"],
  },
  {
    name: "Gym Pro",
    price: "₹1,999",
    tag: "Popular",
    copy: "Progress tracking, leaderboard rank, calendar, and advanced workout plans.",
    features: ["Progress charts", "Leaderboard", "Calendar sync"],
  },
  {
    name: "Yoga Plan",
    price: "₹1,499",
    tag: "Mobility",
    copy: "Yoga categories, flexibility flows, posture support, and habit reminders.",
    features: ["Yoga flows", "Mobility goals", "Safety notes"],
  },
  {
    name: "Forge Combo",
    price: "₹2,999",
    tag: "Best Value",
    copy: "Gym, yoga, AI coach preview, trainer session booking, and premium insights.",
    features: ["Gym + yoga", "AI preview", "Session booking"],
  },
];

export const taskPreview = [
  {
    title: "Chest machine practice",
    goal: "Form",
    xp: 30,
    note: "Start with machine press before heavy barbell work.",
  },
  {
    title: "Incline walk block",
    goal: "Fat loss",
    xp: 20,
    note: "25 minutes at a pace where breathing is controlled.",
  },
  {
    title: "Meal guard check",
    goal: "Nutrition",
    xp: 15,
    note: "Breakfast, lunch, dinner, water, and protein checkpoint.",
  },
  {
    title: "Cool-down mobility",
    goal: "Recovery",
    xp: 10,
    note: "Finish with hips, chest, hamstrings, and slow breathing.",
  },
];

export const rankPreview = [
  { name: "Rohan Kapoor", xp: 980, level: 10, streak: "45d", tag: "Consistency" },
  { name: "Ananya Mehta", xp: 860, level: 9, streak: "38d", tag: "Strength" },
  { name: "Vikram Nair", xp: 740, level: 8, streak: "29d", tag: "Cardio" },
  { name: "Sunita Rao", xp: 620, level: 7, streak: "21d", tag: "Recovery" },
];

export const scoreBreakdown = [
  { label: "Attendance", value: 30, color: "#22C55E" },
  { label: "Workout Tasks", value: 40, color: "#F97316" },
  { label: "Streak Bonus", value: 15, color: "#FBBF24" },
  { label: "Recovery", value: 7, color: "#38BDF8" },
];

export const faqItems = [
  {
    q: "Can a beginner use Iron Forge?",
    a: "Yes. The product direction includes beginner mode, safe alternatives, machine-first explanations, and trainer booking when a member is unsure.",
  },
  {
    q: "Will the diet page replace a dietitian?",
    a: "No. Nutrition content is general education. Medical conditions need a doctor or qualified dietitian.",
  },
  {
    q: "Can admins change website photos?",
    a: "Yes. The admin media page uploads to Cloudinary and saves image placement in MongoDB, so pages can read the latest active image slots.",
  },
  {
    q: "Does AI work without an API key?",
    a: "The planned AI coach will show rule-based fallback answers if no AI provider key is configured.",
  },
];
