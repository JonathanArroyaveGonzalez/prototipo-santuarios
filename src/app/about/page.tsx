import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8">
        <section className="hero-appear surface-panel rounded-3xl p-8 sm:p-12">
          <span className="inline-flex rounded-full border border-[#d9c6ab] bg-[#fff4e3] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8b4b2e]">
            Proyecto PRY-335
          </span>
          <h1 className="section-title mt-6 text-4xl sm:text-5xl">
            Sobre el Proyecto
          </h1>
          <p className="text-soft mt-4 max-w-3xl text-lg leading-relaxed">
            Santuarios de la Memoria: diálogos para la verdad y la reparación simbólica 
            de las víctimas de desaparición en Samaná, Caldas
          </p>
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Contexto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-soft leading-relaxed">
                Samaná es uno de los municipios más afectados por el conflicto armado en Caldas. 
                Según la Unidad para la Atención y Reparación Integral a las Víctimas (2024), 
                <strong> 49.288 personas son reconocidas como víctimas</strong> en este territorio, 
                y aproximadamente <strong>406 son víctimas directas de desaparición forzada</strong>.
              </p>
              <p className="text-soft mt-4 leading-relaxed">
                El 85% de la población del municipio ha sido victimizada por el conflicto armado.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Auto 073 de 2023 - JEP</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-soft leading-relaxed">
                La Jurisdicción Especial para la Paz (JEP) emitió el Auto 073 de 2023, 
                que ordena la construcción de <strong>Santuarios de Memoria</strong> en las alcaldías 
                de Samaná, Victoria, Norcasia y La Dorada.
              </p>
              <p className="text-soft mt-4 leading-relaxed">
                Estos santuarios deben permitir la disposición, conservación, cuidado y custodia 
                de Cuerpos No Identificados (CNI) y Cuerpos Identificados No Reclamados (CINR).
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mt-12 surface-panel rounded-3xl p-8">
          <h2 className="section-title text-3xl">Objetivo General</h2>
          <p className="text-soft mt-4 text-lg leading-relaxed">
            Contribuir al diseño de un Santuario de Memoria en el municipio de Samaná a través 
            del diálogo de saberes entre instituciones del Estado y organizaciones, para aportar 
            a la memoria y dignificación de las víctimas de desaparición, y la conservación, 
            cuidado y custodia de CNI y CINR.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="section-title text-3xl mb-6">Equipo de Trabajo</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Laura Montoya López</CardTitle>
                <p className="text-soft text-sm">Coordinadora</p>
              </CardHeader>
              <CardContent>
                <p className="text-soft text-sm">
                  Facultad de Ciencias Jurídicas y Sociales
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Carolina López Giraldo</CardTitle>
                <p className="text-soft text-sm">Participante</p>
              </CardHeader>
              <CardContent>
                <p className="text-soft text-sm">
                  Facultad de Ciencias Jurídicas y Sociales · 4h/semana
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Andrés Paolo Castaño Vélez</CardTitle>
                <p className="text-soft text-sm">Participante</p>
              </CardHeader>
              <CardContent>
                <p className="text-soft text-sm">
                  Facultad de Ingeniería · 4h/semana
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Carlos Alberto Ruíz Villa</CardTitle>
                <p className="text-soft text-sm">Participante</p>
              </CardHeader>
              <CardContent>
                <p className="text-soft text-sm">
                  Facultad de Ingeniería · 2h/semana
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Leo Ricardo García Sierra</CardTitle>
                <p className="text-soft text-sm">Externo - MOVICE</p>
              </CardHeader>
              <CardContent>
                <p className="text-soft text-sm">
                  2h/semana
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">María Lorena Echeverry García</CardTitle>
                <p className="text-soft text-sm">Externo - FUNDECOS</p>
              </CardHeader>
              <CardContent>
                <p className="text-soft text-sm">
                  2h/semana
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-12 surface-panel rounded-3xl p-8">
          <h2 className="section-title text-3xl">Metodología</h2>
          <p className="text-soft mt-4 text-lg leading-relaxed">
            El proyecto usa la <strong>Investigación Acción Participativa (IAP)</strong> como 
            enfoque metodológico transversal, con énfasis en el diálogo de saberes entre actores 
            comunitarios, organizativos e institucionales.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--line)] bg-white p-4">
              <h3 className="font-semibold text-[var(--brand-strong)]">Participación activa</h3>
              <p className="text-soft text-sm mt-2">De víctimas y familias buscadoras</p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-white p-4">
              <h3 className="font-semibold text-[var(--brand-strong)]">Producción conjunta</h3>
              <p className="text-soft text-sm mt-2">De conocimiento entre comunidad y academia</p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-white p-4">
              <h3 className="font-semibold text-[var(--brand-strong)]">Transformación social</h3>
              <p className="text-soft text-sm mt-2">Orientada a la dignificación y memoria</p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-white p-4">
              <h3 className="font-semibold text-[var(--brand-strong)]">Empoderamiento</h3>
              <p className="text-soft text-sm mt-2">Comunitario y organizativo</p>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-6 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <p className="text-xs uppercase tracking-[0.14em] text-[#8f614d]">Institución</p>
              <CardTitle className="text-xl">Universidad de Caldas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-soft text-sm">
                Facultad de Ciencias Jurídicas y Sociales
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-xs uppercase tracking-[0.14em] text-[#8f614d]">Duración</p>
              <CardTitle className="text-xl">11 meses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-soft text-sm">
                3 febrero - 15 diciembre 2025
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-xs uppercase tracking-[0.14em] text-[#8f614d]">Presupuesto</p>
              <CardTitle className="text-xl">$74.489.440</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-soft text-sm">
                COP
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
