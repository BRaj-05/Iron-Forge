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
    copy: "Progress tracking, leaderboard rank, trainer requests, and advanced workout plans.",
    features: ["Progress charts", "Leaderboard", "Trainer requests"],
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

export const testimonials = [
  {
    name: "Member placeholder",
    quote: "The daily check-in and workout log make it easier to see whether the week is actually moving.",
    label: "Placeholder quote",
  },
  {
    name: "Beginner placeholder",
    quote: "The exercise library explains what each movement is for before asking me to train harder.",
    label: "Placeholder quote",
  },
  {
    name: "Trainer placeholder",
    quote: "Saved diet and workout notes give the trainer a clearer starting point for follow-up.",
    label: "Placeholder quote",
  },
];

export const blogPosts = [
  {
    slug: "how-to-start-strength-training",
    title: "How to start strength training without guessing",
    readTime: "4 min read",
    excerpt: "Begin with machines, learn the target muscle, keep reps controlled, and add load only after the movement looks repeatable.",
    body: [
      "A beginner strength plan works best when the first goal is repeatable technique. Start with stable machines or dumbbell patterns before chasing heavy barbell numbers.",
      "Pick one push, one pull, one squat or hinge, and one core drill. Keep most sets in the 8-12 rep range and stop when form starts changing.",
      "Progress comes from consistency: add a little weight, one extra rep, or better tempo only when the previous week felt controlled.",
    ],
  },
  {
    slug: "protein-habits-for-busy-members",
    title: "Protein habits for busy members",
    readTime: "3 min read",
    excerpt: "Use simple anchors: curd, dal, paneer, eggs, tofu, sprouts, chicken, or whey when whole meals are difficult.",
    body: [
      "Protein does not need to be complicated. Build each meal around one obvious protein anchor and then add vegetables and a measured carb source.",
      "For Indian meals, dal with curd, paneer with roti, sprouts, eggs, tofu, or chicken can all work depending on preference and budget.",
      "The useful habit is visibility: write down meals daily so your trainer can spot patterns instead of guessing from memory.",
    ],
  },
  {
    slug: "why-incline-walking-works",
    title: "Why incline walking works for consistency",
    readTime: "3 min read",
    excerpt: "Incline walking is simple, joint-friendly for many beginners, and easy to repeat across the week.",
    body: [
      "Most fat-loss plans fail because the cardio is too intense to repeat. Incline walking is boring in a useful way: easy to understand and easy to schedule.",
      "Use a pace where breathing is elevated but still controlled. Twenty-five to forty minutes is enough for many members when combined with strength work and food tracking.",
      "Pain, dizziness, or unusual symptoms are a stop sign. Adjust incline, speed, or mode, and ask for trainer support when needed.",
    ],
  },
];
