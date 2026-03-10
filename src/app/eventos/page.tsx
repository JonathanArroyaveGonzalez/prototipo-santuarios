"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";
import { formatDate } from "@/lib/utils";

type Evento = {
  id: number;
  titulo: string;
  descripcion: string | null;
  categoria: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  medios?: {
    url: string;
  } | null;
};

const GENERIC_EVENT_IMAGE = "/evento-placeholder.svg";

export default function EventosPage() {
  const { t } = useLanguage();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [categoria, setCategoria] = useState("");

  useEffect(() => {
    fetch("/api/eventos")
      .then((r) => r.json())
      .then((data) => setEventos(data))
      .catch(() => {
        setEventos([]);
      });
  }, []);

  const categorias = useMemo(() => {
    return Array.from(new Set(eventos.map((evento) => evento.categoria).filter(Boolean)));
  }, [eventos]);

  const filteredEventos = useMemo(() => {
    if (!categoria) return eventos;
    return eventos.filter((evento) => evento.categoria === categoria);
  }, [eventos, categoria]);

  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8">
        <section className="surface-panel rounded-3xl p-8 sm:p-12">
          <h1 className="section-title text-4xl sm:text-5xl">{t.events.title}</h1>
          <p className="text-soft mt-4 max-w-3xl text-base leading-relaxed sm:text-lg">
            {t.events.subtitle}
          </p>
        </section>

        <section className="surface-panel mt-8 rounded-2xl p-6">
          <div className="flex flex-wrap items-center gap-4">
            <label className="text-sm font-semibold text-[var(--brand-strong)]" htmlFor="categoria-evento">
              {t.events.filterByCategory}
            </label>
            <select
              id="categoria-evento"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="rounded-xl border border-[var(--line)] bg-white px-4 py-2 text-sm"
            >
              <option value="">{t.events.allCategories}</option>
              {categorias.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <p className="text-soft mt-4 text-sm">
            {t.events.showing} {filteredEventos.length} {t.events.of} {eventos.length} {t.events.items}
          </p>
        </section>

        <section className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredEventos.map((evento) => (
            <Card key={evento.id} className="overflow-hidden">
              <img
                src={evento.medios?.url || GENERIC_EVENT_IMAGE}
                alt={evento.titulo}
                className="h-44 w-full object-cover"
              />
              <CardContent>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                    {evento.categoria}
                  </span>
                  <span className="text-xs text-[var(--ink-soft)]">#{evento.id}</span>
                </div>

                <h2 className="text-xl font-semibold text-[var(--brand-strong)]">{evento.titulo}</h2>
                <p className="text-soft mt-3 line-clamp-3 text-sm leading-relaxed">
                  {evento.descripcion || t.events.noDescription}
                </p>

                <div className="mt-4 space-y-1 text-sm text-[var(--ink-soft)]">
                  <p>
                    <strong>{t.events.starts}:</strong> {formatDate(evento.fecha_inicio)}
                  </p>
                  {evento.fecha_fin && (
                    <p>
                      <strong>{t.events.ends}:</strong> {formatDate(evento.fecha_fin)}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {filteredEventos.length === 0 && (
          <section className="mt-14 text-center">
            <p className="text-soft text-lg">{t.events.empty}</p>
          </section>
        )}
      </main>
    </div>
  );
}
