"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Eye,
  Stethoscope,
  BrainCircuit,
  HelpCircle,
  Phone,
  Lock,
  LogOut,
  User,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { getSavedAdmin, removeAuthToken, AdminUser } from "@/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setAdmin(getSavedAdmin());
  }, [pathname]);

  const handleLogout = () => {
    removeAuthToken();
    setAdmin(null);
    window.location.href = "/";
  };

  const navLinks = [
    { href: "/", label: "Beranda", icon: Eye },
    { href: "/konsultasi", label: "Konsultasi", icon: Stethoscope },
    { href: "/pelatihan", label: "Pelatihan", icon: BrainCircuit },
    { href: "/bantuan", label: "Bantuan & Ilustrasi", icon: HelpCircle },
    { href: "/kontak", label: "Kontak", icon: Phone },
  ];

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "rgba(5, 8, 17, 0.8)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      borderBottom: "1px solid var(--border-subtle)"
    }}>
      <div className="container" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "76px"
      }}>
        {/* Brand Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "44px",
            height: "44px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #0284c7, #6366f1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 25px rgba(2, 132, 199, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            position: "relative"
          }}>
            <Eye size={24} color="#ffffff" />
            <div style={{
              position: "absolute",
              top: "-2px",
              right: "-2px",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#10b981",
              boxShadow: "0 0 8px #10b981"
            }} />
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: "1.2rem", letterSpacing: "-0.03em", fontFamily: "Outfit, sans-serif" }}>
              Oculo<span className="gradient-text-cyan">Fuzzy</span>
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 600 }}>
              Sistem Pakar Penyakit Mata
            </div>
          </div>
        </Link>

        {/* Desktop Navigation items */}
        <nav style={{
          display: "none",
          alignItems: "center",
          gap: "4px",
          background: "rgba(13, 21, 38, 0.6)",
          padding: "4px 8px",
          borderRadius: "var(--radius-full)",
          border: "1px solid var(--border-subtle)",
        }}
        className="desktop-nav"
        >
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "8px 16px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.86rem",
                  fontFamily: "Outfit, sans-serif",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#ffffff" : "var(--text-muted)",
                  background: isActive ? "linear-gradient(135deg, #0284c7, #2563eb)" : "transparent",
                  boxShadow: isActive ? "0 2px 12px rgba(14, 165, 233, 0.4)" : "none",
                  transition: "all 0.2s ease"
                }}
              >
                <Icon size={15} color={isActive ? "#ffffff" : "var(--text-muted)"} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Admin Section Desktop */}
        <div style={{ display: "none", alignItems: "center", gap: "10px" }} className="desktop-actions">
          {admin ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Link
                href="/admin"
                className="badge badge-emerald pulse-badge"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "8px 16px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <User size={14} />
                {admin.username_admin}
              </Link>
              <button
                onClick={handleLogout}
                title="Keluar"
                className="btn-danger btn-sm"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "8px 12px",
                  cursor: "pointer"
                }}
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                padding: "8px 18px",
                borderRadius: "var(--radius-full)",
                fontSize: "0.85rem",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 600,
                background: "rgba(255, 255, 255, 0.05)",
                color: "var(--text-main)",
                border: "1px solid var(--border-card)",
                transition: "all 0.2s ease"
              }}
            >
              <Lock size={14} color="#38bdf8" />
              Portal Admin
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="btn-secondary btn-sm mobile-toggle"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 12px" }}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div style={{
          padding: "16px 24px 24px 24px",
          background: "rgba(8, 13, 26, 0.98)",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.92rem",
                  fontWeight: 600,
                  color: isActive ? "#38bdf8" : "var(--text-secondary)",
                  background: isActive ? "rgba(14, 165, 233, 0.15)" : "transparent",
                }}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
          <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid var(--border-subtle)" }}>
            {admin ? (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  style={{ color: "#34d399", fontWeight: 700, fontSize: "0.9rem" }}
                >
                  Dashboard ({admin.username_admin})
                </Link>
                <button onClick={handleLogout} className="btn-danger btn-sm">
                  Keluar
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="btn-secondary"
                style={{ width: "100%", justifyContent: "center" }}
              >
                <Lock size={15} /> Masuk Portal Admin
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Responsive CSS helper */}
      <style jsx>{`
        @media (min-width: 860px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-actions {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
