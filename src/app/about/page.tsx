"use client";

import {
  BookOpenText,
  Building2,
  Clock3,
  HandHeart,
  Scale3d,
  Sparkles,
  Users2,
  Wallet,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function AboutPage() {
  const { t } = useLanguage();

  const teamMembers = [
    {
      name: "Laura Montoya López",
      role: t.about.coordinator,
      faculty: t.about.faculty1,
      dedication: null,
    },
    {
      name: "Carolina López Giraldo",
      role: t.about.participant,
      faculty: t.about.faculty1,
      dedication: `4 ${t.about.weeklyHours}`,
    },
    {
      name: "Andrés Paolo Castaño Vélez",
      role: t.about.participant,
      faculty: t.about.faculty2,
      dedication: `4 ${t.about.weeklyHours}`,
    },
    {
      name: "Carlos Alberto Ruíz Villa",
      role: t.about.participant,
      faculty: t.about.faculty2,
      dedication: `2 ${t.about.weeklyHours}`,
    },
    {
      name: "Leo Ricardo García Sierra",
      role: `${t.about.external} · ${t.about.movice}`,
      faculty: t.about.faculty1,
      dedication: `2 ${t.about.weeklyHours}`,
    },
    {
      name: "María Lorena Echeverry García",
      role: `${t.about.external} · ${t.about.fundecos}`,
      faculty: t.about.faculty1,
      dedication: `2 ${t.about.weeklyHours}`,
    },
  ];

  const methodologyItems = [
    {
      title: t.about.activeParticipation,
      description: t.about.activeParticipationDesc,
      Icon: Users2,
    },
    {
      title: t.about.jointProduction,
      description: t.about.jointProductionDesc,
      Icon: BookOpenText,
    },
    {
      title: t.about.socialTransformation,
      description: t.about.socialTransformationDesc,
      Icon: Sparkles,
    },
    {
      title: t.about.empowerment,
      description: t.about.empowermentDesc,
      Icon: HandHeart,
    },
  ];

  const keyFigures = [
    {
      value: "49.288",
      label: t.about.keyFigureVictimsLabel,
    },
    {
      value: "406",
      label: t.about.keyFigureDisappearedLabel,
    },
    {
      value: "85%",
      label: t.about.keyFigurePopulationLabel,
    },
  ];

  const closingCards = [
    {
      label: t.about.institution,
      value: t.about.universityName,
      detail: t.about.faculty1,
      Icon: Building2,
    },
    {
      label: t.about.duration,
      value: t.about.durationValue,
      detail: t.about.durationDates,
      Icon: Clock3,
    },
    {
      label: t.about.budget,
      value: t.about.budgetValue,
      detail: t.about.currency,
      Icon: Wallet,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF0]">
      <section className="w-full bg-[#FDFCF0]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-20 lg:py-24">
          <span className="inline-flex rounded-full border border-[#d9c6ab] bg-[#fff4e3] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8b4b2e]">
            {t.about.projectTag}
          </span>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-[#9b7d5c]">
            {t.about.heroEyebrow}
          </p>
          <h1 className="mt-4 max-w-5xl font-serif text-5xl leading-[0.96] text-[#1f3228] sm:text-6xl lg:text-7xl">
            {t.about.title}
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-relaxed text-[#4f5f56] sm:text-xl">
            {t.about.subtitle}
          </p>
        </div>
      </section>

      <section className="w-full bg-[#1A2F23]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-8 lg:grid-cols-[minmax(0,1.3fr)_340px] lg:gap-14 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d9c49f]">
              {t.about.contextTitle}
            </p>
            <h2 className="mt-4 font-serif text-4xl text-[#FDFCF0] sm:text-5xl">
              {t.about.jepTitle}
            </h2>
            <div className="mt-8 space-y-6 text-base leading-relaxed text-[#e2dccd] sm:text-lg">
              <p>
                {t.about.contextText1}{" "}
                <strong className="text-[#FDFCF0]">
                  {t.about.contextVictims}
                </strong>{" "}
                {t.about.contextText2}{" "}
                <strong className="text-[#FDFCF0]">
                  {t.about.contextDisappeared}
                </strong>
                .
              </p>
              <p>{t.about.contextText3}</p>
              <p>
                {t.about.jepText1}{" "}
                <strong className="text-[#F4E7CF]">
                  {t.about.jepSanctuaries}
                </strong>{" "}
                {t.about.jepText2}
              </p>
              <p>{t.about.jepText3}</p>
            </div>

            <div className="mt-10 rounded-[30px] border border-white/10 bg-[#f8f1e2] px-6 py-6 text-[#244033] shadow-[0_30px_80px_-44px_rgba(0,0,0,0.7)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9b7d5c]">
                {t.about.objectiveKicker}
              </p>
              <h3 className="mt-3 font-serif text-3xl text-[#1f3228]">
                {t.about.objectiveTitle}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-[#4b5c52]">
                {t.about.objectiveText}
              </p>
            </div>
          </div>

          <aside className="lg:pt-16">
            <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-md">
              <div className="flex items-center gap-3 text-[#FDFCF0]">
                <Scale3d className="h-5 w-5 text-[#d9c49f]" />
                <h3 className="font-serif text-2xl">
                  {t.about.keyFiguresTitle}
                </h3>
              </div>
              <div className="mt-6 grid gap-4">
                {keyFigures.map((figure) => (
                  <div
                    key={figure.label}
                    className="rounded-[28px] border border-[#d7c298]/18 bg-[linear-gradient(180deg,rgba(253,252,240,0.12),rgba(253,252,240,0.04))] px-5 py-5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f3e5c8] text-xl font-semibold text-[#23372c] shadow-inner">
                        {figure.value}
                      </div>
                      <p className="max-w-[11rem] text-sm leading-relaxed text-[#ebe3d0]">
                        {figure.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="w-full bg-[#FDFCF0]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9b7d5c]">
              {t.about.teamTitle}
            </p>
            <h2 className="mt-4 font-serif text-4xl text-[#1f3228] sm:text-5xl">
              {t.about.teamTitle}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[#53635a]">
              {t.about.teamSubtitle}
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {teamMembers.map((member) => (
              <article
                key={member.name}
                className="rounded-[24px] bg-white p-6 shadow-sm ring-1 ring-[#eadfce] transition-transform duration-300 hover:-translate-y-1"
              >
                <h3 className="text-xl font-semibold text-[#1f3228]">
                  {member.name}
                </h3>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#B08D6A]">
                  {member.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#7a7c74]">
                  {member.faculty}
                </p>
                {member.dedication ? (
                  <div className="mt-5 inline-flex rounded-full bg-[#f6efe3] px-3 py-1 text-xs font-medium text-[#6f675e]">
                    {t.about.dedicationShort}: {member.dedication}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-[#1A2F23]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:py-20">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d9c49f]">
              {t.about.methodologyTitle}
            </p>
            <h2 className="mt-4 font-serif text-4xl text-[#FDFCF0] sm:text-5xl">
              {t.about.methodologyTitle}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[#e2dccd]">
              {t.about.methodologySubtitle}
            </p>
            <p className="mt-5 text-base leading-relaxed text-[#d7cfbe] sm:text-lg">
              {t.about.methodologyText}{" "}
              <strong className="text-[#FDFCF0]">
                {t.about.methodologyIAP}
              </strong>{" "}
              {t.about.methodologyText2}
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {methodologyItems.map((item) => {
              const Icon = item.Icon;

              return (
                <article
                  key={item.title}
                  className="rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur-md"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3e5c8]/12 text-[#f1ddba] ring-1 ring-white/10">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-serif text-2xl text-[#FDFCF0]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#d9d2c3]">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="w-full bg-[#FDFCF0]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9b7d5c]">
              {t.about.closingTitle}
            </p>
            <h2 className="mt-4 font-serif text-4xl text-[#1f3228] sm:text-5xl">
              {t.about.closingTitle}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[#53635a]">
              {t.about.closingSubtitle}
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {closingCards.map((card) => {
              const Icon = card.Icon;

              return (
                <article
                  key={card.label}
                  className="rounded-[24px] border border-[#e8dfd0] bg-white px-6 py-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9b7d5c]">
                        {card.label}
                      </p>
                      <h3 className="mt-3 font-serif text-3xl text-[#1f3228]">
                        {card.value}
                      </h3>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f6efe3] text-[#8c6b4d]">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[#65736b]">
                    {card.detail}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
