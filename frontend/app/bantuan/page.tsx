"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  HelpCircle,
  BookOpen,
  Image as ImageIcon,
  ShieldCheck,
  Stethoscope,
  BrainCircuit,
  Search,
  X,
  Eye,
  Info,
} from "lucide-react";
import { api, Gejala } from "@/lib/api";

export default function BantuanPage() {
  const [activeTab, setActiveTab] = useState<string>("ilustrasi");
  const [gejalaList, setGejalaList] = useState<Gejala[]>([]);
  const [search, setSearch] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<{
    src: string;
    title: string;
    category?: string;
    interval?: number;
    min?: number;
    max?: number;
  } | null>(null);

  useEffect(() => {
    api.getAllGejala().then((data) => {
      setGejalaList(data);
    });
  }, []);

  const filteredGejala = gejalaList.filter((g) =>
    g.nama_gejala.toLowerCase().includes(search.toLowerCase())
  );

  const tabs = [
    { id: "ilustrasi", label: "Ilustrasi & Foto Gejala", icon: ImageIcon },
    { id: "utama", label: "Modul Utama", icon: BookOpen },
    { id: "konsultasi", label: "Modul Konsultasi", icon: Stethoscope },
    { id: "pelatihan", label: "Modul Pelatihan", icon: BrainCircuit },
    { id: "admin", label: "Modul Admin", icon: ShieldCheck },
  ];

  return (
    <div className="container" style={{ padding: "40px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <span className="badge badge-cyan" style={{ marginBottom: "8px" }}>
          Pusat Bantuan &amp; Edukasi
        </span>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
          Panduan Penggunaan &amp; Ilustrasi Klinis
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "6px" }}>
          Petunjuk pengoperasian sistem dan katalog visual manifestasi gejala penyakit mata.
        </p>
      </div>

      {/* Tabs Bar */}
      <div style={{
        display: "flex",
        gap: "8px",
        borderBottom: "1px solid var(--border-subtle)",
        paddingBottom: "12px",
        marginBottom: "28px",
        overflowX: "auto"
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.9rem",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                background: isActive ? "rgba(14, 165, 233, 0.15)" : "transparent",
                color: isActive ? "#38bdf8" : "var(--text-muted)",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap"
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content: Ilustrasi Gejala */}
      {activeTab === "ilustrasi" && (
        <div>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "16px"
          }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
              Katalog Visual Gejala ({filteredGejala.length} item)
            </h3>
            <div style={{ position: "relative", minWidth: "280px" }}>
              <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="Cari nama gejala..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: "36px" }}
              />
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px"
          }}>
            {filteredGejala.map((g) => {
              const imageSrc = g.gambar_gejala && g.gambar_gejala !== "notfound.jpg"
                ? `/images/${g.gambar_gejala}`
                : "/images/notfound.jpg";

              const parentGejala = gejalaList.find((p) => p.id_gejala === g.parent_id);

              return (
                <div
                  key={g.id_gejala}
                  className="glass-card"
                  onClick={() => setPreviewImage({
                    src: imageSrc,
                    title: g.nama_gejala,
                    category: parentGejala ? parentGejala.nama_gejala : "Gejala Induk",
                    interval: g.interval,
                    min: g.min,
                    max: g.max
                  })}
                  style={{
                    padding: "18px",
                    display: "flex",
                    gap: "16px",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "transform 0.15s ease, border-color 0.15s ease",
                  }}
                >
                  <div style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    flexShrink: 0,
                    background: "#0f172a",
                    border: "1px solid var(--border-subtle)",
                    position: "relative"
                  }}>
                    <Image
                      src={imageSrc}
                      alt={g.nama_gejala}
                      fill
                      sizes="80px"
                      style={{ objectFit: "cover" }}
                    />
                    <div style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: "rgba(0,0,0,0.6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "2px 0"
                    }}>
                      <Eye size={12} color="#38bdf8" />
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.75rem", color: "#38bdf8", fontWeight: 700, textTransform: "uppercase" }}>
                      {parentGejala ? parentGejala.nama_gejala : "Gejala Induk"}
                    </div>
                    <h4 style={{ fontSize: "0.92rem", fontWeight: 700, marginTop: "2px", lineHeight: 1.4 }}>
                      {g.nama_gejala}
                    </h4>
                    <div style={{ display: "flex", gap: "8px", marginTop: "8px", fontSize: "0.75rem", color: "var(--text-faint)" }}>
                      <span>Interval: {g.interval ? g.interval.toFixed(2) : "0.00"}</span>
                      <span>•</span>
                      <span>Min: {g.min.toFixed(1)}</span>
                      <span>•</span>
                      <span>Max: {g.max.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content: Modul Utama */}
      {activeTab === "utama" && (
        <div className="glass-card" style={{ padding: "36px" }}>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "16px" }}>
            Modul Utama Sistem
          </h3>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "20px" }}>
            Modul utama merupakan modul yang muncul pada saat pertama kali menjalankan sistem. Pada modul ini terdapat beberapa tombol dan navigasi yang digunakan untuk mengakses modul lainnya:
          </p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "16px" }}>
            <li style={{ padding: "16px", background: "rgba(15, 23, 42, 0.6)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
              <strong style={{ color: "#38bdf8" }}>⦁ Menu Konsultasi:</strong> Mengakses modul diagnosa interaktif pasien mandiri.
            </li>
            <li style={{ padding: "16px", background: "rgba(15, 23, 42, 0.6)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
              <strong style={{ color: "#34d399" }}>⦁ Menu Pelatihan:</strong> Mengakses modul simulasi dan uji komparasi fungsi keanggotaan logika fuzzy.
            </li>
            <li style={{ padding: "16px", background: "rgba(15, 23, 42, 0.6)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
              <strong style={{ color: "#fbbf24" }}>⦁ Menu Bantuan:</strong> Informasi cara menggunakan setiap fungsi dan katalog visual gejala.
            </li>
            <li style={{ padding: "16px", background: "rgba(15, 23, 42, 0.6)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
              <strong style={{ color: "#c084fc" }}>⦁ Menu Admin:</strong> Mengakses dashboard pengelolaan data penyakit, gejala, dan rekam medik.
            </li>
          </ul>
        </div>
      )}

      {/* Tab Content: Modul Konsultasi */}
      {activeTab === "konsultasi" && (
        <div className="glass-card" style={{ padding: "36px" }}>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "16px" }}>
            Cara Menggunakan Modul Konsultasi
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", color: "var(--text-muted)", lineHeight: 1.7 }}>
            <p>1. Klik menu <strong>Konsultasi</strong> pada navbar atas.</p>
            <p>2. Pilih metode fungsi keanggotaan fuzzy yang ingin digunakan: <strong>Segitiga</strong> atau <strong>Trapesium</strong>.</p>
            <p>3. Pilih kategori penyakit mata.</p>
            <p>4. Buka grup gejala klinis lalu centang gejala-gejala yang diderita. Atur intensitas keparahan menggunakan slider.</p>
            <p>5. Klik tombol <strong>Jalankan Diagnosa</strong>.</p>
            <p>6. Sistem akan menampilkan daftar gejala terpicu, aturan terkait, ranking persentase penyakit, dan solusi medis teratas.</p>
          </div>
        </div>
      )}

      {/* Tab Content: Modul Pelatihan */}
      {activeTab === "pelatihan" && (
        <div className="glass-card" style={{ padding: "36px" }}>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "16px" }}>
            Cara Menggunakan Modul Pelatihan &amp; Uji Aturan
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", color: "var(--text-muted)", lineHeight: 1.7 }}>
            <p>Modul ini berfungsi untuk melatih data penyakit dan membandingkan perilaku fungsi keanggotaan logika fuzzy.</p>
            <p>1. Klik menu <strong>Pelatihan</strong> pada navigasi.</p>
            <p>2. Anda dapat memilih preset kasus cepat seperti &quot;Kasus Kecurigaan Katarak&quot; atau &quot;Kasus Kecurigaan Miopi&quot;.</p>
            <p>3. Sesuaikan nilai interval masing-masing gejala uji.</p>
            <p>4. Klik <strong>Jalankan Komparasi</strong> untuk melihat kalkulasi simultan antara metode Segitiga dan Trapesium secara berdampingan.</p>
          </div>
        </div>
      )}

      {/* Tab Content: Modul Admin */}
      {activeTab === "admin" && (
        <div className="glass-card" style={{ padding: "36px" }}>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "16px" }}>
            Panduan Pengelolaan Modul Admin
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", color: "var(--text-muted)", lineHeight: 1.7 }}>
            <p>Modul Admin memberikan wewenang penuh kepada pakar/dokter mata untuk memodifikasi basis pengetahuan:</p>
            <p>⦁ <strong>Kelola Akun Admin:</strong> Tambah admin baru, reset password, atau hapus admin.</p>
            <p>⦁ <strong>Kelola Kategori &amp; Penyakit:</strong> Mengubah nama penyakit dan solusi medis rekomendasi.</p>
            <p>⦁ <strong>Kelola Gejala:</strong> Menyesuaikan struktur hierarki parent-child, batas interval min-max, serta foto gejala.</p>
            <p>⦁ <strong>Rekam Medik Pasien:</strong> Memasukkan riwayat kasus pasien terdokumentasi (kombinasi gejala dan penyakit terkonfirmasi).</p>
            <p>⦁ <strong>Rules Matrix:</strong> Matriks aturan inferensi fuzzy yang otomatis diperbarui dari data rekam medik.</p>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
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
              maxWidth: "680px",
              width: "100%",
              padding: "26px",
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
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#ffffff" }}>
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
              height: "400px",
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
                sizes="680px"
                style={{ objectFit: "contain" }}
              />
            </div>

            <div style={{
              marginTop: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
              padding: "12px 16px",
              borderRadius: "8px",
              background: "rgba(14, 165, 233, 0.08)",
              border: "1px solid rgba(56, 189, 248, 0.2)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Info size={16} color="#38bdf8" />
                <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                  Interval Baku Sistem: <strong>{previewImage.interval?.toFixed(2)}</strong> (Rentang {previewImage.min?.toFixed(1)} - {previewImage.max?.toFixed(1)})
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
