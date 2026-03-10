"use client";

import { useEffect, useState } from "react";
import type { Testimonio } from "@/types";
import { useLanguage } from "@/lib/language-context";
import {
  Mic,
  Video,
  FileText,
  MapPin,
  User,
  Quote,
  Play,
  X,
  Image as ImageIcon,
} from "lucide-react";

// ─── Tipo config ──────────────────────────────────────────────────────────────
const TIPO_CONFIG: Record<
  string,
  {
    label: string;
    labelEn: string;
    Icon: typeof Mic;
    color: string;
    bg: string;
    thumbBg: string;
  }
> = {
  audio: {
    label: "Audio",
    labelEn: "Audio",
    Icon: Mic,
    color: "#2E4739",
    bg: "rgba(46,71,57,0.10)",
    thumbBg: "linear-gradient(135deg,#2E4739,#3d5a49)",
  },
  video: {
    label: "Video",
    labelEn: "Video",
    Icon: Video,
    color: "#B2916F",
    bg: "rgba(178,145,111,0.13)",
    thumbBg: "linear-gradient(135deg,#B2916F,#8a6d52)",
  },
  texto: {
    label: "Texto",
    labelEn: "Text",
    Icon: FileText,
    color: "#124a63",
    bg: "rgba(18,74,99,0.10)",
    thumbBg: "linear-gradient(135deg,#124a63,#1a6080)",
  },
  imagen: {
    label: "Imagen",
    labelEn: "Image",
    Icon: ImageIcon,
    color: "#9f3f2f",
    bg: "rgba(159,63,47,0.10)",
    thumbBg: "linear-gradient(135deg,#9f3f2f,#c04a35)",
  },
};

