import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// GET /api/prompts - get user's prompts
export async function GET() {
  try {
    const session = (await getServerSession(authOptions)) as any;

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const sessionUser = session.user;

    // First, find or create user
    const user = await prisma.user.upsert({
      where: { email: sessionUser.email },
      update: {
        name: sessionUser.name,
        image: sessionUser.image,
      },
      create: {
        email: sessionUser.email,
        name: sessionUser.name,
        image: sessionUser.image,
      },
    });

    const prompts = await prisma.prompt.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(prompts);
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return NextResponse.json(
      { error: "Failed to fetch prompts" },
      { status: 500 }
    );
  }
}

// POST /api/prompts - create new prompt
export async function POST(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as any;

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const sessionUser = session.user;

    // Find or create user
    const user = await prisma.user.upsert({
      where: { email: sessionUser.email },
      update: {
        name: sessionUser.name,
        image: sessionUser.image,
      },
      create: {
        email: sessionUser.email,
        name: sessionUser.name,
        image: sessionUser.image,
      },
    });

    const body = await request.json();
    const { title, content, description, tags, category } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const prompt = await prisma.prompt.create({
      data: {
        title,
        content,
        description,
        tags: tags || [],
        category,
        userId: user.id,
      },
    });

    return NextResponse.json(prompt, { status: 201 });
  } catch (error) {
    console.error("Error creating prompt:", error);
    return NextResponse.json(
      { error: "Failed to create prompt" },
      { status: 500 }
    );
  }
}
