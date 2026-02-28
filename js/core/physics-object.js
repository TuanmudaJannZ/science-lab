/**
 * PhysicsObject — Base class for all simulated bodies
 * Extend this for any experiment: planets, particles, springs, etc.
 */
import { Vector2D } from './vector.js';

export class PhysicsObject {
  /**
   * @param {object} options
   * @param {number} options.mass       - Mass in simulation units
   * @param {Vector2D} options.position - Initial position
   * @param {Vector2D} options.velocity - Initial velocity
   * @param {string}  options.color     - Render color
   * @param {number}  options.radius    - Visual radius (px)
   * @param {string}  options.label     - Display label
   * @param {boolean} options.fixed     - If true, object doesn't move (anchor)
   */
  constructor({ mass = 1, position, velocity, color = '#00d4ff', radius = 10, label = '', fixed = false } = {}) {
    this.mass     = mass;
    this.position = position ? position.clone() : Vector2D.zero();
    this.velocity = velocity ? velocity.clone() : Vector2D.zero();
    this.color    = color;
    this.radius   = radius;
    this.label    = label;
    this.fixed    = fixed;

    // Accumulated force this frame — reset each tick
    this.force    = Vector2D.zero();

    // Trail history for orbit rendering
    this.trail    = [];
    this.maxTrail = 120;

    // Unique ID for referencing
    this.id = PhysicsObject._nextId++;
  }

  /** Accumulate a force vector */
  applyForce(f) {
    if (!this.fixed) this.force.addSelf(f);
  }

  /**
   * Euler integration step
   * @param {number} dt - delta time in seconds
   */
  integrate(dt) {
    if (this.fixed) return;

    // a = F / m
    const acceleration = this.force.scale(1 / this.mass);

    // v += a * dt
    this.velocity.addSelf(acceleration.scale(dt));

    // Record trail before moving
    this.trail.push(this.position.clone());
    if (this.trail.length > this.maxTrail) this.trail.shift();

    // p += v * dt
    this.position.addSelf(this.velocity.scale(dt));

    // Reset accumulated force
    this.force = Vector2D.zero();
  }

  /** Kinetic energy: 0.5 * m * v² */
  kineticEnergy() {
    return 0.5 * this.mass * this.velocity.magnitudeSq();
  }

  /** Reset trail */
  clearTrail() { this.trail = []; }
}

PhysicsObject._nextId = 1;
