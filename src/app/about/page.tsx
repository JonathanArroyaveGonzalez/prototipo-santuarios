"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";

export default function AboutPage() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8">
        <section className="hero-appear surface-panel rounded-3xl p-8 sm:p-12">
          <span className="inline-flex rounded-full border border-[#d9c6ab] bg-[#fff4e3] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8b4b2e]">
            {t.about.projectTag}
          </span>
          <h1 className="section-title mt-6 text-4xl sm:text-5xl">
            {t.about.title}
          </h1>
          <p className="text-soft mt-4 max-w-3xl text-lg leading-relaxed">
            {t.about.subtitle}
          </p>
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t.about.contextTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-soft leading-relaxed">
                {t.about.contextText1}{" "}
                <strong>{t.about.contextVictims}</strong> {t.about.contextText2}{" "}
                <strong>{t.about.contextDisappeared}</strong>.
              </p>
              <p className="text-soft mt-4 leading-relaxed">
                {t.about.contextText3}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.about.jepTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-soft leading-relaxed">
                {t.about.jepText1} <strong>{t.about.jepSanctuaries}</strong> {t.about.jepText2}
              </p>
              <p className="text-soft mt-4 leading-relaxed">
                {t.about.jepText3}
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mt-12 surface-panel rounded-3xl p-8">
          <h2 className="section-title text-3xl">{t.about.objectiveTitle}</h2>
          <p className="text-soft mt-4 text-lg leading-relaxed">
            {t.about.objectiveText}
          </p>
        </section>

        <section className="mt-12">
          <h2 className="section-title text-3xl mb-6">{t.about.teamTitle}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Laura Montoya López</CardTitle>
                <p className="text-soft text-sm">{t.about.coordinator}</p>
              </CardHeader>
              <CardContent>
                <p className="text-soft text-sm">
                  {t.about.faculty1}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Carolina López Giraldo</CardTitle>
                <p className="text-soft text-sm">{t.about.participant}</p>
              </CardHeader>
              <CardContent>
                <p className="text-soft text-sm">
                  {t.about.faculty1} · 4h/semana
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Andrés Paolo Castaño Vélez</CardTitle>
                <p className="text-soft text-sm">{t.about.participant}</p>
              </CardHeader>
              <CardContent>
                <p className="text-soft text-sm">
                  {t.about.faculty2} · 4h/semana
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Carlos Alberto Ruíz Villa</CardTitle>
                <p className="text-soft text-sm">{t.about.participant}</p>
              </CardHeader>
              <CardContent>
                <p className="text-soft text-sm">
                  {t.about.faculty2} · 2h/semana
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Leo Ricardo García Sierra</CardTitle>
                <p className="text-soft text-sm">{t.about.external} - MOVICE</p>
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
                <p className="text-soft text-sm">{t.about.external} - FUNDECOS</p>
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
          <h2 className="section-title text-3xl">{t.about.methodologyTitle}</h2>
          <p className="text-soft mt-4 text-lg leading-relaxed">
            {t.about.methodologyText} <strong>{t.about.methodologyIAP}</strong> {t.about.methodologyText2}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--line)] bg-white p-4">
              <h3 className="font-semibold text-[var(--brand-strong)]">{t.about.activeParticipation}</h3>
              <p className="text-soft text-sm mt-2">{t.about.activeParticipationDesc}</p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-white p-4">
              <h3 className="font-semibold text-[var(--brand-strong)]">{t.about.jointProduction}</h3>
              <p className="text-soft text-sm mt-2">{t.about.jointProductionDesc}</p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-white p-4">
              <h3 className="font-semibold text-[var(--brand-strong)]">{t.about.socialTransformation}</h3>
              <p className="text-soft text-sm mt-2">{t.about.socialTransformationDesc}</p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-white p-4">
              <h3 className="font-semibold text-[var(--brand-strong)]">{t.about.empowerment}</h3>
              <p className="text-soft text-sm mt-2">{t.about.empowermentDesc}</p>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-6 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <p className="text-xs uppercase tracking-[0.14em] text-[#8f614d]">{t.about.institution}</p>
              <CardTitle className="text-xl">{t.about.universityName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-soft text-sm">
                {t.about.faculty1}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-xs uppercase tracking-[0.14em] text-[#8f614d]">{t.about.duration}</p>
              <CardTitle className="text-xl">{t.about.durationValue}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-soft text-sm">
                {t.about.durationDates}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-xs uppercase tracking-[0.14em] text-[#8f614d]">{t.about.budget}</p>
              <CardTitle className="text-xl">{t.about.budgetValue}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-soft text-sm">
                {t.about.currency}
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
