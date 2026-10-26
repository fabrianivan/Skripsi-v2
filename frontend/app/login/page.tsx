"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, Eye, AlertCircle, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      await api.login(username, password);
      router.push("/admin");
    } catch (err: unknown) {
      const e = err as Error;
      setErrorMsg(e.message || "Gagal masuk. Periksa username dan password.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = () => {
    setUsername("admin");
    setPassword("admin123");
  };

  return (
    <div className="container" style={{ padding: "80px 24px", display: "flex", justifyContent: "center" }}>
      <div className="glass-card" style={{ width: "100%", maxWidth: "440px", padding: "40px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px auto",
            boxShadow: "0 0 25px rgba(14, 165, 233, 0.4)"
          }}>
            <Lock size={28} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>Portal Admin</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "4px" }}>
            Masuk untuk mengelola data penyakit, gejala &amp; aturan
          </p>
        </div>

        {errorMsg && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 14px",
            background: "rgba(244, 63, 94, 0.15)",
            border: "1px solid rgba(244, 63, 94, 0.3)",
            borderRadius: "var(--radius-sm)",
            color: "#fb7185",
            fontSize: "0.85rem",
            marginBottom: "20px"
          }}>
            <AlertCircle size={16} />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>
              Username Admin:
            </label>
            <div style={{ position: "relative" }}>
              <User size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                required
                placeholder="Contoh: admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingLeft: "36px" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>
              Password:
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: "36px" }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: "100%", padding: "14px", marginTop: "10px" }}
          >
            {loading ? "Memproses..." : "Masuk ke Dashboard"}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Quick Demo Credentials Box */}
        <div style={{
          marginTop: "28px",
          padding: "16px",
          background: "rgba(15, 23, 42, 0.6)",
          borderRadius: "var(--radius-sm)",
          border: "1px dashed var(--border-subtle)",
          textAlign: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "0.78rem", color: "#38bdf8", fontWeight: 600 }}>
            <ShieldCheck size={14} /> Akun Pengujian Bawaan Sistem
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Username: <code>admin</code> • Password: <code>admin123</code>
          </div>
          <button
            type="button"
            onClick={handleQuickLogin}
            className="btn-secondary btn-sm"
            style={{ marginTop: "10px", fontSize: "0.78rem", width: "100%" }}
          >
            Gunakan Akun Bawaan Otomatis
          </button>
        </div>
      </div>
    </div>
  );
}
