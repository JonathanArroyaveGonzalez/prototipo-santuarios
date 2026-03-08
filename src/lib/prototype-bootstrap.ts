import prisma from "@/lib/prisma";

export async function ensurePrototypeUser() {
  const firstUser = await prisma.usuarios.findFirst({
    orderBy: { id: "asc" },
    select: { id: true },
  });

  if (firstUser) {
    return firstUser.id;
  }

  const created = await prisma.usuarios.create({
    data: {
      nombre: "Editor Prototipo",
      email: `prototipo+${Date.now()}@santuario.local`,
      hash_password: "demo-no-auth",
      rol: "editor",
    },
    select: { id: true },
  });

  return created.id;
}

export async function ensurePrototypeLugar() {
  const firstLugar = await prisma.lugares.findFirst({
    orderBy: { id: "asc" },
    select: { id: true },
  });

  if (firstLugar) {
    return firstLugar.id;
  }

  const created = await prisma.lugares.create({
    data: {
      nombre: "Samaná, Caldas",
      tipo: "homenaje",
      latitud: 5.54127,
      longitud: -74.99313,
    },
    select: { id: true },
  });

  return created.id;
}
