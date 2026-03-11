import Link from "next/link";

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

export default function RecorridoVirtualPage() {
  return (
    <main className="min-h-screen bg-[#f3eee3] pb-10">
      <section className="relative isolate min-h-screen overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("/Fondo_Recorrido_virtual.png")',
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0.28) 0%, rgba(0, 0, 0, 0.14) 28%, rgba(0, 0, 0, 0.08) 54%, rgba(0, 0, 0, 0.18) 100%), radial-gradient(circle at 50% 38%, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.22) 72%)",
          }}
          aria-hidden="true"
        />

        <div
          className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/14 to-transparent"
          aria-hidden="true"
        />

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

        <div className="relative z-20 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 sm:px-8">
          <div className="flex flex-1 items-start justify-center pt-[16vh] text-center sm:pt-[18vh]">
            <div className="max-w-4xl">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.34em] text-[#EAD7B8] sm:text-xs">
                Santuario inmersivo
              </p>
              <h1 className="mt-5 font-serif text-5xl leading-[0.95] text-[#FDFCF0] sm:text-6xl lg:text-7xl">
                Recorrido Virtual
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-[#FDFCF0]/88 sm:text-base lg:text-xl">
                Recorre un espacio contemplativo construido para honrar la
                memoria con pausa, recogimiento y presencia. Cada gesto dentro
                del entorno 3D acompana la experiencia como un acto de homenaje.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <Link
                  href="/recorrido-virtual/index.html"
                  target="_blank"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#d8bf90] bg-transparent px-5 text-sm font-medium text-[#FDFCF0] transition duration-300 hover:bg-[#b2916f] hover:text-white sm:px-6"
                >
                  Abrir en una pestaña independiente
                </Link>
                <a
                  href="#visita-3d"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#d8bf90] bg-transparent px-5 text-sm font-medium text-[#FDFCF0] transition duration-300 hover:bg-[#b2916f] hover:text-white sm:px-6"
                >
                  Entrar a la experiencia
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-12 w-full max-w-7xl px-4 sm:px-8 lg:-mt-16">
        <div className="relative z-20 rounded-[28px] border border-[#dac7a7] bg-[linear-gradient(180deg,rgba(255,252,246,0.92),rgba(247,240,225,0.9))] p-5 shadow-[0_28px_70px_-40px_rgba(27,35,30,0.45)] backdrop-blur-xl sm:p-7">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[22px] border border-[#e6d7bf] bg-white/42 px-4 py-4 backdrop-blur-md sm:px-5">
              <p className="font-serif text-base font-semibold text-[#2e4739]">
                Experiencia Guiada
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#52655a]">
                Navega con calma, acercate a los memoriales y activa homenajes
                simbolicos dentro del espacio.
              </p>
            </div>

            <div className="rounded-[22px] border border-[#e6d7bf] bg-white/42 px-4 py-4 backdrop-blur-md sm:px-5">
              <p className="font-serif text-base font-semibold text-[#2e4739]">
                Recomendacion
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#52655a]">
                Para una visualizacion mas estable y envolvente, abre el
                recorrido en pantalla completa o en una pestaña independiente.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-6 w-full max-w-7xl px-4 sm:px-8">
        <div className="overflow-hidden rounded-[32px] border border-[#d7c2a0] bg-[#0d0f0d] shadow-[0_30px_80px_-36px_rgba(0,0,0,0.55)]">
          <iframe
            id="visita-3d"
            src="/recorrido-virtual/index.html"
            title="Recorrido virtual 3D Santuarios de la Memoria"
            className="h-[78vh] w-full lg:h-[82vh]"
            loading="lazy"
            allow="fullscreen"
          />
        </div>
      </section>
    </main>
  );
}
