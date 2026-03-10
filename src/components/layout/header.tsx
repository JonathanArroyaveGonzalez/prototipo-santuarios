"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { Globe, Heart, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function Header() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsAuthenticated(!!sessionStorage.getItem("authenticated"));
  }, [pathname]);

  const navItems = [
    { href: "/", label: t.nav.home },
    { href: "/victimas", label: t.nav.victims },
    { href: "/mapa", label: t.nav.memoryMap },
    { href: "/eventos", label: t.nav.events },
    { href: "/recorrido-virtual", label: t.nav.virtualTour },
    { href: "/testimonios", label: t.nav.testimonies },
    { href: "/about", label: t.nav.about },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[#2D4336]/95 backdrop-blur-md shadow-lg"
          : "bg-[#2D4336] shadow-md",
      )}
      style={{
        borderBottom: `1px solid rgba(178, 145, 111, ${scrolled ? "0.2" : "0.15"})`,
      }}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 py-2 sm:py-2.5">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#B2916F] to-[#9a7d5f] shadow-md ring-1 ring-white/20 sm:h-9 sm:w-9"
              aria-label="Ir al inicio"
            >
              <Heart className="h-5 w-5 text-white" fill="currentColor" />
            </Link>

            <div className="hidden lg:flex lg:min-w-0 lg:items-center lg:gap-4">
              <Link
                href="/"
                className="flex items-baseline gap-2 border-r border-white/20 pr-4"
              >
                <h1 className="font-serif text-lg leading-none tracking-[0.02em] text-[#f5efe3] xl:text-xl">
                  Santuarios
                </h1>
                <p className="text-[10px] uppercase leading-none tracking-[0.2em] text-[#d5c6b0]/90">
                  Samaná, Caldas
                </p>
              </Link>

              <div className="flex min-w-0 items-center gap-3 xl:gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative whitespace-nowrap py-1 text-xs font-medium tracking-[0.01em] text-[#f2efe7]/90 transition-colors duration-300 hover:text-[#d4b488]",
                      isActive(item.href) ? "text-[#f7f3ea]" : "",
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "pointer-events-none absolute inset-x-0 -bottom-px mx-auto h-px w-0 bg-[#d1b08a]/70 opacity-0 transition-all duration-300",
                        isActive(item.href) ? "w-full opacity-100" : "",
                      )}
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="hidden lg:flex lg:items-center lg:gap-2">
              <button
                onClick={() => setLanguage(language === "es" ? "en" : "es")}
                className="flex h-8 items-center gap-1 rounded-md bg-white/10 px-2.5 text-[11px] font-medium text-white transition hover:bg-white/20"
              >
                <Globe className="h-3.5 w-3.5" />
                {language.toUpperCase()}
              </button>
              <Link href={isAuthenticated ? "/dashboard" : "/login"}>
                <Button className="h-8 rounded-md border border-white/20 bg-[#B2916F] px-3 text-xs text-white shadow-sm transition-all duration-300 hover:bg-[#9a7d5f] hover:shadow-md">
                  {isAuthenticated ? t.nav.dashboard : t.nav.login}
                </Button>
              </Link>
            </div>

            <button
              type="button"
              className="lg:hidden p-2 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        <div className="pb-2 lg:hidden">
          <Link href="/" className="block text-center">
            <h1 className="font-serif text-base leading-none tracking-[0.02em] text-[#f5efe3] sm:text-lg">
              Santuarios
            </h1>
            <p className="mt-1 text-[10px] uppercase leading-none tracking-[0.2em] text-[#d5c6b0]/90">
              Samaná, Caldas
            </p>
          </Link>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden space-y-1 border-t border-white/15 bg-[#2D4336]/95 pb-4 pt-2 backdrop-blur-md">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block px-3 py-2 text-base font-medium transition-colors",
                  isActive(item.href)
                    ? "text-white bg-[#B2916F]/20 border-l-2 border-[#B2916F]"
                    : "text-white/90 hover:bg-white/10 hover:text-[#B2916F]",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setLanguage(language === "es" ? "en" : "es");
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-base font-medium text-white/90 hover:bg-white/10 hover:text-[#B2916F] transition-colors flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              {language === "es" ? "English" : "Español"}
            </button>
            <Link
              href={isAuthenticated ? "/dashboard" : "/login"}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button className="w-full mt-2 bg-[#B2916F] text-white hover:bg-[#9a7d5f]">
                {isAuthenticated ? t.nav.dashboard : t.nav.login}
              </Button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
