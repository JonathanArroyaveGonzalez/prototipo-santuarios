"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Flower2, Flame, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";

type Stats = {
  victimas: number;
  testimonios: number;
  lugares: number;
};

type VictimaLite = {
  id: number;
  nombres: string;
  apellidos: string;
  municipio: string;
  departamento: string;
  fecha_desaparicion?: string | null;
  estado_busqueda?: string;
  foto_url?: string | null;
};

let introShownInCurrentRuntime = false;

const WALL_COLUMNS = 12;
const WALL_ROWS = 4;
const WALL_VISIBLE_TILES = WALL_COLUMNS * WALL_ROWS;
const HERO_FLOATING_ORBS = [
  { left: "5%", delay: "0s", duration: "11.2s", size: 12 },
  { left: "11%", delay: "1.1s", duration: "10.1s", size: 8 },
  { left: "18%", delay: "2.2s", duration: "12.3s", size: 13 },
  { left: "27%", delay: "0.6s", duration: "10.9s", size: 10 },
  { left: "36%", delay: "2.7s", duration: "13.5s", size: 14 },
  { left: "45%", delay: "1.5s", duration: "11.4s", size: 9 },
  { left: "54%", delay: "0.4s", duration: "12.1s", size: 12 },
  { left: "62%", delay: "2.1s", duration: "13.1s", size: 10 },
  { left: "70%", delay: "1.8s", duration: "10.8s", size: 9 },
  { left: "78%", delay: "2.9s", duration: "13.8s", size: 15 },
  { left: "86%", delay: "0.9s", duration: "11.7s", size: 11 },
  { left: "93%", delay: "1.7s", duration: "10.5s", size: 8 },
];

function getVictimPhoto(victim: VictimaLite) {
  const candidate = victim.foto_url?.trim();
  return candidate && candidate.length > 0 ? candidate : null;
}

