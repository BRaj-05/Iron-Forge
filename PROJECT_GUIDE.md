# Iron Forge Gym Management: Complete Project Guide

This project is a Next.js App Router gym management SaaS called **Iron Forge**.
It is being built as a premium gym operating system with customer progress,
admin control, Cloudinary media management, MongoDB data models, gamified tasks,
attendance, leaderboard, analytics, and future AI/payment features.

## 1. What You Are Building

Iron Forge has two main sides:

1. Public website
   - Home page
   - Equipment page
   - Daily score preview
   - Rank preview
   - Tasks preview
   - Plans
   - About
   - Contact
   - Login / signup / forgot password

2. Logged-in app
   - Admin panel: manages business, analytics, members, media/photos
   - Customer panel: dashboard, workouts/tasks, calendar, leaderboard, progress

The long-term product idea is:

> A smart AI-powered gym management platform where admins control the gym business and customers get a gamified fitness experience.

## 2. Current Tech Stack

- Next.js App Router
- React
- TypeScript
- MongoDB + Mongoose
- JWT authentication
- HTTP-only auth cookies
- Cloudinary uploads
- Resend email architecture
- Framer Motion animations
- Recharts
- React Big Calendar
- Custom dark gym UI theme

## 3. Main Folder Structure

```txt
src/
├── app/
│   ├── page.tsx                       Public homepage
│   ├── equipment/page.tsx              Public equipment/zone guide
│   ├── daily-score/page.tsx            Public daily score preview
│   ├── rank/page.tsx                   Public leaderboard preview
│   ├── tasks/page.tsx                  Public task preview
│   ├── plans/page.tsx                  Public membership plans
│   ├── about/page.tsx                  About page
│   ├── contact/page.tsx                Contact page
│   ├── login/page.tsx                  Login page
│   ├── signup/page.tsx                 Signup page
│   ├── forgot-password/page.tsx        Forgot password page
│   ├── reset-password/[token]/page.tsx Reset password page
│   │
│   ├── admin/
│   │   ├── layout.tsx                  Admin layout
│   │   ├── dashboard/page.tsx          Admin overview
│   │   ├── analytics/page.tsx          Admin analytics
│   │   ├── members/page.tsx            Member management
│   │   └── media/page.tsx              Cloudinary media control
│   │
│   ├── customer/
│   │   ├── layout.tsx                  Customer app layout/nav
│   │   ├── dashboard/page.tsx          Customer XP/check-in/meal dashboard
│   │   ├── todos/page.tsx              Workout mission/task system
│   │   ├── calendar/page.tsx           Workout calendar
│   │   └── leaderboard/page.tsx        Customer leaderboard
│   │
│   └── api/
│       ├── auth/                       Auth APIs
│       ├── admin/                      Admin APIs
│       ├── attendance/                 Check-in/history APIs
│       ├── todos/route.ts              Task/workout APIs
│       ├── progress/route.ts           XP/level/streak API
│       ├── leaderboard/route.ts        Leaderboard API
│       └── site-images/route.ts        Website media API
│
├── components/
│   ├── home/                           Public navbar/CTA components
│   ├── media/                          Cloudinary upload button
│   └── ui/                             Shared cards, XP bar, glow cards
│
├── lib/
│   ├── auth.ts                         JWT and cookie helpers
│   ├── cloudinary.ts                   Cloudinary URL/upload helpers
│   ├── db.ts                           MongoDB connection
│   ├── mailer.ts                       Resend email helper
│   ├── theme.ts                        Design tokens
│   └── verifyToken.ts                  Token verification helper
│
├── models/                             MongoDB/Mongoose schemas
├── proxy.ts                            Route protection middleware-like proxy
└── scripts/createAdmin.js              Admin creation script
```

## 4. Route Map

### Public Routes

```txt
/                  Homepage
/equipment          Equipment zones and exercise guidance
/daily-score        Score preview
/rank               Public rank preview
/tasks              Public task preview
/plans              Membership plan preview
/about              About page
/contact            Contact page
/login              Login
/signup             Signup
/forgot-password    Forgot password
/reset-password/:token
```

### Admin Routes

```txt
/admin/dashboard    Admin dashboard
/admin/analytics    Charts and business analytics
/admin/members      Member management
/admin/media        Cloudinary media control
```

### Customer Routes

```txt
/customer/dashboard    XP, check-in, meal tracking, AI coach
/customer/todos        Workout missions/tasks
/customer/calendar     Calendar schedule
/customer/leaderboard  Leaderboard
```

## 5. Authentication Flow

Main files:

```txt
src/lib/auth.ts
src/proxy.ts
src/app/api/auth/login/route.ts
src/app/api/auth/logout/route.ts
src/app/api/auth/signup/route.ts
src/app/api/auth/refresh/route.ts
src/app/api/auth/verify-email/route.ts
src/app/api/auth/forgot-password/route.tsx
src/app/api/auth/reset-password/route.ts
```

Flow:

