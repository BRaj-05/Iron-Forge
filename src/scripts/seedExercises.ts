import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../lib/db";
import Exercise from "../models/Exercise";
import { exercises } from "../lib/exercise-data";

async function main() {
  await connectDB();

  const operations = exercises.map((exercise) => ({
    updateOne: {
      filter: { slug: exercise.slug },
      update: {
        $set: {
          ...exercise,
          isActive: true,
        },
      },
      upsert: true,
    },
  }));

  const result = await Exercise.bulkWrite(operations);

  console.log(
    `Seeded exercises. Inserted: ${result.upsertedCount}, modified: ${result.modifiedCount}`,
  );
}

main()
  .catch((error) => {
    console.error("Exercise seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
