"use client";

import { FormEvent, useEffect, useState } from "react";
import { LayoutDashboard, Users, MapPin, FileText, Upload, LogOut, Menu, X, Globe } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

type Victima = {
  id: number;
  nombres: string;
  apellidos: string;
};

type Lugar = {
  id: number;
  nombre: string;
  tipo: string;
};

type Medio = {
  id: number;
  tipo: string;
  url: string;
  nombre_archivo: string;
};

type Testimonio = {
  id: number;
  tipo: string;
  autor_nombre: string;
  victimas: {
    id: number;
    nombres: string;
    apellidos: string;
  };
};

export default function DashboardPage() {
  const { t, language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [victimas, setVictimas] = useState<Victima[]>([]);
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [medios, setMedios] = useState<Medio[]>([]);
  const [testimonios, setTestimonios] = useState<Testimonio[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const [victimaForm, setVictimaForm] = useState({
    nombres: "",
    apellidos: "",
    fecha_desaparicion: "",
    departamento: "Caldas",
    municipio: "Samaná",
  });

  const [testimonioForm, setTestimonioForm] = useState({
    victima_id: "",
    lugar_id: "",
    medio_id: "",
    autor_nombre: "",
    tipo: "texto",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState("documento");

  useEffect(() => {
    setStatus(t.dashboard.status);
  }, [t]);

  useEffect(() => {
    refreshData();
  }, []);

  async function refreshData() {
    setLoading(true);
    try {
      const [victimasRes, lugaresRes, mediosRes, testimoniosRes] = await Promise.all([
        fetch("/api/victimas"),
        fetch("/api/lugares"),
        fetch("/api/medios"),
        fetch("/api/testimonios"),
      ]);

      const [victimasData, lugaresData, mediosData, testimoniosData] = await Promise.all([
        victimasRes.json(),
        lugaresRes.json(),
        mediosRes.json(),
        testimoniosRes.json(),
      ]);

      setVictimas(victimasData);
      setLugares(lugaresData);
      setMedios(mediosData);
      setTestimonios(testimoniosData);
      setStatus(t.dashboard.dataUpdated);
    } catch {
      setStatus(t.dashboard.errorLoading);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateVictima(event: FormEvent) {
    event.preventDefault();
    setStatus(t.dashboard.creatingVictim);

    const response = await fetch("/api/victimas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(victimaForm),
    });

    if (!response.ok) {
      setStatus(t.dashboard.errorCreatingVictim);
      return;
    }

    setStatus(t.dashboard.victimCreated);
    setVictimaForm({
      nombres: "",
      apellidos: "",
      fecha_desaparicion: "",
      departamento: "Caldas",
      municipio: "Samaná",
    });
    await refreshData();
  }

  async function handleUploadFile(event: FormEvent) {
    event.preventDefault();
    if (!selectedFile) {
      setStatus(t.dashboard.selectFile);
      return;
    }

    setStatus(t.dashboard.uploadingFile);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("tipo", mediaType);
    formData.append("nombre_archivo", selectedFile.name);

    const response = await fetch("/api/medios", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      setStatus(t.dashboard.errorUploadingFile);
      return;
    }

    setStatus(t.dashboard.fileUploaded);
    setSelectedFile(null);
    await refreshData();
  }

  async function handleCreateTestimonio(event: FormEvent) {
    event.preventDefault();
    setStatus(t.dashboard.creatingTestimony);

    const payload = {
      victima_id: Number(testimonioForm.victima_id),
      medio_id: Number(testimonioForm.medio_id),
      lugar_id: testimonioForm.lugar_id ? Number(testimonioForm.lugar_id) : undefined,
      autor_nombre: testimonioForm.autor_nombre,
      tipo: testimonioForm.tipo,
    };

    const response = await fetch("/api/testimonios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setStatus(t.dashboard.errorCreatingTestimony);
      return;
    }

    setStatus(t.dashboard.testimonyCreated);
    setTestimonioForm({
      victima_id: "",
      lugar_id: "",
      medio_id: "",
      autor_nombre: "",
      tipo: "texto",
    });
    await refreshData();
  }

  const menuItems = [
    { id: "overview", label: t.dashboard.overview, icon: LayoutDashboard },
    { id: "victimas", label: t.dashboard.victims, icon: Users },
    { id: "medios", label: t.dashboard.media, icon: Upload },
    { id: "testimonios", label: t.dashboard.testimonies, icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[var(--line)] transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-[var(--line)]">
          <h2 className="section-title text-lg text-[var(--brand-strong)]">{t.dashboard.title}</h2>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                activeTab === item.id
                  ? "bg-[var(--brand)] text-white"
                  : "text-[var(--ink-soft)] hover:bg-[var(--surface)]"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--line)]">
          <button
            onClick={() => {
              sessionStorage.removeItem("authenticated");
              sessionStorage.removeItem("user");
              window.location.href = "/";
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--ink-soft)] hover:bg-[var(--surface)] transition w-full"
          >
            <LogOut className="w-5 h-5" />
            {t.dashboard.exit}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 h-16 bg-white border-b border-[var(--line)] flex items-center justify-between px-4 sm:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLanguage(language === "es" ? "en" : "es")}
              className="flex items-center gap-1 rounded-full bg-[var(--surface)] px-3 py-1.5 text-xs font-medium transition hover:bg-[var(--line)]"
            >
              <Globe className="h-3.5 w-3.5" />
              {language.toUpperCase()}
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface)] text-xs font-medium">
              <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500' : 'bg-green-500'}`} />
              {status}
            </div>
            <button
              onClick={refreshData}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-[var(--brand)] text-white text-sm font-medium hover:bg-[var(--brand-strong)] disabled:opacity-50 transition"
            >
              {t.dashboard.refresh}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-4 sm:p-6 space-y-6">
          {activeTab === "overview" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="surface-panel rounded-2xl p-5">
                  <p className="text-xs uppercase tracking-wider text-[var(--ink-soft)]">{t.dashboard.victims}</p>
                  <p className="mt-2 text-3xl font-bold text-[var(--brand-strong)]">{victimas.length}</p>
                </div>
                <div className="surface-panel rounded-2xl p-5">
                  <p className="text-xs uppercase tracking-wider text-[var(--ink-soft)]">{t.dashboard.media}</p>
                  <p className="mt-2 text-3xl font-bold text-[var(--brand-strong)]">{medios.length}</p>
                </div>
                <div className="surface-panel rounded-2xl p-5">
                  <p className="text-xs uppercase tracking-wider text-[var(--ink-soft)]">{t.dashboard.testimonies}</p>
                  <p className="mt-2 text-3xl font-bold text-[var(--brand-strong)]">{testimonios.length}</p>
                </div>
                <div className="surface-panel rounded-2xl p-5">
                  <p className="text-xs uppercase tracking-wider text-[var(--ink-soft)]">{t.dashboard.places}</p>
                  <p className="mt-2 text-3xl font-bold text-[var(--brand-strong)]">{lugares.length}</p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="surface-panel rounded-2xl p-6">
                  <h3 className="section-title text-xl mb-4">{t.dashboard.recentVictims}</h3>
                  <div className="space-y-2">
                    {victimas.slice(0, 5).map((v) => (
                      <div key={v.id} className="flex items-center justify-between p-3 rounded-xl bg-white border border-[var(--line)]">
                        <span className="font-medium text-sm">{v.nombres} {v.apellidos}</span>
                        <span className="text-xs text-[var(--ink-soft)]">#{v.id}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="surface-panel rounded-2xl p-6">
                  <h3 className="section-title text-xl mb-4">{t.dashboard.recentTestimonies}</h3>
                  <div className="space-y-2">
                    {testimonios.slice(0, 5).map((t) => (
                      <div key={t.id} className="p-3 rounded-xl bg-white border border-[var(--line)]">
                        <p className="font-medium text-sm">{t.autor_nombre}</p>
                        <p className="text-xs text-[var(--ink-soft)] mt-1">{t.victimas.nombres} {t.victimas.apellidos}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "victimas" && (
            <div className="surface-panel rounded-2xl p-6">
              <h2 className="section-title text-2xl mb-6">{t.dashboard.createVictim}</h2>
              <form onSubmit={handleCreateVictima} className="space-y-4 max-w-2xl">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.dashboard.firstName}</label>
                    <input
                      required
                      value={victimaForm.nombres}
                      onChange={(e) => setVictimaForm((s) => ({ ...s, nombres: e.target.value }))}
                      className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.dashboard.lastName}</label>
                    <input
                      required
                      value={victimaForm.apellidos}
                      onChange={(e) => setVictimaForm((s) => ({ ...s, apellidos: e.target.value }))}
                      className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.dashboard.disappearanceDate}</label>
                  <input
                    required
                    type="date"
                    value={victimaForm.fecha_desaparicion}
                    onChange={(e) => setVictimaForm((s) => ({ ...s, fecha_desaparicion: e.target.value }))}
                    className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.dashboard.department}</label>
                    <input
                      required
                      value={victimaForm.departamento}
                      onChange={(e) => setVictimaForm((s) => ({ ...s, departamento: e.target.value }))}
                      className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.dashboard.municipality}</label>
                    <input
                      required
                      value={victimaForm.municipio}
                      onChange={(e) => setVictimaForm((s) => ({ ...s, municipio: e.target.value }))}
                      className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                    />
                  </div>
                </div>
                <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[var(--brand)] text-white font-medium hover:bg-[var(--brand-strong)] transition">
                  {t.dashboard.createVictimBtn}
                </button>
              </form>
            </div>
          )}

          {activeTab === "medios" && (
            <div className="surface-panel rounded-2xl p-6">
              <h2 className="section-title text-2xl mb-6">{t.dashboard.uploadFile}</h2>
              <form onSubmit={handleUploadFile} className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium mb-2">{t.dashboard.mediaType}</label>
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value)}
                    className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  >
                    <option value="imagen">{t.dashboard.image}</option>
                    <option value="video">{t.dashboard.video}</option>
                    <option value="audio">{t.dashboard.audio}</option>
                    <option value="documento">{t.dashboard.document}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.dashboard.file}</label>
                  <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                    className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[var(--accent)] text-white font-medium hover:bg-[#7f2f22] transition">
                  {t.dashboard.uploadBtn}
                </button>
              </form>
            </div>
          )}

          {activeTab === "testimonios" && (
            <div className="surface-panel rounded-2xl p-6">
              <h2 className="section-title text-2xl mb-6">{t.dashboard.createTestimony}</h2>
              <form onSubmit={handleCreateTestimonio} className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium mb-2">{t.dashboard.victim}</label>
                  <select
                    required
                    value={testimonioForm.victima_id}
                    onChange={(e) => setTestimonioForm((s) => ({ ...s, victima_id: e.target.value }))}
                    className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  >
                    <option value="">{t.dashboard.selectVictim}</option>
                    {victimas.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.nombres} {v.apellidos}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.dashboard.medium}</label>
                  <select
                    required
                    value={testimonioForm.medio_id}
                    onChange={(e) => setTestimonioForm((s) => ({ ...s, medio_id: e.target.value }))}
                    className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  >
                    <option value="">{t.dashboard.selectMedium}</option>
                    {medios.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.tipo} - {m.nombre_archivo}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.dashboard.testimonyAuthor}</label>
                  <input
                    required
                    value={testimonioForm.autor_nombre}
                    onChange={(e) => setTestimonioForm((s) => ({ ...s, autor_nombre: e.target.value }))}
                    className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2f6f55] text-white font-medium hover:bg-[#285d48] transition">
                  {t.dashboard.createTestimonyBtn}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