1. User signs up or logs in.
2. Login API validates user.
3. Access token and refresh token are created.
4. Tokens are saved in HTTP-only cookies.
5. `src/proxy.ts` protects admin/customer routes.
6. Admin users can open `/admin/*`.
7. Customer users can open `/customer/*`.
8. Logout clears cookies.

Important role concept:

```txt
ADMIN    -> business owner/operator panel
CUSTOMER -> member/customer app
TRAINER  -> future trainer app
STAFF    -> future staff app
MANAGER  -> future manager app
```

## 6. MongoDB Model Plan

Your ERD is implemented as Mongoose models in `src/models`.

### Identity and Roles

```txt
User
AdminProfile
Customer
Trainer
Staff
```

`User` is the login identity. Role-specific models store profile/business data.

### Gym Business

```txt
GymBranch
Equipment
Membership
Subscription
Payment
Locker
AuditLog
Notification
```

### Fitness and Progress

```txt
Attendance
WorkoutSchedule
WorkoutEquipment
Todo
UserProgress
BodyMeasurement
DietPlan
Achievement
MemberAchievement
CustomerTrainer
```

### AI and Media

```txt
AIInsight
SiteImage
```

## 7. ER Relationship Plan

### Strong Entities

```txt
User
Customer
Trainer
Staff
AdminProfile
GymBranch
Equipment
Membership
Payment
Attendance
WorkoutSchedule
DietPlan
BodyMeasurement
SiteImage
```

### Weak / Associative Entities

```txt
CustomerTrainer
WorkoutEquipment
Subscription
MemberAchievement
```

These connect many-to-many relationships.

### One-to-One

```txt
User -> Customer
User -> Trainer
User -> Staff
User -> AdminProfile
Customer -> Locker
```

### One-to-Many

```txt
GymBranch -> Customers
GymBranch -> Trainers
GymBranch -> Staff
GymBranch -> Equipment
Customer -> Attendance
Customer -> Payment
Customer -> Todo
Customer -> BodyMeasurement
Customer -> DietPlan
Trainer -> WorkoutSchedule
Membership -> Subscription
```

### Many-to-Many

```txt
Customer <-> Trainer via CustomerTrainer
Customer <-> Membership via Subscription
WorkoutSchedule <-> Equipment via WorkoutEquipment
Customer <-> Achievement via MemberAchievement
```

## 8. Admin Role in Your ERD

You asked for a person who observes and controls everything. That is:

```txt
AdminProfile
```

Admin should manage:

- customers
- trainers
- staff
- equipment
- attendance
- payments
- memberships
- website photos
- reports
- AI insights
- audit logs
- business settings

Recommended admin relationships:

```txt
User 1:1 AdminProfile
AdminProfile 1:N GymBranch
AdminProfile 1:N AuditLog
AdminProfile 1:N SiteImage
AdminProfile 1:N AIInsight
```

## 9. Cloudinary Media System

Main files:

```txt
src/lib/cloudinary.ts
src/models/SiteImage.ts
src/components/media/CloudinaryUploadButton.tsx
src/app/admin/media/page.tsx
src/app/api/site-images/route.ts
src/app/api/site-images/sync/route.ts
```

How it works:

1. Admin opens `/admin/media`.
2. Admin selects a section and exact image place.
3. Admin uploads image.
4. Image goes to Cloudinary.
5. Cloudinary returns `secure_url` and `public_id`.
6. App saves those values into MongoDB `SiteImage`.
7. Public/customer pages fetch `/api/site-images`.
8. Page shows latest active image for that slot.

### Important Image Slots

```txt
HOME_HERO_1
HOME_HERO_2
HOME_HERO_3
STRENGTH
CARDIO
RECOVERY
TRAINER_HEAD
TRAINER_COACH_1
TRAINER_COACH_2
TRAINER_COACH_3
BRANCH_EXTERIOR
BRANCH_INTERIOR
BRANCH_FLOOR
BRANCH_RECOVERY
GALLERY_1
GALLERY_2
GALLERY_3
GALLERY_4
GALLERY_5
GALLERY_6
TRANSFORMATION_BEFORE
TRANSFORMATION_AFTER
TRANSFORMATION_STORY
MEMBERSHIP_ELITE
MEMBERSHIP_PRO
MEMBERSHIP_SELECT
LOGIN_VISUAL
DAILY_SCORE_VISUAL
```

### Why Your Images Sometimes Look Same

If three cards show the same image, it usually means:

1. All three records were uploaded with the same `slot`.
2. The page is only reading one fallback image.
3. The admin media record is hidden/inactive.
4. The browser has old cache.
5. The page is fetching the wrong section/slot.

Correct fix:

```txt
Strength Zone -> slot STRENGTH
Cardio Deck   -> slot CARDIO
Recovery Bay  -> slot RECOVERY
```

## 10. Environment Variables

Important files:

```txt
.env.local
.env.example
```

Required:

