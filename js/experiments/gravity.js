/**
 * Gravity Experiment — Multi-body gravitational simulation
 * Implements Newton's Law of Universal Gravitation: F = G * m1 * m2 / r²
 */
import { PhysicsEngine }  from '../core/physics-engine.js';
import { PhysicsObject }  from '../core/physics-object.js';
import { Vector2D }       from '../core/vector.js';

export class GravityExperiment {
  constructor(canvas) {
    this.canvas  = canvas;
    this.ctx     = canvas.getContext('2d');
    this.engine  = new PhysicsEngine();

    // Simulation constants
    this.G       = 6.674;   // Scaled gravitational constant (real: 6.674e-11)
    this.scale   = 1;       // Future: zoom/pan

    // Palette for auto-assigned colors
    this._palette = [
      '#f59e0b', '#3b82f6', '#10b981', '#f43f5e', '#8b5cf6',
      '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#a78bfa'
    ];
    this._colorIdx = 0;

    this._setupForces();
    this._setupCallbacks();
    this.reset();
  }

  // ─────────────────────────────────────────────
  // Setup
  // ─────────────────────────────────────────────

  _setupForces() {
    const self = this;
    this.engine.addForce((objects) => {
      // N-body gravitational attraction
      for (let i = 0; i < objects.length; i++) {
        for (let j = i + 1; j < objects.length; j++) {
          const a = objects[i];
          const b = objects[j];
          const delta = b.position.sub(a.position);
          let rSq = delta.magnitudeSq();

          // Softening factor to prevent singularity at close range
          const softening = (a.radius + b.radius) * 0.5;
          rSq = Math.max(rSq, softening * softening);

          const r = Math.sqrt(rSq);
          const forceMag = (self.G * a.mass * b.mass) / rSq;
          const forceDir = delta.scale(1 / r); // unit vector

          const force = forceDir.scale(forceMag);
          a.applyForce(force);
          b.applyForce(force.scale(-1));
        }
      }
    });
  }

  _setupCallbacks() {
    this.engine.onRender = () => this._render();
    this.engine.onUpdate = (objects) => this._updateStats(objects);
  }

  // ─────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────

  /** Initialize default scenario: 1 star + 3 orbiting planets */
  reset() {
    this.engine.reset();
    this._colorIdx = 0;

    const cx = this.canvas.width  / 2;
    const cy = this.canvas.height / 2;

    // Central star (fixed anchor mass)
    this.engine.addObject(new PhysicsObject({
      mass:     2000,
      position: new Vector2D(cx, cy),
      velocity: new Vector2D(0, 0),
      color:    '#fbbf24',
      radius:   22,
      label:    'Star',
      fixed:    true
    }));

    // Add 3 orbiting bodies with stable circular orbit velocities
    this._addOrbitingBody({ mass: 10,  orbitRadius: 110, angle: 0,          color: '#3b82f6', label: 'Planet A' });
    this._addOrbitingBody({ mass: 15,  orbitRadius: 175, angle: Math.PI/3,  color: '#10b981', label: 'Planet B' });
    this._addOrbitingBody({ mass: 5,   orbitRadius: 240, angle: Math.PI,    color: '#f43f5e', label: 'Planet C' });
  }

  /**
   * Add a new orbiting body at given orbit radius
   * Calculates stable circular velocity: v = sqrt(G*M/r)
   */
  _addOrbitingBody({ mass, orbitRadius, angle = 0, color, label }) {
    const cx = this.canvas.width  / 2;
    const cy = this.canvas.height / 2;
    const starMass = this.engine.objects[0]?.mass || 2000;

    const pos = new Vector2D(
      cx + orbitRadius * Math.cos(angle),
      cy + orbitRadius * Math.sin(angle)
    );

    // Circular orbit velocity (perpendicular to radius)
    const speed = Math.sqrt((this.G * starMass) / orbitRadius);
    const vel = new Vector2D(
      -speed * Math.sin(angle),
       speed * Math.cos(angle)
    );

    const radius = Math.max(4, Math.sqrt(mass) * 1.2);
    return this.engine.addObject(new PhysicsObject({
      mass, position: pos, velocity: vel,
      color: color || this._nextColor(),
      radius, label: label || `Body ${this.engine.objects.length}`
    }));
  }