// ─── Popup de contenido ───────────────────────────────────────────────────────
function ContentPopup({
  testimonio,
  language,
  onClose,
}: {
  testimonio: Testimonio;
  language: string;
  onClose: () => void;
}) {
  const tipo = TIPO_CONFIG[testimonio.tipo ?? "texto"] ?? TIPO_CONFIG.texto;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(3px)",
        }}
      />
      {/* Modal */}
      <div
        style={{
          position: "relative",
          background: "#fff",
          borderRadius: 20,
          width: "100%",
          maxWidth: 640,
          maxHeight: "88vh",
          overflowY: "auto",
          boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
        }}
      >
        {/* Barra de color */}
        <div
          style={{
            height: 5,
            background: tipo.color,
            borderRadius: "20px 20px 0 0",
          }}
        />
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            padding: "20px 24px 16px",
            borderBottom: "1px solid rgba(46,71,57,0.08)",
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontSize: 24,
                fontWeight: 800,
                margin: 0,
                color: "#0d0d0d",
              }}
            >
              {testimonio.autor_nombre}
            </h3>
            {testimonio.autor_rol && (
              <p
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontSize: 14,
                  color: "#555",
                  margin: "5px 0 0",
                }}
              >
                {testimonio.autor_rol}
              </p>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 10px",
                borderRadius: 999,
                background: tipo.bg,
                color: tipo.color,
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "Sora, sans-serif",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              <tipo.Icon size={13} />
              {language === "es" ? tipo.label : tipo.labelEn}
            </span>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "none",
                background: "rgba(0,0,0,0.06)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div
          style={{
            padding: "20px 24px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Audio */}
          {testimonio.tipo === "audio" && testimonio.medios?.url && (
            <div
              style={{
                background: "rgba(46,71,57,0.05)",
                borderRadius: 14,
                padding: "16px 18px",
                border: "1px solid rgba(46,71,57,0.10)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <Mic size={15} style={{ color: "#2E4739" }} />
                <span
                  style={{
                    fontFamily: "Sora, sans-serif",
                    fontSize: 14,
                    color: "#2E4739",
                    fontWeight: 600,
                  }}
                >
                  {language === "es"
                    ? "Reproducir testimonio de voz"
                    : "Play voice testimony"}
                </span>
              </div>
              <audio controls style={{ width: "100%" }}>
                <source src={testimonio.medios.url} />
              </audio>
            </div>
          )}

          {/* Video */}
          {testimonio.tipo === "video" && testimonio.medios?.url && (
            <div
              style={{
                borderRadius: 14,
                overflow: "hidden",
                background: "#000",
              }}
            >
              <video
                controls
                style={{ width: "100%", display: "block", maxHeight: 360 }}
              >
                <source src={testimonio.medios.url} />
              </video>
            </div>
          )}

          {/* Imagen */}
          {testimonio.tipo === "imagen" && (
            <div
              style={{
                background: "rgba(159,63,47,0.04)",
                borderRadius: 14,
                padding: "18px 20px",
                border: "1px solid rgba(159,63,47,0.12)",
                position: "relative",
              }}
            >
              <ImageIcon
                size={36}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 14,
                  color: "rgba(159,63,47,0.07)",
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <ImageIcon size={16} style={{ color: "#9f3f2f" }} />
                <span
                  style={{
                    fontFamily: "Sora, sans-serif",
                    fontSize: 14,
                    color: "#9f3f2f",
                    fontWeight: 600,
                  }}
                >
                  {language === "es" ? "Documento de imagen" : "Image document"}
                </span>
              </div>
              {testimonio.medios?.url ? (
                <a
                  href={testimonio.medios.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "Sora, sans-serif",
                    fontSize: 14,
                    color: "#9f3f2f",
                    textDecoration: "underline",
                  }}
                >
                  {language === "es" ? "Abrir imagen →" : "Open image →"}
                </a>
              ) : (
                <p
                  style={{
                    fontFamily: "Fraunces, Georgia, serif",
                    fontSize: 15,
                    color: "#777",
                    fontStyle: "italic",
                    margin: 0,
                  }}
                >
                  {language === "es"
                    ? "Imagen no disponible."
                    : "Image not available."}
                </p>
              )}
            </div>
          )}

          {/* Texto */}
          {testimonio.tipo === "texto" && (
            <div
              style={{
                background: "rgba(18,74,99,0.04)",
                borderRadius: 14,
                padding: "18px 20px",
                border: "1px solid rgba(18,74,99,0.10)",
                position: "relative",
              }}
            >
              <Quote
                size={36}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 14,
                  color: "rgba(18,74,99,0.07)",
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  marginBottom: 12,
                }}
              >
                <FileText size={14} style={{ color: "#124a63" }} />
                <span
                  style={{
                    fontFamily: "Sora, sans-serif",
                    fontSize: 14,
                    color: "#124a63",
                    fontWeight: 600,
                  }}
                >
                  {language === "es"
                    ? "Testimonio escrito"
                    : "Written testimony"}
                </span>
              </div>
              {testimonio.medios?.url ? (
                <a
                  href={testimonio.medios.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "Sora, sans-serif",
                    fontSize: 15,
                    color: "#124a63",
                    textDecoration: "underline",
                    fontWeight: 500,
                  }}
                >
                  {language === "es"
                    ? "Ver documento completo →"
                    : "View full document →"}
                </a>
              ) : (
                <p
                  style={{
                    fontFamily: "Fraunces, Georgia, serif",
                    fontSize: 15,
                    color: "#555",
                    fontStyle: "italic",
                    margin: 0,
                    lineHeight: 1.7,
                  }}
                >
                  {language === "es"
                    ? "Contenido no disponible."
                    : "Content not available."}
                </p>
              )}
            </div>
          )}

          {/* Meta */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div
              style={{
                background: "rgba(178,145,111,0.07)",
                borderRadius: 12,
                padding: "12px 14px",
              }}
            >
              <p
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#888",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  margin: "0 0 5px",
                }}
              >
                {language === "es" ? "Víctima" : "Victim"}
              </p>
              <p
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontSize: 16,
                  color: "#1a1a1a",
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                {testimonio.victimas?.nombres} {testimonio.victimas?.apellidos}
              </p>
            </div>
            <div
              style={{
                background: "rgba(46,71,57,0.05)",
                borderRadius: 12,
                padding: "12px 14px",
              }}
            >
              <p
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#888",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  margin: "0 0 5px",
                }}
              >
                {language === "es" ? "Lugar" : "Place"}
              </p>
              <p
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontSize: 16,
                  color: "#1a1a1a",
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                {testimonio.lugares?.nombre}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Card de testimonio ───────────────────────────────────────────────────────
function TestimonioCard({
  testimonio,
  language,
}: {
  testimonio: Testimonio;
  language: string;
}) {
  const [popupOpen, setPopupOpen] = useState(false);
  const tipo = TIPO_CONFIG[testimonio.tipo ?? "texto"] ?? TIPO_CONFIG.texto;
  const { Icon } = tipo;

  return (
    <>
      {/* Popup */}
      {popupOpen && (
        <ContentPopup
          testimonio={testimonio}
          language={language}
          onClose={() => setPopupOpen(false)}
        />
      )}

      <article
        style={{
          background: "#fff",
          borderRadius: 20,
          overflow: "hidden",
          border: "1px solid rgba(46,71,57,0.10)",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
          transition: "box-shadow 0.2s ease, transform 0.2s ease",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
        }}
        onClick={() => setPopupOpen(true)}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow =
            "0 8px 32px rgba(46,71,57,0.14)";
          (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow =
            "0 2px 16px rgba(0,0,0,0.06)";
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        }}
      >
        {/* ── Thumbnail: siempre el mismo tamaño, con ícono del tipo ── */}
        <div
          style={{
            position: "relative",
            height: 160,
            background: tipo.thumbBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Patrón decorativo de fondo */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.06) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%)",
            }}
          />

          {/* Ícono central del tipo */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(4px)",
                border: "1.5px solid rgba(255,255,255,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon size={24} color="#fff" />
            </div>
            <span
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                color: "rgba(255,255,255,0.85)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {language === "es" ? tipo.label : tipo.labelEn}
            </span>
          </div>

          {/* Botón "Ver" */}
          <div
            style={{
              position: "absolute",
              bottom: 12,
              right: 12,
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(4px)",
              borderRadius: 999,
              padding: "5px 12px",
              display: "flex",
              alignItems: "center",
              gap: 5,
              border: "1px solid rgba(255,255,255,0.25)",
            }}
          >
            <Play size={11} color="#fff" fill="#fff" />
            <span
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 11,
                color: "#fff",
                fontWeight: 600,
              }}
            >
              {language === "es" ? "Ver" : "View"}
            </span>
          </div>
        </div>

        {/* ── Contenido de la card ── */}
        <div
          style={{
            padding: "18px 20px 20px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {/* Autor */}
          <div>
            <h3
              style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontSize: 18,
                fontWeight: 700,
                color: "#1a1a1a",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {testimonio.autor_nombre}
            </h3>
            {testimonio.autor_rol && (
              <p
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontSize: 12,
                  color: "#888",
                  margin: "4px 0 0",
                }}
              >
                {testimonio.autor_rol}
              </p>
            )}
          </div>

          <div style={{ height: 1, background: "rgba(46,71,57,0.08)" }} />

          {/* Meta */}
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <User size={13} style={{ color: "#B2916F", flexShrink: 0 }} />
              <span
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontSize: 13,
                  color: "#444",
                  fontWeight: 400,
                }}
              >
                {testimonio.victimas?.nombres} {testimonio.victimas?.apellidos}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <MapPin size={13} style={{ color: "#2E4739", flexShrink: 0 }} />
              <span
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontSize: 13,
                  color: "#444",
                  fontWeight: 400,
                }}
              >
                {testimonio.lugares?.nombre}
              </span>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TestimoniosPage() {
  const { t, language } = useLanguage();
  const [testimonios, setTestimonios] = useState<Testimonio[]>([]);
  const [tipoFilter, setTipoFilter] = useState("");

  useEffect(() => {
    fetch("/api/testimonios")
      .then((r) => {
        if (!r.ok) throw new Error("API error");
        return r.json();
      })
      .then(setTestimonios)
      .catch(() => setTestimonios([]));
  }, []);

  const filtered = tipoFilter
    ? testimonios.filter((t) => t.tipo === tipoFilter)
    : testimonios;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #F6F3ED, #FFFDF8)",
        fontFamily: "Sora, sans-serif",
      }}
    >
      {/* ── HERO ── */}
      <section
        style={{
          position: "relative",
          color: "#fff",
          padding: "100px 24px",
          textAlign: "center",
          overflow: "hidden",
          backgroundImage: `url("https://www.unidadvictimas.gov.co/sites/default/files/imagecache/galeria_580x387/galeria/gal_20140409_045.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(20,38,28,0.75) 0%, rgba(46,71,57,0.85) 100%)",
            zIndex: 0,
          }}
        />
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
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Quote size={28} color="#fff" />
            </div>
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
            {language === "es"
              ? "Testimonios de Memoria"
              : "Memory Testimonies"}
          </h1>
          <p
            style={{
              fontSize: 20,
              opacity: 0.9,
              maxWidth: 680,
              margin: "0 auto",
              textShadow: "0 1px 6px rgba(0,0,0,0.3)",
            }}
          >
            {language === "es"
              ? "Voces de familiares, sobrevivientes y comunidad que mantienen viva la memoria de las víctimas de desaparición."
              : "Voices of families, survivors and community that keep alive the memory of the victims of disappearance."}
          </p>

          {/* Stat pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginTop: 28,
              padding: "8px 20px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.25)",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <Quote size={14} color="#FFCC00" />
            {testimonios.length}{" "}
            {language === "es"
              ? "testimonios registrados"
              : "testimonies recorded"}
          </div>
        </div>
      </section>

      {/* ── FILTROS ── */}
      <section style={{ padding: "32px 24px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "1px solid rgba(46,71,57,0.10)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              padding: "18px 24px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: "#2E4739",
              }}
            >
              {language === "es" ? "Filtrar por tipo:" : "Filter by type:"}
            </span>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { key: "", label: language === "es" ? "Todos" : "All" },
                { key: "texto", label: language === "es" ? "Texto" : "Text" },
                { key: "audio", label: language === "es" ? "Audio" : "Audio" },
                { key: "video", label: language === "es" ? "Video" : "Video" },
                {
                  key: "imagen",
                  label: language === "es" ? "Imagen" : "Image",
                },
              ].map(({ key, label }) => {
                const active = tipoFilter === key;
                const cfg = key ? TIPO_CONFIG[key] : null;
                return (
                  <button
                    key={key}
                    onClick={() => setTipoFilter(key)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 14px",
                      borderRadius: 999,
                      border: "none",
                      background: active ? "#2E4739" : "rgba(46,71,57,0.07)",
                      color: active ? "#fff" : "#444",
                      fontFamily: "Sora, sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {cfg && <cfg.Icon size={12} />}
                    {label}
                  </button>
                );
              })}
            </div>
            <span
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 12,
                color: "#aaa",
                marginLeft: "auto",
              }}
            >
              {filtered.length} {language === "es" ? "resultados" : "results"}
            </span>
          </div>
        </div>
      </section>

      {/* ── GRID DE CARDS ── */}
      <section style={{ padding: "32px 24px 64px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {filtered.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: 24,
              }}
            >
              {filtered.map((testimonio) => (
                <TestimonioCard
                  key={testimonio.id}
                  testimonio={testimonio}
                  language={language}
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "80px 24px" }}>
              <Quote size={48} color="#ccc" />
              <p
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontSize: 22,
                  color: "#aaa",
                  marginTop: 16,
                }}
              >
                {language === "es"
                  ? "No hay testimonios para mostrar."
                  : "No testimonies to show."}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