```env
MONGO_URI=
JWT_SECRET=
JWT_REFRESH_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=
EMAIL_FROM=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Optional old public image IDs:

```env
NEXT_PUBLIC_CLOUDINARY_HOME_HERO_1=
NEXT_PUBLIC_CLOUDINARY_HOME_HERO_2=
NEXT_PUBLIC_CLOUDINARY_HOME_HERO_3=
NEXT_PUBLIC_CLOUDINARY_EQUIPMENT_STRENGTH=
NEXT_PUBLIC_CLOUDINARY_EQUIPMENT_CARDIO=
NEXT_PUBLIC_CLOUDINARY_EQUIPMENT_RECOVERY=
```

These are not the best long-term method. The better method is MongoDB `SiteImage`,
because admin can update images from `/admin/media` without editing `.env.local`.

## 11. Current Feature List

### Public Website

- Animated homepage
- Public navigation
- Auth-aware buttons
- Equipment zone cards
- Daily score preview
- Plans page
- Footer/contact/about pages
- Cloudinary image support

### Customer App

- Customer dashboard
- XP, level, streak
- Check-in
- Attendance heatmap
- AI coach-style panel
- Meal guard for morning/afternoon/dinner
- Workout missions
- Calendar
- Leaderboard

### Admin App

- Admin dashboard
- Analytics
- Members
- Media manager
- Cloudinary uploads
- Image slot selection
- Sync Cloudinary folder

### APIs

- Auth login/signup/logout/refresh
- Email verification architecture
- Forgot/reset password architecture
- Attendance check-in/history
- Progress
- Todos
- Leaderboard
- Site images
- Admin analytics
- Admin members

## 12. Customer Experience Plan

Customer should feel:

- easy navigation
- clear dashboard
- gamified progress
- meal reminders
- check-in habit
- workouts linked to XP
- leaderboard motivation
- useful exercise guidance

Customer pages should include:

```txt
Dashboard -> today focus, XP, check-in, meals
Tasks     -> workout missions
Calendar  -> schedule and deadlines
Rank      -> leaderboard
Equipment -> what to train, what to avoid, fat-loss guidance
Plans     -> membership upgrade
```

## 13. Diet and Health Guidance Plan

The app can show general fitness guidance, but medical cases need careful wording.

For diabetes, injury, pregnancy, kidney disease, heart disease, or severe obesity:

```txt
Show general safe guidance.
Tell user to consult doctor/dietitian/trainer for a personal plan.
Avoid giving dangerous medical certainty.
```

Useful customer features:

- Morning meal check
- Afternoon meal check
- Dinner check
- Missed meal warning
- Water reminder
- Protein target
- Diabetes-friendly meal template
- Fat-loss meal template
- Muscle-gain meal template
- Trainer-approved plan flag

## 14. Payment Plan

Future files/routes:

```txt
src/app/admin/payments/page.tsx
src/app/customer/payments/page.tsx
src/app/api/payment/create-order/route.ts
src/app/api/payment/verify/route.ts
src/models/Payment.ts
src/models/Subscription.ts
```

Recommended gateways:

- Razorpay for India
- Stripe for international SaaS

Payment flow:

```txt
Customer selects plan
-> create order/session
-> payment gateway
-> verify payment
-> create Payment
-> create/update Subscription
-> update membership status
```

## 15. AI Feature Plan

Future AI modules:

```txt
AI workout recommendation
AI diet recommendation
AI renewal risk prediction
AI attendance prediction
AI injury-safe plan hints
AI admin insight box
AI trainer workload suggestions
```

Future routes:

```txt
src/app/api/ai/workout/route.ts
src/app/api/ai/diet/route.ts
src/app/api/ai/renewal-risk/route.ts
src/app/api/ai/admin-insights/route.ts
```

## 16. Recommended Build Order From Here

1. Make customer UI fully polished
   - dashboard
   - equipment guide
   - tasks
   - calendar
   - leaderboard

2. Finish Cloudinary media slots
   - exact upload place for every image
   - active/inactive state
   - instant refresh after update

3. Stabilize auth
   - login
   - logout
   - role redirects
   - protected routes
   - email verification

4. Finish admin
   - members CRUD
   - analytics
   - payments
   - equipment management
   - trainer management

5. Add payments
   - Razorpay or Stripe
   - subscription
   - invoices

6. Add AI
   - recommendations
   - admin insights
   - renewal prediction

7. Deploy
   - Vercel
   - MongoDB Atlas
   - Cloudinary
   - Resend
   - domain

## 17. How To Ask Doubts

You can ask by file:

```txt
Explain src/app/customer/dashboard/page.tsx
Explain src/app/admin/media/page.tsx
Explain src/models/SiteImage.ts
Explain src/lib/auth.ts
Explain src/proxy.ts
```

Or by concept:

```txt
Explain how Cloudinary image upload works
Explain how customer dashboard gets XP
Explain admin/customer route protection
Explain my ER diagram relationships
Explain MongoDB schema design
Explain how to add Razorpay
Explain how to add AI diet plan
```

## 18. One-Line Summary

Iron Forge is becoming a full gym SaaS where **Admin controls the business**,
**Customer gets a gamified fitness app**, **MongoDB stores the system data**,
and **Cloudinary controls all website photos without editing code**.
