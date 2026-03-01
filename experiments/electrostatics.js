/**
 * ElectrostaticsExperiment — Coulomb's Law + Electric Field Visualization
 * F = k · q₁ · q₂ / r²
 *
 * Features:
 *  - N-body charge simulation (attract/repel)
 *  - Electric field line rendering
 *  - Potential energy heatmap overlay
 *  - Real-time force vectors on each charge
 *  - Drag-to-place charges on canvas
 */
import { PhysicsEngine }  from '../core/physics-engine.js';
import { PhysicsObject }  from '../core/physics-object.js';
import { Vector2D }       from '../core/vector.js';

export class ElectrostaticsExperiment {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    this.engine = new PhysicsEngine();

    // Coulomb constant (scaled for simulation)
    this.k         = 8.99;   // real: 8.99e9 N·m²/C²
    this.damping   = 0.985;  // velocity damping per frame (simulate medium resistance)
    this.showField = true;   // toggle electric field lines
    this.showForce = true;   // toggle force vectors
    this.showHeatmap = false; // toggle potential heatmap

    // Heatmap offscreen canvas
    this._heatCanvas = document.createElement('canvas');
    this._heatCtx    = this._heatCanvas.getContext('2d');
    this._heatDirty  = true;
    this._heatInterval = null;

    this._setupForces();
    this._setupCallbacks();
    this.reset();

