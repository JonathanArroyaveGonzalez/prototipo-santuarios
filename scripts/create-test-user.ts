import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured.");
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function createTestUser() {
  try {
    const email = "admin@santuario.com";
    const password = "admin123";
    const nombre = "Administrador";

    // Verificar si el usuario ya existe
    const existingUser = await prisma.usuarios.findFirst({
      where: { email },
    });

    if (existingUser) {
      console.log("❌ El usuario ya existe:", email);
      return;
    }

    // Hashear la contraseña
    const hash_password = await bcrypt.hash(password, 10);

    // Crear el usuario
    const user = await prisma.usuarios.create({
      data: {
        nombre,
        email,
        hash_password,
        rol: "admin",
      },
    });

    console.log("✅ Usuario creado exitosamente:");
    console.log("   Email:", email);
    console.log("   Contraseña:", password);
    console.log("   ID:", user.id);
  } catch (error) {
    console.error("❌ Error al crear usuario:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
