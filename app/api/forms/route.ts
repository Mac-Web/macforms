import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get("q");
    if (!query)
      return NextResponse.json({ error: "Please provide a search query" });
    const session = await getSession();
    const forms = await prisma.form.findMany({
      where: {
        AND: [
          {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          },
          {
            OR: [{ userId: session?.user.id }, { private: false, open: true }],
          },
        ],
      },
      include: {
        user: true,
      },
      take: 5,
    });
    return NextResponse.json(forms);
  } catch (err) {
    return NextResponse.json({ error: "Error: " + err });
  }
}
