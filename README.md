# Iron Forge Gym Management

Iron Forge is a role-based gym platform built with Next.js App Router,
TypeScript, Prisma, MongoDB, Cloudinary, and an optional local Ollama coach. It
combines a public fitness education website with separate customer, trainer, and
owner workspaces.

This is the single project document. It explains the product, folder structure,
routes, request flow, data ownership, setup, and the main interview talking
points.

## Product workflow

```text
Visitor
  └─> public website
      ├─> gym -> muscle -> exercise guide
      ├─> yoga, cardio, nutrition, equipment, plans
      └─> login / signup

Authenticated user
  └─> /dashboard role resolver
      ├─> CUSTOMER -> /customer
      ├─> TRAINER  -> /trainer
      └─> OWNER    -> /admin
```

Customers return to the public homepage after login. The header changes to
**My account**, which opens `/dashboard` and resolves the private destination
from the signed session. Trainers and owners enter their workspaces directly.

## Exercise learning workflow

Exercise URLs describe the real content hierarchy:

```text
/gym
  └─> /gym/chest
      ├─> animated chest exercise showcase
      └─> /gym/chest/bench-press
          ├─> technique steps
          ├─> posture, breathing, and safety
          ├─> beginner-to-advanced programming
          ├─> alternatives and related movements
          └─> previous / next chest exercise
```

Every exercise belongs to one muscle group in `src/lib/exercise-data.ts`.
`exercisePath()` is the single URL builder, so cards, search results, related
exercises, and customer workouts cannot create conflicting links. The legacy
`/exercise/[slug]` route redirects to the canonical nested URL, preserving old
bookmarks.

Muscle pages use an animated one-exercise-at-a-time gallery. Users can navigate
with buttons, keyboard arrows, thumbnails, or a swipe gesture. Public route
changes use a shared transition template. Motion respects the operating
system's reduced-motion preference.

## Project structure

```text
src/
├── app/
│   ├── (public)/                       public website; group does not change URLs
│   │   ├── gym/
│   │   │   ├── page.tsx                muscle-group library
│   │   │   └── [muscle]/
│   │   │       ├── page.tsx            animated exercise gallery
│   │   │       └── [exercise]/page.tsx canonical exercise guide
│   │   ├── exercise/[slug]/page.tsx    compatibility redirect
│   │   ├── about, blog, cardio, equipment, nutrition, plans...
│   │   └── template.tsx                public page transition
│   ├── (auth)/                         login, signup, password recovery
│   ├── (workspace)/
│   │   ├── customer/                   all member-owned screens
│   │   ├── trainer/                    trainer screens
│   │   ├── admin/                      owner screens
│   │   └── dashboard/                  server-side role resolver
│   └── api/
│       ├── auth/                       account and session boundary
│       ├── customer/                   member-owned operations
│       ├── trainer/                    trainer-owned operations
│       ├── admin/                      owner-only operations
│       ├── content/                    public content reads
│       └── cron/                       scheduled server jobs
├── components/
│   ├── home/                           public page composition
│   ├── layout/                         headers, footers, workspace shell
│   ├── motion/                         shared transitions
│   ├── media/                          Cloudinary upload UI
│   └── ui/                             reusable visual primitives
├── config/
│   ├── api-routes.ts                   one client-side API URL map
│   └── navigation.ts                   public and role navigation
├── features/auth/                      browser session provider
├── infrastructure/
│   ├── prisma/client.ts                transactional database client
│   └── mongoose/
│       ├── connection.ts               document database connection
│       └── models/                     catalog/media document models
├── lib/                                policies, datasets, and integrations
├── modules/
│   ├── customer/                       member API client, types, hooks
│   └── exercise-library/components/    gallery and full-guide views
└── proxy.ts                            route and API access protection
```

Next.js folders wrapped in parentheses are route groups. They organize code but
do not appear in the browser URL.

## Design responsibilities

- Route pages validate route parameters and compose a feature view.
- Feature modules own interaction-heavy UI and reusable domain behavior.
- Shared UI primitives handle buttons, cards, fields, and panels.
- `WorkspaceShell` owns private navigation, responsive behavior, and member
  footer links.
- `PublicPageShell` owns the public header and full public footer.
- `routing.ts` owns role normalization and post-login destinations.
- `api-routes.ts` prevents endpoint strings from being repeated across pages.
- API routes authenticate, authorize, validate input, then call a data provider.

