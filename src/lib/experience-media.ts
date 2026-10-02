export const experienceSlides = [
  {
    title: "Strength lab",
    eyebrow: "Progressive overload",
    copy: "Build strength with clear form cues, tracked sessions, and repeatable weekly targets.",
    image: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1600",
    href: "/gym",
    source: "Pexels",
  },
  {
    title: "Mobility reset",
    eyebrow: "Move better",
    copy: "Pair lifting days with mobility and recovery so the next session starts sharper.",
    image: "https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=1600",
    href: "/yoga",
    source: "Pexels",
  },
  {
    title: "Nutrition rhythm",
    eyebrow: "Fuel consistently",
    copy: "Keep meals simple, protein-forward, and connected to the goal you are training for.",
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1600",
    href: "/nutrition",
    source: "Pexels",
  },
  {
    title: "Conditioning deck",
    eyebrow: "Engine work",
    copy: "Use cardio as a measurable training tool instead of random punishment after lifting.",
    image: "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1600",
    href: "/cardio",
    source: "Pexels",
  },
] as const;

export const trustedVideoGuides = [
  {
    title: "Common Yoga Protocol 2026",
    publisher: "Morarji Desai National Institute of Yoga",
    videoId: "Td5L4gxhiQU",
    note: "Official structured yoga routine from MDNIY, Ministry of Ayush.",
  },
  {
    title: "Yoga Protocol Series",
    publisher: "Ministry of Ayush",
    videoId: "kpdfHJ7x0dY",
    note: "Official Ministry of Ayush guidance and protocol material.",
  },
  {
    title: "Yoga & Fitness",
    publisher: "Doordarshan National",
    videoId: "sdG_wi-lkcU",
    note: "Official DD National fitness and yoga programming.",
  },
] as const;

export const liveForgeMetrics = [
  { label: "Strength load", values: [72, 78, 83, 86], suffix: "%" },
  { label: "Mobility readiness", values: [64, 70, 76, 81], suffix: "%" },
  { label: "Recovery score", values: [79, 84, 88, 92], suffix: "%" },
] as const;