function shuffleWithSeed<T>(items: T[], seed: number) {
  const next = [...items];
  let state = (seed || 1) >>> 0;
  const random = () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }

  return next;
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function AnimatedCount({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 1300;
    let frameId = 0;
    const startedAt = performance.now();

    const tick = (timestamp: number) => {
      const progress = Math.min((timestamp - startedAt) / duration, 1);
      setDisplayValue(Math.round(value * progress));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [inView, value]);

  return <span ref={ref}>{displayValue.toLocaleString("es-CO")}</span>;
}

export default function Home() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<Stats>({
    victimas: 0,
    testimonios: 0,
    lugares: 0,
  });
  const [showIntroCover, setShowIntroCover] = useState(false);
  const [openingCover, setOpeningCover] = useState(false);
  const [victims, setVictims] = useState<VictimaLite[]>([]);
  const [selectedVictim, setSelectedVictim] = useState<VictimaLite | null>(
    null,
  );
  const [wallSeed, setWallSeed] = useState(1);
  const [activeStatMessage, setActiveStatMessage] = useState(0);
  const [showActiveStatMessage, setShowActiveStatMessage] = useState(true);

  const wallTiles = useMemo<Array<VictimaLite | null>>(() => {
    if (!victims.length) {
      return Array.from({ length: WALL_VISIBLE_TILES }, () => null);
    }

    const shuffled = shuffleWithSeed(victims, wallSeed);
    return Array.from({ length: WALL_VISIBLE_TILES }, (_, idx) => {
      const victimIndex = (idx * 7 + wallSeed * 5) % shuffled.length;
      return shuffled[victimIndex];
    });
  }, [victims, wallSeed]);

  const isActiveMessage = (index: number) =>
    activeStatMessage === index && showActiveStatMessage;

  useEffect(() => {
    if (!victims.length) return;
    const timer = window.setInterval(() => {
      setWallSeed((prev) => prev + 1);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [victims]);

  useEffect(() => {
    const messageFadeMs = 700;
    const messageVisibleMs = 8000;
    const messageStepMs = messageFadeMs + messageVisibleMs;
    let fadeTimer: number | undefined;

    const sequenceTimer = window.setInterval(() => {
      setShowActiveStatMessage(false);

      fadeTimer = window.setTimeout(() => {
        setActiveStatMessage((prev) => (prev + 1) % 3);
        setShowActiveStatMessage(true);
      }, messageFadeMs);
    }, messageStepMs);

    return () => {
      window.clearInterval(sequenceTimer);
      if (fadeTimer) window.clearTimeout(fadeTimer);
    };
  }, []);

  useEffect(() => {
    if (introShownInCurrentRuntime) return;

    const navigationEntry = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;

    if (navigationEntry?.type === "reload") {
      introShownInCurrentRuntime = true;
      setShowIntroCover(true);
    }
  }, []);

  useEffect(() => {
    if (!showIntroCover) return;

    const unlockCover = () => {
      setOpeningCover(true);
      window.setTimeout(() => {
        setShowIntroCover(false);
        setOpeningCover(false);
      }, 1050);
    };

    const onWheel = (event: WheelEvent) => {
      if (event.deltaY > 8 && !openingCover) {
        event.preventDefault();
        unlockCover();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (openingCover) return;
      const openKeys = ["ArrowDown", "PageDown", " ", "Enter"];
      if (openKeys.includes(event.key)) {
        event.preventDefault();
        unlockCover();
      }
    };

    let touchStartY = 0;
    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY ?? 0;
      if (touchStartY - currentY > 16 && !openingCover) {
        unlockCover();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [showIntroCover, openingCover]);

  useEffect(() => {
    Promise.all([
      fetch("/api/victimas").then((r) => r.json()),
      fetch("/api/testimonios").then((r) => r.json()),
      fetch("/api/lugares").then((r) => r.json()),
    ])
      .then(([victimas, testimonios, lugares]) => {
        setVictims(victimas);
        setStats({
          victimas: victimas.length,
          testimonios: testimonios.length,
          lugares: lugares.length,
        });
      })
      .catch(() => {
        // Silently handle errors
      });
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      {showIntroCover && (
        <div className={`home-intro-cover ${openingCover ? "is-opening" : ""}`}>
          <div className="home-intro-left" />
          <div className="home-intro-right" />
          <div className="home-intro-overlay" />
          <div className="home-intro-hint" aria-live="polite">
            <p className="home-intro-hint-label">Desliza</p>
            <div className="home-intro-swipe" aria-hidden="true">
              <span className="home-intro-hint-icon">⌄</span>
              <span className="home-intro-hint-icon is-second">⌄</span>
            </div>
          </div>
        </div>
      )}

      <section
        className={`hero-appear memorial-hero relative isolate min-h-[100svh] w-full overflow-hidden transition-opacity duration-700 ${showIntroCover ? "opacity-0" : "opacity-100"}`}
      >
        <div className="memorial-hero-atmosphere" aria-hidden="true" />
        <div className="memorial-hero-orbs" aria-hidden="true">
          {HERO_FLOATING_ORBS.map((orb, idx) => (
            <span
              key={idx}
              className="memorial-hero-orb"
              style={{
                left: orb.left,
                bottom: "-8%",
                width: `${orb.size}px`,
                height: `${orb.size}px`,
                animationDelay: orb.delay,
                animationDuration: orb.duration,
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center">
          <div className="mx-auto max-w-4xl">
            <h1 className="memorial-hero-title text-4xl leading-tight sm:text-6xl">
              {t.home.heroTitle}
            </h1>

            <p className="memorial-hero-subtitle mx-auto mt-5 max-w-3xl text-base leading-relaxed sm:text-xl">
              {t.home.heroSubtitleLine1}
              <br className="hidden sm:block" />
              {t.home.heroSubtitleLine2}
            </p>

            <div className="home-light-wall" aria-hidden="true">
              {Array.from({ length: 13 }).map((_, idx) => (
                <span key={idx} className="home-light-candle" />
              ))}
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/victimas">
                <Button size="lg" className="home-hero-btn home-hero-btn-ghost">
                  {t.home.exploreVictims}
                </Button>
              </Link>
              <Link href="/mapa">
                <Button size="lg" className="home-hero-btn home-hero-btn-ghost">
                  {t.home.viewMap}
                </Button>
              </Link>
              <Link href="/recorrido-virtual">
                <Button
                  size="lg"
                  className="home-hero-btn home-hero-btn-accent"
                >
                  {t.home.virtualTourCta}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main
        className={`mx-auto w-full max-w-7xl px-4 py-12 transition-opacity duration-700 sm:px-8 ${showIntroCover ? "opacity-0" : "opacity-100"}`}
      >
        <section data-reveal className="mt-12">
          <div className="meaning-layout w-full rounded-3xl">
            <aside className="reflection-card reflection-card-light">
              <h3 className="reflection-title">{t.home.reflectionTitle}</h3>
              <p className="reflection-highlight">"{t.home.reflectionQuote}"</p>
              <p>{t.home.reflectionBody1}</p>
              <p>{t.home.reflectionBody2}</p>
              <p className="reflection-closing">{t.home.reflectionClosing}</p>
            </aside>

            <section className="meaning-stats w-full rounded-3xl p-6 sm:p-10">
              <div className="meaning-stats-grid">
                <article className="meaning-stat-card group">
                  <div className="meaning-stat-icon-wrap">
                    <Heart className="h-6 w-6" fill="currentColor" />
                  </div>
                  <p className="meaning-stat-label">
                    {t.home.victimsRegistered}
                  </p>
                  <p className="meaning-stat-number">
                    <AnimatedCount value={stats.victimas} />
                  </p>
                  <p
                    className={`meaning-stat-hover speech-bubble ${activeStatMessage === 0 && showActiveStatMessage ? "is-active" : ""}`}
                    style={{
                      opacity: isActiveMessage(0) ? 1 : 0,
                      transform: isActiveMessage(0)
                        ? "translateY(0)"
                        : "translateY(4px)",
                    }}
                  >
                    {t.home.statMessageVictims}
                  </p>
                </article>

                <article className="meaning-stat-card group">
                  <div className="meaning-stat-icon-wrap">
                    <Flower2 className="h-6 w-6" />
                  </div>
                  <p className="meaning-stat-label">
                    {t.home.testimoniesShared}
                  </p>
                  <p className="meaning-stat-number">
                    <AnimatedCount value={stats.testimonios} />
                  </p>
                  <p
                    className={`meaning-stat-hover speech-bubble ${activeStatMessage === 1 && showActiveStatMessage ? "is-active" : ""}`}
                    style={{
                      opacity: isActiveMessage(1) ? 1 : 0,
                      transform: isActiveMessage(1)
                        ? "translateY(0)"
                        : "translateY(4px)",
                    }}
                  >
                    {t.home.statMessageTestimonies}
                  </p>
                </article>

                <article className="meaning-stat-card group">
                  <div className="meaning-stat-icon-wrap">
                    <Flame className="h-6 w-6" />
                  </div>
                  <p className="meaning-stat-label">
                    {t.home.geoReferencedFacts}
                  </p>
                  <p className="meaning-stat-number">
                    <AnimatedCount value={stats.lugares} />
                  </p>
                  <p
                    className={`meaning-stat-hover speech-bubble ${activeStatMessage === 2 && showActiveStatMessage ? "is-active" : ""}`}
                    style={{
                      opacity: isActiveMessage(2) ? 1 : 0,
                      transform: isActiveMessage(2)
                        ? "translateY(0)"
                        : "translateY(4px)",
                    }}
                  >
                    {t.home.statMessagePlaces}
                  </p>
                </article>
              </div>
            </section>
          </div>
        </section>
      </main>

      <section
        data-reveal
        className="light-wall-section mt-16 w-full px-3 py-10 sm:px-5 sm:py-14"
      >
        <div className="mx-auto w-full max-w-[1700px] light-wall-layout">
          <div className="light-wall-main">
            <div className="text-center">
              <div className="light-wall-icon" aria-hidden="true">
                ◌
              </div>
              <h2 className="light-wall-title text-4xl sm:text-5xl">
                {t.home.lightWallTitle}
              </h2>
              <p className="light-wall-subtitle mx-auto mt-4 max-w-3xl text-base sm:text-lg">
                {t.home.lightWallSubtitle}
              </p>
            </div>

            <div className="soul-cloud mt-8 w-full">
              {wallTiles.map((victim, idx) => {
                const fullName = victim
                  ? `${victim.nombres} ${victim.apellidos}`
                  : t.home.memorialSpace;
                const candleDuration = 1.2 + (idx % 9) * 0.22;
                const candleDelay = (idx % 17) * 0.09;

                return (
                  <motion.button
                    key={victim ? `${victim.id}-${idx}` : `placeholder-${idx}`}
                    type="button"
                    onClick={() => victim && setSelectedVictim(victim)}
                    className={`soul-tile ${victim ? "" : "is-empty"}`}
                    disabled={!victim}
                    aria-label={`${t.home.openTributeLabel} ${fullName}`}
                    whileHover={victim ? { y: -2, scale: 1.08 } : undefined}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    <div className="soul-tile-media">
                      <motion.span
                        className="soul-candle"
                        aria-hidden="true"
                        animate={{
                          opacity: [0.35, 0.96, 0.52, 0.88],
                          scale: [1, 1.12, 0.94, 1],
                        }}
                        transition={{
                          duration: candleDuration,
                          delay: candleDelay,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        🕯
                      </motion.span>
                      {victim && (
                        <span className="soul-tooltip">{fullName}</span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <p className="light-wall-quote mt-10">"{t.home.lightWallQuote}"</p>
          </div>
        </div>
      </section>

      <main
        className={`mx-auto w-full max-w-7xl px-4 py-12 sm:px-8 ${showIntroCover ? "opacity-0" : "opacity-100"}`}
      >
        <section
          data-reveal
          className="mt-16 surface-panel rounded-3xl p-8 sm:p-12"
        >
          <h2 className="section-title text-3xl sm:text-4xl">
            {t.home.projectTitle}
          </h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <div>
              <p className="text-soft leading-relaxed">
                {t.home.projectDesc1} <strong>{t.home.projectName}</strong>{" "}
                {t.home.projectDesc2}
              </p>
              <p className="text-soft mt-4 leading-relaxed">
                {t.home.projectDesc3}
              </p>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl border border-[var(--line)] bg-white p-4">
                <h3 className="font-semibold text-[var(--brand-strong)]">
                  {t.home.coordination}
                </h3>
                <p className="text-soft text-sm mt-1">
                  {t.home.coordinationText}
                </p>
              </div>
              <div className="rounded-xl border border-[var(--line)] bg-white p-4">
                <h3 className="font-semibold text-[var(--brand-strong)]">
                  {t.home.duration}
                </h3>
                <p className="text-soft text-sm mt-1">{t.home.durationText}</p>
              </div>
              <div className="rounded-xl border border-[var(--line)] bg-white p-4">
                <h3 className="font-semibold text-[var(--brand-strong)]">
                  {t.home.population}
                </h3>
                <p className="text-soft text-sm mt-1">
                  {t.home.populationText}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <Link href="/about">
              <Button variant="accent">{t.home.learnMore}</Button>
            </Link>
          </div>
        </section>

        <section data-reveal className="mt-16 text-center">
          <h2 className="section-title text-2xl sm:text-3xl">
            {t.home.contribute}
          </h2>
          <p className="text-soft mx-auto mt-4 max-w-2xl">
            {t.home.contributeDesc}
          </p>
          <div className="mt-6">
            <Link href="/dashboard">
              <Button size="lg" variant="accent">
                {t.home.accessSystem}
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {selectedVictim && (
        <div className="garden-modal-backdrop" role="dialog" aria-modal="true">
          <div className="tribute-modal-card">
            <div className="tribute-modal-media">
              {getVictimPhoto(selectedVictim) ? (
                <img
                  src={getVictimPhoto(selectedVictim) as string}
                  alt={`${selectedVictim.nombres} ${selectedVictim.apellidos}`}
                  className="tribute-modal-image"
                />
              ) : (
                <div className="tribute-modal-placeholder" aria-hidden="true" />
              )}
              <div className="tribute-modal-media-glow" aria-hidden="true" />
            </div>

            <div className="tribute-modal-content">
              <button
                type="button"
                className="garden-modal-close"
                onClick={() => setSelectedVictim(null)}
              >
                {t.home.close}
              </button>

              <h3 className="tribute-modal-title">
                {selectedVictim.nombres} {selectedVictim.apellidos}
              </h3>

              <div className="tribute-museum-card mt-6">
                <div className="tribute-museum-row">
                  <span>{t.home.gardenModalMunicipality}</span>
                  <strong>{selectedVictim.municipio || "-"}</strong>
                </div>
                <div className="tribute-museum-row">
                  <span>{t.home.gardenModalDepartment}</span>
                  <strong>{selectedVictim.departamento || "-"}</strong>
                </div>
                <div className="tribute-museum-row">
                  <span>{t.home.gardenModalDisappearance}</span>
                  <strong>
                    {formatDate(selectedVictim.fecha_desaparicion)}
                  </strong>
                </div>
                <div className="tribute-museum-row">
                  <span>{t.home.gardenModalStatus}</span>
                  <strong>{selectedVictim.estado_busqueda || "-"}</strong>
                </div>
              </div>

              <p className="tribute-modal-copy mt-7">
                {t.home.tributeModalCopy}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
