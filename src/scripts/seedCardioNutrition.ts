import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../infrastructure/mongoose/connection";
import CardioWorkout from "../infrastructure/mongoose/models/CardioWorkout";
import DietPlan from "../infrastructure/mongoose/models/DietPlan";
import { cardioWorkouts, nutritionPlans } from "../lib/cardio-nutrition-data";

async function main() {
  await connectDB();

  const cardioResult = await CardioWorkout.bulkWrite(
    cardioWorkouts.map((workout) => ({
      updateOne: {
        filter: { slug: workout.slug },
        update: { $set: { ...workout, isActive: true } },
        upsert: true,
      },
    })),
  );

  const nutritionResult = await DietPlan.bulkWrite(
    nutritionPlans.map((plan) => ({
      updateOne: {
        filter: { slug: plan.slug },
        update: {
          $set: {
            scope: "EDUCATIONAL",
            name: plan.name,
            planName: plan.name,
            slug: plan.slug,
            goal: plan.goal,
            dietType: plan.dietType,
            caloriesRange: plan.caloriesRange,
            proteinTargetText: plan.proteinTarget,
            meals: plan.meals,
            notes: plan.notes,
            warnings: plan.warnings,
            trainerApproved: plan.trainerApproved,
            active: plan.isActive,
          },
        },
        upsert: true,
      },
    })),
  );

  console.log(
    `Seeded cardio. Inserted: ${cardioResult.upsertedCount}, modified: ${cardioResult.modifiedCount}`,
  );
  console.log(
    `Seeded nutrition. Inserted: ${nutritionResult.upsertedCount}, modified: ${nutritionResult.modifiedCount}`,
  );
}

main()
  .catch((error) => {
    console.error("Cardio/nutrition seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
