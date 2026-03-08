import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ensurePrototypeUser } from "@/lib/prototype-bootstrap";

type VictimaPayload = {
  usuario_id?: number;
  nombres: string;
  apellidos: string;
  fecha_nacimiento?: string | null;
  fecha_desaparicion: string;
  edad_desaparicion?: number | null;
  departamento: string;
  municipio: string;
  estado_busqueda?: string;
};

export async function GET() {
  const victimas = await prisma.victimas.findMany({
    orderBy: { id: "desc" },
    include: {
      usuarios: {
        select: { id: true, nombre: true },
      },
      _count: {
        select: { testimonios: true },
      },
    },
    take: 100,
  });

  return NextResponse.json(victimas);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VictimaPayload;

    const usuarioId = body.usuario_id ?? (await ensurePrototypeUser());

    const victima = await prisma.victimas.create({
      data: {
        usuario_id: usuarioId,
        nombres: body.nombres,
        apellidos: body.apellidos,
        fecha_nacimiento: body.fecha_nacimiento
          ? new Date(body.fecha_nacimiento)
          : null,
        fecha_desaparicion: new Date(body.fecha_desaparicion),
        edad_desaparicion: body.edad_desaparicion ?? null,
        departamento: body.departamento,
        municipio: body.municipio,
        estado_busqueda: body.estado_busqueda ?? "en_busqueda",
      },
    });

    return NextResponse.json(victima, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "No fue posible crear la victima.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}
