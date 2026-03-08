"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { Lugar } from "@/types";
import { mapIcons } from "@/components/maps/map-icons";
import { useLanguage } from "@/lib/language-context";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

export default function MapaPage() {
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [tipoFilter, setTipoFilter] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    fetch("/api/lugares")
      .then((r) => r.json())
      .then(setLugares);
  }, []);

  const filteredLugares = tipoFilter
    ? lugares.filter((l) => l.tipo === tipoFilter)
    : lugares;

  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8">
        <section className="hero-appear surface-panel rounded-3xl p-8">
          <h1 className="section-title text-4xl sm:text-5xl">
            {t.map.title}
          </h1>
          <p className="text-soft mt-4 max-w-3xl text-lg">
            Georeferenciación de lugares significativos relacionados con las víctimas 
            de desaparición en el Magdalena Caldense.
          </p>
        </section>

        <section className="mt-8 surface-panel rounded-2xl p-6">
          <div className="flex flex-wrap items-center gap-4">
            <label className="text-sm font-medium">{t.map.filterByType}</label>
            <select
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value)}
              className="rounded-xl border border-[var(--line)] bg-white px-4 py-2 text-sm"
            >
              <option value="">{t.map.allPlaces}</option>
              <option value="punto_desaparicion">{t.map.disappearancePoint}</option>
              <option value="encuentro">{t.map.meetingPlace}</option>
              <option value="homenaje">{t.map.tributeSite}</option>
            </select>
            <span className="text-soft text-sm">
              {t.map.showing} {filteredLugares.length} {t.map.places}
            </span>
          </div>
        </section>

        <section className="mt-8 surface-panel rounded-2xl p-2 h-[600px]">
          {typeof window !== "undefined" && (
            <MapContainer
              center={[5.54127, -74.99313]}
              zoom={10}
              style={{ height: "100%", width: "100%", borderRadius: "12px" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredLugares.map((lugar) => (
                <Marker
                  key={lugar.id}
                  position={[Number(lugar.latitud), Number(lugar.longitud)]}
                  icon={mapIcons[lugar.tipo as keyof typeof mapIcons]}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold text-[var(--brand-strong)]">
                        {lugar.nombre}
                      </h3>
                      <p className="text-soft text-sm mt-1">
                        Tipo: {lugar.tipo}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--line)] bg-white p-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span className="text-sm font-medium">{t.map.disappearancePoint}</span>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--line)] bg-white p-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-sm font-medium">{t.map.meetingPlace}</span>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--line)] bg-white p-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <span className="text-sm font-medium">{t.map.tributeSite}</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
