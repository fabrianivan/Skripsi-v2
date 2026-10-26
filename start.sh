#!/bin/bash

# Script untuk menjalankan Backend Golang dan Frontend Next.js secara bersamaan
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=========================================================="
echo "  Memulai OculoFuzzy — Sistem Pakar Penyakit Mata"
echo "=========================================================="

# 1. Jalankan Backend Golang di latar belakang (Port 8080)
echo "[1/2] Menjalankan Backend Golang (Port 8080)..."
cd "$ROOT_DIR/backend"
if [ ! -f "skripsi-mata-backend" ]; then
    echo "Mengompilasi binary Golang..."
    go build -o skripsi-mata-backend main.go
fi
./skripsi-mata-backend &
BACKEND_PID=$!
echo "Backend aktif dengan PID: $BACKEND_PID"

# Fungsi cleanup ketika user menekan CTRL+C
cleanup() {
    echo ""
    echo "Menghentikan layanan..."
    kill $BACKEND_PID 2>/dev/null
    exit 0
}
trap cleanup SIGINT SIGTERM

# Tunggu sejenak agar backend siap
sleep 2

# 2. Jalankan Frontend Next.js (Port 3000)
echo "[2/2] Menjalankan Frontend Next.js di http://localhost:3000..."
cd "$ROOT_DIR/frontend"
npm run dev

# Tunggu proses backend jika frontend berhenti
wait $BACKEND_PID
