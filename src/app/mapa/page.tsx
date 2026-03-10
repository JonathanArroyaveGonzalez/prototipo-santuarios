"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import type { Lugar } from "@/types";
import { useLanguage } from "@/lib/language-context";
import {
  Filter,
  MapPin,
  AlertTriangle,
  Search,
  Landmark,
  X,
} from "lucide-react";
import type { Map as LeafletMap } from "leaflet";

// ─── Leaflet dynamic imports ──────────────────────────────────────────────────
// useMap must be imported at module level (not inside components) to satisfy
// React's rules of hooks — it's safe here because the whole file is "use client"
// and MapContainer / its children only render on the client via dynamic().
import { useMap } from "react-leaflet";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false },
);
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
});
const GeoJSON = dynamic(() => import("react-leaflet").then((m) => m.GeoJSON), {
  ssr: false,
});

// ─── Samaná boundary GeoJSON ──────────────────────────────────────────────────
const SAMANA_GEOJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Samaná" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-75.15, 5.55],
            [-75.1, 5.6],
            [-75.0, 5.62],
            [-74.9, 5.6],
            [-74.85, 5.52],
            [-74.88, 5.45],
            [-74.95, 5.4],
            [-75.05, 5.38],
            [-75.12, 5.42],
            [-75.15, 5.5],
            [-75.15, 5.55],
          ],
        ],
      },
    },
  ],
} as const;

const SAMANA_STYLE = {
  color: "#2E4739",
  weight: 2.5,
  opacity: 0.85,
  fillColor: "#2E4739",
  fillOpacity: 0.06,
  dashArray: "6 4",
};

