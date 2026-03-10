import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const normalizedEmail = String(email).toLowerCase().trim();
    const plainPassword = String(password);

    if (!normalizedEmail || !plainPassword) {
      return NextResponse.json(
        { message: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // Verificacion temporal: el campo hash_password se compara como texto plano.
    const usuario = await prisma.usuarios.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: "insensitive",
        },
        hash_password: plainPassword,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { message: "Credenciales invalidas" },
        { status: 401 }
      );
    }

    // Login exitoso
    return NextResponse.json({
      success: true,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { message: "Error en el servidor" },
      { status: 500 }
    );
  }
}
