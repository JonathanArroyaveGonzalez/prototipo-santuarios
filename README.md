# 🏛️ Santuarios de la Memoria - MVP

Sistema web para la gestión y visualización de memoria histórica de víctimas de desaparición en Samaná, Caldas.

**Proyecto PRY-335 · Universidad de Caldas · 2025**

---

## ✨ Características Principales

### 🌐 Portal Público
- **Home Page** con estadísticas en tiempo real
- **Galería de Víctimas** con filtros avanzados y búsqueda
- **Mapa Interactivo** con marcadores personalizados por tipo de lugar
- **Testimonios Multimedia** con reproductor integrado
- **Página About** con información del proyecto

### 🔐 Panel de Administración
- Dashboard moderno con sidebar responsive
- Gestión de víctimas, medios y testimonios
- Sistema de carga de archivos
- Estadísticas en tiempo real
- Interfaz optimizada para móvil y desktop

### 🌍 Sistema de Idiomas
- Soporte bilingüe: Español / English
- Selector de idioma en header
- Persistencia de preferencia en localStorage

### 🗺️ Mapa Mejorado
- Iconos personalizados por tipo:
  - 🔴 Punto de desaparición
  - 🟢 Lugar de encuentro
  - 🟡 Sitio de homenaje
- Popups informativos
- Filtros por tipo de lugar

---

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+
- PostgreSQL (Neon)

### Instalación

\`\`\`bash
# Clonar repositorio
cd santuario-memoria

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear archivo .env con:
DATABASE_URL="tu_conexion_postgresql"
FILE_SERVICE_UPLOAD_URL="tu_servicio_de_archivos"

# Generar cliente Prisma
npm run prisma:generate

# Iniciar servidor de desarrollo
npm run dev
\`\`\`

Abrir [http://localhost:3000](http://localhost:3000)

---

## 📁 Estructura del Proyecto

\`\`\`
santuario-memoria/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Home page
│   │   ├── about/                # Sobre el proyecto
│   │   ├── victimas/             # Galería de víctimas
│   │   ├── mapa/                 # Mapa interactivo
│   │   ├── testimonios/          # Testimonios
│   │   ├── login/                # Login
│   │   ├── dashboard/            # Panel admin
│   │   └── api/                  # API Routes
│   ├── components/
│   │   ├── ui/                   # Componentes base
│   │   ├── layout/               # Header, Footer
│   │   └── maps/                 # Componentes de mapa
│   ├── lib/
│   │   ├── prisma.ts             # Cliente Prisma
│   │   ├── i18n.ts               # Traducciones
│   │   ├── language-context.tsx  # Contexto de idioma
│   │   └── utils.ts              # Utilidades
│   └── types/
│       └── index.ts              # TypeScript types
├── prisma/
│   └── schema.prisma             # Schema de BD
└── package.json
\`\`\`

---

## 🎨 Sistema de Diseño

### Paleta de Colores
\`\`\`css
--brand: #124a63          /* Azul principal */
--brand-strong: #0a3147   /* Azul oscuro */
--accent: #9f3f2f         /* Rojo acento */
--background: #f3eee5     /* Fondo cálido */
--surface: #fffaf3        /* Superficie */
\`\`\`

### Tipografía
- **Sora** - Sans-serif (cuerpo)
- **Fraunces** - Serif (títulos)
- **Geist Mono** - Monospace (código)

---

## 🔌 API Endpoints

### Víctimas
- `GET /api/victimas` - Listar víctimas
- `POST /api/victimas` - Crear víctima

### Medios
- `GET /api/medios` - Listar medios
- `POST /api/medios` - Subir archivo

### Testimonios
- `GET /api/testimonios` - Listar testimonios
- `POST /api/testimonios` - Crear testimonio

### Lugares
- `GET /api/lugares` - Listar lugares

### Health
- `GET /api/health` - Estado del sistema

---

## 🛠️ Tecnologías

- **Framework:** Next.js 16 (App Router)
- **Base de Datos:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Estilos:** Tailwind CSS 4
- **Mapa:** Leaflet + React Leaflet
- **Iconos:** Lucide React
- **Tipado:** TypeScript

---

## 📱 Características de UI/UX

### ✅ Diseño Visual
- Sistema de colores consistente
- Tipografía jerárquica clara
- Espaciado uniforme con grid system
- Contraste WCAG AA (4.5:1)

### ✅ Navegación
- Header sticky con navegación clara
- Breadcrumbs en páginas internas
- Sidebar responsive en dashboard
- Estados activos visibles

### ✅ Accesibilidad
- Elementos semánticos HTML5
- Navegación por teclado
- Atributos ARIA
- Contraste adecuado

### ✅ Usabilidad
- Loading states
- Feedback inmediato
- Responsive design (móvil, tablet, desktop)
- Performance optimizado

---

## 🌍 Cambio de Idioma

El sistema soporta español e inglés. Para cambiar:

1. Click en el botón **🌐 ES/EN** en el header
2. La preferencia se guarda automáticamente
3. Todo el contenido se traduce instantáneamente

---

## 📊 Dashboard

### Acceso
`/dashboard` (requiere login básico)

### Funcionalidades
- **Resumen:** Estadísticas generales
- **Víctimas:** Crear y gestionar víctimas
- **Medios:** Subir archivos multimedia
- **Testimonios:** Registrar testimonios

### Navegación
- Sidebar con menú de secciones
- Responsive (hamburger menu en móvil)
- Estados de carga visibles
- Feedback de acciones

---

## 🗺️ Mapa Interactivo

### Características
- Marcadores personalizados con iconos SVG
- Colores por tipo de lugar
- Popups con información
- Filtros dinámicos
- Zoom y pan

### Tipos de Lugares
- **Punto de desaparición** (rojo)
- **Lugar de encuentro** (verde)
- **Sitio de homenaje** (amarillo)

---

## 🔐 Autenticación

**Estado Actual:** Login básico (simulado)

**Próximos Pasos:**
- Implementar NextAuth.js v5
- Integración con tabla usuarios
- Roles: visitante, editor, admin, restringido
- 2FA opcional

---

## 📝 Scripts Disponibles

\`\`\`bash
npm run dev              # Desarrollo
npm run build            # Build producción
npm run start            # Servidor producción
npm run prisma:generate  # Generar cliente Prisma
npm run db:pull          # Pull schema desde BD
npm run db:push          # Push schema a BD
\`\`\`

---

## 🐛 Solución de Problemas

### Mapa no carga
- Verificar que Leaflet CSS esté importado
- Usar dynamic import para evitar SSR issues

### Iconos del mapa no se ven
- Verificar estilos `.custom-marker` en globals.css
- Asegurar que los iconos SVG estén correctamente formateados

### Error de idioma
- Verificar que LanguageProvider envuelva la app
- Limpiar localStorage si hay problemas

---

## 👥 Equipo

- **Laura Montoya López** - Coordinadora
- **Carolina López Giraldo** - Participante
- **Andrés Paolo Castaño Vélez** - Participante
- **Carlos Alberto Ruíz Villa** - Participante

---

## 📄 Licencia

© 2025 Universidad de Caldas. Todos los derechos reservados.

---

## 🔗 Enlaces

- [Universidad de Caldas](https://www.ucaldas.edu.co/)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Leaflet Docs](https://leafletjs.com/)

---

**Versión:** 1.0.0  
**Última actualización:** Enero 2025