This separation keeps page files readable and makes business rules testable
without coupling them to presentation code.

## Main routes

### Public

| URL | Purpose |
| --- | --- |
| `/` | Website homepage |
| `/gym` | Exercise and muscle library |
| `/gym/[muscle]` | Animated muscle exercise gallery |
| `/gym/[muscle]/[exercise]` | Canonical full exercise guide |
| `/cardio`, `/yoga`, `/nutrition` | Fitness education |
| `/equipment`, `/schedule`, `/plans` | Gym information |
| `/about`, `/team`, `/blog`, `/contact` | Company content |
| `/login`, `/signup`, `/forgot-password` | Account access |

### Customer

| URL | Purpose |
| --- | --- |
| `/customer` | Member overview |
| `/customer/daily-log` | Attendance, workout, diet, and body log |
| `/customer/workouts` | Personal workout learning |
| `/customer/diet` | Nutrition log |
| `/customer/yoga` | Recovery content |
| `/customer/progress` | Measurements and progress |
| `/customer/ai-coach` | Local AI fitness coach |
| `/customer/sessions` | Trainer support requests |
| `/customer/calendar` | Weekly schedule |
| `/customer/tasks` | Gamified tasks and XP |
| `/customer/leaderboard` | Member ranking |
| `/customer/payments` | Membership payment |
| `/customer/profile` | Private member information and photo |

### Trainer and owner

- `/trainer` contains the trainer workspace.
- `/admin` contains the owner overview.
- `/admin/members`, `/admin/analytics`, and `/admin/media` contain focused
  management screens.

## API ownership

```text
/api/auth/*                  login, logout, session, registration, password reset
/api/customer/dashboard     member dashboard aggregate
/api/customer/attendance/*  check-in and attendance history
/api/customer/daily-log     workout and body logging
/api/customer/diet-log      meal and hydration logging
/api/customer/tasks         tasks and XP
/api/customer/progress      member progress
/api/customer/leaderboard   member ranking
/api/customer/payments/*    checkout and verification
/api/customer/profile/photo member-owned profile photo
/api/customer/coach         authenticated Ollama coach
/api/trainer/*              trainer-owned operations
/api/admin/*                owner-only management operations
/api/content/images         active public image metadata
/api/cron/subscriptions     scheduled membership status maintenance
```

Protected handlers call `requireRole()`. The API never trusts a browser role
value; it verifies the signed cookie and loads the active user before allowing
the operation.

## Data ownership

Prisma is the source of truth for transactional gym records:

- users and roles
- subscriptions and payments
- attendance
- daily workout, diet, and body logs
- customer tasks and XP progress
- notifications and support requests
- hashed password reset tokens

Mongoose is isolated to document-style catalog and media records:

- exercise, cardio, yoga, and diet reference content
- AI coach conversation history
- site-image metadata

There is only one login identity: the Prisma `User`. This prevents registration,
login, password reset, and member management from reading different collections.

## Image workflow

Cloudinary stores the image files. The database stores metadata and placement.

```text
Owner uploads image
  └─> Cloudinary receives file
      └─> /api/content/images saves metadata

Owner runs media sync
  └─> POST /api/admin/media/sync
      └─> imports metadata for files already in configured Cloudinary folders

Public page
  └─> GET /api/content/images
      └─> renders active image URLs
```

`/api/admin/media/sync` is an owner operation, not a picture page. Public
image reading stays under `content/images`; customer profile upload stays under
`customer/profile/photo`.

Exercise guides currently use curated high-resolution Unsplash URLs. They can be
replaced with Cloudinary assets through the central image helpers without
changing route components.

## Authentication and privacy

1. Registration validates input with Zod and hashes passwords with bcrypt.
2. Login compares the password and creates a signed HTTP-only cookie.
3. The proxy protects workspace pages and protected API prefixes.
4. `/dashboard` reads the session and resolves the role destination.
5. Password reset stores only a SHA-256 hash of the short-lived token.
6. Logout removes the session cookie.

Customer health and contact details are returned only to authorized roles.
Trainer access should remain limited to assigned training data; owner access
covers business administration.

## Local AI coach

The customer coach calls Ollama at:

```env
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.2:3b
```

Install Ollama and run:

```bash
ollama pull llama3.2:3b
ollama serve
```

If Ollama is unavailable, the API returns a short safe fallback so the customer
page remains usable. The AI coach is general fitness guidance and does not
diagnose injuries or medical conditions.

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and enter the required values.

