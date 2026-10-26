"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, User, GraduationCap, Code2 } from "lucide-react";

function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export default function KontakPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container" style={{ padding: "40px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px", textAlign: "center", maxWidth: "600px", margin: "0 auto 40px auto" }}>
        <span className="badge badge-cyan" style={{ marginBottom: "8px" }}>
          Informasi &amp; Kontak
        </span>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
          Tentang Pengembang &amp; Riset
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "6px" }}>
          Proyek Skripsi: Pendeteksian Penyakit Mata Berdasarkan Gejala dengan Metode Logika Fuzzy.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px", maxWidth: "1000px", margin: "0 auto" }}>
        {/* Author Bio Card */}
        <div className="glass-card" style={{ padding: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
            <div style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "#ffffff"
            }}>
              FI
            </div>
            <div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Fabrian Ivan</h2>
              <div style={{ color: "#38bdf8", fontSize: "0.88rem", fontWeight: 600 }}>
                Penulis Skripsi &amp; Pengembang
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <GraduationCap size={18} color="#34d399" />
              <span>Skripsi: Sistem Pakar Pendeteksian Penyakit Mata</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Code2 size={18} color="#fbbf24" />
              <span>Arsitektur Baru: Golang REST API + Next.js App Router</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ color: "#38bdf8" }}><GithubIcon size={18} /></span>
              <a
                href="https://github.com/fabrianivan/Skripsi"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#38bdf8", textDecoration: "underline" }}
              >
                github.com/fabrianivan/Skripsi
              </a>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Mail size={18} color="#c084fc" />
              <span>fabrianivan21@gmail.com</span>
            </div>
          </div>

          <div style={{ marginTop: "32px", padding: "16px", background: "rgba(15, 23, 42, 0.6)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", fontSize: "0.82rem", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--text-main)" }}>Catatan Rilis V2:</strong> Aplikasi ini telah direkonstruksi penuh dari basis awal ASP.NET C# menjadi performa tinggi Golang Gin &amp; UI modern Next.js TypeScript.
          </div>
        </div>

        {/* Feedback / Contact Form */}
        <div className="glass-card" style={{ padding: "32px" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px" }}>
            Kirim Pesan atau Masukan
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "20px" }}>
            Punya saran perbaikan atau pertanyaan terkait riset sistem pakar ini?
          </p>

          {submitted ? (
            <div style={{
              padding: "24px",
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "var(--radius-sm)",
              textAlign: "center",
            }}>
              <CheckCircle2 size={36} color="#34d399" style={{ margin: "0 auto 10px auto" }} />
              <h4 style={{ fontWeight: 700, color: "#34d399" }}>Pesan Berhasil Terkirim!</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "6px" }}>
                Terima kasih telah berkontribusi memberikan masukan untuk pengembangan sistem ini.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>
                  Nama Lengkap:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama Anda"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>
                  Alamat Email:
                </label>
                <input
                  type="text"
                  required
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>
                  Isi Pesan:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan pertanyaan atau masukan Anda..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: "8px" }}>
                <Send size={16} /> Kirim Pesan
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
