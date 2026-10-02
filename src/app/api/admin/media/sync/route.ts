import { NextResponse } from "next/server";
import connectDB from "@/infrastructure/mongoose/connection";
import { getTokenFromRequest, verifyAccessToken } from "@/lib/auth";
import SiteImage from "@/infrastructure/mongoose/models/SiteImage";
import { normalizeRole } from "@/lib/routing";

const folderBySection: Record<string, string> = {
  HOME_HERO: "iron-forge/home_hero",
  EQUIPMENT: "iron-forge/equipment",
  TRAINER: "iron-forge/trainer",
  BRANCH: "iron-forge/branch",
  GALLERY: "iron-forge/gallery",
  TRANSFORMATION: "iron-forge/transformation",
  MEMBERSHIP: "iron-forge/membership",
};

function getAdminUser(req: Request) {
  const token = getTokenFromRequest(req);
  if (!token) return null;

  try {
    const decoded = verifyAccessToken(token);
    return normalizeRole(decoded?.role) === "OWNER" ? decoded : null;
  } catch {
    return null;
  }
}

function titleFromPublicId(publicId: string) {
  const fileName = publicId.split("/").pop() || "Cloudinary image";
  return fileName
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export async function POST(req: Request) {
  try {
    const admin = getAdminUser(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { section } = await req.json();
    const folder = folderBySection[section];

    if (!folder) {
      return NextResponse.json({ error: "Invalid section." }, { status: 400 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary server keys are missing." },
        { status: 500 },
      );
    }

    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
    const url = new URL(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload`,
    );
    url.searchParams.set("prefix", folder);
    url.searchParams.set("max_results", "100");

    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || "Cloudinary sync failed." },
        { status: response.status },
      );
    }

    await connectDB();

    const resources = Array.isArray(data.resources) ? data.resources : [];
    let created = 0;
    let skipped = 0;
    let reactivated = 0;

    for (const resource of resources) {
      const publicId = resource.public_id;
      const secureUrl = resource.secure_url;

      if (!publicId || !secureUrl) {
        skipped++;
        continue;
      }

      const existing = await SiteImage.findOne({ publicId });
      if (existing) {
        existing.section = section;
        existing.secureUrl = secureUrl;
        existing.active = true;
        await existing.save();
        reactivated++;
        skipped++;
        continue;
      }

      await SiteImage.create({
        title: titleFromPublicId(publicId),
        section,
        secureUrl,
        publicId,
        alt: titleFromPublicId(publicId),
        sortOrder: created,
        uploadedBy: admin.id,
      });
      created++;
    }

    return NextResponse.json({
      message: `Synced ${created} image${created === 1 ? "" : "s"}.`,
      created,
      skipped,
      reactivated,
      folder,
    });
  } catch (error) {
    console.error("Site images sync error:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
