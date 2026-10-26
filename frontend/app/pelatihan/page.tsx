"use client";

import { useEffect, useState } from "react";
import {
  BrainCircuit,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRightLeft,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { api, Kategori, Gejala, KonsultasiResponse } from "@/lib/api";

export default function PelatihanPage() {
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [selectedKategori, setSelectedKategori] = useState<number>(1);
  const [allGejala, setAllGejala] = useState<Gejala[]>([]);
  const [selectedGejala, setSelectedGejala] = useState<{ [id: number]: number }>({});
  
  const [resSegitiga, setResSegitiga] = useState<KonsultasiResponse | null>(null);
  const [resTrapesium, setResTrapesium] = useState<KonsultasiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    api.getKategori().then((k) => {
      setKategoriList(k);
      if (k.length > 0) setSelectedKategori(k[0].kategori_penyakit);
    });
  }, []);

  useEffect(() => {
    if (!selectedKategori) return;
    // Get all children symptoms for simulation
    api.getAllGejala(selectedKategori).then((data) => {
      // filter only child symptoms (parent_id > 0)
      const children = data.filter((g) => g.parent_id > 0);
      setAllGejala(children);
    });
  }, [selectedKategori]);

  const toggleGejala = (g: Gejala) => {
    setSelectedGejala((prev) => {
      const copy = { ...prev };
      if (copy[g.id_gejala] !== undefined) {
        delete copy[g.id_gejala];
      } else {
        copy[g.id_gejala] = g.interval || 0.5;
      }
      return copy;
    });
  };

  const handleSliderChange = (id: number, val: number) => {
    setSelectedGejala((prev) => ({
      ...prev,
      [id]: val,
    }));
  };

  const runComparison = async () => {
    const keys = Object.keys(selectedGejala);
    if (keys.length === 0) return;

    setLoading(true);
    const payload = keys.map((id) => ({
      id_gejala: Number(id),
      interval: selectedGejala[Number(id)],
    }));

    try {
      const [segitiga, trapesium] = await Promise.all([
        api.konsultasi(selectedKategori, 0, payload),
        api.konsultasi(selectedKategori, 1, payload),
      ]);
      setResSegitiga(segitiga);
      setResTrapesium(trapesium);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Quick preset loader
  const loadPreset = (presetName: string) => {
    if (presetName === "katarak") {
      // Find symptoms related to katarak: mata kabur, berembun, silau
      const katarakIds: { [id: number]: number } = {};
      allGejala.forEach((g) => {
        const lower = g.nama_gejala.toLowerCase();
        if (lower.includes("embun") || lower.includes("berbayang") || lower.includes("cahaya")) {
          katarakIds[g.id_gejala] = 0.65;
        }
      });
      setSelectedGejala(katarakIds);
    } else if (presetName === "miopi") {
      const miopiIds: { [id: number]: number } = {};
      allGejala.forEach((g) => {
        const lower = g.nama_gejala.toLowerCase();
        if (lower.includes("minus") || lower.includes("sulit melihat")) {
          miopiIds[g.id_gejala] = 0.55;
        }
      });
      setSelectedGejala(miopiIds);
    }
  };

  const activeCount = Object.keys(selectedGejala).length;

  return (
    <div className="container" style={{ padding: "40px 16px" }}>
      {/* Header Banner */}
      <div style={{
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(14, 165, 233, 0.08))",
        border: "1px solid rgba(16, 185, 129, 0.25)",
        borderRadius: "var(--radius-lg)",
        padding: "36px 30px",
        marginBottom: "36px",
      }}>
        <span className="badge badge-emerald" style={{ marginBottom: "12px" }}>
          Modul Pelatihan &amp; Pengujian Aturan
        </span>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>
          Simulasi Komparasi <span className="gradient-text-emerald">Logika Fuzzy</span>
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.98rem", marginTop: "8px", maxWidth: "760px", lineHeight: 1.6 }}>
          Bandingkan keluaran diagnosis metode <strong>Segitiga</strong> vs <strong>Trapesium</strong> secara simultan untuk meneliti sensitivitas defuzzifikasi centroid pada data uji yang sama.
        </p>
      </div>

      {/* Preset Toolbar */}
      <div className="glass-card" style={{ padding: "20px 24px", marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)" }}>
            Preset Kasus Cepat:
          </span>
          <button
            onClick={() => loadPreset("katarak")}
            className="btn-secondary btn-sm"
          >
            Kasus Kecurigaan Katarak
          </button>
          <button
            onClick={() => loadPreset("miopi")}
            className="btn-secondary btn-sm"
          >
            Kasus Kecurigaan Miopi
          </button>
          {activeCount > 0 && (
            <button
              onClick={() => { setSelectedGejala({}); setResSegitiga(null); setResTrapesium(null); }}
              className="btn-secondary btn-sm"
              style={{ color: "#fb7185" }}
            >
              <RotateCcw size={13} /> Bersihkan ({activeCount})
            </button>
          )}
        </div>

        <button
          onClick={runComparison}
          disabled={loading || activeCount === 0}
          className="btn-primary"
          style={{ padding: "12px 26px" }}
        >
          <Play size={16} />
          {loading ? "Menjalankan..." : `Jalankan Komparasi (${activeCount} Gejala)`}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "28px" }}>
        {/* Left Column: Symptom Picker with Sliders */}
        <div>
          <div className="glass-card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Sliders size={18} color="#38bdf8" />
              Pilih Gejala Uji ({activeCount} dipilih)
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "640px", overflowY: "auto", paddingRight: "6px" }}>
              {allGejala.map((g) => {
                const isSelected = selectedGejala[g.id_gejala] !== undefined;
                const val = selectedGejala[g.id_gejala] ?? (g.interval || 0.5);

                return (
                  <div
                    key={g.id_gejala}
                    style={{
                      padding: "12px",
                      borderRadius: "var(--radius-sm)",
                      background: isSelected ? "rgba(14, 165, 233, 0.1)" : "rgba(15, 23, 42, 0.4)",
                      border: isSelected ? "1px solid rgba(56, 189, 248, 0.4)" : "1px solid var(--border-subtle)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <input
                        type="checkbox"
                        id={`pelatihan-${g.id_gejala}`}
                        checked={isSelected}
                        onChange={() => toggleGejala(g)}
                        style={{ marginTop: "4px", accentColor: "#0ea5e9" }}
                      />
                      <div style={{ flex: 1 }}>
                        <label
                          htmlFor={`pelatihan-${g.id_gejala}`}
                          style={{
                            fontSize: "0.88rem",
                            fontWeight: isSelected ? 600 : 400,
                            cursor: "pointer",
                            color: isSelected ? "#f8fafc" : "var(--text-muted)",
                          }}
                        >
                          {g.nama_gejala}
                        </label>

                        {isSelected && (
                          <div style={{ marginTop: "8px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#38bdf8", marginBottom: "4px" }}>
                              <span>Interval:</span>
                              <strong>{val.toFixed(2)}</strong>
                            </div>
                            <input
                              type="range"
                              min={g.min || 0}
                              max={g.max || 1}
                              step="0.01"
                              value={val}
                              onChange={(e) => handleSliderChange(g.id_gejala, parseFloat(e.target.value))}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Side-by-Side Comparison */}
        <div>
          {!resSegitiga || !resTrapesium ? (
            <div className="glass-card" style={{ padding: "60px 40px", textAlign: "center", color: "var(--text-muted)" }}>
              <ArrowRightLeft size={42} style={{ opacity: 0.3, margin: "0 auto 16px auto" }} />
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px" }}>
                Panel Komparasi Siap
              </h3>
              <p style={{ fontSize: "0.9rem", maxWidth: "450px", margin: "0 auto", lineHeight: 1.6 }}>
                Centang gejala pada panel kiri lalu klik tombol &quot;Jalankan Komparasi&quot; untuk mengamati perbedaan perhitungan defuzzifikasi antara metode Segitiga dan Trapesium.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Comparative Summary */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                {/* Segitiga Column */}
                <div className="glass-card" style={{ padding: "24px", borderTop: "4px solid #38bdf8" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>Metode Segitiga</h3>
                    <span className="badge badge-blue">Linear Peak</span>
                  </div>

                  {resSegitiga.penyakit_terpilih ? (
                    <div>
                      <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#38bdf8" }}>
                        {resSegitiga.penyakit_terpilih.persentase.toFixed(2)}%
                      </div>
                      <div style={{ fontWeight: 700, fontSize: "1rem", marginTop: "4px" }}>
                        {resSegitiga.penyakit_terpilih.nama_penyakit}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
                        Status: {resSegitiga.penyakit_terpilih.tingkat_parah}
                      </div>

                      <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid var(--border-subtle)" }}>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px" }}>
                          Peringkat Lengkap:
                        </div>
                        {resSegitiga.hasil_diagnosa.map((h, i) => (
                          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", padding: "4px 0" }}>
                            <span>#{i + 1} {h.nama_penyakit}</span>
                            <strong>{h.persentase.toFixed(1)}%</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: "var(--text-faint)", fontSize: "0.85rem" }}>Tidak ada aturan terpicu</p>
                  )}
                </div>

                {/* Trapesium Column */}
                <div className="glass-card" style={{ padding: "24px", borderTop: "4px solid #34d399" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>Metode Trapesium</h3>
                    <span className="badge badge-emerald">Flat Plateau</span>
                  </div>

                  {resTrapesium.penyakit_terpilih ? (
                    <div>
                      <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#34d399" }}>
                        {resTrapesium.penyakit_terpilih.persentase.toFixed(2)}%
                      </div>
                      <div style={{ fontWeight: 700, fontSize: "1rem", marginTop: "4px" }}>
                        {resTrapesium.penyakit_terpilih.nama_penyakit}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
                        Status: {resTrapesium.penyakit_terpilih.tingkat_parah}
                      </div>

                      <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid var(--border-subtle)" }}>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px" }}>
                          Peringkat Lengkap:
                        </div>
                        {resTrapesium.hasil_diagnosa.map((h, i) => (
                          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", padding: "4px 0" }}>
                            <span>#{i + 1} {h.nama_penyakit}</span>
                            <strong>{h.persentase.toFixed(1)}%</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: "var(--text-faint)", fontSize: "0.85rem" }}>Tidak ada aturan terpicu</p>
                  )}
                </div>
              </div>

              {/* Research Insights Card */}
              <div className="glass-card" style={{ padding: "24px" }}>
                <h4 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle2 size={18} color="#38bdf8" />
                  Kesimpulan Komparasi Riset
                </h4>
                <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                  Metode trapesium cenderung menghasilkan bobot keanggotaan lebih tinggi pada rentang nilai tengah karena area puncak berbentuk plateau (datar pada μ=1.0). Sebaliknya, metode segitiga lebih sensitif terhadap perubahan interval mikro karena memiliki satu titik puncak tunggal.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
