import Link from "next/link";

export default function RecorridoVirtualPage() {
  return (
    <main className="min-h-screen bg-[#f6f1e8] px-4 py-8 sm:px-8">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <div className="rounded-2xl border border-[#dcc7a8] bg-white/80 p-4 shadow-sm sm:p-6">
          <h1 className="font-display text-3xl text-[#2E4739] sm:text-4xl">Recorrido virtual</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#435b4e] sm:text-base">
            Explora los Santuarios de la Memoria en un entorno inmersivo 3D. Puedes navegar libremente,
            seleccionar memoriales y dejar homenajes simbólicos.
          </p>
          <p className="mt-3 text-xs text-[#6b7f73] sm:text-sm">
            Si tienes problemas de visualizacion en el navegador integrado, abrelo en una pestaña independiente desde{" "}
            <Link href="/recorrido-virtual/index.html" target="_blank" className="font-semibold text-[#8b5e3c] underline underline-offset-4">
              este enlace directo
            </Link>
            .
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#d7c2a0] bg-black shadow-lg">
          <iframe
            src="/recorrido-virtual/index.html"
            title="Recorrido virtual 3D Santuarios de la Memoria"
            className="h-[78vh] w-full"
            loading="lazy"
            allow="fullscreen"
          />
        </div>
      </section>
    </main>
  );
}