// ─── Candle SVG icon factory ──────────────────────────────────────────────────
function createCandleIcon(color: string) {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const L = require("leaflet");
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="28" height="44" viewBox="0 0 28 44">
  <rect x="8" y="18" width="12" height="22" rx="3" ry="3" fill="${color}" stroke="white" stroke-width="1.5"/>
  <ellipse cx="14" cy="40" rx="7" ry="2.5" fill="${color}" opacity="0.55"/>
  <line x1="14" y1="8" x2="14" y2="18" stroke="#5a3a1a" stroke-width="1.5" stroke-linecap="round"/>
  <ellipse cx="14" cy="10" rx="7" ry="9" fill="${color}" opacity="0.18"/>
  <path d="M14 2 C10 6 9 10 11 13 C12.5 15.5 15.5 15.5 17 13 C19 10 18 6 14 2Z" fill="#FFCC00" opacity="0.85"/>
  <path d="M14 5 C12.5 8 12 10.5 13 12 C13.5 13 14.5 13 15 12 C16 10.5 15.5 8 14 5Z" fill="white" opacity="0.7"/>
  <ellipse cx="14" cy="41.5" rx="5" ry="1.5" fill="rgba(0,0,0,0.2)"/>
</svg>`;
  return L.divIcon({
    className: "",
    html: svg,
    iconSize: [28, 44],
    iconAnchor: [14, 44],
  });
}

// ─── Type config ──────────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<
  string,
  {
    label: string;
    labelEn: string;
    hex: string;
    bg: string;
    bar: string;
    text: string;
  }
> = {
  punto_desaparicion: {
    label: "Desaparición",
    labelEn: "Disappearance",
    hex: "#ef4444",
    bg: "rgba(239,68,68,0.10)",
    bar: "#ef4444",
    text: "#ef4444",
  },
  encuentro: {
    label: "Encuentro",
    labelEn: "Encounter",
    hex: "#2E4739",
    bg: "rgba(46,71,57,0.10)",
    bar: "#2E4739",
    text: "#2E4739",
  },
  homenaje: {
    label: "Memorial",
    labelEn: "Memorial",
    hex: "#B2916F",
    bg: "rgba(178,145,111,0.13)",
    bar: "#B2916F",
    text: "#B2916F",
  },
};

// ─── Captures map instance safely inside MapContainer (avoids Strict Mode bug) ─
function MapReadyListener({
  mapRef,
  onReady,
}: {
  mapRef: React.MutableRefObject<LeafletMap | null>;
  onReady: (map: LeafletMap) => void;
}) {
  // useMap() gives us the Leaflet instance managed by react-leaflet itself —
  // this avoids the Strict Mode double-mount crash from using ref callbacks.
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    mapRef.current = map;
    onReady(map);
  }, [map]);
  return null;
}

// ─── FlyTo (must run inside MapContainer) ────────────────────────────────────
function FlyToController({
  target,
  mapRef,
}: {
  target: { lat: number; lng: number } | null;
  mapRef: React.MutableRefObject<LeafletMap | null>;
}) {
  useEffect(() => {
    if (target && mapRef.current) {
      mapRef.current.flyTo([target.lat, target.lng], 15, { duration: 1.5 });
    }
  }, [target]);
  return null;
}

// ─── Floating popup positioned next to the clicked marker ────────────────────
function FloatingPopup({
  lugar,
  mapInstance,
  mapEl,
  onClose,
  language,
}: {
  lugar: Lugar;
  mapInstance: LeafletMap;
  mapEl: HTMLElement;
  onClose: () => void;
  language: string;
}) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const cfg =
    TYPE_CONFIG[lugar.tipo as keyof typeof TYPE_CONFIG] ?? TYPE_CONFIG.homenaje;

  // Barra de progreso: se consume en 3s (igual que el auto-cierre)
  useEffect(() => {
    if (!progressRef.current) return;
    progressRef.current.style.transition = "none";
    progressRef.current.style.width = "100%";
    void progressRef.current.offsetWidth; // force reflow
    progressRef.current.style.transition = "width 3000ms linear";
    progressRef.current.style.width = "0%";
  }, [lugar.id]);

  useEffect(() => {
    const update = () => {
      const pt = mapInstance.latLngToContainerPoint([
        Number(lugar.latitud),
        Number(lugar.longitud),
      ]);
      setPos({ x: pt.x, y: pt.y });
    };
    update();
    mapInstance.on("move zoom moveend zoomend", update);
    return () => {
      mapInstance.off("move zoom moveend zoomend", update);
    };
  }, [mapInstance, lugar]);

  if (!pos) return null;

  const W = 272;
  const H = 140; // approx
  const offset = 20;
  const size = mapInstance.getSize();
  const goRight = pos.x + W + offset < size.x;
  const left = goRight ? pos.x + offset : pos.x - W - offset;
  let top = pos.y - H / 2;
  top = Math.max(8, Math.min(top, size.y - H - 8));

  return createPortal(
    <>
      <style>{`
        @keyframes smPopIn {
          from { opacity:0; transform:scale(0.93) translateY(4px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
      `}</style>
      <div
        style={{
          position: "absolute",
          left,
          top,
          width: W,
          zIndex: 1000,
          pointerEvents: "auto",
          animation: "smPopIn 0.18s ease-out",
        }}
      >
        {/* Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,0.22)",
          }}
        >
          {/* Barra de progreso auto-cierre 3s */}
          <div
            style={{
              position: "relative",
              height: 4,
              background: "rgba(0,0,0,0.07)",
              overflow: "hidden",
            }}
          >
            <div
              ref={progressRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: "100%",
                background: cfg.bar,
              }}
            />
          </div>

          <div style={{ padding: "14px 16px 18px" }}>
            {/* Header row */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontFamily: "Fraunces, Georgia, serif",
                    fontSize: 17,
                    fontWeight: 800,
                    color: "#111",
                    lineHeight: 1.25,
                  }}
                >
                  {lugar.nombre}
                </h3>
                <span
                  style={{
                    display: "inline-block",
                    marginTop: 6,
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "2px 9px",
                    borderRadius: 999,
                    background: cfg.bg,
                    color: cfg.text,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {language === "es" ? cfg.label : cfg.labelEn}
                </span>
              </div>
              <button
                onClick={onClose}
                style={{
                  flexShrink: 0,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Coords row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                marginTop: 10,
              }}
            >
              {/* mini candle */}
              <svg
                width="9"
                height="15"
                viewBox="0 0 28 44"
                aria-hidden="true"
                style={{ flexShrink: 0 }}
              >
                <rect
                  x="8"
                  y="18"
                  width="12"
                  height="22"
                  rx="3"
                  fill={cfg.hex}
                />
                <line
                  x1="14"
                  y1="8"
                  x2="14"
                  y2="18"
                  stroke="#5a3a1a"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M14 2 C10 6 9 10 11 13 C12.5 15.5 15.5 15.5 17 13 C19 10 18 6 14 2Z"
                  fill="#FFCC00"
                />
                <path
                  d="M14 5 C12.5 8 12 10.5 13 12 C13.5 13 14.5 13 15 12 C16 10.5 15.5 8 14 5Z"
                  fill="white"
                  opacity="0.7"
                />
              </svg>
              <MapPin size={12} style={{ color: cfg.text, flexShrink: 0 }} />
              <span
                style={{
                  fontSize: 11,
                  color: "#888",
                  fontFamily: "Sora, sans-serif",
                }}
              >
                {Number(lugar.latitud).toFixed(5)},{" "}
                {Number(lugar.longitud).toFixed(5)}
              </span>
            </div>
          </div>
        </div>

        {/* Connector dot */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            [goRight ? "left" : "right"]: -6,
            transform: "translateY(-50%)",
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: cfg.bar,
            border: "2px solid #fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        />
      </div>
    </>,
    mapEl,
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MapaPage() {
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [tipoFilter, setTipoFilter] = useState("all");
  const [candleIcons, setCandleIcons] = useState<Record<string, any>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [flyTarget, setFlyTarget] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [mapEl, setMapEl] = useState<HTMLElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    fetch("/api/lugares")
      .then((r) => r.json())
      .then(setLugares);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCandleIcons({
        punto_desaparicion: createCandleIcon("#ef4444"),
        encuentro: createCandleIcon("#2E4739"),
        homenaje: createCandleIcon("#B2916F"),
      });
    }
  }, []);

  const filtered =
    tipoFilter === "all"
      ? lugares
      : lugares.filter((l) => l.tipo === tipoFilter);

  const selectedLugar = selectedId
    ? (lugares.find((l) => l.id === selectedId) ?? null)
    : null;

  const iconsReady =
    typeof window !== "undefined" && Object.keys(candleIcons).length > 0;

  const handleSelect = (lugar: Lugar) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSelectedId(lugar.id);
    setFlyTarget({ lat: Number(lugar.latitud), lng: Number(lugar.longitud) });
    timerRef.current = setTimeout(() => setSelectedId(null), 3000);
  };

  const handleClose = () => {
    setSelectedId(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // shared card style
  const card = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: "#fff",
    borderRadius: 18,
    border: "1px solid rgba(46,71,57,0.10)",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    ...extra,
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #F6F3ED, #FFFDF8)",
        fontFamily: "Sora, sans-serif",
      }}
    >
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      {/*
        IMAGEN DE FONDO: Reemplaza la URL de abajo con tu propia imagen.
        Recomendado: foto del paisaje de Samaná, Caldas o relacionada con
        memoria histórica. Dimensiones ideales: 1600x600px o más.
      */}
      <section
        style={{
          position: "relative",
          color: "#fff",
          padding: "100px 24px",
          textAlign: "center",
          overflow: "hidden",
          // ── Imagen de fondo ──────────────────────────────────────────────
          backgroundImage: `url("https://portalhistorico.unidadvictimas.gov.co/sites/default/files/styles/slide_700_350/public/ug3.jpg?itok=r9uegxQR")`,
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay oscuro para legibilidad del texto */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(20,38,28,0.72) 0%, rgba(46,71,57,0.80) 100%)",
            zIndex: 0,
          }}
        />

        {/* Contenido sobre el overlay */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 860,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <svg width="56" height="80" viewBox="0 0 28 44" aria-hidden="true">
              <rect
                x="8"
                y="18"
                width="12"
                height="22"
                rx="3"
                fill="#fff"
                opacity="0.85"
              />
              <ellipse
                cx="14"
                cy="40"
                rx="7"
                ry="2.5"
                fill="#fff"
                opacity="0.4"
              />
              <line
                x1="14"
                y1="8"
                x2="14"
                y2="18"
                stroke="#f0c070"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <ellipse
                cx="14"
                cy="10"
                rx="7"
                ry="9"
                fill="#FFCC00"
                opacity="0.25"
              />
              <path
                d="M14 2 C10 6 9 10 11 13 C12.5 15.5 15.5 15.5 17 13 C19 10 18 6 14 2Z"
                fill="#FFCC00"
                opacity="0.9"
              />
              <path
                d="M14 5 C12.5 8 12 10.5 13 12 C13.5 13 14.5 13 15 12 C16 10.5 15.5 8 14 5Z"
                fill="white"
                opacity="0.7"
              />
            </svg>
          </div>
          <h1
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 800,
              margin: "0 0 16px",
              textShadow: "0 2px 12px rgba(0,0,0,0.4)",
            }}
          >
            {language === "es" ? "Mapa de Memoria" : "Memory Map"}
          </h1>
          <p
            style={{
              fontSize: 20,
              opacity: 0.92,
              maxWidth: 680,
              margin: "0 auto",
              textShadow: "0 1px 6px rgba(0,0,0,0.3)",
            }}
          >
            {language === "es"
              ? "Cada lugar guarda una historia. Cada vela, una presencia. Explora los sitios que preservan la memoria de las víctimas en Samaná, Caldas."
              : "Every place holds a story. Every candle, a presence. Explore the sites that preserve the memory of victims in Samaná, Caldas."}
          </p>
        </div>
      </section>

      {/* ── TIPO CARDS ───────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "48px 24px",
          borderBottom: "1px solid rgba(46,71,57,0.10)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              fontFamily: "Fraunces, Georgia, serif",
              fontSize: 30,
              fontWeight: 700,
              color: "#2E4739",
              marginBottom: 32,
            }}
          >
            {language === "es"
              ? "Tipos de lugares de memoria"
              : "Types of memory places"}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))",
              gap: 20,
            }}
          >
            {[
              {
                tipo: "punto_desaparicion",
                Icon: AlertTriangle,
                desc:
                  language === "es"
                    ? "Lugares donde ocurrieron desapariciones forzadas durante el conflicto armado."
                    : "Places where forced disappearances occurred during the armed conflict.",
              },
              {
                tipo: "encuentro",
                Icon: Search,
                desc:
                  language === "es"
                    ? "Lugares donde las personas se reúnen para conversar, reflexionar o construir memoria colectiva."
                    : "Places where people gather to talk, reflect, or build collective memory.",
              },
              {
                tipo: "homenaje",
                Icon: Landmark,
                desc:
                  language === "es"
                    ? "Espacios de memoria creados para dignificar a las víctimas."
                    : "Memory spaces created to dignify victims.",
              },
            ].map(({ tipo, Icon, desc }) => {
              const cfg = TYPE_CONFIG[tipo];
              return (
                <div
                  key={tipo}
                  style={{ ...card(), padding: 24, textAlign: "center" }}
                >
                  <Icon
                    size={32}
                    style={{ color: cfg.hex, margin: "0 auto 12px" }}
                  />
                  <h3
                    style={{
                      fontFamily: "Fraunces, Georgia, serif",
                      fontSize: 18,
                      fontWeight: 700,
                      marginBottom: 8,
                      color: "#111",
                    }}
                  >
                    {language === "es" ? cfg.label : cfg.labelEn}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: "#666",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MAP + SIDEBAR ────────────────────────────────────────────────── */}
      <section style={{ padding: "48px 24px 48px 16px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,280px) minmax(0,1fr)",
              gap: 20,
              alignItems: "stretch",
            }}
          >
            {/* ── SIDEBAR ───────────────────────────────────────────── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Filter card */}
              <div style={{ ...card(), padding: 24 }}>
                <h3
                  style={{
                    fontFamily: "Fraunces, Georgia, serif",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#2E4739",
                    margin: "0 0 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Filter size={18} style={{ color: "#B2916F" }} />
                  {language === "es" ? "Filtrar por tipo" : "Filter by type"}
                </h3>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {(
                    [
                      {
                        key: "all",
                        label:
                          language === "es"
                            ? "Todos los lugares"
                            : "All places",
                        dot: null,
                      },
                      { key: "punto_desaparicion", dot: "#ef4444" },
                      { key: "encuentro", dot: "#2E4739" },
                      { key: "homenaje", dot: "#B2916F" },
                    ] as { key: string; label?: string; dot: string | null }[]
                  ).map(({ key, dot }) => {
                    const cfg = TYPE_CONFIG[key];
                    const label =
                      key === "all"
                        ? language === "es"
                          ? "Todos los lugares"
                          : "All places"
                        : language === "es"
                          ? cfg.label
                          : cfg.labelEn;
                    const active = tipoFilter === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setTipoFilter(key)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          width: "100%",
                          padding: "9px 14px",
                          borderRadius: 10,
                          border: active
                            ? "none"
                            : "1px solid rgba(46,71,57,0.15)",
                          background: active ? "#2E4739" : "#fff",
                          color: active ? "#fff" : "#333",
                          fontFamily: "Sora, sans-serif",
                          fontSize: 14,
                          fontWeight: 500,
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.15s",
                        }}
                      >
                        {dot && (
                          <div
                            style={{
                              width: 11,
                              height: 11,
                              borderRadius: "50%",
                              background: dot,
                              flexShrink: 0,
                            }}
                          />
                        )}
                        {label}
                      </button>
                    );
                  })}
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: "#999",
                    marginTop: 12,
                    marginBottom: 0,
                  }}
                >
                  {language === "es" ? "Mostrando" : "Showing"}{" "}
                  {filtered.length} {language === "es" ? "lugares" : "places"}
                </p>
              </div>

              {/* Place list */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  maxHeight: 420,
                  overflowY: "auto",
                  paddingRight: 2,
                }}
              >
                {filtered.map((lugar) => {
                  const cfg =
                    TYPE_CONFIG[lugar.tipo as keyof typeof TYPE_CONFIG] ??
                    TYPE_CONFIG.homenaje;
                  const active = selectedId === lugar.id;
                  return (
                    <button
                      key={lugar.id}
                      onClick={() => handleSelect(lugar)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        background: active ? "#fdfaf6" : "#fff",
                        borderRadius: 14,
                        border: `2px solid ${active ? cfg.hex : "rgba(46,71,57,0.08)"}`,
                        padding: "14px 16px",
                        boxShadow: active
                          ? `0 4px 20px ${cfg.bg}`
                          : "0 1px 4px rgba(0,0,0,0.05)",
                        cursor: "pointer",
                        transition: "all 0.18s ease",
                      }}
                    >
                      {/* left accent bar */}
                      <div
                        style={{
                          display: "flex",
                          gap: 12,
                          alignItems: "stretch",
                        }}
                      >
                        <div
                          style={{
                            width: 3,
                            borderRadius: 4,
                            background: active
                              ? cfg.hex
                              : "rgba(46,71,57,0.15)",
                            flexShrink: 0,
                            transition: "background 0.18s",
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              justifyContent: "space-between",
                              gap: 6,
                            }}
                          >
                            <p
                              style={{
                                fontFamily: "Fraunces, Georgia, serif",
                                fontSize: 15,
                                fontWeight: 400,
                                color: "#1a1a1a",
                                margin: 0,
                                lineHeight: 1.3,
                                letterSpacing: "-0.01em",
                              }}
                            >
                              {lugar.nombre}
                            </p>
                            <MapPin
                              size={15}
                              style={{
                                color: cfg.hex,
                                flexShrink: 0,
                                marginTop: 2,
                                opacity: active ? 1 : 0.5,
                              }}
                            />
                          </div>
                          <span
                            style={{
                              display: "inline-block",
                              marginTop: 5,
                              fontSize: 10,
                              fontWeight: 700,
                              padding: "2px 8px",
                              borderRadius: 999,
                              background: cfg.bg,
                              color: cfg.text,
                              textTransform: "uppercase",
                              letterSpacing: "0.07em",
                              fontFamily: "Sora, sans-serif",
                            }}
                          >
                            {language === "es" ? cfg.label : cfg.labelEn}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
                {filtered.length === 0 && (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#aaa",
                      fontSize: 14,
                      padding: "24px 0",
                    }}
                  >
                    {language === "es"
                      ? "No hay lugares para mostrar."
                      : "No places to show."}
                  </p>
                )}
              </div>
            </div>

            {/* ── MAP ───────────────────────────────────────────────── */}
            <div
              style={{
                borderRadius: 20,
                overflow: "hidden",
                border: "1px solid rgba(46,71,57,0.12)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
                position: "relative",
                height: "100%",
                minHeight: 500,
              }}
            >
              {iconsReady ? (
                <MapContainer
                  center={[5.54127, -74.99313]}
                  zoom={10}
                  scrollWheelZoom
                  style={{ height: "100%", width: "100%", zIndex: 0 }}
                >
                  <MapReadyListener
                    mapRef={mapRef}
                    onReady={(map) => setMapEl(map.getContainer())}
                  />
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Samaná municipal boundary */}
                  <GeoJSON
                    key="samana-boundary"
                    data={SAMANA_GEOJSON as any}
                    style={() => SAMANA_STYLE}
                  />

                  <FlyToController target={flyTarget} mapRef={mapRef} />

                  {filtered.map((lugar) => {
                    const icon =
                      candleIcons[lugar.tipo as keyof typeof candleIcons] ??
                      candleIcons.homenaje;
                    return (
                      <Marker
                        key={lugar.id}
                        position={[
                          Number(lugar.latitud),
                          Number(lugar.longitud),
                        ]}
                        icon={icon}
                        eventHandlers={{ click: () => handleSelect(lugar) }}
                      />
                    );
                  })}

                  {selectedLugar && mapEl && mapRef.current && (
                    <FloatingPopup
                      lugar={selectedLugar}
                      mapInstance={mapRef.current}
                      mapEl={mapEl}
                      onClose={handleClose}
                      language={language}
                    />
                  )}
                </MapContainer>
              ) : (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#999",
                    fontSize: 14,
                  }}
                >
                  {language === "es" ? "Cargando mapa…" : "Loading map…"}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
