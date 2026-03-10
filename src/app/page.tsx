"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
};

type GardenSlot = {
  id: number;
  victimId: number | null;
  showPortrait: boolean;
};

let introShownInCurrentRuntime = false;

const GARDEN_SLOTS = 12;
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

function buildPortraitData(victim: VictimaLite) {
  const initials =
    `${victim.nombres?.charAt(0) ?? ""}${victim.apellidos?.charAt(0) ?? ""}`.toUpperCase();
  const fullName = `${victim.nombres} ${victim.apellidos}`;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 280 280'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='#1f3e34'/>
        <stop offset='100%' stop-color='#b2916f'/>
      </linearGradient>
    </defs>
    <rect width='100%' height='100%' fill='url(#g)' />
    <circle cx='140' cy='120' r='64' fill='rgba(255,255,255,0.18)' />
    <text x='140' y='139' text-anchor='middle' fill='#fffdf6' font-size='58' font-family='Georgia, serif'>${initials}</text>
    <rect x='24' y='210' width='232' height='44' rx='10' fill='rgba(12,20,16,0.38)' />
    <text x='140' y='238' text-anchor='middle' fill='#f9efe1' font-size='16' font-family='Arial, sans-serif'>${fullName}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
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
  const [gardenSlots, setGardenSlots] = useState<GardenSlot[]>(
    Array.from({ length: GARDEN_SLOTS }, (_, idx) => ({
      id: idx,
      victimId: null,
      showPortrait: false,
    })),
  );

  const victimMap = useMemo(
    () => new Map(victims.map((victim) => [victim.id, victim])),
    [victims],
  );

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
    if (!victims.length) return;

    setGardenSlots(
      Array.from({ length: GARDEN_SLOTS }, (_, idx) => {
        const randomVictim =
          victims[Math.floor(Math.random() * victims.length)];
        return {
          id: idx,
          victimId: randomVictim.id,
          showPortrait: Math.random() > 0.35,
        };
      }),
    );
  }, [victims]);

  useEffect(() => {
    if (!victims.length) return;

    const timer = setInterval(() => {
      setGardenSlots((prev) => {
        const next = [...prev];
        const changes = 1 + Math.floor(Math.random() * 2);

        for (let i = 0; i < changes; i += 1) {
          const slotIndex = Math.floor(Math.random() * next.length);
          const randomVictim =
            victims[Math.floor(Math.random() * victims.length)];
          next[slotIndex] = {
            ...next[slotIndex],
            victimId: randomVictim.id,
            showPortrait: Math.random() > 0.28,
          };
        }

        return next;
      });
    }, 1900);

    return () => clearInterval(timer);
  }, [victims]);

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
              Santuario Digital
            </h1>

            <p className="memorial-hero-subtitle mx-auto mt-5 max-w-3xl text-base leading-relaxed sm:text-xl">
              Un espacio sagrado para honrar la memoria,
              <br className="hidden sm:block" />
              celebrar la vida y encontrar esperanza
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
        <section data-reveal className="mt-12 grid gap-6 sm:grid-cols-3">
          <Card className="stagger-item">
            <CardHeader>
              <p className="text-xs uppercase tracking-[0.14em] text-[#8f614d]">
                {t.home.victimsRegistered}
              </p>
              <CardTitle className="mt-2 text-4xl font-bold text-[var(--brand-strong)]">
                {stats.victimas}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-soft text-sm">{t.home.documentsDesc}</p>
            </CardContent>
          </Card>

          <Card className="stagger-item">
            <CardHeader>
              <p className="text-xs uppercase tracking-[0.14em] text-[#8f614d]">
                {t.home.testimonies}
              </p>
              <CardTitle className="mt-2 text-4xl font-bold text-[var(--brand-strong)]">
                {stats.testimonios}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-soft text-sm">{t.home.familyDesc}</p>
            </CardContent>
          </Card>

          <Card className="stagger-item">
            <CardHeader>
              <p className="text-xs uppercase tracking-[0.14em] text-[#8f614d]">
                {t.home.memoryPlaces}
              </p>
              <CardTitle className="mt-2 text-4xl font-bold text-[var(--brand-strong)]">
                {stats.lugares}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-soft text-sm">{t.home.sitesDesc}</p>
            </CardContent>
          </Card>
        </section>

        <section
          data-reveal
          className="garden-section mt-16 rounded-3xl p-8 sm:p-12"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#8f614d]">
                Memoria viva
              </p>
              <h2 className="section-title mt-2 text-3xl sm:text-4xl">
                {t.home.gardenTitle}
              </h2>
            </div>
            <p className="text-soft max-w-xl text-sm sm:text-right sm:text-base">
              {t.home.gardenHint}
            </p>
          </div>

          <p className="text-soft mt-4 max-w-3xl leading-relaxed">
            {t.home.gardenSubtitle}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {gardenSlots.map((slot) => {
              const victim = slot.victimId
                ? victimMap.get(slot.victimId)
                : null;
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => victim && setSelectedVictim(victim)}
                  className="garden-tile"
                  aria-label={
                    victim
                      ? `${victim.nombres} ${victim.apellidos}`
                      : "Vela conmemorativa"
                  }
                >
                  <div
                    className={`garden-tile-inner ${slot.showPortrait && victim ? "show-portrait" : "show-candle"}`}
                  >
                    {slot.showPortrait && victim ? (
                      <img
                        src={buildPortraitData(victim)}
                        alt={`${victim.nombres} ${victim.apellidos}`}
                        className="garden-portrait"
                      />
                    ) : (
                      <div className="garden-candle" aria-hidden="true">
                        🕯️
                      </div>
                    )}
                  </div>
                  <div className="garden-tile-overlay" />
                </button>
              );
            })}
          </div>
        </section>

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
          <div className="garden-modal-card">
            <button
              type="button"
              className="garden-modal-close"
              onClick={() => setSelectedVictim(null)}
            >
              {t.home.close}
            </button>

            <img
              src={buildPortraitData(selectedVictim)}
              alt={`${selectedVictim.nombres} ${selectedVictim.apellidos}`}
              className="garden-modal-image"
            />

            <h3 className="section-title mt-5 text-3xl">
              {selectedVictim.nombres} {selectedVictim.apellidos}
            </h3>

            <div className="mt-5 space-y-2 text-sm text-[#4d5b52]">
              <p>
                <strong>{t.home.gardenModalMunicipality}:</strong>{" "}
                {selectedVictim.municipio || "-"}
              </p>
              <p>
                <strong>{t.home.gardenModalDepartment}:</strong>{" "}
                {selectedVictim.departamento || "-"}
              </p>
              <p>
                <strong>{t.home.gardenModalDisappearance}:</strong>{" "}
                {formatDate(selectedVictim.fecha_desaparicion)}
              </p>
              <p>
                <strong>{t.home.gardenModalStatus}:</strong>{" "}
                {selectedVictim.estado_busqueda || "-"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
