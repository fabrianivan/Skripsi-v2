"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Stethoscope,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Activity,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Sliders,
  TrendingUp,
  Info,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
  Zap,
  Eye,
  X,
} from "lucide-react";
import { api, Kategori, Gejala, KonsultasiResponse } from "@/lib/api";
import FuzzyChart from "@/components/FuzzyChart";

interface SelectedSymptomState {
  [gejalaId: number]: {
    checked: boolean;
    interval: number;
    nama: string;
  };
}

export default function KonsultasiPage() {
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [selectedKategori, setSelectedKategori] = useState<number>(1);
  const [metode, setMetode] = useState<number>(0); // 0: Segitiga, 1: Trapesium
  const [treeData, setTreeData] = useState<Gejala[]>([]);
  const [expandedParents, setExpandedParents] = useState<{ [id: number]: boolean }>({});
  const [selectedSymptoms, setSelectedSymptoms] = useState<SelectedSymptomState>({});
  
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<KonsultasiResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showCalculationDetails, setShowCalculationDetails] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string; category?: string } | null>(null);

  // Load Kategori
  useEffect(() => {
    api.getKategori()
      .then((data) => {
        setKategoriList(data);
        if (data.length > 0) setSelectedKategori(data[0].kategori_penyakit);
      })
      .catch((err) => console.error(err));
  }, []);

  // Load Tree Data when category changes
  useEffect(() => {
    if (!selectedKategori) return;
    api.getGejalaTree(selectedKategori)
      .then((data) => {
        setTreeData(data);
        // Expand first two by default
        const exp: { [id: number]: boolean } = {};
        data.slice(0, 3).forEach((p) => {
          exp[p.id_gejala] = true;
        });
        setExpandedParents(exp);
      })
      .catch((err) => console.error(err));
  }, [selectedKategori]);

  const toggleParent = (parentId: number) => {
    setExpandedParents((prev) => ({
      ...prev,
      [parentId]: !prev[parentId],
    }));
  };

  const handleCheckboxToggle = (g: Gejala) => {
    setSelectedSymptoms((prev) => {
      const current = prev[g.id_gejala];
      if (current && current.checked) {
        const copy = { ...prev };
        delete copy[g.id_gejala];
        return copy;
      } else {
        return {
          ...prev,
          [g.id_gejala]: {
            checked: true,
            interval: g.interval || 0.5,
            nama: g.nama_gejala,
          },
        };
      }
    });
  };

  const handleSliderChange = (gejalaId: number, val: number) => {
    setSelectedSymptoms((prev) => ({
      ...prev,
      [gejalaId]: {
        ...prev[gejalaId],
        interval: val,
      },
    }));
  };

  const handleReset = () => {
    setSelectedSymptoms({});
    setResult(null);
    setErrorMsg(null);
  };

  // Quick Preset Handlers
  const applyPreset = (preset: "katarak" | "miopi" | "all") => {
    const newSelected: SelectedSymptomState = {};
    const exp: { [id: number]: boolean } = {};

    treeData.forEach((parent) => {
      (parent.children || []).forEach((child) => {
        const name = child.nama_gejala.toLowerCase();
        if (preset === "katarak" && (name.includes("embun") || name.includes("berbayang") || name.includes("cahaya"))) {
          newSelected[child.id_gejala] = { checked: true, interval: 0.65, nama: child.nama_gejala };
          exp[parent.id_gejala] = true;
        } else if (preset === "miopi" && (name.includes("minus") || name.includes("sulit melihat"))) {
          newSelected[child.id_gejala] = { checked: true, interval: 0.55, nama: child.nama_gejala };
          exp[parent.id_gejala] = true;
        }
      });
    });

    setSelectedSymptoms(newSelected);
    setExpandedParents(exp);
  };

  const getLinguisticTag = (val: number) => {
    if (val <= 0.25) return { text: "Ringan", color: "badge-emerald" };
    if (val <= 0.5) return { text: "Sedikit Parah", color: "badge-blue" };
    if (val <= 0.75) return { text: "Agak Parah", color: "badge-amber" };
    return { text: "Sangat Parah", color: "badge-rose" };
  };

  const handleDiagnosis = async () => {
    const activeEntries = Object.entries(selectedSymptoms).filter(([, v]) => v.checked);
    if (activeEntries.length === 0) {
      setErrorMsg("Harap pilih minimal 1 gejala sebelum memulai diagnosa.");
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    try {
      const payload = activeEntries.map(([idStr, v]) => ({
        id_gejala: Number(idStr),
        interval: v.interval,
      }));

      const res = await api.konsultasi(selectedKategori, metode, payload);
      setResult(res);
      setTimeout(() => {
        document.getElementById("hasil-diagnosa-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err: unknown) {
      const e = err as Error;
      setErrorMsg(e.message || "Gagal melakukan diagnosa ke server.");
    } finally {
      setLoading(false);
    }
  };

  const activeCount = Object.keys(selectedSymptoms).length;

  return (
    <div className="container" style={{ padding: "40px 16px" }}>
      {/* Header Banner */}
      <div style={{
        background: "linear-gradient(135deg, rgba(14, 165, 233, 0.12), rgba(99, 102, 241, 0.08))",
        border: "1px solid rgba(56, 189, 248, 0.2)",
        borderRadius: "var(--radius-lg)",
        padding: "36px 30px",
        marginBottom: "36px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span className="badge badge-cyan">
              <Zap size={13} /> Modul Konsultasi Pasien
            </span>
            <span className="badge badge-emerald">
              Fuzzy Inference Engine V2
            </span>
          </div>
          <h1 style={{
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.2
          }}>
            Diagnosis Klinis <span className="gradient-text">Penyakit Mata</span>
          </h1>
          <p style={{
            color: "var(--text-muted)",
            fontSize: "1rem",
            marginTop: "10px",
            maxWidth: "720px",
            lineHeight: 1.6
          }}>
            Sistem pakar menggunakan penalaran logika fuzzy untuk mengkalkulasi kemungkinan penyakit mata Anda berdasarkan derajat keanggotaan interval gejala.
          </p>
        </div>
      </div>

      {/* Main Responsive Layout */}
      <div className="consultation-layout">
        {/* Left Form: Method, Presets & Symptoms */}
        <div>
          {/* Controls Card */}
          <div className="glass-card" style={{ padding: "24px", marginBottom: "24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
              {/* Fuzzy Method Selector */}
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px" }}>
                  Metode Fungsi Keanggotaan:
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setMetode(0)}
                    style={{
                      flex: 1,
                      padding: "11px 16px",
                      borderRadius: "var(--radius-sm)",
                      border: metode === 0 ? "1px solid #38bdf8" : "1px solid var(--border-subtle)",
                      background: metode === 0 ? "linear-gradient(135deg, rgba(14, 165, 233, 0.25), rgba(37, 99, 235, 0.2))" : "var(--bg-input)",
                      color: metode === 0 ? "#ffffff" : "var(--text-muted)",
                      fontWeight: 700,
                      fontSize: "0.88rem",
                      cursor: "pointer",
                      boxShadow: metode === 0 ? "0 0 15px rgba(14, 165, 233, 0.3)" : "none",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Segitiga
                  </button>
                  <button
                    type="button"
                    onClick={() => setMetode(1)}
                    style={{
                      flex: 1,
                      padding: "11px 16px",
                      borderRadius: "var(--radius-sm)",
                      border: metode === 1 ? "1px solid #38bdf8" : "1px solid var(--border-subtle)",
                      background: metode === 1 ? "linear-gradient(135deg, rgba(14, 165, 233, 0.25), rgba(37, 99, 235, 0.2))" : "var(--bg-input)",
                      color: metode === 1 ? "#ffffff" : "var(--text-muted)",
                      fontWeight: 700,
                      fontSize: "0.88rem",
                      cursor: "pointer",
                      boxShadow: metode === 1 ? "0 0 15px rgba(14, 165, 233, 0.3)" : "none",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Trapesium
                  </button>
                </div>
              </div>

              {/* Kategori Selector */}
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px" }}>
                  Kategori Spesialisasi:
                </label>
                <select
                  value={selectedKategori}
                  onChange={(e) => setSelectedKategori(Number(e.target.value))}
                >
                  {kategoriList.map((k) => (
                    <option key={k.kategori_penyakit} value={k.kategori_penyakit}>
                      {k.nama_kategori}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Presets Row */}
            <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)" }}>
                Preset Cepat:
              </span>
              <button
                type="button"
                onClick={() => applyPreset("katarak")}
                className="btn-secondary btn-sm"
              >
                Gejala Katarak
              </button>
              <button
                type="button"
                onClick={() => applyPreset("miopi")}
                className="btn-secondary btn-sm"
              >
                Gejala Miopi
              </button>
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-secondary btn-sm"
                  style={{ color: "#fb7185", marginLeft: "auto" }}
                >
                  <RotateCcw size={13} /> Reset ({activeCount})
                </button>
              )}
            </div>
          </div>

          {/* Symptoms List Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                Pilih Gejala Klinis Anda
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginTop: "2px" }}>
                Centang manifestasi keluhan mata lalu atur tingkat keparahannya.
              </p>
            </div>
            <span className="badge badge-cyan">
              {activeCount} Dipilih
            </span>
          </div>

          {/* Symptoms Tree Accordion */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {treeData.map((parent) => {
              const isExpanded = !!expandedParents[parent.id_gejala];
              const children = parent.children || [];
              const activeInChildren = children.filter((c) => selectedSymptoms[c.id_gejala]?.checked).length;

              return (
                <div key={parent.id_gejala} className="glass-card" style={{ overflow: "hidden" }}>
                  {/* Parent Accordion Bar */}
                  <div
                    onClick={() => toggleParent(parent.id_gejala)}
                    style={{
                      padding: "16px 20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      background: isExpanded ? "rgba(20, 32, 58, 0.4)" : "transparent",
                      borderBottom: isExpanded ? "1px solid var(--border-subtle)" : "none",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "8px",
                        background: isExpanded ? "rgba(14, 165, 233, 0.2)" : "rgba(255, 255, 255, 0.05)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        {isExpanded ? (
                          <ChevronDown size={18} color="#38bdf8" />
                        ) : (
                          <ChevronRight size={18} color="var(--text-muted)" />
                        )}
                      </div>

                      {/* Parent Category Clinical Thumbnail */}
                      <div style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        position: "relative",
                        border: "1px solid var(--border-subtle)",
                        background: "#090d16",
                        flexShrink: 0
                      }}>
                        <Image
                          src={`/images/${parent.gambar_gejala || "mata-berbayang.jpg"}`}
                          alt={parent.nama_gejala}
                          fill
                          sizes="38px"
                          style={{ objectFit: "cover" }}
                        />
                      </div>

                      <span style={{ fontWeight: 700, fontSize: "0.98rem" }}>
                        {parent.nama_gejala}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {activeInChildren > 0 ? (
                        <span className="badge badge-emerald" style={{ fontSize: "0.72rem" }}>
                          {activeInChildren} aktif
                        </span>
                      ) : (
                        <span style={{ fontSize: "0.78rem", color: "var(--text-faint)" }}>
                          {children.length} gejala
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Children Items */}
                  {isExpanded && (
                    <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                      {children.map((child) => {
                        const isChecked = !!selectedSymptoms[child.id_gejala]?.checked;
                        const currentInterval = selectedSymptoms[child.id_gejala]?.interval ?? (child.interval || 0.5);
                        const tag = getLinguisticTag(currentInterval);
                        const childImg = child.gambar_gejala || parent.gambar_gejala || "mata-berbayang.jpg";

                        return (
                          <div
                            key={child.id_gejala}
                            style={{
                              padding: "14px 18px",
                              borderRadius: "var(--radius-sm)",
                              background: isChecked ? "rgba(14, 165, 233, 0.09)" : "rgba(15, 23, 42, 0.5)",
                              border: isChecked ? "1px solid rgba(56, 189, 248, 0.4)" : "1px solid var(--border-subtle)",
                              transition: "all 0.2s ease",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                              <input
                                type="checkbox"
                                id={`gejala-${child.id_gejala}`}
                                checked={isChecked}
                                onChange={() => handleCheckboxToggle(child)}
                                style={{
                                  marginTop: "16px",
                                  width: "18px",
                                  height: "18px",
                                  accentColor: "#0ea5e9",
                                  cursor: "pointer",
                                  flexShrink: 0,
                                }}
                              />

                              {/* Clinical Photo Preview Thumbnail */}
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPreviewImage({
                                    src: `/images/${childImg}`,
                                    title: child.nama_gejala,
                                    category: parent.nama_gejala
                                  });
                                }}
                                title="Klik untuk memperbesar ilustrasi klinis"
                                style={{
                                  width: "54px",
                                  height: "54px",
                                  borderRadius: "10px",
                                  overflow: "hidden",
                                  position: "relative",
                                  border: isChecked ? "2px solid #38bdf8" : "1px solid var(--border-subtle)",
                                  background: "#090d16",
                                  flexShrink: 0,
                                  cursor: "pointer",
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                                  transition: "all 0.2s ease"
                                }}
                              >
                                <Image
                                  src={`/images/${childImg}`}
                                  alt={child.nama_gejala}
                                  fill
                                  sizes="54px"
                                  style={{ objectFit: "cover" }}
                                />
                                <div style={{
                                  position: "absolute",
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  background: "rgba(0,0,0,0.65)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: "2px 0"
                                }}>
                                  <Eye size={11} color="#38bdf8" />
                                </div>
                              </div>

                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", flexWrap: "wrap" }}>
                                  <label
                                    htmlFor={`gejala-${child.id_gejala}`}
                                    style={{
                                      fontWeight: isChecked ? 700 : 500,
                                      fontSize: "0.92rem",
                                      cursor: "pointer",
                                      display: "block",
                                      color: isChecked ? "#ffffff" : "var(--text-secondary)",
                                      lineHeight: 1.4,
                                    }}
                                  >
                                    {child.nama_gejala}
                                  </label>

                                  <button
                                    type="button"
                                    onClick={() => setPreviewImage({
                                      src: `/images/${childImg}`,
                                      title: child.nama_gejala,
                                      category: parent.nama_gejala
                                    })}
                                    style={{
                                      background: "transparent",
                                      border: "none",
                                      color: "#38bdf8",
                                      fontSize: "0.74rem",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "4px",
                                      cursor: "pointer",
                                      padding: "0 4px"
                                    }}
                                  >
                                    <Eye size={12} /> Lihat Foto
                                  </button>
                                </div>

                                {/* Slider controls when checked */}
                                {isChecked && (
                                  <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px dashed rgba(255,255,255,0.08)" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                                        Tingkat Intensitas: <strong style={{ color: "#38bdf8" }}>{currentInterval.toFixed(2)}</strong>
                                      </span>
                                      <span className={`badge ${tag.color}`}>
                                        {tag.text}
                                      </span>
                                    </div>
                                    <input
                                      type="range"
                                      min={child.min || 0}
                                      max={child.max || 1}
                                      step="0.01"
                                      value={currentInterval}
                                      onChange={(e) => handleSliderChange(child.id_gejala, parseFloat(e.target.value))}
                                    />
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-faint)", marginTop: "6px" }}>
                                      <span>0.0 (Ringan)</span>
                                      <span>0.5 (Sedang)</span>
                                      <span>1.0 (Parah)</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Button */}
          <div style={{ marginTop: "28px" }}>
            {errorMsg && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 18px",
                borderRadius: "var(--radius-sm)",
                background: "rgba(244, 63, 94, 0.15)",
                border: "1px solid rgba(244, 63, 94, 0.35)",
                color: "#fb7185",
                fontSize: "0.9rem",
                marginBottom: "16px",
              }}>
                <AlertTriangle size={18} />
                {errorMsg}
              </div>
            )}

            <button
              onClick={handleDiagnosis}
              disabled={loading || activeCount === 0}
              className="btn-primary"
              style={{ width: "100%", padding: "18px", fontSize: "1.05rem", borderRadius: "var(--radius-md)" }}
            >
              {loading ? (
                <>Menghitung Logika Fuzzy...</>
              ) : (
                <>
                  <Stethoscope size={22} />
                  Jalankan Diagnosa ({activeCount} Gejala Dipilih)
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Panel: Interactive Charts & Results Preview */}
        <div>
          {/* Real-time Fuzzy Curve Visualizer */}
          <div className="glass-card" style={{ padding: "24px", marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <TrendingUp size={18} color="#38bdf8" />
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>
                  Visualisasi Kurva Fuzzy
                </h3>
              </div>
              <span className="badge badge-cyan" style={{ fontSize: "0.72rem" }}>
                {metode === 0 ? "Fungsi Segitiga" : "Fungsi Trapesium"}
              </span>
            </div>

            {activeCount === 0 ? (
              <div style={{
                padding: "44px 20px",
                textAlign: "center",
                color: "var(--text-faint)",
                fontSize: "0.88rem",
                border: "1px dashed var(--border-card)",
                borderRadius: "var(--radius-sm)",
              }}>
                <Sliders size={32} style={{ opacity: 0.3, margin: "0 auto 10px auto" }} />
                Centang gejala pada panel untuk memantau grafik derajat keanggotaan logika fuzzy secara langsung.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxHeight: "480px", overflowY: "auto", paddingRight: "4px" }}>
                {Object.entries(selectedSymptoms).map(([idStr, val]) => (
                  <FuzzyChart
                    key={idStr}
                    metode={metode}
                    gejalaName={val.nama}
                    intervalValue={val.interval}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Fuzzy Theory Explanation Card */}
          <div className="glass-card" style={{ padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <Info size={16} color="#34d399" />
              <h4 style={{ fontSize: "0.92rem", fontWeight: 700, color: "#34d399" }}>
                Prinsip Inferensi {metode === 0 ? "Segitiga" : "Trapesium"}
              </h4>
            </div>
            <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              {metode === 0
                ? "Fungsi segitiga memiliki titik puncak tunggal pada median interval [min, max]. Sangat presisi dalam mendeteksi gejala bergradasi bertahap."
                : "Fungsi trapesium memiliki rentang puncak datar (plateau) bernilai μ=1.0 pada area tengah, memberikan toleransi stabilitas keparahan."}
            </p>
          </div>
        </div>
      </div>

      {/* DIAGNOSIS RESULTS SECTION */}
      {result && (
        <section id="hasil-diagnosa-section" style={{ marginTop: "70px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span className="badge badge-emerald">Laporan Hasil Diagnosa</span>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 900, marginTop: "10px" }}>
              Analisis Medis &amp; Rekomendasi Solusi
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
              Hasil evaluasi inferensi berbasis aturan rekam medik dengan metode {result.metode_nama}
            </p>
          </div>

          {/* Top Recommended Disease Showcase */}
          {result.penyakit_terpilih && (
            <div
              style={{
                background: "linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(16, 185, 129, 0.15))",
                border: "1px solid rgba(56, 189, 248, 0.5)",
                borderRadius: "var(--radius-lg)",
                padding: "36px",
                boxShadow: "0 0 50px rgba(14, 165, 233, 0.25)",
                marginBottom: "32px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "28px",
                alignItems: "center"
              }}
            >
              <div>
                <span className="badge badge-cyan" style={{ marginBottom: "12px" }}>
                  <ShieldCheck size={14} /> Probabilitas Tertinggi
                </span>
                <h3 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.02em" }}>
                  {result.penyakit_terpilih.nama_penyakit}
                </h3>

                <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "12px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "1.6rem", fontWeight: 900, color: "#38bdf8" }}>
                    {result.penyakit_terpilih.persentase.toFixed(2)}%
                  </span>
                  <span className={`badge ${
                    result.penyakit_terpilih.tingkat_parah === "Ringan"
                      ? "badge-emerald"
                      : result.penyakit_terpilih.tingkat_parah === "Agak Parah"
                      ? "badge-blue"
                      : result.penyakit_terpilih.tingkat_parah === "Parah"
                      ? "badge-amber"
                      : "badge-rose"
                  }`}>
                    Keparahan: {result.penyakit_terpilih.tingkat_parah}
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {result.penyakit_terpilih.gejala_cocok} dari {result.penyakit_terpilih.total_gejala_rule} aturan terpicu
                  </span>
                </div>
              </div>

              {/* Actionable Medical Advice */}
              <div style={{
                background: "rgba(10, 16, 30, 0.85)",
                border: "1px solid var(--border-card)",
                borderRadius: "var(--radius-md)",
                padding: "24px",
                backdropFilter: "blur(12px)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#34d399", fontWeight: 700, fontSize: "1rem", marginBottom: "10px" }}>
                  <CheckCircle2 size={20} /> Solusi &amp; Tindakan Medis Dianjurkan:
                </div>
                <p style={{ color: "var(--text-main)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  {result.solusi_rekomendasi}
                </p>
              </div>
            </div>
          )}

          {/* Three Detail Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            {/* Gejala Terpicu */}
            <div className="glass-card" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Activity size={18} color="#38bdf8" />
                Gejala Terpicu ({result.gejala_terpicu.length})
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "360px", overflowY: "auto" }}>
                {result.gejala_terpicu.map((gt) => (
                  <div
                    key={gt.id_gejala}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "var(--radius-sm)",
                      background: "rgba(15, 23, 42, 0.6)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div style={{ fontSize: "0.88rem", fontWeight: 600 }}>{gt.nama_gejala}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
                      <span>Interval: <strong>{gt.interval.toFixed(2)}</strong></span>
                      <span style={{ color: "#38bdf8" }}>μ = {gt.derajat.toFixed(4)} ({gt.kategori_teks})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rule Penyakit Terpicu */}
            <div className="glass-card" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Sparkles size={18} color="#fbbf24" />
                Penyakit dengan Gejala Mirip
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "360px", overflowY: "auto" }}>
                {result.rule_terpicu.length === 0 ? (
                  <p style={{ color: "var(--text-faint)", fontSize: "0.85rem" }}>Tidak ada rule yang cocok</p>
                ) : (
                  result.rule_terpicu.map((rt) => (
                    <div
                      key={rt.id_penyakit}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "var(--radius-sm)",
                        background: "rgba(15, 23, 42, 0.6)",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontWeight: 700, fontSize: "0.92rem" }}>{rt.nama_penyakit}</span>
                        <span className="badge badge-blue">
                          {rt.gejala_cocok}/{rt.total_gejala_rule} cocok
                        </span>
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                        {rt.gejala_list.join(", ")}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Ranking Hasil Diagnosa */}
            <div className="glass-card" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <TrendingUp size={18} color="#34d399" />
                Peringkat Hasil Diagnosa
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "360px", overflowY: "auto" }}>
                {result.hasil_diagnosa.length === 0 ? (
                  <p style={{ color: "var(--text-faint)", fontSize: "0.85rem" }}>Tidak ada hasil diagnosa</p>
                ) : (
                  result.hasil_diagnosa.map((h, idx) => (
                    <div
                      key={h.id_penyakit}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "var(--radius-sm)",
                        background: idx === 0 ? "rgba(14, 165, 233, 0.12)" : "rgba(15, 23, 42, 0.6)",
                        border: idx === 0 ? "1px solid rgba(56, 189, 248, 0.4)" : "1px solid var(--border-subtle)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 700, fontSize: "0.92rem" }}>
                          #{idx + 1} {h.nama_penyakit}
                        </span>
                        <span style={{ fontWeight: 900, color: idx === 0 ? "#38bdf8" : "var(--text-main)" }}>
                          {h.persentase.toFixed(2)}%
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "999px", marginTop: "8px", overflow: "hidden" }}>
                        <div style={{
                          width: `${Math.min(100, h.persentase)}%`,
                          height: "100%",
                          background: idx === 0 ? "linear-gradient(90deg, #38bdf8, #34d399)" : "#64748b",
                          borderRadius: "999px",
                        }} />
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "6px" }}>
                        <span>Status: <strong>{h.tingkat_parah}</strong></span>
                        <span>{h.gejala_cocok} gejala cocok</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Toggle Mathematical Breakdown */}
          <div style={{ marginTop: "32px", textAlign: "center" }}>
            <button
              onClick={() => setShowCalculationDetails(!showCalculationDetails)}
              className="btn-secondary btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Info size={14} />
              {showCalculationDetails ? "Sembunyikan Rincian Rumus Matematis" : "Tampilkan Rincian Rumus Matematis Centroid"}
            </button>

            {showCalculationDetails && (
              <div className="glass-card" style={{ marginTop: "20px", padding: "28px", textAlign: "left", maxWidth: "800px", margin: "20px auto 0 auto" }}>
                <h4 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: "12px", color: "#38bdf8" }}>
                  Metodologi Perhitungan Defuzzifikasi Centroid:
                </h4>
                <div style={{ fontFamily: "JetBrains Mono, monospace", background: "rgba(5, 8, 17, 0.8)", padding: "16px", borderRadius: "8px", fontSize: "0.85rem", color: "#a5f3fc", lineHeight: 1.6, marginBottom: "14px" }}>
                  Hasil Diagnosa (%) = [ Σ (μ_i * Interval_i) / Σ (μ_i) ] * 100
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                  Di mana <code>μ_i</code> adalah derajat keanggotaan fuzzy dari gejala ke-i yang dihitung berdasarkan metode {result.metode_nama}, dan <code>Interval_i</code> adalah nilai intensitas yang dimasukkan pasien (0.00 hingga 1.00). Nilai akhir dikelompokkan ke dalam kategori keparahan: Ringan (≤25%), Agak Parah (26-50%), Parah (51-75%), dan Sangat Parah (&gt;75%).
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Clinical Illustration Lightbox Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(8px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-card"
            style={{
              maxWidth: "640px",
              width: "100%",
              padding: "24px",
              position: "relative",
              border: "1px solid rgba(56, 189, 248, 0.35)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.9)",
              background: "#0c1222"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                {previewImage.category && (
                  <span className="badge badge-cyan" style={{ marginBottom: "6px", fontSize: "0.72rem" }}>
                    {previewImage.category}
                  </span>
                )}
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#ffffff" }}>
                  {previewImage.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="btn-secondary btn-sm"
                style={{ padding: "6px 12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <X size={15} /> Tutup
              </button>
            </div>

            <div style={{
              width: "100%",
              height: "360px",
              position: "relative",
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid var(--border-subtle)",
              background: "#050811"
            }}>
              <Image
                src={previewImage.src}
                alt={previewImage.title}
                fill
                sizes="640px"
                style={{ objectFit: "contain" }}
              />
            </div>

            <div style={{
              marginTop: "14px",
              padding: "10px 14px",
              borderRadius: "8px",
              background: "rgba(14, 165, 233, 0.08)",
              border: "1px solid rgba(56, 189, 248, 0.2)",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <Info size={16} color="#38bdf8" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                Foto ilustrasi klinis ini membantu pasien mengidentifikasi bentuk atau sensasi keluhan mata yang dialami secara akurat.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
