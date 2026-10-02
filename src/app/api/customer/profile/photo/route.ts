import { mkdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";
import { prisma } from "@/infrastructure/prisma/client";
import { getSessionFromRequest } from "@/lib/session";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function hasCloudinaryConfig() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

async function uploadToCloudinary(buffer: Buffer, userId: string) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "iron-forge/avatars",
        public_id: `${userId}-${Date.now()}`,
        overwrite: true,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result?.secure_url) reject(error || new Error("Cloudinary upload failed"));
        else resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
}

async function saveLocalAvatar(buffer: Buffer, userId: string) {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const fileName = `${userId}-${Date.now()}.webp`;
  const outputPath = path.join(uploadDir, fileName);
  await sharp(buffer).resize(512, 512, { fit: "cover" }).webp({ quality: 82 }).toFile(outputPath);

  return `/uploads/${fileName}`;
}

export async function POST(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session || session.role !== "CUSTOMER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const targetUserId = session.userId;

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "A file field is required." }, { status: 400 });
  }

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json({ error: "Only jpg, png, and webp uploads are allowed." }, { status: 400 });
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "Upload must be 5MB or smaller." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const photoUrl = hasCloudinaryConfig()
    ? await uploadToCloudinary(buffer, targetUserId)
    : await saveLocalAvatar(buffer, targetUserId);

  const user = await prisma.user.update({
    where: { id: targetUserId },
    data: { photoUrl },
    select: { id: true, name: true, email: true, role: true, photoUrl: true },
  });

  return NextResponse.json({
    user,
    photoUrl,
    storage: hasCloudinaryConfig() ? "cloudinary" : "local",
  });
}
