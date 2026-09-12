import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../lib/db";
import YogaAsana from "../models/YogaAsana";
import { yogaAsanas } from "../lib/yoga-data";

async function main() {
  await connectDB();

  const operations = yogaAsanas.map((asana) => ({
    updateOne: {
      filter: { slug: asana.slug },
      update: {
        $set: {
          ...asana,
          isActive: true,
        },
      },
      upsert: true,
    },
  }));

  const result = await YogaAsana.bulkWrite(operations);

  console.log(
    `Seeded yoga asanas. Inserted: ${result.upsertedCount}, modified: ${result.modifiedCount}`,
  );
}

main()
  .catch((error) => {
    console.error("Yoga seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
