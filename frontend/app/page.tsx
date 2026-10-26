import Link from "next/link";
import {
  Eye,
  Stethoscope,
  BrainCircuit,
  Activity,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  HelpCircle,
  FileCheck2,
} from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{ padding: "80px 0 60px 0", position: "relative" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: "900px" }}>
          <div style={{ display: "inline-flex", marginBottom: "20px" }}>
            <span className="badge badge-cyan" style={{ padding: "6px 16px", fontSize: "0.82rem" }}>
              <Zap size={14} /> Skripsi Peneliti Fabrian Ivan • Rekayasa Ulang Modern
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            marginBottom: "24px"
          }}>
            Deteksi Dini Penyakit Mata dengan{" "}
            <span className="gradient-text">Kecerdasan Logika Fuzzy</span>
          </h1>

          <p style={{
            fontSize: "1.15rem",
            color: "var(--text-muted)",
            lineHeight: 1.7,
            marginBottom: "36px",
            maxWidth: "760px",
            margin: "0 auto 36px auto"
          }}>
            Sistem pakar klinis modern untuk menganalisis gejala mata Anda dengan metode fungsi keanggotaan
            <strong> Segitiga</strong> dan <strong>Trapesium</strong>. Memberikan estimasi tingkat keparahan yang akurat serta rekomendasi solusi medis secara instan.
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <Link href="/konsultasi" className="btn-primary" style={{ padding: "14px 32px", fontSize: "1rem" }}>
              <Stethoscope size={20} />
              Mulai Konsultasi Gratis
              <ArrowRight size={18} />
            </Link>
            <Link href="/pelatihan" className="btn-secondary" style={{ padding: "14px 28px", fontSize: "1rem" }}>
              <BrainCircuit size={18} />
              Simulasi &amp; Uji Aturan
            </Link>
          </div>

          {/* Quick Metrics */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "20px",
            marginTop: "60px"
          }}>
            <div className="glass-card" style={{ padding: "20px" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#38bdf8" }}>7+</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "4px" }}>
                Penyakit Mata Terdokumentasi
              </div>
            </div>
            <div className="glass-card" style={{ padding: "20px" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#34d399" }}>50+</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "4px" }}>
                Gejala Klinis Bertingkat
              </div>
            </div>
            <div className="glass-card" style={{ padding: "20px" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#fbbf24" }}>2 Metode</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "4px" }}>
                Fuzzy Segitiga &amp; Trapesium
              </div>
            </div>
            <div className="glass-card" style={{ padding: "20px" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#c084fc" }}>Golang</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "4px" }}>
                High-Performance Microsecond API
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Steps Section */}
      <section style={{ padding: "60px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span className="badge badge-blue">Alur Kerja Sistem</span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: "12px", letterSpacing: "-0.02em" }}>
              Diagnosis Cepat dalam 4 Langkah
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "24px"
          }}>
            {[
              {
                step: "01",
                title: "Pilih Kategori & Metode",
                desc: "Pilih kategori penyakit mata serta preferensi metode fungsi keanggotaan fuzzy (Segitiga atau Trapesium).",
                icon: BrainCircuit,
                color: "#38bdf8",
              },
              {
                step: "02",
                title: "Input Gejala & Slider",
                desc: "Centang gejala yang dirasakan lalu tentukan derajat intensitas menggunakan slider interaktif dari ringan hingga parah.",
                icon: Activity,
                color: "#34d399",
              },
              {
                step: "03",
                title: "Penalaran Fuzzy Engine",
                desc: "Sistem mencocokkan rule base, menghitung derajat keanggotaan μ(x), dan melakukan defuzzifikasi rata-rata terbobot.",
                icon: BarChart3,
                color: "#fbbf24",
              },
              {
                step: "04",
                title: "Hasil & Solusi Terarah",
                desc: "Dapatkan persentase keparahan, perbandingan penyakit bergejala mirip, serta saran tindakan medis dari pakar.",
                icon: FileCheck2,
                color: "#c084fc",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="glass-card" style={{ padding: "28px", position: "relative" }}>
                  <div style={{
                    fontSize: "2.5rem",
                    fontWeight: 900,
                    color: "rgba(255,255,255,0.06)",
                    position: "absolute",
                    top: "16px",
                    right: "20px"
                  }}>
                    {item.step}
                  </div>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: `${item.color}15`,
                    border: `1px solid ${item.color}35`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px"
                  }}>
                    <Icon size={24} color={item.color} />
                  </div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "10px" }}>
                    {item.title}
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Covered Diseases Showcase */}
      <section style={{ padding: "60px 0" }}>
        <div className="container">
          <div className="glass-card" style={{ padding: "40px 36px" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "32px",
              flexWrap: "wrap",
              gap: "16px"
            }}>
              <div>
                <span className="badge badge-emerald">Basis Pengetahuan</span>
                <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginTop: "10px" }}>
                  Cakupan Penyakit Mata yang Teridentifikasi
                </h2>
              </div>
              <Link href="/konsultasi" className="btn-secondary btn-sm">
                Uji Pada Pasien <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px"
            }}>
              {[
                {
                  name: "Katarak",
                  status: "Kondisi Lensa Keruh",
                  desc: "Penurunan kejernihan lensa mata yang menyebabkan penglihatan berkabut atau berembun.",
                  tag: "Operasi Terjadwal",
                },
                {
                  name: "Katarak Akut",
                  status: "Stadium Lanjut",
                  desc: "Kekeruhan lensa mata yang sangat pekat dengan gangguan penglihatan signifikan.",
                  tag: "Tindakan Segera",
                },
                {
                  name: "Miopi",
                  status: "Rabun Jauh",
                  desc: "Kelainan refraksi cahaya jatuh di depan retina, memerlukan koreksi kacamata minus.",
                  tag: "Koreksi Lensa",
                },
                {
                  name: "Miopi Akut",
                  status: "Minus Tinggi",
                  desc: "Refraksi minus sedang hingga tinggi yang membutuhkan kontrol berkala terhadap lapisan retina.",
                  tag: "Kontrol Retina",
                },
                {
                  name: "Tidak Diperlukan Operasi",
                  status: "Gejala Ringan",
                  desc: "Lapisan lensa masih tipis sehingga cukup observasi 6 bulan sekali dan gaya hidup sehat.",
                  tag: "Observasi",
                },
                {
                  name: "Kegagalan Operasi Mata",
                  status: "Komplikasi",
                  desc: "Kondisi mata merah hebat dan dislokasi pasca operasi yang memerlukan penanganan darurat.",
                  tag: "Darurat",
                },
              ].map((p, i) => (
                <div
                  key={i}
                  style={{
                    padding: "20px",
                    borderRadius: "var(--radius-sm)",
                    background: "rgba(15, 23, 42, 0.6)",
                    border: "1px solid var(--border-subtle)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <h4 style={{ fontWeight: 700, fontSize: "1.05rem" }}>{p.name}</h4>
                    <span className="badge badge-cyan" style={{ fontSize: "0.68rem" }}>{p.tag}</span>
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#38bdf8", marginBottom: "8px", fontWeight: 600 }}>
                    {p.status}
                  </div>
                  <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: "40px 0 80px 0" }}>
        <div className="container">
          <div style={{
            background: "linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(99, 102, 241, 0.2))",
            border: "1px solid rgba(56, 189, 248, 0.3)",
            borderRadius: "var(--radius-lg)",
            padding: "50px 40px",
            textAlign: "center",
            boxShadow: "0 0 50px rgba(14, 165, 233, 0.15)"
          }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "16px" }}>
              Siap Menganalisis Kondisi Mata Anda?
            </h2>
            <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto 30px auto", lineHeight: 1.6 }}>
              Konsultasi bersifat mandiri, instan, dan dilengkapi penjelasan grafik keanggotaan fuzzy.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/konsultasi" className="btn-primary" style={{ padding: "14px 32px" }}>
                <Stethoscope size={20} />
                Konsultasi Sekarang
              </Link>
              <Link href="/bantuan" className="btn-secondary" style={{ padding: "14px 28px" }}>
                <HelpCircle size={18} />
                Lihat Katalog &amp; Foto Gejala
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
