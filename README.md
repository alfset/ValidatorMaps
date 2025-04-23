#  Validator Galaxy Explorer 🌌

Visualisasi 3D interaktif dari jaringan validator blockchain Cosmos seperti Cosmos Hub, Osmosis, Stargaze, dan lainnya. Proyek ini menampilkan node validator sebagai planet yang mengorbit pusat (chain) dalam tampilan galaksi dengan animasi real-time dan interaksi pengguna.

Dibangun menggunakan **React**, **@react-three/fiber**, dan **drei**, proyek ini memvisualisasikan data blockchain seperti jumlah token, nama validator, dan blok terbaru secara visual.

## 🔧 Fitur Utama

- 🌍 Representasi validator sebagai planet dengan ukuran dan warna dinamis berdasarkan jumlah token.
- 🔄 Orbit animasi dan garis koneksi acak antara validator dan pusat.
- 🔎 Info validator & blok terbaru secara real-time dari API masing-masing chain.
- 🛰️ Pilihan chain (Cosmos Hub, Osmosis, Stargaze, Planq, Akash).
- ✨ Background bintang dan antarmuka bergaya sci-fi.

## 📦 Teknologi
- React + Typescript
- @react-three/fiber (Three.js binding)
- @react-three/drei (HTML overlay, Stars, OrbitControls)
- REST API Cosmos (via Cosmos Directory, dll)

## 📄 Struktur Komponen

- `GalaxyScene.tsx` – Komponen utama yang memuat seluruh tampilan 3D dan interaksi.
- `ValidatorPlanet.tsx` – Komponen planet individual yang mewakili validator.
- `AnimatedConnectionLine.tsx` – Animasi garis koneksi validator ke pusat.
- `cosmosApi.ts` – Ambil data validator dari berbagai chain.
- `fetchLatestBlock.ts` – Ambil informasi blok terbaru untuk chain yang dipilih.

## 📝 TODO

- [ ] Tambahkan label dan ikon chain di pusat planet.
- [ ] Tambahkan animasi masuk/keluar saat berpindah chain.
- [ ] Tambahkan detail lebih lengkap (status, uptime, commission rate).
- [ ] Tambahkan legenda dan petunjuk visual.
- [ ] Buat komponen UI tambahan untuk statistik agregat (total validator, total tokens).
- [ ] Tambah mode gelap/terang (light/dark mode).
- [ ] Tambah fitur klik planet untuk zoom dan highlight interaktif.
- [ ] Tambahkan unit test untuk fungsi fetch API.
- [ ] Optimasi performa untuk banyak validator (chunking, LOD, dll).

## 🚀 Cara Menjalankan

```bash
npm install
npm run dev
```

Buka browser di `http://localhost:3000`


---
