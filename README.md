# OculoFuzzy — Sistem Pakar Pendeteksian Penyakit Mata (Logika Fuzzy)
> **Versi Rekayasa Ulang Modern dalam Golang & Next.js**  
> Diadaptasi dari repositori Skripsi [fabrianivan/Skripsi](https://github.com/fabrianivan/Skripsi).

---

## 🌟 Ringkasan Pembaruan Arsitektur

| Komponen | Implementasi Awal (ASP.NET MVC C#) | Implementasi Baru (Modern Stack) |
|---|---|---|
| **Backend** | .NET Core / ASP.NET MVC / C# | **Golang 1.26** dengan **Gin Engine** & **GORM** |
| **Frontend** | Razor Views (`.cshtml`), jQuery, Bootstrap 3 | **Next.js 16 (App Router)**, **TypeScript**, Modern Glassmorphic CSS |
| **Basis Data** | Microsoft SQL Server (`.mdf`) | **Pure-Go SQLite** (tanpa ketergantungan driver eksternal CGO) |
| **Autentikasi** | ASP.NET Cookie Auth | **JWT (JSON Web Token)** & **Bcrypt** Password Hashing |
| **Mesin Fuzzy** | C# Functions (Segitiga & Trapesium) | **Golang High-Throughput Fuzzy Engine** (Sub-millisecond) |
| **Visualisasi Kurva** | Chart.js 1.x script inline | **Chart.js + React-Chartjs-2** (Kurva dinamis real-time) |

---

## 🔬 Metode & Algoritma Sistem Pakar

1. **Fungsi Keanggotaan Fuzzy (Membership Functions)**:
   - **Metode Segitiga (Triangular)**: Titik puncak linear tunggal di tengah interval.
   - **Metode Trapesium (Trapezoidal)**: Rentang puncak datar (plateau $\mu = 1.0$) di area tengah.
2. **Defuzzifikasi Centroid / Weighted Average**:
   $$\text{Tingkat Keparahan} = \frac{\sum_{i=1}^{n} (\mu_i \times x_i)}{\sum_{i=1}^{n} \mu_i} \times 100\%$$
3. **Kategori Keparahan Kualitatif**:
   - $\le 25\%$: **Ringan**
   - $26\% - 50\%$: **Agak Parah**
   - $51\% - 75\%$: **Parah**
   - $> 75\%$: **Sangat Parah**
4. **Basis Pengetahuan & Aturan (Rule Base)**:
   - Aturan diderivasi secara otomatis dari riwayat kasus pasien (**Rekam Medik**).

---

## 📂 Struktur Direktori Proyek

```
skripsi-mata-go-next/
├── backend/                  # RESTful API Service (Golang)
│   ├── database/             # GORM SQLite & Auto Seed Data
│   ├── fuzzy/                # Engine Logika Fuzzy (Segitiga & Trapesium)
│   ├── handlers/             # HTTP Handlers (Konsultasi, Penyakit, Gejala, dll.)
│   ├── models/               # Model Database & DTOs
│   ├── uploads/              # Direktori File Gambar Gejala
│   └── main.go               # Server Entrypoint (Port 8080)
│
├── frontend/                 # Client Interface (Next.js App Router)
│   ├── app/
│   │   ├── page.tsx          # Beranda Utama
│   │   ├── konsultasi/       # Halaman Diagnosa Mandiri Pasien
│   │   ├── pelatihan/        # Halaman Simulasi & Komparasi Metode
│   │   ├── bantuan/          # Panduan & Katalog Foto Gejala
│   │   ├── kontak/           # Profil Peneliti & Feedback
│   │   ├── login/            # Portal Masuk Admin
│   │   ├── admin/            # Dashboard Manajemen Data Medis
│   │   ├── globals.css       # Design System & Token Warna
│   │   └── layout.tsx        # Shell Layout & Navbar
│   ├── components/           # Navbar, Footer, FuzzyChart
│   └── lib/api.ts            # Client API Terintegrasi
└── README.md
```

---

## 🚀 Panduan Menjalankan Aplikasi

### 1. Menjalankan Backend Golang

```bash
cd backend
go run main.go
# Server berjalan di http://localhost:8080
```

Akun bawaan untuk portal administrator:
- **Username**: `admin`
- **Password**: `admin123`

### 2. Menjalankan Frontend Next.js

```bash
cd frontend
npm run dev
# Frontend berjalan di http://localhost:3000
```

---

## 🩺 Modul-Modul yang Tersedia

1. **Konsultasi Pasien**:
   - Pemilihan metode fungsi keanggotaan Segitiga vs Trapesium.
   - Pohon gejala hierarkis (Induk & Sub-gejala).
   - Slider keparahan interaktif [0.00 – 1.00] dengan indikator istilah linguistik.
   - Grafik kurva fuzzy real-time menggunakan Chart.js.
   - Laporan komprehensif: Gejala terpicu, Rule terpicu, Ranking kemungkinan penyakit, dan Solusi medis dari dokter spesialis mata.
2. **Pelatihan & Simulasi**:
   - Uji perbandingan berdampingan (*side-by-side*) metode Segitiga vs Trapesium.
   - Preset pengujian instan (Kasus Katarak & Miopi).
3. **Katalog Bantuan & Ilustrasi**:
   - Panduan operasional sistem per modul.
   - Katalog foto manifestasi klinis gejala mata.
4. **Dashboard Admin**:
   - Manajemen Pengguna Admin.
   - CRUD Kategori Penyakit.
   - CRUD Penyakit & Rekomendasi Solusi Medis.
   - CRUD Gejala & Batasan Interval Min/Max.
   - Input Kasus Rekam Medik Baru.
   - Rekalkulasi Matriks Rules Otomatis.
