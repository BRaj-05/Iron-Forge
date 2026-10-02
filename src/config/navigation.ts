import { LayoutDashboard, Dumbbell, Apple, ChartNoAxesCombined, CalendarDays, CreditCard, Trophy, ListTodo, Sparkles, UserRound, Users, Bell, ClipboardCheck, Layers, Images, Heart, type LucideIcon } from "lucide-react";
import type { AppRole } from "@/lib/routing";

export type NavigationItem = { label: string; href: string; icon: LucideIcon; group: string };
export const workspaceNavigation: Record<AppRole, NavigationItem[]> = {
  CUSTOMER: [
    { label: "Overview", href: "/customer", icon: LayoutDashboard, group: "Workspace" },
    { label: "Daily log", href: "/customer/daily-log", icon: ClipboardCheck, group: "Workspace" },
    { label: "My workouts", href: "/customer/workouts", icon: Dumbbell, group: "Training" },
    { label: "AI coach", href: "/customer/ai-coach", icon: Sparkles, group: "Training" },
    { label: "Nutrition", href: "/customer/diet", icon: Apple, group: "Training" },
    { label: "Yoga & recovery", href: "/customer/yoga", icon: Heart, group: "Training" },
    { label: "Progress", href: "/customer/progress", icon: ChartNoAxesCombined, group: "Training" },
    { label: "Sessions", href: "/customer/sessions", icon: CalendarDays, group: "My gym" },
    { label: "Calendar", href: "/customer/calendar", icon: CalendarDays, group: "My gym" },
    { label: "Tasks", href: "/customer/tasks", icon: ListTodo, group: "My gym" },
    { label: "Leaderboard", href: "/customer/leaderboard", icon: Trophy, group: "My gym" },
    { label: "Payments", href: "/customer/payments", icon: CreditCard, group: "Account" },
    { label: "My profile", href: "/customer/profile", icon: UserRound, group: "Account" },
  ],
  OWNER: [
    { label: "Overview", href: "/admin", icon: LayoutDashboard, group: "Management" },
    { label: "Members", href: "/admin/members", icon: Users, group: "Management" },
    { label: "Analytics", href: "/admin/analytics", icon: ChartNoAxesCombined, group: "Management" },
    { label: "Media library", href: "/admin/media", icon: Images, group: "Management" },
    { label: "Trainers", href: "/admin#trainers", icon: Dumbbell, group: "Operations" },
    { label: "Plans", href: "/admin#plans", icon: Layers, group: "Operations" },
    { label: "Payments", href: "/admin#payments", icon: CreditCard, group: "Operations" },
    { label: "Attendance", href: "/admin#attendance", icon: ClipboardCheck, group: "Operations" },
    { label: "Notifications", href: "/admin#notifications", icon: Bell, group: "Operations" },
  ],
  TRAINER: [{ label: "Overview", href: "/trainer", icon: LayoutDashboard, group: "Coaching" }],
};

export const publicNavigation = [
  { label: "Home", href: "/" },
  { label: "Training", href: "/gym" },
  { label: "Yoga", href: "/yoga" },
  { label: "Nutrition", href: "/nutrition" },
  { label: "Equipment", href: "/equipment" },
  { label: "Our gym", href: "/about" },
  { label: "Membership", href: "/plans" },
];
