import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "OculoFuzzy — Sistem Pakar Pendeteksian Penyakit Mata (Logika Fuzzy)",
  description:
    "Aplikasi sistem pakar pendeteksian penyakit mata berdasarkan gejala menggunakan metode logika fuzzy (Fungsi Keanggotaan Segitiga & Trapesium) berbasis Golang & Next.js.",
  keywords: [
    "Sistem Pakar",
    "Penyakit Mata",
    "Logika Fuzzy",
    "Fuzzy Segitiga",
    "Fuzzy Trapesium",
    "Katarak",
    "Miopi",
    "Golang",
    "Next.js",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <div className="ambient-bg" />
        <Navbar />
        <main style={{ minHeight: "calc(100vh - 72px - 260px)" }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