    // Recompute heatmap periodically (expensive, not every frame)
    this._heatInterval = setInterval(() => { this._heatDirty = true; }, 300);
  }

  // ─────────────────────────────────────────────
  // Setup
  // ─────────────────────────────────────────────

  _setupForces() {
    const self = this;
    this.engine.addForce((objects) => {
      for (let i = 0; i < objects.length; i++) {
        for (let j = i + 1; j < objects.length; j++) {
          const a = objects[i];
          const b = objects[j];

          const delta  = b.position.sub(a.position);
          let   rSq    = delta.magnitudeSq();
          const soft   = (a.radius + b.radius) * 1.2;
          rSq          = Math.max(rSq, soft * soft);
          const r      = Math.sqrt(rSq);

          // F = k·q1·q2 / r²  — sign determines attract/repel
          const forceMag = (self.k * Math.abs(a.charge) * Math.abs(b.charge)) / rSq;
          const sign     = (a.charge * b.charge > 0) ? -1 : 1; // same sign → repel (push apart)
          const forceDir = delta.scale(1 / r);
          const force    = forceDir.scale(forceMag * sign);

          a.applyForce(force);
          b.applyForce(force.scale(-1));
        }
      }
    });

    // Damping force (simulates air/medium resistance)
    this.engine.addForce((objects) => {
      for (const obj of objects) {
        if (!obj.fixed) obj.velocity.scaleSelf(self.damping);
      }
    });

    // Boundary repulsion — keep charges inside canvas
    this.engine.addForce((objects) => {
      const margin = 20;
      const W = self.canvas.width;
      const H = self.canvas.height - 48; // minus topbar
      for (const obj of objects) {
        if (obj.fixed) continue;
        const p = obj.position;
        const f = Vector2D.zero();
        if (p.x < margin)     f.x += (margin - p.x) * 2;
        if (p.x > W - margin) f.x -= (p.x - (W - margin)) * 2;
        if (p.y < margin)     f.y += (margin - p.y) * 2;
        if (p.y > H - margin) f.y -= (p.y - (H - margin)) * 2;
        obj.applyForce(f);
      }
    });
  }

  _setupCallbacks() {
    this.engine.onRender = () => this._render();
    this.engine.onUpdate = (objects) => this._updateStats(objects);
  }

  // ─────────────────────────────────────────────
  // Default Scenarios
  // ─────────────────────────────────────────────

  /** Default: dipole + free charges */
  reset() {
    this.engine.reset();
    this._heatDirty = true;
    const cx = this.canvas.width  / 2;
    const cy = (this.canvas.height - 48) / 2;

    // Fixed dipole pair
    this._addCharge({ charge: +5, x: cx - 120, y: cy, fixed: true, label: '+q' });
    this._addCharge({ charge: -5, x: cx + 120, y: cy, fixed: true, label: '−q' });

    // Free test charges
    this._addCharge({ charge: +1, x: cx,       y: cy - 110, label: '+1' });
    this._addCharge({ charge: +1, x: cx,       y: cy + 110, label: '+1' });
    this._addCharge({ charge: -1, x: cx - 60,  y: cy - 60,  label: '−1' });
    this._addCharge({ charge: -1, x: cx + 60,  y: cy + 60,  label: '−1' });
  }

  /** Preset: repulsion lattice */
  presetRepulsion() {
    this.engine.reset();
    this._heatDirty = true;
    const cx = this.canvas.width  / 2;
    const cy = (this.canvas.height - 48) / 2;
    const spacing = 100;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        this._addCharge({
          charge: +3,
          x: cx + i * spacing + (Math.random()-0.5)*10,
          y: cy + j * spacing + (Math.random()-0.5)*10,
          label: '+3'
        });
      }
    }
  }

  /** Preset: attraction chain */
  presetChain() {
    this.engine.reset();
    this._heatDirty = true;
    const cx = this.canvas.width  / 2;
    const cy = (this.canvas.height - 48) / 2;
    const n  = 6;
    for (let i = 0; i < n; i++) {
      this._addCharge({
        charge: i % 2 === 0 ? +4 : -4,
        x: cx - (n/2)*80 + i*80 + 40,
        y: cy,
        label: i % 2 === 0 ? '+4' : '−4'
      });
    }
  }

  // ─────────────────────────────────────────────
  // Charge Management
  // ─────────────────────────────────────────────

  _addCharge({ charge, x, y, fixed = false, label }) {
    const obj         = new PhysicsObject({
      mass:     Math.max(1, Math.abs(charge) * 2),
      position: new Vector2D(x, y),
      velocity: Vector2D.zero(),
      color:    charge > 0 ? '#f43f5e' : '#3b82f6',
      radius:   Math.max(10, Math.abs(charge) * 3.5),
      label:    label || (charge > 0 ? `+${charge}` : `${charge}`),
      fixed
    });
    obj.charge        = charge;
    obj.maxTrail      = 0; // no trails for electrostatics
    return this.engine.addObject(obj);
  }

  /** Add charge from UI at canvas position */
  addChargeAt({ charge, x, y }) {
    this._heatDirty = true;
    return this._addCharge({ charge: Number(charge), x, y });
  }

  start()   { this.engine.start();  }
  pause()   { this.engine.pause();  }
  setK(val) { this.k = Number(val); this._heatDirty = true; }

  get fps()     { return this.engine.fps; }
  get objects() { return this.engine.objects; }

  resize(w, h) {
    this.canvas.width  = w;
    this.canvas.height = h;
    this._heatCanvas.width  = Math.floor(w / 6);
    this._heatCanvas.height = Math.floor(h / 6);
    this._heatDirty = true;
  }

  destroy() {
    this.engine.pause();
    if (this._heatInterval) clearInterval(this._heatInterval);
  }

  // ─────────────────────────────────────────────
  // Stats
  // ─────────────────────────────────────────────

  _updateStats(objects) {
    const KE = objects.reduce((s, o) => s + o.kineticEnergy(), 0);
    let PE = 0;
    for (let i = 0; i < objects.length; i++) {
      for (let j = i + 1; j < objects.length; j++) {
        const r = objects[i].position.distanceTo(objects[j].position);
        if (r > 0) {
          PE += (this.k * objects[i].charge * objects[j].charge) / r;
        }
      }
    }
    this._stats = { KE, PE, E: KE + PE };

    // Net force on each charge for display
    this._forceData = objects.map(o => ({
      label: o.label,
      charge: o.charge,
      speed: o.velocity.magnitude().toFixed(2),
      fixed: o.fixed
    }));
  }

  getStats()     { return this._stats     || { KE: 0, PE: 0, E: 0 }; }
  getForceData() { return this._forceData || []; }

  // ─────────────────────────────────────────────
  // Rendering
  // ─────────────────────────────────────────────

  _render() {
    const { canvas, ctx } = this;
    const H = canvas.height - 48;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this._drawGrid();

    if (this.showHeatmap)  this._drawHeatmap();
    if (this.showField)    this._drawFieldLines();
    if (this.showForce)    this._drawForceVectors();

    this._drawCharges();
  }

  _drawGrid() {
    const { canvas, ctx } = this;
    ctx.save();
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.05)';
    ctx.lineWidth = 1;
    const step = 40;
    for (let x = 0; x < canvas.width; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
    ctx.restore();
  }

  /**
   * Electric field lines — trace from positive charges
   * Uses Euler integration along E field direction
   */
  _drawFieldLines() {
    const { canvas, ctx } = this;
    const objects = this.engine.objects;
    const positive = objects.filter(o => o.charge > 0);
    if (positive.length === 0) return;

    const linesPerCharge = Math.max(6, Math.round(16 / positive.length));
    const stepSize       = 4;
    const maxSteps       = 300;
    const W = canvas.width, H = canvas.height;

    ctx.save();
    ctx.lineWidth = 0.9;

    for (const src of positive) {
      for (let a = 0; a < linesPerCharge; a++) {
        const angle = (a / linesPerCharge) * Math.PI * 2;
        let x = src.position.x + (src.radius + 4) * Math.cos(angle);
        let y = src.position.y + (src.radius + 4) * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(x, y);

        for (let s = 0; s < maxSteps; s++) {
          // Compute E field at (x, y)
          let ex = 0, ey = 0;
          for (const obj of objects) {
            const dx = x - obj.position.x;
            const dy = y - obj.position.y;
            const rSq = Math.max(dx*dx + dy*dy, 25);
            const r   = Math.sqrt(rSq);
            const mag = obj.charge / rSq;
            ex += mag * dx / r;
            ey += mag * dy / r;
          }
          const len = Math.sqrt(ex*ex + ey*ey);
          if (len < 1e-6) break;
          x += stepSize * ex / len;
          y += stepSize * ey / len;

          // Stop at canvas edge or negative charge
          if (x < 0 || x > W || y < 0 || y > H) break;

          let absorbed = false;
          for (const obj of objects) {
            if (obj.charge < 0) {
              const d = Math.sqrt((x - obj.position.x)**2 + (y - obj.position.y)**2);
              if (d < obj.radius + 3) { absorbed = true; break; }
            }
          }
          if (absorbed) break;

          ctx.lineTo(x, y);
        }

        // Gradient stroke: red → blue (positive to negative direction)
        const grad = ctx.createLinearGradient(
          src.position.x, src.position.y, x, y
        );
        grad.addColorStop(0, 'rgba(244, 63, 94, 0.55)');
        grad.addColorStop(1, 'rgba(59, 130, 246, 0.15)');
        ctx.strokeStyle = grad;
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  /** Force vectors on each non-fixed charge */
  _drawForceVectors() {
    const { ctx } = this;
    const objects = this.engine.objects;
    if (objects.length < 2) return;

    ctx.save();
    for (const obj of objects) {
      if (obj.fixed) continue;
      const speed = obj.velocity.magnitude();
      if (speed < 0.1) continue;

      const scale = Math.min(speed * 4, 60);
      const dir   = obj.velocity.normalize();
      const ex    = obj.position.x + dir.x * (obj.radius + scale);
      const ey    = obj.position.y + dir.y * (obj.radius + scale);

      // Arrow shaft
      ctx.beginPath();
      ctx.moveTo(obj.position.x + dir.x * obj.radius,
                 obj.position.y + dir.y * obj.radius);
      ctx.lineTo(ex, ey);
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Arrowhead
      const perpX = -dir.y * 5, perpY = dir.x * 5;
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex - dir.x*8 + perpX, ey - dir.y*8 + perpY);
      ctx.lineTo(ex - dir.x*8 - perpX, ey - dir.y*8 - perpY);
      ctx.closePath();
      ctx.fillStyle = 'rgba(250, 204, 21, 0.7)';
      ctx.fill();
    }
    ctx.restore();
  }

  /** Potential heatmap (computed at low resolution, scaled up) */
  _drawHeatmap() {
    const { canvas, ctx, _heatCanvas, _heatCtx } = this;
    const objects = this.engine.objects;
    if (!objects.length) return;

    const W = _heatCanvas.width;
    const H = _heatCanvas.height;
    const scaleX = canvas.width  / W;
    const scaleY = canvas.height / H;

    if (this._heatDirty) {
      const imgData = _heatCtx.createImageData(W, H);
      const data    = imgData.data;
      const samples = [];

      // First pass: compute potential at every pixel
      for (let py = 0; py < H; py++) {
        for (let px = 0; px < W; px++) {
          const wx = px * scaleX;
          const wy = py * scaleY;
          let V = 0;
          for (const obj of objects) {
            const dx = wx - obj.position.x;
            const dy = wy - obj.position.y;
            const r  = Math.sqrt(dx*dx + dy*dy);
            if (r > 1) V += (this.k * obj.charge) / r;
          }
          samples.push(V);
        }
      }

      // Normalize
      const maxV = Math.max(...samples.map(Math.abs)) || 1;
      for (let i = 0; i < samples.length; i++) {
        const t    = samples[i] / maxV; // -1..1
        const idx  = i * 4;
        if (t > 0) {
          data[idx]   = Math.floor(244 * t);
          data[idx+1] = Math.floor(20  * t);
          data[idx+2] = Math.floor(20  * t);
          data[idx+3] = Math.floor(80  * t);
        } else {
          const at = Math.abs(t);
          data[idx]   = Math.floor(20  * at);
          data[idx+1] = Math.floor(50  * at);
          data[idx+2] = Math.floor(244 * at);
          data[idx+3] = Math.floor(80  * at);
        }
      }
      _heatCtx.putImageData(imgData, 0, 0);
      this._heatDirty = false;
    }

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(_heatCanvas, 0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  _drawCharges() {
    const { ctx } = this;
    const objects = this.engine.objects;

    for (const obj of objects) {
      ctx.save();

      const isPos = obj.charge > 0;
      const color = isPos ? '#f43f5e' : '#3b82f6';
      const inner = isPos ? '#fda4af' : '#93c5fd';

      // Glow
      ctx.shadowBlur  = obj.fixed ? 25 : 14;
      ctx.shadowColor = color;

      // Radial gradient body
      const grad = ctx.createRadialGradient(
        obj.position.x, obj.position.y, 0,
        obj.position.x, obj.position.y, obj.radius
      );
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.25, inner);
      grad.addColorStop(0.7,  color);
      grad.addColorStop(1,    color + '55');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(obj.position.x, obj.position.y, obj.radius, 0, Math.PI * 2);
      ctx.fill();

      // Fixed marker ring
      if (obj.fixed) {
        ctx.shadowBlur = 0;
        ctx.strokeStyle = color + 'aa';
        ctx.lineWidth   = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(obj.position.x, obj.position.y, obj.radius + 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Label
      ctx.shadowBlur = 0;
      ctx.fillStyle  = '#f1f5f9';
      ctx.font       = `bold ${Math.max(9, obj.radius * 0.7)}px "JetBrains Mono", monospace`;
      ctx.textAlign  = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(obj.label, obj.position.x, obj.position.y);

      ctx.restore();
    }
  }
}
