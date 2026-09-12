import "dotenv/config";
import mongoose from "mongoose";

function dateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function main() {
  const uri = process.env.DATABASE_URL || process.env.MONGO_URI;
  if (!uri) throw new Error("DATABASE_URL or MONGO_URI is required.");

  await mongoose.connect(uri);
  const collection = mongoose.connection.collection("Attendance");
  const rows = await collection.find({}).sort({ checkIn: 1 }).toArray();
  const seen = new Set<string>();
  let updated = 0;
  let preservedLegacy = 0;

  for (const row of rows) {
    const checkIn = row.checkIn ? new Date(row.checkIn) : new Date();
    const baseLogDate = typeof row.logDate === "string" && row.logDate ? row.logDate : dateKey(checkIn);
    const key = `${String(row.customerId)}:${baseLogDate}`;
    const nextLogDate = seen.has(key)
      ? `${baseLogDate}-legacy-${String(row._id).slice(-6)}`
      : baseLogDate;

    seen.add(key);

    if (row.logDate !== nextLogDate) {
      await collection.updateOne(
        { _id: row._id },
        { $set: { logDate: nextLogDate } },
      );
      updated += 1;
      if (nextLogDate.includes("-legacy-")) preservedLegacy += 1;
    }
  }

  await mongoose.disconnect();
  console.log(`Attendance repaired. Updated ${updated}, preserved ${preservedLegacy} legacy duplicates.`);
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
