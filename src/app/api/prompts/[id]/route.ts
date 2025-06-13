import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// GET /api/prompts/[id] - get single prompt
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = (await getServerSession(authOptions)) as any;

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const sessionUser = session.user;
    const user = await prisma.user.findUnique({
      where: { email: sessionUser.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = await params;
    const prompt = await prisma.prompt.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    return NextResponse.json(prompt);
  } catch (error) {
    console.error("Error fetching prompt:", error);
    return NextResponse.json(
      { error: "Failed to fetch prompt" },
      { status: 500 }
    );
  }
}

// PUT /api/prompts/[id] - update prompt
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = (await getServerSession(authOptions)) as any;

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const sessionUser = session.user;
    const user = await prisma.user.findUnique({
      where: { email: sessionUser.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, content, description, tags, category } = body;

    // Check if prompt belongs to user
    const existingPrompt = await prisma.prompt.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingPrompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    const prompt = await prisma.prompt.update({
      where: { id },
      data: {
        title,
        content,
        description,
        tags,
        category,
      },
    });

    return NextResponse.json(prompt);
  } catch (error) {
    console.error("Error updating prompt:", error);
    return NextResponse.json(
      { error: "Failed to update prompt" },
      { status: 500 }
    );
  }
}

// DELETE /api/prompts/[id] - delete prompt
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = (await getServerSession(authOptions)) as any;

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const sessionUser = session.user;
    const user = await prisma.user.findUnique({
      where: { email: sessionUser.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = await params;

    // Check if prompt belongs to user before deleting
    const existingPrompt = await prisma.prompt.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingPrompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    await prisma.prompt.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Prompt deleted successfully" });
  } catch (error) {
    console.error("Error deleting prompt:", error);
    return NextResponse.json(
      { error: "Failed to delete prompt" },
      { status: 500 }
    );
  }
}
