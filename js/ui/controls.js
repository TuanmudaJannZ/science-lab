/**
 * Controls — UI control panel manager
 * Connects DOM elements to experiment API
 */
export class Controls {
  /**
   * @param {object} experiment - Any experiment with start/pause/reset/setG
   * @param {object} elements   - Map of element IDs
   */
  constructor(experiment, elements) {
    this.exp = experiment;
    this.el  = elements;
    this._bind();
    this._startStatsLoop();
  }

  _bind() {
    const { exp, el } = this;

    el.btnStart?.addEventListener('click', () => {
      exp.start();
      el.btnStart.classList.add('active');
      el.btnPause.classList.remove('active');
      this._log('Simulation started');
    });

    el.btnPause?.addEventListener('click', () => {
      exp.pause();
      el.btnPause.classList.add('active');
      el.btnStart.classList.remove('active');
      this._log('Simulation paused');
    });

    el.btnReset?.addEventListener('click', () => {
      exp.reset();
      exp.start();
      this._log('Simulation reset to default');
    });

    el.btnAdd?.addEventListener('click', () => {
      const mass  = parseFloat(el.inMass?.value || 10);
      const vx    = parseFloat(el.inVx?.value   || 0);
      const vy    = parseFloat(el.inVy?.value   || 0);
      const orbit = parseFloat(el.inOrbit?.value || 160);
      exp.addCustomBody({ mass, vx, vy, orbitRadius: orbit });
      this._log(`Added body: mass=${mass}, orbit=${orbit}px, vx=${vx}, vy=${vy}`);
    });

    el.sliderG?.addEventListener('input', () => {
      const val = parseFloat(el.sliderG.value);
      exp.setG(val);
      if (el.valG) el.valG.textContent = val.toFixed(2);
      this._log(`G constant → ${val.toFixed(2)}`);
    });
  }

  _startStatsLoop() {
    const update = () => {
      const stats = this.exp.getStats?.() || {};
      const dists = this.exp.getDistances?.() || [];

      if (this.el.statFPS)  this.el.statFPS.textContent  = `${this.exp.fps} FPS`;
      if (this.el.statKE)   this.el.statKE.textContent   = stats.KE?.toFixed(1) || '--';
      if (this.el.statPE)   this.el.statPE.textContent   = stats.PE?.toFixed(1) || '--';
      if (this.el.statE)    this.el.statE.textContent    = stats.E?.toFixed(1)  || '--';
      if (this.el.statObjs) this.el.statObjs.textContent = this.exp.objects?.length || 0;

      if (this.el.distPanel) {
        this.el.distPanel.innerHTML = dists.map(d =>
          `<div class="dist-row"><span>${d.a} ↔ ${d.b}</span><span>${d.d} u</span></div>`
        ).join('');
      }

      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  _log(msg) {
    const console = document.getElementById('terminal-log');
    if (!console) return;
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    const line = document.createElement('div');
    line.className = 'log-line';
    line.textContent = `[${time}] > ${msg}`;
    console.appendChild(line);
    console.scrollTop = console.scrollHeight;
    // Keep last 50 lines
    while (console.children.length > 50) console.removeChild(console.firstChild);
  }
}
