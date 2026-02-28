/**
 * Tutorial — Step-by-step educational mode
 */
export class Tutorial {
  constructor(steps) {
    this.steps   = steps;
    this.current = 0;
    this.active  = false;
    this.overlay = null;
  }

  start() {
    this.active  = true;
    this.current = 0;
    this._render();
  }

  stop() {
    this.active = false;
    this.overlay?.remove();
    this.overlay = null;
  }

  next() {
    if (this.current < this.steps.length - 1) {
      this.current++;
      this._render();
    } else {
      this.stop();
    }
  }

  prev() {
    if (this.current > 0) {
      this.current--;
      this._render();
    }
  }

  _render() {
    const step = this.steps[this.current];
    if (!this.overlay) {
      this.overlay = document.createElement('div');
      this.overlay.className = 'tutorial-overlay';
      document.body.appendChild(this.overlay);
    }

    this.overlay.innerHTML = `
      <div class="tutorial-card">
        <div class="tutorial-header">
          <span class="tutorial-tag">TUTORIAL</span>
          <span class="tutorial-step">${this.current + 1} / ${this.steps.length}</span>
        </div>
        <h3 class="tutorial-title">${step.title}</h3>
        <div class="tutorial-body">${step.content}</div>
        ${step.formula ? `<div class="tutorial-formula">${step.formula}</div>` : ''}
        <div class="tutorial-nav">
          <button class="btn-tut" id="tut-prev" ${this.current === 0 ? 'disabled' : ''}>← Prev</button>
          <button class="btn-tut primary" id="tut-next">
            ${this.current === this.steps.length - 1 ? 'Finish ✓' : 'Next →'}
          </button>
        </div>
      </div>
    `;

    document.getElementById('tut-next')?.addEventListener('click', () => this.next());
    document.getElementById('tut-prev')?.addEventListener('click', () => this.prev());
  }
}

/** Default gravity tutorial steps */
export const GRAVITY_TUTORIAL = [
  {
    title: 'Hukum Gravitasi Universal Newton',
    content: 'Isaac Newton menemukan bahwa setiap benda bermassa menarik benda lain. Gaya tarik ini bergantung pada massa kedua benda dan jarak antara keduanya.',
    formula: 'F = G · m₁ · m₂ / r²'
  },
  {
    title: 'Komponen Formula',
    content: '<b>F</b> = Gaya gravitasi (Newton)<br><b>G</b> = Konstanta gravitasi (6.674 × 10⁻¹¹)<br><b>m₁, m₂</b> = Massa kedua benda (kg)<br><b>r²</b> = Jarak kuadrat antara pusat massa',
    formula: 'F ∝ m₁ · m₂ &nbsp;|&nbsp; F ∝ 1/r²'
  },
  {
    title: 'Orbit Stabil',
    content: 'Orbit stabil terjadi ketika gaya gravitasi = gaya sentripetal. Kecepatan orbit dapat dihitung sebagai:',
    formula: 'v = √(G · M / r)'
  },
  {
    title: 'Energi Sistem',
    content: 'Sistem gravitasi memiliki dua komponen energi:<br><b>Energi Kinetik:</b> KE = ½mv²<br><b>Energi Potensial:</b> PE = -G·m₁·m₂/r<br><br>Total energi konservatif jika tidak ada gaya luar.',
    formula: 'E_total = KE + PE = konstan'
  },
  {
    title: 'Coba Sekarang!',
    content: 'Gunakan panel kontrol untuk:<br>• Ubah konstanta G dan amati perubahan orbit<br>• Tambahkan benda baru dengan tombol Add Object<br>• Pantau energi sistem secara real-time<br><br>Selamat bereksperimen! 🚀'
  }
];
