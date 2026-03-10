"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { Victima } from "@/types";
import { useLanguage } from "@/lib/language-context";

function buildVictimPhoto(victima: Victima) {
  const initials = `${victima.nombres?.charAt(0) ?? ""}${victima.apellidos?.charAt(0) ?? ""}`.toUpperCase();
  const fullName = `${victima.nombres} ${victima.apellidos}`;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 360 240'>
    <defs>
      <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='#274338'/>
        <stop offset='100%' stop-color='#b2916f'/>
      </linearGradient>
    </defs>
    <rect width='100%' height='100%' fill='url(#bg)' />
    <circle cx='180' cy='105' r='56' fill='rgba(255,255,255,0.18)' />
    <text x='180' y='122' text-anchor='middle' fill='#fff8ec' font-size='52' font-family='Georgia, serif'>${initials}</text>
    <rect x='22' y='184' width='316' height='34' rx='8' fill='rgba(0,0,0,0.24)' />
    <text x='180' y='206' text-anchor='middle' fill='#fdf4e4' font-size='16' font-family='Arial, sans-serif'>${fullName}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default function VictimasPage() {
  const { t } = useLanguage();
  const [victimas, setVictimas] = useState<Victima[]>([]);
  const [filteredVictimas, setFilteredVictimas] = useState<Victima[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [municipioFilter, setMunicipioFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");

  useEffect(() => {
    fetch("/api/victimas")
      .then((r) => r.json())
      .then((data) => {
        setVictimas(data);
        setFilteredVictimas(data);
      })
      .catch(() => {
        // Silently handle errors
      });
  }, []);

  useEffect(() => {
    let filtered = victimas;

    if (searchTerm) {
      filtered = filtered.filter(
        (v) =>
          v.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.apellidos.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (municipioFilter) {
      filtered = filtered.filter((v) => v.municipio === municipioFilter);
    }

    if (estadoFilter) {
      filtered = filtered.filter((v) => v.estado_busqueda === estadoFilter);
    }

    setFilteredVictimas(filtered);
  }, [searchTerm, municipioFilter, estadoFilter, victimas]);

  const municipios = Array.from(new Set(victimas.map((v) => v.municipio)));
  const estados = Array.from(new Set(victimas.map((v) => v.estado_busqueda)));

  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8">
        <section className="hero-appear surface-panel rounded-3xl p-8">
          <h1 className="section-title text-4xl sm:text-5xl">
            {t.victims.title}
          </h1>
          <p className="text-soft mt-4 max-w-3xl text-lg">
            Registro de personas desaparecidas en el Magdalena Caldense. 
            Cada nombre representa una vida, una familia y una historia que merece ser recordada.
          </p>
        </section>

        <section className="mt-8 surface-panel rounded-2xl p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <input
              type="text"
              placeholder={t.victims.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-2 text-sm"
            />
            <select
              value={municipioFilter}
              onChange={(e) => setMunicipioFilter(e.target.value)}
              className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-2 text-sm"
            >
              <option value="">{t.victims.allMunicipalities}</option>
              {municipios.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
              className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-2 text-sm"
            >
              <option value="">{t.victims.allStates}</option>
              {estados.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>
          <p className="text-soft mt-4 text-sm">
            {t.victims.showing} {filteredVictimas.length} {t.victims.of} {victimas.length} {t.victims.title.toLowerCase()}
          </p>
        </section>

        <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredVictimas.map((victima) => (
            <Link key={victima.id} href={`/victimas/${victima.id}`}>
              <Card className="transition-all hover:shadow-lg cursor-pointer">
                <CardContent>
                  <img
                    src={buildVictimPhoto(victima)}
                    alt={`${victima.nombres} ${victima.apellidos}`}
                    className="mb-4 h-40 w-full rounded-xl border border-[var(--line)] object-cover"
                  />
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-[var(--brand-strong)]">
                        {victima.nombres} {victima.apellidos}
                      </h3>
                      <p className="text-soft text-sm mt-1">
                        {victima.municipio}, {victima.departamento}
                      </p>
                    </div>
                    <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
                      {victima.estado_busqueda}
                    </span>
                  </div>
                  <div className="mt-4 space-y-1 text-sm text-[var(--ink-soft)]">
                    <p>
                      <strong>{t.victims.disappearance}:</strong>{" "}
                      {formatDate(victima.fecha_desaparicion)}
                    </p>
                    {victima.edad_desaparicion && (
                      <p>
                        <strong>{t.victims.age}:</strong> {victima.edad_desaparicion} {t.victims.years}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>

        {filteredVictimas.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-soft text-lg">
              {t.victims.noVictims}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
