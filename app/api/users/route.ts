import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let query = searchParams.get("q");
    if (query) {
      const session = await getSession();
      query = query.trim().toLowerCase();
      if (session) {
        const users = await prisma.user.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
              { about: { contains: query, mode: "insensitive" } },
            ],
          },
        });
        return NextResponse.json({
          success: "Successfully searched users",
          users,
        });
      }
      return NextResponse.json({
        error: "Please sign in to use this API endpoint",
      });
    }
    return NextResponse.json({ error: "Please provide a user search query" });
  } catch (err) {
    console.error("Error: " + err);
    return NextResponse.json({ error: `Error: ${err}` });
  }
}
