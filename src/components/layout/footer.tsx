import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#2E4739] to-[#254032] text-white mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-xl mb-4 text-[#B2916F]">
              Santuarios de la Memoria
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Preservando la memoria histórica y honrando la dignidad de las
              víctimas de desaparición en Samaná, Caldas.
            </p>
          </div>
          <div>
            <h4 className="font-display text-lg mb-4 text-white">Contacto</h4>
            <p className="text-white/80 text-sm">Universidad de Caldas</p>
            <p className="text-white/80 text-sm">Proyecto PRY-335 (2025)</p>
            <p className="text-white/80 text-sm mt-2">
              <a href="mailto:laura.montoya@ucaldas.edu.co" className="hover:text-[#B2916F] transition-colors">
                laura.montoya@ucaldas.edu.co
              </a>
            </p>
          </div>
          <div>
            <h4 className="font-display text-lg mb-4 text-white">Enlaces</h4>
            <div className="space-y-2">
              <Link
                href="/victimas"
                className="block text-white/80 text-sm hover:text-[#B2916F] transition-colors"
              >
                Galería de Víctimas
              </Link>
              <Link
                href="/mapa"
                className="block text-white/80 text-sm hover:text-[#B2916F] transition-colors"
              >
                Mapa Interactivo
              </Link>
              <Link
                href="/testimonios"
                className="block text-white/80 text-sm hover:text-[#B2916F] transition-colors"
              >
                Testimonios
              </Link>
              <Link
                href="/about"
                className="block text-white/80 text-sm hover:text-[#B2916F] transition-colors"
              >
                Sobre el Proyecto
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/60">
          © 2025 Universidad de Caldas. Proyecto PRY-335. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
