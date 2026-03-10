"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";

type Stats = {
  victimas: number;
  testimonios: number;
  lugares: number;
};

export default function Home() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<Stats>({ victimas: 0, testimonios: 0, lugares: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/victimas").then((r) => r.json()),
      fetch("/api/testimonios").then((r) => r.json()),
      fetch("/api/lugares").then((r) => r.json()),
    ]).then(([victimas, testimonios, lugares]) => {
      setStats({
        victimas: victimas.length,
        testimonios: testimonios.length,
        lugares: lugares.length,
      });
    }).catch(() => {
      // Silently handle errors
    });
  }, []);

  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8">
        <section className="hero-appear surface-panel relative overflow-hidden rounded-3xl p-8 sm:p-16">
          <div className="absolute -right-14 -top-12 h-44 w-44 rounded-full bg-[radial-gradient(circle,#d9ebe8_0%,#ffffff00_70%)]" />
          <div className="absolute -bottom-24 -left-14 h-52 w-52 rounded-full bg-[radial-gradient(circle,#f6e6df_0%,#ffffff00_72%)]" />

          <div className="relative max-w-4xl">
            <span className="inline-flex rounded-full border border-[#d9c6ab] bg-[#fff4e3] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8b4b2e]">
              Proyecto PRY-335 · Universidad de Caldas
            </span>

            <h1 className="section-title mt-6 text-4xl leading-tight sm:text-6xl">
              {t.home.title}
            </h1>

            <p className="text-soft mt-6 max-w-3xl text-base leading-relaxed sm:text-lg">
              {t.home.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/victimas">
                <Button size="lg">{t.home.exploreVictims}</Button>
              </Link>
              <Link href="/mapa">
                <Button variant="secondary" size="lg">{t.home.viewMap}</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-6 sm:grid-cols-3">
          <Card className="stagger-item">
            <CardHeader>
              <p className="text-xs uppercase tracking-[0.14em] text-[#8f614d]">{t.home.victimsRegistered}</p>
              <CardTitle className="mt-2 text-4xl font-bold text-[var(--brand-strong)]">
                {stats.victimas}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-soft text-sm">
                {t.home.documentsDesc}
              </p>
            </CardContent>
          </Card>

          <Card className="stagger-item">
            <CardHeader>
              <p className="text-xs uppercase tracking-[0.14em] text-[#8f614d]">{t.home.testimonies}</p>
              <CardTitle className="mt-2 text-4xl font-bold text-[var(--brand-strong)]">
                {stats.testimonios}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-soft text-sm">
                {t.home.familyDesc}
              </p>
            </CardContent>
          </Card>

          <Card className="stagger-item">
            <CardHeader>
              <p className="text-xs uppercase tracking-[0.14em] text-[#8f614d]">{t.home.memoryPlaces}</p>
              <CardTitle className="mt-2 text-4xl font-bold text-[var(--brand-strong)]">
                {stats.lugares}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-soft text-sm">
                {t.home.sitesDesc}
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mt-16 surface-panel rounded-3xl p-8 sm:p-12">
          <h2 className="section-title text-3xl sm:text-4xl">{t.home.projectTitle}</h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <div>
              <p className="text-soft leading-relaxed">
                {t.home.projectDesc1} <strong>{t.home.projectName}</strong> {t.home.projectDesc2}
              </p>
              <p className="text-soft mt-4 leading-relaxed">
                {t.home.projectDesc3}
              </p>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl border border-[var(--line)] bg-white p-4">
                <h3 className="font-semibold text-[var(--brand-strong)]">{t.home.coordination}</h3>
                <p className="text-soft text-sm mt-1">{t.home.coordinationText}</p>
              </div>
              <div className="rounded-xl border border-[var(--line)] bg-white p-4">
                <h3 className="font-semibold text-[var(--brand-strong)]">{t.home.duration}</h3>
                <p className="text-soft text-sm mt-1">{t.home.durationText}</p>
              </div>
              <div className="rounded-xl border border-[var(--line)] bg-white p-4">
                <h3 className="font-semibold text-[var(--brand-strong)]">{t.home.population}</h3>
                <p className="text-soft text-sm mt-1">{t.home.populationText}</p>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <Link href="/about">
              <Button variant="accent">{t.home.learnMore}</Button>
            </Link>
          </div>
        </section>

        <section className="mt-16 text-center">
          <h2 className="section-title text-2xl sm:text-3xl">{t.home.contribute}</h2>
          <p className="text-soft mx-auto mt-4 max-w-2xl">
            {t.home.contributeDesc}
          </p>
          <div className="mt-6">
            <Link href="/dashboard">
              <Button size="lg" variant="accent">{t.home.accessSystem}</Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
