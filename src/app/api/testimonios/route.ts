import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ensurePrototypeLugar } from "@/lib/prototype-bootstrap";

type TestimonioPayload = {
  victima_id: number;
  lugar_id?: number;
  medio_id: number;
  tipo?: string;
  autor_nombre: string;
  autor_rol?: string | null;
};

export async function GET() {
  const testimonios = await prisma.testimonios.findMany({
    orderBy: { id: "desc" },
    include: {
      victimas: {
        select: { id: true, nombres: true, apellidos: true },
      },
      medios: {
        select: { id: true, tipo: true, url: true },
      },
      lugares: {
        select: { id: true, nombre: true, tipo: true },
      },
    },
    take: 100,
  });

  return NextResponse.json(testimonios);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TestimonioPayload;

    const lugarId = body.lugar_id ?? (await ensurePrototypeLugar());

    const testimonio = await prisma.testimonios.create({
      data: {
        victima_id: body.victima_id,
        lugar_id: lugarId,
        medio_id: body.medio_id,
        tipo: body.tipo ?? "texto",
        autor_nombre: body.autor_nombre,
        autor_rol: body.autor_rol ?? null,
      },
    });

    return NextResponse.json(testimonio, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "No fue posible crear el testimonio.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}
