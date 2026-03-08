"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Stats = {
  victimas: number;
  testimonios: number;
  lugares: number;
};

export default function Home() {
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
              Santuarios de la Memoria
            </h1>

            <p className="text-soft mt-6 max-w-3xl text-base leading-relaxed sm:text-lg">
              Diálogos para la verdad y la reparación simbólica de las víctimas de desaparición en Samaná, Caldas. 
              Un espacio digital de memoria, dignificación y búsqueda de la verdad.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/victimas">
                <Button size="lg">Explorar Víctimas</Button>
              </Link>
              <Link href="/mapa">
                <Button variant="secondary" size="lg">Ver Mapa Interactivo</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-6 sm:grid-cols-3">
          <Card className="stagger-item">
            <CardHeader>
              <p className="text-xs uppercase tracking-[0.14em] text-[#8f614d]">Víctimas Registradas</p>
              <CardTitle className="mt-2 text-4xl font-bold text-[var(--brand-strong)]">
                {stats.victimas}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-soft text-sm">
                Personas desaparecidas documentadas
              </p>
            </CardContent>
          </Card>

          <Card className="stagger-item">
            <CardHeader>
              <p className="text-xs uppercase tracking-[0.14em] text-[#8f614d]">Testimonios</p>
              <CardTitle className="mt-2 text-4xl font-bold text-[var(--brand-strong)]">
                {stats.testimonios}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-soft text-sm">
                Relatos de familiares y comunidad
              </p>
            </CardContent>
          </Card>

          <Card className="stagger-item">
            <CardHeader>
              <p className="text-xs uppercase tracking-[0.14em] text-[#8f614d]">Lugares de Memoria</p>
              <CardTitle className="mt-2 text-4xl font-bold text-[var(--brand-strong)]">
                {stats.lugares}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-soft text-sm">
                Sitios georeferenciados en el territorio
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mt-16 surface-panel rounded-3xl p-8 sm:p-12">
          <h2 className="section-title text-3xl sm:text-4xl">Un Proyecto de Memoria y Dignidad</h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <div>
              <p className="text-soft leading-relaxed">
                El proyecto <strong>Santuarios de la Memoria</strong> surge en respuesta al Auto 073 de 2023 
                de la Jurisdicción Especial para la Paz (JEP), que ordena la construcción de espacios de memoria 
                en Samaná, Victoria, Norcasia y La Dorada.
              </p>
              <p className="text-soft mt-4 leading-relaxed">
                A través de la Investigación Acción Participativa (IAP), co-construimos con familias buscadoras, 
                organizaciones sociales e instituciones del Estado un diseño que honra la memoria de las 
                víctimas de desaparición forzada en el Magdalena Caldense.
              </p>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl border border-[var(--line)] bg-white p-4">
                <h3 className="font-semibold text-[var(--brand-strong)]">Coordinación</h3>
                <p className="text-soft text-sm mt-1">Laura Montoya López · Universidad de Caldas</p>
              </div>
              <div className="rounded-xl border border-[var(--line)] bg-white p-4">
                <h3 className="font-semibold text-[var(--brand-strong)]">Duración</h3>
                <p className="text-soft text-sm mt-1">11 meses · Febrero - Diciembre 2025</p>
              </div>
              <div className="rounded-xl border border-[var(--line)] bg-white p-4">
                <h3 className="font-semibold text-[var(--brand-strong)]">Población</h3>
                <p className="text-soft text-sm mt-1">1.328 personas desaparecidas (universo UBPD)</p>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <Link href="/about">
              <Button variant="accent">Conocer Más del Proyecto</Button>
            </Link>
          </div>
        </section>

        <section className="mt-16 text-center">
          <h2 className="section-title text-2xl sm:text-3xl">Contribuye a la Memoria Colectiva</h2>
          <p className="text-soft mx-auto mt-4 max-w-2xl">
            Si tienes información sobre personas desaparecidas o deseas compartir un testimonio, 
            tu voz es fundamental para la construcción de verdad y memoria.
          </p>
          <div className="mt-6">
            <Link href="/dashboard">
              <Button size="lg" variant="accent">Acceder al Sistema</Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