3. Generate and synchronize Prisma:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Seed development accounts and content when needed:

   ```bash
   npm run seed
   npm run seed:exercises
   npm run seed:yoga
   npm run seed:cardio-nutrition
   ```

5. Start the application:

   ```bash
   npm run dev
   ```

## Environment variables

| Group | Variables |
| --- | --- |
| Database | `DATABASE_URL`, optional legacy `MONGO_URI` |
| Authentication | `JWT_SECRET`, `JWT_REFRESH_SECRET` |
| Application | `NEXT_PUBLIC_APP_URL`, `CRON_SECRET` |
| Cloudinary | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, upload preset variables |
| Email | `RESEND_API_KEY`, `EMAIL_FROM` |
| Payments | Stripe or Razorpay variables from `.env.example` |
| AI | `OLLAMA_BASE_URL`, `OLLAMA_MODEL` |

Never commit real secrets. `.env.example` contains placeholders only.

## Validation commands

```bash
npx tsc --noEmit
npm run lint
npm run build
```

## Interview explanation

A concise explanation of the architecture:

> Iron Forge separates public content, authentication, and role workspaces with
> Next.js route groups. Each role owns its API namespace, and every protected
> handler verifies the signed session and database role. Prisma owns
> transactional gym data, while Mongoose is isolated to document-style catalog
> and media content. Shared route builders, API maps, layouts, and feature
> modules remove duplication. The exercise library uses canonical hierarchical
> URLs and reusable animated views, so navigation reflects the domain model.

Useful design concepts demonstrated by the project:

- separation of concerns
- single responsibility
- role-based access control
- canonical resource routing
- centralized configuration
- server-side validation
- dependency boundaries
- reusable layouts and feature components
- progressive enhancement and reduced-motion accessibility

## Native AI posture coach

Open **My Account → AI Coach → Posture Coach** (`/customer/ai-coach`).
Choose squats, push-ups, biceps curls, shoulder press, or lunges, set rep/set
targets, and enable your camera. Finish the workout and select **Save session**.
Saved metrics appear under **AI Form Progress** on `/customer/progress`.
**Ask Coach** preserves the existing chat and Ollama integration. Pose tracking
does not need Ollama, an API key, or a paid inference service.

### Architecture and workflow

```text
Customer page → AICoach tabs → PostureCoach session controls
                            → CameraStage (browser-only camera + skeleton)
                            → MediaPipe PoseLandmarker in VIDEO mode
                            → geometry → exercise checks → WorkoutEngine
                            → summary → authenticated session API
                            → Prisma AIWorkoutSession → MongoDB
                            → FormProgress history and chart
```

The reusable implementation lives in `src/modules/ai-coach/`:

| File | Responsibility |
| --- | --- |
| `types.ts`, `exercises.ts` | Shared contracts, exercise configuration, landmark and posture checks |
| `geometry.ts` | Aspect-corrected joint angles and torso inclination |
| `engine.ts` | Movement state, debouncing, rep counts and warning aggregates |
| `pose-landmarker.ts` | Pinned MediaPipe WASM/model loading and confidence settings |
| `CameraStage.tsx` | Camera lifetime, inference scheduling and canvas skeleton |
| `PostureCoach.tsx` | Targets, pause, voice feedback, summary and save/retry |
| `AskCoach.tsx`, `AICoach.tsx` | Existing chat and coach mode navigation |
| `validation.ts` | Server input validation |
| `FormProgress.tsx`, `coach.module.css` | History, charts and responsive styling |

`GET/POST /api/customer/ai-coach/sessions` verifies the signed session and active
customer role. Customer ownership comes exclusively from the server session;
client-supplied ownership is rejected. `POST` validates metrics and derives the
score, completed sets and issue count. A customer/session UUID unique index makes
save retries idempotent. `GET` returns only the current customer's latest 30
sessions plus lifetime totals and most-practiced exercise. Compatibility routes
`/api/ai-coach/sessions` and `/api/ai/coach` delegate to the same handlers.

`AIWorkoutSession` stores exercise, targets, completed reps/sets, good reps,
score, issue aggregates, duration and timestamps. Its indexes are
`(customerId, clientSessionId)` (unique) and `(customerId, createdAt)`.
Camera frames and landmarks are never uploaded or persisted.

### Detection and scoring

