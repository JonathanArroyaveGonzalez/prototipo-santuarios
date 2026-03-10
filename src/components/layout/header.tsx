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

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className={cn(
      "sticky top-0 z-50 transition-all duration-500",
      scrolled ? "bg-[#2E4739]/95 backdrop-blur-md shadow-lg" : "bg-[#2E4739] shadow-md"
    )} style={{ borderBottom: `1px solid rgba(178, 145, 111, ${scrolled ? '0.2' : '0.15'})` }}>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-3 lg:flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#B2916F] to-[#9a7d5f] flex items-center justify-center shadow-lg ring-2 ring-white/20">
              <Heart className="h-6 w-6 text-white" fill="currentColor" />
            </div>
            <div className="hidden xl:block">
              <div className="font-display text-xl tracking-wide text-white whitespace-nowrap">
                Santuarios de la Memoria
              </div>
              <div className="text-xs text-white/70">Samaná, Caldas</div>
            </div>
          </Link>

          <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:gap-x-2 xl:gap-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap rounded-full px-2.5 py-1 text-sm font-medium transition-all duration-300",
                  isActive(item.href)
                    ? "text-white border-b-2 border-[#B2916F] pb-1"
                    : "text-white/90 hover:text-[#B2916F]"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex lg:items-center lg:gap-3 lg:flex-shrink-0">
            <button
              onClick={() => setLanguage(language === "es" ? "en" : "es")}
              className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/20"
            >
              <Globe className="h-3.5 w-3.5" />
              {language.toUpperCase()}
            </button>
            <Link href={isAuthenticated ? "/dashboard" : "/login"}>
              <Button className="ml-2 bg-[#B2916F] text-white hover:bg-[#9a7d5f] shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
                {isAuthenticated ? t.nav.dashboard : t.nav.login}
              </Button>
            </Link>
          </div>

          <button
            type="button"
            className="lg:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 pt-2 space-y-1 bg-[#2E4739]/95 backdrop-blur-md border-t border-white/15">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block px-3 py-2 text-base font-medium transition-colors",
                  isActive(item.href)
                    ? "text-white bg-[#B2916F]/20 border-l-2 border-[#B2916F]"
                    : "text-white/90 hover:bg-white/10 hover:text-[#B2916F]"
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
            <Link href={isAuthenticated ? "/dashboard" : "/login"} onClick={() => setMobileMenuOpen(false)}>
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
