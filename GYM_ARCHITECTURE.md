# Iron Forge Gym Management Architecture

## Core Identity

`User` is the login identity for every human in the system.

- ADMIN
- MANAGER
- STAFF
- TRAINER
- CUSTOMER

Role-specific profile models extend `User`:

- `Customer`
- `Trainer`
- `Staff`
- `AdminProfile`

## Business Control

`AdminProfile` represents the owner/operator layer that can observe and manage:

- branches
- customers
- trainers
- staff
- memberships
- subscriptions
- payments
- attendance
- equipment
- site images
- reports
- AI insights

Use `AuditLog` to track important admin/staff actions.

## Main Relationships

- `User` 1:1 `Customer`
- `User` 1:1 `Trainer`
- `User` 1:1 `Staff`
- `User` 1:1 `AdminProfile`
- `GymBranch` 1:N `Customer`
- `GymBranch` 1:N `Trainer`
- `GymBranch` 1:N `Staff`
- `GymBranch` 1:N `Equipment`
- `Customer` 1:N `Payment`
- `Customer` 1:N `Attendance`
- `Customer` 1:N `BodyMeasurement`
- `Customer` 1:N `DietPlan`
- `Customer` 1:N `WorkoutSchedule`
- `Customer` 1:1 `Locker`
- `Customer` M:N `Trainer` via `CustomerTrainer`
- `Customer` M:N `Membership` via `Subscription`
- `WorkoutSchedule` M:N `Equipment` via `WorkoutEquipment`

## Cloudinary

Use `SiteImage` to store uploaded media metadata:

- `secureUrl`
- `publicId`
- `section`
- `title`
- `alt`
- `active`
- `sortOrder`
- `uploadedBy`

Equipment, trainer, branch, customer, and membership models also include
`imageUrl` / `imagePublicId` fields for direct image association.

## What To Configure

Copy `.env.example` to `.env.local`, then fill:

- `MONGO_URI`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Email/payment keys can be filled when those integrations are built.
