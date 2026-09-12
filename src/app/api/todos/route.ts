import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Todo from "@/models/Todo";
import UserProgress from "@/models/UserProgress";
import { getTokenFromRequest, verifyAccessToken } from "@/lib/auth";

type TodoPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

interface TokenPayload {
  id: string;
  role: string;
}

const priorities = new Set<TodoPriority>([
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
]);

function calculateXP(priority: TodoPriority) {
  switch (priority) {
    case "LOW":
      return 5;
    case "MEDIUM":
      return 10;
    case "HIGH":
      return 20;
    case "CRITICAL":
      return 40;
  }
}

function normalizePriority(priority: unknown): TodoPriority {
  return typeof priority === "string" && priorities.has(priority as TodoPriority)
    ? (priority as TodoPriority)
    : "MEDIUM";
}

async function getUserFromToken(req: Request) {
  const token = getTokenFromRequest(req);

  if (!token) return null;

  try {
    return verifyAccessToken(token) as TokenPayload;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const decoded = await getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const todos = await Todo.find({ userId: decoded.id }).sort({
      createdAt: -1,
    });

    return NextResponse.json(todos);
  } catch (error) {
    console.error("Todos GET error:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const decoded = await getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";

    if (!title) {
      return NextResponse.json(
        { error: "Mission title is required." },
        { status: 400 },
      );
    }

    const todo = await Todo.create({
      userId: decoded.id,
      title,
      description:
        typeof body.description === "string" ? body.description.trim() : "",
      priority: normalizePriority(body.priority),
      deadline: body.deadline || undefined,
      important: Boolean(body.important),
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error("Todos POST error:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();

    const decoded = await getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "Mission id is required." },
        { status: 400 },
      );
    }

    const todo = await Todo.findOne({
      _id: body.id,
      userId: decoded.id,
    });

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    if (body.title !== undefined) {
      const title = typeof body.title === "string" ? body.title.trim() : "";

      if (!title) {
        return NextResponse.json(
          { error: "Mission title is required." },
          { status: 400 },
        );
      }

      todo.title = title;
    }

    if (body.description !== undefined) {
      todo.description =
        typeof body.description === "string" ? body.description.trim() : "";
    }

    if (body.priority !== undefined) {
      todo.priority = normalizePriority(body.priority);
    }

    if (body.deadline !== undefined) {
      todo.deadline = body.deadline || undefined;
    }

    if (body.important !== undefined) {
      todo.important = Boolean(body.important);
    }

    if (body.completed === true && !todo.completed) {
      const xp = calculateXP(todo.priority);

      todo.completed = true;
      todo.status = "COMPLETED";
      todo.xpEarned = xp;

      let progress = await UserProgress.findOne({ userId: decoded.id });

      if (!progress) {
        progress = await UserProgress.create({
          userId: decoded.id,
          xp: 0,
          level: 1,
          streak: 0,
        });
      }

      progress.xp += xp;
      progress.level = Math.floor(progress.xp / 100) + 1;
      progress.streak += 1;
      progress.lastCompletedDate = new Date();

      await progress.save();
    }

    await todo.save();

    return NextResponse.json(todo);
  } catch (error) {
    console.error("Todos PATCH error:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const decoded = await getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Mission id is required." },
        { status: 400 },
      );
    }

    const deleted = await Todo.findOneAndDelete({
      _id: id,
      userId: decoded.id,
    });

    if (!deleted) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Todos DELETE error:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
