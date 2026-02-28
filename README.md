<div align="center">

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ███████╗ ██████╗██╗███████╗███╗   ██╗ ██████╗███████╗     ║
║   ██╔════╝██╔════╝██║██╔════╝████╗  ██║██╔════╝██╔════╝     ║
║   ███████╗██║     ██║█████╗  ██╔██╗ ██║██║     █████╗       ║
║   ╚════██║██║     ██║██╔══╝  ██║╚██╗██║██║     ██╔══╝       ║
║   ███████║╚██████╗██║███████╗██║ ╚████║╚██████╗███████╗     ║
║   ╚══════╝ ╚═════╝╚═╝╚══════╝╚═╝  ╚═══╝ ╚═════╝╚══════╝     ║
║                                                               ║
║              L A B   V I R T U A L  ⚛                        ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

**Platform eksperimen sains interaktif berbasis web.**  
Visualisasikan hukum fisika langsung di browser — tanpa instalasi, tanpa backend.

<br>

[![Deploy Status](https://img.shields.io/badge/deploy-GitHub%20Pages-00d4ff?style=for-the-badge&logo=github)](https://github.com)
[![Vanilla JS](https://img.shields.io/badge/built%20with-Vanilla%20JS-f59e0b?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![No Framework](https://img.shields.io/badge/framework-none-10b981?style=for-the-badge)](.)
[![Physics Engine](https://img.shields.io/badge/physics-Newton%20%7C%20Euler-8b5cf6?style=for-the-badge)](.)
[![License](https://img.shields.io/badge/license-MIT-f43f5e?style=for-the-badge)](LICENSE)

<br>

[**🚀 Live Demo**](https://yourusername.github.io/science-lab) · [**📖 Dokumentasi**](#arsitektur) · [**🧪 Eksperimen**](#eksperimen) · [**🤝 Kontribusi**](#kontribusi)

<br>

![ScienceLab Virtual Screenshot](https://via.placeholder.com/900x500/0f172a/00d4ff?text=ScienceLab+Virtual+—+Gravity+Simulation)

</div>

---

## ⚡ Apa Ini?

**ScienceLab Virtual** adalah platform eksperimen sains modular yang berjalan sepenuhnya di browser. Dibangun dengan arsitektur **OOP class-based** dan **physics engine** yang reusable — satu engine, banyak eksperimen.

Proyek ini dirancang sebagai:
- 🎯 **Portfolio profesional** — menunjukkan pemahaman mendalam tentang fisika, matematika, dan arsitektur software
- 🧱 **Fondasi scalable** — siap dikembangkan ke simulasi 3D dengan Three.js
- 📚 **Alat edukasi** — mode tutorial step-by-step untuk pelajar sains

```
F = G · m₁ · m₂ / r²        v = √(G·M/r)        E_total = KE + PE = konstan
```

---

## 🌌 Fitur Utama

### 🔭 Simulasi Gravitasi Multi-Body
- Implementasi **Hukum Gravitasi Universal Newton** (N-body)
- **Trail orbit** semi-transparan untuk visualisasi lintasan
- **Energi real-time**: Kinetik (KE), Potensial (PE), Total (E)
- **Klik canvas** untuk menambah benda baru di posisi yang diinginkan
- Kecepatan orbit stabil dihitung otomatis: `v = √(G·M/r)`
- Softening factor untuk mencegah singularitas saat benda berdekatan

### 🎛️ Panel Kontrol Interaktif
- Slider konstanta gravitasi **G** dengan efek real-time
- Input parameter: massa, radius orbit, kecepatan awal (Vx, Vy)
- Tombol Start / Pause / Reset
- **Terminal log** berbasis waktu untuk setiap aksi

### 📊 Data Real-Time
- FPS counter
- Jarak antar benda (semua pasangan)
- Energi kinetik, potensial, dan total sistem
- Jumlah objek aktif

### 🎓 Mode Tutorial
- 5 langkah step-by-step: dari teori hingga orbit stabil
- Penjelasan rumus matematika setiap langkah
- Overlay animasi non-blocking

### 🎨 Cyber-Science Aesthetic
- Dark futuristic (`#0f172a`, `#020617`)
- Neon cyan glow + glassmorphism panel
- Binary rain background animation
- Animated particle network di hero section
- Responsive mobile-first

---

## 🧪 Eksperimen

| # | Eksperimen | Status | Fisika |
|---|-----------|--------|--------|
| 01 | 🌌 Gravitasi Universal | ✅ **Live** | F = Gm₁m₂/r² |
| 02 | ⚡ Elektrostatika | 🔜 Coming Soon | F = kq₁q₂/r² |
| 03 | 🌊 Gelombang & Interferensi | 🔜 Coming Soon | y = A·sin(kx−ωt) |
| 04 | 🔴 Pendulum & Chaos | 🔜 Coming Soon | θ̈ = −(g/L)·sinθ |
| 05 | 🧬 Simulasi Ekosistem | 🔜 Coming Soon | Lotka-Volterra |
| 06 | 🪐 Tata Surya 3D | 🔜 Coming Soon | Three.js + N-body |

---

## 🏗️ Arsitektur

```
science-lab/
│
├── index.html                    ← Homepage + hero + experiment catalog
│
├── experiments/
│   └── gravity.html              ← Experiment page (canvas + sidebar)
│
├── css/
│   ├── main.css                  ← Design tokens, reset, typography, buttons
│   ├── layout.css                ← Navbar, hero, grid, experiment layout
│   └── components.css            ← Tutorial overlay, terminal, tooltips, orbs
│
└── js/
    ├── main.js                   ← Entry: binary rain, hero particles, navbar
    │
    ├── core/                     ← 🔧 Reusable physics engine (experiment-agnostic)
    │   ├── vector.js             ← Vector2D math (add, sub, scale, normalize, dot)
    │   ├── physics-engine.js     ← RAF loop + deltaTime + force registration
    │   └── physics-object.js     ← Base class: mass, position, velocity, Euler integration
    │
    ├── ui/
    │   ├── controls.js           ← DOM → experiment API binding + live stats
    │   └── tutorial.js           ← Step-by-step overlay system
    │
    └── experiments/
        └── gravity.js            ← N-body gravity: forces, rendering, trail, energy
```

### Design Principles

```
┌─────────────────────────────────────────────────┐
│  SEPARATION OF CONCERNS                         │
│                                                 │
│  Logic Layer    →  core/physics-engine.js       │
│  Data Layer     →  core/physics-object.js       │
│  Math Layer     →  core/vector.js               │
│  Render Layer   →  experiments/gravity.js       │
│  UI Layer       →  ui/controls.js               │
└─────────────────────────────────────────────────┘
```

Setiap lapisan bisa diubah atau diganti **tanpa menyentuh lapisan lain**.

---

## ⚙️ Physics Engine

### Newton's Law of Universal Gravitation
```
F = G · m₁ · m₂ / r²

Implementasi N-body: setiap pasangan dihitung, kompleksitas O(n²)
Softening factor: r_eff = max(r, (r₁ + r₂) / 2)  →  mencegah singularitas
```

### Euler Integration (per frame)
```
a  =  F / m
v  +=  a · Δt
x  +=  v · Δt
F  =  0  (reset setiap frame)
```

### Stable Orbit Velocity
```
Gaya gravitasi = Gaya sentripetal
G·M·m/r² = m·v²/r
→  v = √(G·M/r)
```

### Energy System
```
KE  =  ½ · m · v²
PE  =  −G · m₁ · m₂ / r
E   =  KE + PE  (konservatif dalam sistem terisolasi)
```

### Menambahkan Force Type Baru
```javascript
// physics-engine.js menerima fungsi force sebagai plugin
engine.addForce((objects) => {
  // contoh: drag force
  for (const obj of objects) {
    const drag = obj.velocity.scale(-0.01 * obj.velocity.magnitude());
    obj.applyForce(drag);
  }
});
```

---

## 🚀 Deploy ke GitHub Pages

### 1. Clone & Setup
```bash
git clone https://github.com/TuanmudaJannZ/science-lab.git
cd science-lab
```

### 2. Jalankan Lokal
```bash
# Gunakan server lokal (REQUIRED untuk ES modules)
npx serve .
# atau
python -m http.server 8080
# → buka http://localhost:8080
```

> ⚠️ **Jangan buka langsung sebagai file:///** — ES modules membutuhkan HTTP server.

### 3. Deploy
```bash
git add .
git commit -m "🚀 Initial deploy — ScienceLab Virtual"
git push origin main
```

Kemudian di GitHub: **Settings → Pages → Source: main branch → / (root)**

### 4. Custom Domain (Opsional)
```bash
echo "yourdomain.com" > CNAME
git add CNAME && git commit -m "Add custom domain" && git push
```

Tambahkan A record di DNS provider:
```
A  @  185.199.108.153
A  @  185.199.109.153
A  @  185.199.110.153
A  @  185.199.111.153
```

---

## 🔮 Roadmap

```
v1.0  ✅  Gravity N-body + physics engine core
v1.1  🔜  Electrostatics (Coulomb's Law)
v1.2  🔜  Wave interference simulator
v1.3  🔜  Double pendulum + chaos visualization
v2.0  🔜  3D Solar System (Three.js)
v2.1  🔜  Ecosystem simulation (Lotka-Volterra)
v3.0  🔜  User accounts + experiment save/share
```

---

## 🛠️ Stack Teknologi

| Layer | Teknologi | Alasan |
|-------|-----------|--------|
| Language | Vanilla JavaScript ES6+ | Zero dependency, performance |
| Architecture | OOP Class-based | Modular, testable, extensible |
| Rendering | Canvas 2D API | 60fps, full control |
| Styling | CSS3 Custom Properties | Maintainable design tokens |
| Layout | CSS Grid + Flexbox | Responsive tanpa framework |
| Animation | CSS Keyframes + RAF | Smooth 60fps micro-interactions |
| Deploy | GitHub Pages | Free, fast, custom domain support |
| Fonts | Google Fonts (Orbitron, JetBrains Mono, Rajdhani) | Distinctive cyber-science aesthetic |

**Dependencies: 0 (zero).**

---

## 🤝 Kontribusi

Pull request sangat disambut! Terutama untuk:

- Eksperimen fisika baru (lihat `js/experiments/gravity.js` sebagai template)
- Peningkatan physics engine (metode integrasi Verlet, RK4)
- Optimasi rendering (WebGL, OffscreenCanvas)
- Terjemahan UI (English, dll)

### Menambahkan Eksperimen Baru

```javascript
// 1. Buat file js/experiments/namaEksperimen.js
export class NamaEksperimen {
  constructor(canvas) {
    this.engine = new PhysicsEngine();
    // setup forces...
  }
  reset() { /* default state */ }
  start() { this.engine.start(); }
  pause() { this.engine.pause(); }
}

// 2. Buat experiments/namaEksperimen.html
// 3. Tambahkan kartu di index.html
```

---

## 📐 Matematika di Balik Simulasi

<details>
<summary><b>Penjelasan lengkap derivasi orbit stabil</b></summary>

Untuk orbit melingkar, gaya gravitasi harus sama dengan gaya sentripetal:

```
F_grav    =  F_centripetal
G·M·m/r²  =  m·v²/r

Sederhanakan (bagi kedua sisi dengan m dan kalikan dengan r):
G·M/r     =  v²
v         =  √(G·M/r)
```

Ini adalah **circular orbit velocity** — kecepatan tepat untuk orbit stabil pada radius r.

Untuk orbit yang lebih kecil, benda bergerak lebih cepat (v ∝ 1/√r).  
Ini menjelaskan mengapa Merkurius (orbit kecil) bergerak lebih cepat dari Neptunus.

</details>

<details>
<summary><b>Mengapa energi total bernilai negatif?</b></summary>

Dalam sistem gravitasi terikat:
```
KE  =  +½mv²       (selalu positif)
PE  =  −G·m₁·m₂/r  (selalu negatif karena gaya tarik)

Untuk orbit stabil: |PE| = 2·KE
→  E = KE + PE = −KE  →  selalu negatif
```

Nilai E yang semakin negatif berarti sistem semakin **terikat** (lebih stabil).  
E = 0 berarti benda tepat di escape velocity.  
E > 0 berarti benda kabur (tidak terikat).

</details>

---

## 📄 Lisensi

```
MIT License — bebas digunakan, dimodifikasi, dan didistribusikan.
Kredit sangat diapresiasi. ⚛
```

---

<div align="center">

**Dibuat dengan ⚛ oleh [Ahmad Januar D.K](https://github.com/TuanmudaJannZ)**

*"The important thing is to not stop questioning. Curiosity has its own reason for existing."*  
*— Albert Einstein*

<br>

```
F = G · m₁ · m₂ / r²   ·   E = mc²   ·   ΔE · Δt ≥ ℏ/2   ·   ∇ × B = μ₀J
```

⭐ **Star repo ini jika bermanfaat!** ⭐

</div>
