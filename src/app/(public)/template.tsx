import type { ReactNode } from "react";
import PublicRouteTransition from "@/components/motion/PublicRouteTransition";

export default function PublicTemplate({ children }: { children: ReactNode }) {
  return <PublicRouteTransition>{children}</PublicRouteTransition>;
}
