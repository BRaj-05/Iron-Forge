"use client";

import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(count, value, { duration: 0.9, ease: "easeOut" });
    const unsubscribe = rounded.on("change", (latest) => setDisplay(latest));
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [count, rounded, value]);

  return <motion.span>{display}{suffix}</motion.span>;
}
