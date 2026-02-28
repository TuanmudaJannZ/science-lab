/**
 * Vector2D — 2D Vector mathematics utility
 * Reusable for all physics experiments
 * Future: extend to Vector3D for Three.js integration
 */
export class Vector2D {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /** Returns a new Vector2D with added components */
  add(v) { return new Vector2D(this.x + v.x, this.y + v.y); }

  /** Returns a new Vector2D with subtracted components */
  sub(v) { return new Vector2D(this.x - v.x, this.y - v.y); }

  /** Returns a new Vector2D scaled by scalar */
  scale(s) { return new Vector2D(this.x * s, this.y * s); }

  /** Returns the dot product */
  dot(v) { return this.x * v.x + this.y * v.y; }

  /** Returns the magnitude (length) of the vector */
  magnitude() { return Math.sqrt(this.x * this.x + this.y * this.y); }

  /** Returns the squared magnitude (cheaper, no sqrt) */
  magnitudeSq() { return this.x * this.x + this.y * this.y; }

  /** Returns a unit vector in the same direction */
  normalize() {
    const mag = this.magnitude();
    if (mag === 0) return new Vector2D(0, 0);
    return this.scale(1 / mag);
  }

  /** Returns distance to another vector */
  distanceTo(v) { return this.sub(v).magnitude(); }

  /** Returns squared distance (cheaper) */
  distanceSqTo(v) { return this.sub(v).magnitudeSq(); }

  /** In-place add — mutates this vector */
  addSelf(v) { this.x += v.x; this.y += v.y; return this; }

  /** In-place scale — mutates this vector */
  scaleSelf(s) { this.x *= s; this.y *= s; return this; }

  /** Clone this vector */
  clone() { return new Vector2D(this.x, this.y); }

  /** Convert to plain object (for serialization) */
  toObject() { return { x: this.x, y: this.y }; }

  /** Static factory from plain object */
  static fromObject(obj) { return new Vector2D(obj.x, obj.y); }

  /** Static zero vector */
  static zero() { return new Vector2D(0, 0); }
}
