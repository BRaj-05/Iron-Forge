# Iron Forge Phase 0 Audit and Upgrade Plan

Branch:

```txt
feature/iron-forge-fitness-education-platform
```

This file is the Phase 0 baseline before adding the fitness education platform.
No application code should be rewritten during Phase 0.

## 1. Current Project Summary

Iron Forge is currently a Next.js App Router gym management SaaS with:

- public website routes
- admin panel
- customer panel
- JWT cookie authentication
- demo login fallback users
- MongoDB/Mongoose models
- Cloudinary upload and site image metadata
- Resend/email architecture
- attendance/check-in
- XP/progress
- todos/workout missions
- leaderboard
- analytics
- media manager

The app is already beyond a basic CRUD project. The next upgrade should turn it
into a fitness education, gym, yoga, AI coach, trainer booking, and payment
platform without breaking the existing foundation.

## 2. Current Folder Structure

Important folders:

```txt
src/app
src/app/admin
src/app/api
src/app/customer
src/components
src/components/home
src/components/media
src/components/ui
src/lib
src/models
src/scripts
```

Important root files:

```txt
package.json
next.config.ts
tsconfig.json
eslint.config.mjs
.env.example
.env.local
GYM_ARCHITECTURE.md
PROJECT_GUIDE.md
src/proxy.ts
```

## 3. Current Public Routes

```txt
/                         homepage
/about                    about page
/contact                  contact page
/equipment                equipment zone guide
/daily-score              daily score preview
/rank                     public rank preview
/tasks                    public tasks preview
/plans                    membership plans
/login                    login
/signup                   signup
/forgot-password          forgot password
/reset-password/[token]   reset password
```

## 4. Current Admin Routes

```txt
/admin/dashboard
/admin/analytics
/admin/members
/admin/media
```

## 5. Current Customer Routes

```txt
/customer/dashboard
/customer/todos
/customer/calendar
/customer/leaderboard
```

## 6. Current API Routes

```txt
/api
/api/test
/api/protected
/api/admin-only
/api/auth/login
/api/auth/logout
/api/auth/signup
/api/auth/refresh
/api/auth/verify-email
/api/auth/resend-verification
/api/auth/forgot-password
/api/auth/reset-password
/api/admin/analytics
/api/admin/members
/api/analytics
/api/attendance/checkin
/api/attendance/history
/api/leaderboard
/api/progress
/api/site-images
/api/site-images/sync
/api/todos
```

## 7. Current Models

Existing Mongoose models:

```txt
Achievement / Achievment
AdminProfile
AIInsight
Attendance
AuditLog
BodyMeasurement
Customer
CustomerTrainer
DietPlan
Equipment
GymBranch
Locker
Member
MemberAchievement / MemberAchievment
Membership
Notification
Payment
SiteImage
Staff
Subscription
Todo
Trainer
User
UserProgress
WorkoutEquipment
WorkoutSchedule
```

Note:

- Some names contain spelling inconsistencies: `Achievment`, `MemberAchievment`.
- Do not rename these blindly because imports/database collections may depend on them.
- Add new clean models in later phases and migrate carefully if needed.

## 8. Current Working Features

### Authentication

- Real MongoDB login exists.
- Demo login fallback exists.
- JWT access token and refresh token helpers exist.
- Tokens are stored in HTTP-only cookies.
- Logout clears cookies.
- Protected route logic exists in `src/proxy.ts`.

### Public Site

- Homepage exists with animated hero.
- Public navbar exists.
- Auth-aware buttons exist.
- Equipment page exists and opens modal/guide.
- Daily score, rank, tasks, plans, about, contact routes exist.

### Customer

- Customer layout exists.
- Customer dashboard has XP, level, streak, check-in, attendance heatmap,
  meal guard, and coach-style guidance.
- Todos/workout missions exist.
- Calendar exists.
- Leaderboard exists.

### Admin

- Admin layout exists.
- Admin dashboard exists.
- Analytics exists.
- Members page exists.
- Media manager exists.

### Cloudinary

- Browser upload helper exists.
- Admin media upload UI exists.
- `SiteImage` model stores image metadata.
- `/api/site-images` can read/write/update/delete image records.
- Public pages can fetch image records.

## 9. Broken, Incomplete, or Risky Areas

### 1. Phase Discipline Risk

The requested future scope is very large. Building all phases at once would
create routing, model, and UI conflicts. We should implement one phase at a
time and keep every phase buildable.

### 2. Public Site UI Is Not Final

The homepage and public pages exist, but the requested premium fitness
education platform needs a more intentional IA:

- gym learning
- yoga learning
- cardio
- nutrition
- AI coach
- trainer booking preview
- plans
- transformations
- FAQ

### 3. Fitness Education Routes Are Missing

Missing routes:

```txt
/gym
/gym/[muscle]
/exercise/[slug]
/yoga
/yoga/[category]
/yoga/asana/[slug]
/cardio
/nutrition
/ai-coach
/trainers
```

### 4. Trainer Panel Is Missing

Missing routes:

```txt
/trainer/dashboard
/trainer/clients
/trainer/sessions
/trainer/content
```

`User.role` supports `TRAINER`, but route protection and trainer pages need
to be added later.

### 5. Admin Content Management Is Missing

Missing admin routes:

```txt
/admin/content
/admin/exercises
/admin/yoga
/admin/equipment
/admin/cardio
/admin/diet
/admin/trainers
/admin/sessions
/admin/offers
/admin/payments
```

### 6. Education Models Are Missing

Missing models for later phases:

```txt
Exercise
YogaAsana
CardioWorkout
TrainerProfile
TrainerSession
VideoResource
Offer
```

### 7. Cloudinary Slots Need Expansion

Current media slots support core home/equipment/trainer/gallery images.
Later phases need slots for:

