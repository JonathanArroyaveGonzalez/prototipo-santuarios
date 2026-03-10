import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const eventos = await prisma.eventos.findMany({
      orderBy: { fecha_inicio: "desc" },
      include: {
        medios: {
          select: {
            id: true,
            url: true,
            tipo: true,
            nombre_archivo: true,
          },
        },
      },
      take: 100,
    });

    return NextResponse.json(eventos);
  } catch (error) {
    console.error("Error fetching eventos:", error);
    return NextResponse.json([]);
  }
}
