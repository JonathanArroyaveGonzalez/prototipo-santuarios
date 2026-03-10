"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

export function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-gradient-to-br from-[#2E4739] to-[#254032] text-white mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-xl mb-4 text-[#B2916F]">
              {t.footer.title}
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              {t.footer.description}
            </p>
          </div>
          <div>
            <h4 className="font-display text-lg mb-4 text-white">{t.footer.contact}</h4>
            <p className="text-white/80 text-sm">{t.footer.university}</p>
            <p className="text-white/80 text-sm">{t.footer.project}</p>
            <p className="text-white/80 text-sm mt-2">
              <a href="mailto:laura.montoya@ucaldas.edu.co" className="hover:text-[#B2916F] transition-colors">
                laura.montoya@ucaldas.edu.co
              </a>
            </p>
          </div>
          <div>
            <h4 className="font-display text-lg mb-4 text-white">{t.footer.links}</h4>
            <div className="space-y-2">
              <Link
                href="/victimas"
                className="block text-white/80 text-sm hover:text-[#B2916F] transition-colors"
              >
                {t.footer.victimsGallery}
              </Link>
              <Link
                href="/mapa"
                className="block text-white/80 text-sm hover:text-[#B2916F] transition-colors"
              >
                {t.footer.interactiveMap}
              </Link>
              <Link
                href="/testimonios"
                className="block text-white/80 text-sm hover:text-[#B2916F] transition-colors"
              >
                {t.nav.testimonies}
              </Link>
              <Link
                href="/about"
                className="block text-white/80 text-sm hover:text-[#B2916F] transition-colors"
              >
                {t.nav.about}
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/60">
          {t.footer.copyright}
        </div>
      </div>
    </footer>
  );
}