```txt
GYM_LIBRARY_HERO
YOGA_HERO
CARDIO_HERO
NUTRITION_HERO
TRAINER_HERO
CHEST
BACK
SHOULDERS
ARMS
LEGS
CORE
EQUIPMENT_FREE_WEIGHTS
EQUIPMENT_MACHINES
EQUIPMENT_CARDIO
YOGA_FLEXIBILITY
YOGA_POSTURE
YOGA_STRESS
PLAN_GYM
PLAN_YOGA
PLAN_COMBO
DASHBOARD_VISUAL
```

### 8. Env Example Security Risk

`.env.example` currently contains real-looking credential examples. In a later
cleanup phase, replace them with placeholders only. Do not print or expose
actual `.env.local` values.

### 9. Lint Strictness Risk

The project builds, but lint may report pre-existing issues such as:

- explicit `any`
- unused imports
- unescaped characters
- React hook dependency warnings

If lint fails, fix issues in the active phase instead of hiding them.

### 10. Medical Claim Risk

Yoga/diet/AI features must avoid cure claims. Use language like:

```txt
may support general wellness
general education only
consult a doctor/dietitian/trained instructor
```

## 10. Reusable Existing Components

```txt
src/components/home/AuthNavActions.tsx
src/components/home/MemberAction.tsx
src/components/home/PublicPageShell.tsx
src/components/media/CloudinaryUploadButton.tsx
src/components/ui/GlowCard.tsx
src/components/ui/StatCard.tsx
src/components/ui/XPBar.tsx
```

These should be reused instead of duplicating navigation, upload, and card
logic.

## 11. Reusable Existing Libraries

```txt
src/lib/auth.ts          JWT/cookie helpers
src/lib/cloudinary.ts    Cloudinary helpers
src/lib/db.ts            Mongo connection
src/lib/mailer.ts        Email helper
src/lib/theme.ts         Theme tokens
src/lib/verifyToken.ts   Token helper
```

## 12. Exact Upgrade Plan

### Phase 1: Premium Public Website Redesign

Scope:

- `/`
- `/about`
- `/contact`
- `/plans`
- `/equipment`
- `/tasks`
- `/daily-score`
- `/rank`

Rules:

- no database CRUD
- use existing/static data safely
- improve UI, layout, animation, responsive behavior
- keep Cloudinary image fetching

Output:

- premium homepage
- upgraded public sections
- consistent navbar/footer
- no broken auth/customer/admin behavior

### Phase 2: Exercise Library

Add:

- `/gym`
- `/gym/[muscle]`
- `/exercise/[slug]`
- `Exercise` model
- seed data for muscle groups

### Phase 3: Yoga Library

Add:

- `/yoga`
- `/yoga/[category]`
- `/yoga/asana/[slug]`
- `YogaAsana` model
- safe yoga content

### Phase 4: Cardio + Nutrition

Add:

- `/cardio`
- `/nutrition`
- `CardioWorkout` model
- upgraded `DietPlan` model or new educational diet model

### Phase 5: Customer Dashboard Upgrade

Add/upgrade:

- `/customer/workouts`
- `/customer/yoga`
- `/customer/diet`
- `/customer/progress`
- `/customer/sessions`
- `/customer/ai-coach`

### Phase 6: Trainer Panel

Add:

- `/trainer/dashboard`
- `/trainer/clients`
- `/trainer/sessions`
- `/trainer/content`
- `TrainerProfile`
- `TrainerSession`
- trainer route protection

### Phase 7: Admin Content Management

Add:

- `/admin/content`
- `/admin/exercises`
- `/admin/yoga`
- `/admin/equipment`
- `/admin/cardio`
- `/admin/diet`
- `/admin/trainers`
- `/admin/sessions`
- `/admin/offers`

### Phase 8: Cloudinary Media Upgrade

Expand slots and admin controls without breaking existing images.

### Phase 9: AI Fitness Coach

Add:

- `/api/ai/fitness-coach`
- `/ai-coach`
- `/customer/ai-coach`
- fallback responses when no AI key exists

### Phase 10: Payments + Subscriptions

Add Razorpay-safe architecture:

- `/customer/payments`
- `/admin/payments`
- `/api/payment/create-order`
- `/api/payment/verify`

No crash if Razorpay env is missing.

### Phase 11: Booking + Call / Video Sessions

Add:

- booking flow
- meeting link field
- accept/reject/reschedule
- no WebRTC yet

### Phase 12: Full Polish + Production Cleanup

Add:

- loading states
- empty states
- error states
- SEO metadata
- mobile navbar
- accessibility
- final lint/build cleanup

## 13. What Should Be Built First

Build **Phase 1** first.

Reason:

- it changes user perception immediately
- it does not risk database logic
- it gives the future exercise/yoga/nutrition pages a strong design system
- it lets us fix public navigation and footer once before adding more routes

## 14. Commands For Phase Verification

After each phase:

```bash
npm run lint
npm run build
```

If lint/build fails, fix before moving to the next phase.

## 15. Phase 0 Status

- Branch created.
- Project audited.
- No application code rewritten in this phase.
- `npm run lint` completed with 0 errors and 23 warnings.
- `npm run build` completed successfully.
- Next step: user says `START PHASE 1`.

## 16. Verification Results

### Lint

Command:

```bash
npm run lint
```

Result:

```txt
0 errors
23 warnings
```

Warning categories:

- existing `any` usage
- unused variables/imports
- React Compiler warnings around state updates inside effects
- missing hook dependency warning in admin dashboard

These are not build-blocking. Clean them gradually inside the phase where each
file is touched.

### Build

Command:

```bash
npm run build
```

Result:

```txt
Compiled successfully
TypeScript passed
43 routes generated
```
