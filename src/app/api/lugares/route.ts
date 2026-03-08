import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ensurePrototypeLugar } from "@/lib/prototype-bootstrap";

export async function GET() {
  await ensurePrototypeLugar();

  const lugares = await prisma.lugares.findMany({
    orderBy: { id: "asc" },
    take: 100,
  });

  return NextResponse.json(lugares);
}
