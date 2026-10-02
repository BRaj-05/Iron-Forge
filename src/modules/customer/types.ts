export type CustomerUser = {
  id: string; name: string; email: string; phone?: string | null; photoUrl?: string | null;
  address?: string | null; dateOfBirth?: string | null; gender?: string | null;
  heightCm?: number | null; weightKg?: number | null; emergencyContact?: string | null;
};
export type ExerciseEntry = { name: string; sets?: number; reps?: number; weightKg?: number; done?: boolean };
export type MealEntry = { name: string; food: string; done?: boolean };
export type DailyLog = {
  logDate: string;
  workout?: { workoutName: string; exercises: ExerciseEntry[] | unknown; completed: boolean; notes?: string | null } | null;
  diet?: { meals: MealEntry[] | unknown; waterCups: number; completed: boolean; notes?: string | null } | null;
  metric?: { weightKg?: number | null; heightCm?: number | null; notes?: string | null } | null;
};
export type CustomerDashboardData = {
  user: CustomerUser;
  plan: { name: string; price: number; durationDays: number } | null;
  subscription: { status: string; endDate: string; daysRemaining?: number } | null;
  attendance: Array<{ id: string; checkIn: string; checkOut?: string | null }>;
  payments: Array<{ id: string; amount: number; method: string; status: string; createdAt: string }>;
  notifications: Array<{ id: string; type: string; message: string; isRead: boolean }>;
  trainer: { name: string; email: string; specialization?: string | null; photoUrl?: string | null } | null;
  daily?: DailyLog;
};
