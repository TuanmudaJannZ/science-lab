/**
 * PhysicsEngine — Core simulation loop
 * Reusable for gravity, electrostatics, fluid, etc.
 * Designed for easy extension without modification (Open/Closed Principle)
 */
export class PhysicsEngine {
  constructor() {
    this.objects  = [];
    this.forces   = [];     // Force calculators: fn(objects) => applies forces
    this.running  = false;
    this.lastTime = null;
    this.rafId    = null;

    // Callbacks
    this.onUpdate = null;   // fn(objects, dt)
    this.onRender = null;   // fn(objects)

    // Stats
    this.fps      = 0;
    this._fpsAccum = 0;
    this._fpsCount = 0;
  }

  /** Register a force calculator */
  addForce(forceFn) {
    this.forces.push(forceFn);
    return this;
  }

  /** Remove all force calculators */
  clearForces() { this.forces = []; }

  /** Add a physics object */
  addObject(obj) {
    this.objects.push(obj);
    return obj;
  }

  /** Remove a physics object by id */
  removeObject(id) {
    this.objects = this.objects.filter(o => o.id !== id);
  }

  /** Clear all objects */
  clearObjects() { this.objects = []; }

  /** Start simulation loop */
  start() {
    if (this.running) return;
    this.running  = true;
    this.lastTime = performance.now();
    this.rafId    = requestAnimationFrame(t => this._loop(t));
  }

  /** Pause simulation */
  pause() {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }

  /** Reset — clears objects but keeps forces */
  reset() {
    this.pause();
    this.clearObjects();
    this.lastTime = null;
    this.fps = 0;
  }

  /** Main loop */
  _loop(timestamp) {
    if (!this.running) return;

    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05); // cap at 50ms
    this.lastTime = timestamp;

    // FPS calc
    this._fpsAccum += dt;
    this._fpsCount++;
    if (this._fpsAccum >= 0.5) {
      this.fps = Math.round(this._fpsCount / this._fpsAccum);
      this._fpsAccum = 0;
      this._fpsCount = 0;
    }

    // Apply all registered forces
    for (const forceFn of this.forces) {
      forceFn(this.objects);
    }

    // Integrate all objects
    for (const obj of this.objects) {
      obj.integrate(dt);
    }

    // Callbacks
    if (this.onUpdate) this.onUpdate(this.objects, dt);
    if (this.onRender) this.onRender(this.objects);

    this.rafId = requestAnimationFrame(t => this._loop(t));
  }
}