Required landmarks must be in frame with visibility at least 0.7. Joint angles
use pixel aspect correction. Squats/lunges use knee angles below 100° and above
160°; push-ups use elbow angles below 90° and above 160°; curls below 50° and
above 160°; presses start below 90° and reach above 160° with hands overhead.
Lunges require both legs visible and use the smaller knee angle; other exercises
lock the observed side for each repetition.

A complete start → peak → start cycle is required. Thresholds must persist for
160 ms, with at least 700 ms between counted reps. Held poses and threshold
jitter do not produce extra reps. Tracking loss, pause and long frame gaps
discard incomplete movements. No-pose instructions become explicit after
700 ms. Form warnings must persist for 450 ms and each issue type is recorded
at most once per attempt. Checks cover chest/torso lean, elbow drift, swinging,
press back lean and push-up hip alignment.

Form score = `round(100 × good completed reps / completed reps)`. A good rep is
one without a sustained warning; this is a coaching heuristic, not a clinical
measurement. Issues from incomplete attempts can also appear in the summary.
Inference is limited to 10 FPS and UI updates to 5 FPS. It currently runs on the
main thread with CPU delegation; a worker is a future performance improvement.
Hidden tabs stop analysis. Finish, navigation and unmount release the camera,
animation loop and model; camera retry preserves completed rep totals.

### Setup and startup troubleshooting

Dependency: `@mediapipe/tasks-vision` pinned to `1.0.1`. Model/WASM asset URLs
are centralized in `pose-landmarker.ts`; internet access is required on first
load. Deploy with HTTPS (localhost also supports camera access). Allow the
jsDelivr and Google model endpoints in any deployment CSP. Browser speech is
optional and muted initially.

```bash
npm install
npx prisma generate
# Apply reviewed schema/index changes to your chosen MongoDB database:
npx prisma db push
npm run dev
```

The focused `node scripts/setup-ai-coach-db.cjs` setup has been executed. It
created only the two documented `AIWorkoutSession` indexes and did not
synchronize or alter other models. Use the same script when preparing another
database. Never use `--accept-data-loss` for this setup.

`npm run dev` now uses `next dev --webpack` to bypass the observed Turbopack
`failed to create whole tree` startup panic. This is a bundler workaround, not
a proven diagnosis of the internal panic. Production `next build` remains on
Turbopack and has compiled successfully. If Prisma generation fails with a
Windows engine DLL lock, stop this project's running dev server, generate the
client, and restart it.

### Verification

```bash
node scripts/ai-coach.test.cjs
npx tsc --noEmit --incremental false
npm run lint
npm run build
# With the dev server and an existing demo customer:
node scripts/ai-coach-browser.cjs
```

The browser check defaults to installed Microsoft Edge; set
`COACH_BROWSER_CHANNEL` for another installed Playwright browser channel.
`COACH_TEST_EMAIL`, `COACH_TEST_PASSWORD` and `COACH_BASE_URL` can override its
test account and URL. It does not save workout records.

Verified in this workspace: Prisma client generation, TypeScript, ESLint,
production build, nine detector/validation tests, and an Edge browser smoke
check. The browser check loads the real model and runs inference on synthetic
camera frames, exercises denial/retry, no-pose handling, pause/resume and camera
shutdown, and checks mobile layout and both coach modes. MongoDB history access
and validation were verified without inserting test workouts. Real-person
movement accuracy still requires manual webcam testing.

Manual acceptance after database setup: allow the camera; perform ten slow reps
for each exercise; verify the skeleton, rep transitions and coaching cues;
leave/re-enter frame; pause/resume; deny/retry permission; navigate away and
confirm the camera indicator turns off; finish and save; retry the same save
without creating duplicates; reload Progress; verify a second customer cannot
see the first customer's sessions. Real-person webcam accuracy still requires
this calibration check across camera angles, lighting and body proportions.

### Reference and attribution

The detector concepts were studied from
[shradha-khapra/ai-gym-coach](https://github.com/shradha-khapra/ai-gym-coach),
commit `6fe189713db45da95d23709655b85cf5dd30c872`. No license file was found in
that inspected revision, so its source was not copied. Iron Forge's TypeScript
detectors independently implement the joint-angle/state-transition concepts;
they are adaptations, not a claim of identical behavior. Reference thresholds
were retained where useful, with additional visibility, timing and side checks.
No Streamlit application, reference authentication or SQLite persistence is
embedded. MediaPipe is a separate dependency and retains its packaged license;
see the [official web pose documentation](https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker/web_js).
