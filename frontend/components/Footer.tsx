import Link from "next/link";
import { Eye, Heart, ShieldAlert } from "lucide-react";

function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border-subtle)",
      background: "rgba(10, 15, 26, 0.95)",
      padding: "60px 0 30px 0",
      marginTop: "80px",
      fontSize: "0.9rem"
    }}>
      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "40px",
          marginBottom: "50px"
        }}>
          {/* Col 1 */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Eye size={20} color="#ffffff" />
              </div>
              <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>
                Oculo<span className="gradient-text">Fuzzy</span>
              </span>
            </div>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.6, fontSize: "0.85rem", marginBottom: "16px" }}>
              Sistem Pakar Pendeteksian Penyakit Mata Berdasarkan Gejala dengan Metode Logika Fuzzy (Fungsi Keanggotaan Segitiga &amp; Trapesium).
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--text-faint)", fontSize: "0.8rem" }}>
              <span>Dibuat oleh <strong>Fabrian Ivan</strong></span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "16px", color: "var(--text-main)" }}>
              Navigasi Cepat
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              <li>
                <Link href="/" style={{ color: "var(--text-muted)", transition: "color 0.15s" }}>
                  Beranda Sistem
                </Link>
              </li>
              <li>
                <Link href="/konsultasi" style={{ color: "var(--text-muted)", transition: "color 0.15s" }}>
                  Konsultasi Mandiri
                </Link>
              </li>
              <li>
                <Link href="/pelatihan" style={{ color: "var(--text-muted)", transition: "color 0.15s" }}>
                  Pelatihan &amp; Uji Aturan
                </Link>
              </li>
              <li>
                <Link href="/bantuan" style={{ color: "var(--text-muted)", transition: "color 0.15s" }}>
                  Katalog Gejala &amp; Panduan
                </Link>
              </li>
              <li>
                <Link href="/login" style={{ color: "var(--text-muted)", transition: "color 0.15s" }}>
                  Portal Tenaga Medis / Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Medical Disclaimer */}
          <div>
            <div style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              padding: "16px",
              background: "rgba(245, 158, 11, 0.08)",
              border: "1px solid rgba(245, 158, 11, 0.25)",
              borderRadius: "var(--radius-sm)"
            }}>
              <ShieldAlert size={24} color="#f59e0b" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <h5 style={{ fontWeight: 700, color: "#fbbf24", marginBottom: "6px", fontSize: "0.88rem" }}>
                  Disklaimer Medis
                </h5>
                <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", lineHeight: 1.5 }}>
                  Hasil diagnosa ini merupakan estimasi berbasis penalaran komputer (Sistem Pakar Logika Fuzzy). Untuk penanganan definitif, lakukan pemeriksaan langsung ke dokter spesialis mata.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "24px",
          borderTop: "1px solid var(--border-subtle)",
          color: "var(--text-faint)",
          fontSize: "0.8rem",
          flexWrap: "wrap",
          gap: "12px"
        }}>
          <div>
            © 2026 Skripsi Fabrian Ivan — Implementasi Modern Golang &amp; Next.js
          </div>
          <a
            href="https://github.com/fabrianivan/Skripsi"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--text-muted)",
              transition: "color 0.15s"
            }}
          >
            <GithubIcon size={16} />
            github.com/fabrianivan/Skripsi
          </a>
        </div>
      </div>
    </footer>
  );
}
