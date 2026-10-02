/**
 * One map for browser-to-server endpoints. Keeping URL knowledge here prevents
 * page components from duplicating route strings.
 */
export const apiRoutes = {
  auth: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    me: "/api/auth/me",
    register: "/api/auth/register",
    forgotPassword: "/api/auth/forgot-password",
    resetPassword: "/api/auth/reset-password",
  },
  customer: {
    dashboard: "/api/customer/dashboard",
    dailyLog: "/api/customer/daily-log",
    dietLog: "/api/customer/diet-log",
    checkIn: "/api/customer/attendance/check-in",
    attendanceHistory: "/api/customer/attendance/history",
    leaderboard: "/api/customer/leaderboard",
    paymentsCheckout: "/api/customer/payments/checkout",
    paymentsVerify: "/api/customer/payments/verify",
    profilePhoto: "/api/customer/profile/photo",
    progress: "/api/customer/progress",
    tasks: "/api/customer/tasks",
    coach: "/api/customer/coach",
    coachSessions: "/api/customer/ai-coach/sessions",
  },
  content: {
    images: "/api/content/images",
  },
  admin: {
    overview: "/api/admin/overview",
    users: "/api/admin/users",
    user: (id: string) => `/api/admin/users/${id}`,
    plans: "/api/admin/plans",
    subscriptions: "/api/admin/subscriptions",
    members: "/api/admin/members",
    mediaSync: "/api/admin/media/sync",
  },
  shared: {
    supportRequests: "/api/support-requests",
  },
} as const;
