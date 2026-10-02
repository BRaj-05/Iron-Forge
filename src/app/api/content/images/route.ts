import { NextResponse } from "next/server";
import connectDB from "@/infrastructure/mongoose/connection";
import SiteImage from "@/infrastructure/mongoose/models/SiteImage";
import { getTokenFromRequest, verifyAccessToken } from "@/lib/auth";
import { normalizeRole } from "@/lib/routing";

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

export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const section = url.searchParams.get("section");
    const slot = url.searchParams.get("slot");
    const query = {
      active: true,
      ...(section ? { section } : {}),
      ...(slot ? { slot } : {}),
    };

    const images = await SiteImage.find(query).sort({
      sortOrder: 1,
      createdAt: -1,
    });

    return NextResponse.json(images, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Site images GET error:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = getAdminUser(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const { title, section, secureUrl, publicId, alt, sortOrder, slot } = body;

    if (!title || !section || !secureUrl || !publicId) {
      return NextResponse.json(
        { error: "title, section, secureUrl, and publicId are required." },
        { status: 400 },
      );
    }

    const image = await SiteImage.create({
      title,
      section,
      slot: slot || undefined,
      secureUrl,
      publicId,
      alt: alt || title,
      sortOrder: Number(sortOrder || 0),
      uploadedBy: admin.id,
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error("Site images POST error:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const admin = getAdminUser(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Image id is required." }, { status: 400 });
    }

    const image = await SiteImage.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found." }, { status: 404 });
    }

    return NextResponse.json(image);
  } catch (error) {
    console.error("Site images PATCH error:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const admin = getAdminUser(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Image id is required." }, { status: 400 });
    }

    await SiteImage.findByIdAndDelete(id);

    return NextResponse.json({ message: "Image removed." });
  } catch (error) {
    console.error("Site images DELETE error:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
