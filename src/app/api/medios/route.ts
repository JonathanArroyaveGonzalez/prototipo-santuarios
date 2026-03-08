import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadFileToStorage } from "@/lib/file-service";
import { ensurePrototypeUser } from "@/lib/prototype-bootstrap";
import { inferMediaTypeFromMime, normalizeMediaType } from "@/lib/media-utils";

export async function GET() {
  const medios = await prisma.medios.findMany({
    orderBy: { id: "desc" },
    include: {
      usuarios: {
        select: { id: true, nombre: true },
      },
    },
    take: 100,
  });

  return NextResponse.json(medios);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const rawFile = formData.get("file");

    if (!(rawFile instanceof File)) {
      return NextResponse.json({ message: "Debes enviar un archivo." }, { status: 400 });
    }

    const rawUsuarioId = formData.get("usuario_id");
    const parsedUsuarioId =
      typeof rawUsuarioId === "string" && rawUsuarioId.trim()
        ? Number(rawUsuarioId)
        : undefined;

    const usuarioId =
      typeof parsedUsuarioId === "number" && Number.isFinite(parsedUsuarioId)
        ? parsedUsuarioId
        : await ensurePrototypeUser();

    const rawTipo = formData.get("tipo");
    const tipo =
      typeof rawTipo === "string" && rawTipo.trim()
        ? normalizeMediaType(rawTipo)
        : inferMediaTypeFromMime(rawFile.type);

    const rawNombreArchivo = formData.get("nombre_archivo");
    const nombreArchivo =
      typeof rawNombreArchivo === "string" && rawNombreArchivo.trim()
        ? rawNombreArchivo
        : rawFile.name;

    const storageUrl = await uploadFileToStorage(rawFile);

    const medio = await prisma.medios.create({
      data: {
        usuario_id: usuarioId,
        tipo,
        nombre_archivo: nombreArchivo,
        url: storageUrl,
      },
    });

    return NextResponse.json(medio, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "No fue posible subir el archivo.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}
