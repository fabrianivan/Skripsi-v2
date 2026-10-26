"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface FuzzyChartProps {
  metode: number; // 0 = Segitiga, 1 = Trapesium
  gejalaName: string;
  intervalValue: number;
}

export default function FuzzyChart({
  metode,
  gejalaName,
  intervalValue,
}: FuzzyChartProps) {
  // Method 0: Segitiga (top = 2), Method 1: Trapesium (top = 1)
  const top = metode === 0 ? 2 : 1;

  // X-Axis labels from 0.0 to 1.0
  const labels = ["0.0", "0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9", "1.0"];

  // Curve definition matching original C# thesis formulas:
  const dataRingan = [1, 0.8, 0.5, 0.2, 0, null, null, null, null, null, null];
  const dataSedang = [null, null, null, 0, 0.5, top === 2 ? 1 : 0.9, 0.5, 0, null, null, null];
  const dataParah = [null, null, null, null, null, null, 0, 0.4, 0.8, 1, 1];

  // Point for the user's selected interval value
  const userPoint = new Array(11).fill(null);
  const roundedIdx = Math.min(10, Math.max(0, Math.round(intervalValue * 10)));
  userPoint[roundedIdx] = 0.5;

  const data = {
    labels,
    datasets: [
      {
        label: "Ringan",
        data: dataRingan,
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.12)",
        fill: true,
        tension: 0.2,
        borderWidth: 2,
        pointRadius: 0,
      },
      {
        label: "Sedang",
        data: dataSedang,
        borderColor: "#0ea5e9",
        backgroundColor: "rgba(14, 165, 233, 0.12)",
        fill: true,
        tension: 0.2,
        borderWidth: 2,
        pointRadius: 0,
      },
      {
        label: "Parah",
        data: dataParah,
        borderColor: "#f43f5e",
        backgroundColor: "rgba(244, 63, 94, 0.12)",
        fill: true,
        tension: 0.2,
        borderWidth: 2,
        pointRadius: 0,
      },
      {
        label: `Input Pasien (${intervalValue.toFixed(2)})`,
        data: userPoint,
        borderColor: "#fbbf24",
        backgroundColor: "#fbbf24",
        pointRadius: 6,
        pointHoverRadius: 8,
        showLine: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#cbd5e1",
          font: { size: 10, family: "Plus Jakarta Sans" },
          boxWidth: 8,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: `Fungsi Keanggotaan: ${gejalaName}`,
        color: "#f8fafc",
        font: { size: 11, weight: "bold" as const, family: "Outfit" },
        padding: { bottom: 8 },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleColor: "#38bdf8",
        bodyColor: "#f8fafc",
        borderColor: "rgba(255, 255, 255, 0.15)",
        borderWidth: 1,
        padding: 8,
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(255, 255, 255, 0.04)" },
        ticks: { color: "#64748b", font: { size: 9 } },
        title: {
          display: true,
          text: "Nilai Interval (x)",
          color: "#64748b",
          font: { size: 9 },
        },
      },
      y: {
        grid: { color: "rgba(255, 255, 255, 0.04)" },
        ticks: { color: "#64748b", font: { size: 9 } },
        title: {
          display: true,
          text: "Derajat μ(x)",
          color: "#64748b",
          font: { size: 9 },
        },
        min: 0,
        max: 1.2,
      },
    },
  };

  return (
    <div style={{
      width: "100%",
      height: "220px",
      background: "rgba(10, 16, 30, 0.75)",
      borderRadius: "var(--radius-sm)",
      padding: "12px",
      border: "1px solid var(--border-subtle)",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.4)",
    }}>
      <Line data={data} options={options} />
    </div>
  );
}
