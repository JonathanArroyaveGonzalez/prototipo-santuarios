"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Testimonio } from "@/types";
import { useLanguage } from "@/lib/language-context";

export default function TestimoniosPage() {
  const { t } = useLanguage();
  const [testimonios, setTestimonios] = useState<Testimonio[]>([]);
  const [tipoFilter, setTipoFilter] = useState("");

  useEffect(() => {
    fetch("/api/testimonios")
      .then((r) => {
        if (!r.ok) throw new Error('API error');
        return r.json();
      })
      .then(setTestimonios)
      .catch(() => {
        // Silently handle errors - API might not be available
        setTestimonios([]);
      });
  }, []);

  const filteredTestimonios = tipoFilter
    ? testimonios.filter((t) => t.tipo === tipoFilter)
    : testimonios;

  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8">
        <section className="hero-appear surface-panel rounded-3xl p-8">
          <h1 className="section-title text-4xl sm:text-5xl">
            {t.testimoniesPage.title}
          </h1>
          <p className="text-soft mt-4 max-w-3xl text-lg">
            {t.testimoniesPage.subtitle}
          </p>
        </section>

        <section className="mt-8 surface-panel rounded-2xl p-6">
          <div className="flex flex-wrap items-center gap-4">
            <label className="text-sm font-medium">{t.testimoniesPage.filterByType}</label>
            <select
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value)}
              className="rounded-xl border border-[var(--line)] bg-white px-4 py-2 text-sm"
            >
              <option value="">{t.testimoniesPage.allTestimonies}</option>
              <option value="texto">{t.testimoniesPage.text}</option>
              <option value="audio">{t.testimoniesPage.audio}</option>
              <option value="video">{t.testimoniesPage.video}</option>
            </select>
            <span className="text-soft text-sm">
              {t.testimoniesPage.showing} {filteredTestimonios.length} {t.testimoniesPage.testimonies}
            </span>
          </div>
        </section>

        <section className="mt-8 grid gap-6 sm:grid-cols-2">
          {filteredTestimonios.map((testimonio) => (
            <Card key={testimonio.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{testimonio.autor_nombre}</CardTitle>
                    {testimonio.autor_rol && (
                      <p className="text-soft text-sm mt-1">{testimonio.autor_rol}</p>
                    )}
                  </div>
                  <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
                    {testimonio.tipo}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-[var(--brand-strong)]">
                      {t.testimoniesPage.victim}
                    </p>
                    <p className="text-soft text-sm">
                      {testimonio.victimas.nombres} {testimonio.victimas.apellidos}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--brand-strong)]">
                      {t.testimoniesPage.place}
                    </p>
                    <p className="text-soft text-sm">
                      {testimonio.lugares.nombre} ({testimonio.lugares.tipo})
                    </p>
                  </div>
                  {testimonio.medios.tipo === "audio" && (
                    <audio controls className="w-full mt-2">
                      <source src={testimonio.medios.url} />
                    </audio>
                  )}
                  {testimonio.medios.tipo === "video" && (
                    <video controls className="w-full mt-2 rounded-lg">
                      <source src={testimonio.medios.url} />
                    </video>
                  )}
                  {testimonio.medios.tipo === "imagen" && (
                    <img
                      src={testimonio.medios.url}
                      alt="Testimonio"
                      className="w-full mt-2 rounded-lg"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {filteredTestimonios.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-soft text-lg">
              {t.testimoniesPage.noTestimonies}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