  /** Add a custom body from UI controls */
  addCustomBody({ mass, vx, vy, angle, orbitRadius }) {
    const cx = this.canvas.width  / 2;
    const cy = this.canvas.height / 2;
    const r  = Number(orbitRadius) || 150;
    const a  = Number(angle)  * Math.PI / 180 || Math.random() * Math.PI * 2;

    const pos = new Vector2D(cx + r * Math.cos(a), cy + r * Math.sin(a));
    const vel = new Vector2D(Number(vx) || 0, Number(vy) || 0);
    const m   = Number(mass) || 10;

    return this.engine.addObject(new PhysicsObject({
      mass: m, position: pos, velocity: vel,
      color: this._nextColor(),
      radius: Math.max(4, Math.sqrt(m) * 1.2),
      label: `Body ${this.engine.objects.length}`
    }));
  }

  start()  { this.engine.start();  }
  pause()  { this.engine.pause();  }

  setG(val) {
    this.G = Number(val);
    // Force fn captures `self`, so this.G is referenced live ✓
  }

  get fps()     { return this.engine.fps; }
  get objects() { return this.engine.objects; }

  // ─────────────────────────────────────────────
  // Physics Stats
  // ─────────────────────────────────────────────

  _updateStats(objects) {
    // Kinetic energy
    const KE = objects.reduce((s, o) => s + o.kineticEnergy(), 0);

    // Gravitational potential energy: U = -G * m1 * m2 / r
    let PE = 0;
    for (let i = 0; i < objects.length; i++) {
      for (let j = i + 1; j < objects.length; j++) {
        const r = objects[i].position.distanceTo(objects[j].position);
        if (r > 0) PE -= (this.G * objects[i].mass * objects[j].mass) / r;
      }
    }

    this._stats = { KE, PE, E: KE + PE };

    // Pair distances for display
    this._distances = [];
    for (let i = 0; i < Math.min(objects.length, 4); i++) {
      for (let j = i + 1; j < Math.min(objects.length, 4); j++) {
        this._distances.push({
          a: objects[i].label, b: objects[j].label,
          d: objects[i].position.distanceTo(objects[j].position).toFixed(1)
        });
      }
    }
  }

  getStats() { return this._stats || { KE: 0, PE: 0, E: 0 }; }
  getDistances() { return this._distances || []; }

  // ─────────────────────────────────────────────
  // Rendering
  // ─────────────────────────────────────────────

  _render() {
    const { canvas, ctx } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    this._drawGrid();

    const objects = this.engine.objects;

    // Draw trails
    for (const obj of objects) {
      if (obj.trail.length < 2) continue;
      ctx.save();
      for (let i = 1; i < obj.trail.length; i++) {
        const alpha = (i / obj.trail.length) * 0.5;
        ctx.beginPath();
        ctx.strokeStyle = obj.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = 1.5;
        ctx.moveTo(obj.trail[i - 1].x, obj.trail[i - 1].y);
        ctx.lineTo(obj.trail[i].x,     obj.trail[i].y);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Draw objects
    for (const obj of objects) {
      ctx.save();

      // Glow effect
      ctx.shadowBlur  = obj.fixed ? 30 : 15;
      ctx.shadowColor = obj.color;

      // Body
      const grad = ctx.createRadialGradient(
        obj.position.x, obj.position.y, 0,
        obj.position.x, obj.position.y, obj.radius
      );
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, obj.color);
      grad.addColorStop(1, obj.color + '44');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(obj.position.x, obj.position.y, obj.radius, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.shadowBlur = 0;
      ctx.fillStyle  = '#e2e8f0';
      ctx.font       = '11px "JetBrains Mono", monospace';
      ctx.textAlign  = 'center';
      ctx.fillText(obj.label, obj.position.x, obj.position.y - obj.radius - 5);

      ctx.restore();
    }
  }

  _drawGrid() {
    const { canvas, ctx } = this;
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.04)';
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

  _nextColor() {
    return this._palette[this._colorIdx++ % this._palette.length];
  }

  /** Resize canvas to parent */
  resize(w, h) {
    this.canvas.width  = w;
    this.canvas.height = h;
  }
}
