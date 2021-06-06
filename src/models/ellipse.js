// Helper functions
export function deg2rad (deg) { return deg * Math.PI / 180 }
export function rad2deg (rad) { return rad * 180 / Math.PI }
export function cos (r) { return Math.cos(r) }
export function cosdeg (deg) { return rad2deg(cos(deg2rad(deg))) }
export function sin (r) { return Math.sin(r) }
export function sindeg (deg) { return rad2deg(sin(deg2rad(deg))) }
export function sqrt (v) { return (v <= 0) ? 0 : Math.sqrt(v) }

export class Point {
  constructor (x=0, y=0) {
    this.x = x
    this.y = y
  }

  // Returns distance between *this* point and another point 'p'
  distanceTo (p) {
    return sqrt((this.x - p.x) * (this.x - p.x)
      + (this.y - p.y ) * (this.y - p,y))
  }

  /**
  * Returns the point at a specified distance and angle.
  *
  * @param {number} radians Angle of travel from the starting point
  * @param {number} distance  Distance of travel from the starting point
  * @returns {Point} Ending point
  */
  pointAt(radians, distance) {
    const x = start.x + distance * cos(radians)
    const y = start.y + distance * sin(radians)
    return new Point(x, y)
  }
}

export class Ellipse {
  constructor (xCenter=0, yCenter=0, length=1, width=1, angle=0) {
    this.x = xCenter
    this.y = yCenter
    this.l = length / 2 // major axis length
    this.w = width / 2 // minor axis length
    this.a = angle // angle of major axis (radians)
  }

  /**
   * Returns TRUE if this Ellipse contains point x, y
   *
   * @param {Point} p  Point to be tested
   * @returns {bool} TRUE if p is inside or on the perimeter of e
   */
  containsPoint (p) {
    const cosa = cos(this.a)
    const sina = sin(this.a)
    const x = p.x - this.x
    const y = p.y - this.y
    const d1 = (cosa*x + sina*y) / this.w
    const d2 = (sina*x + cosa*y) / this.l
    return d1 * d1 + d2 * d2 <= 1
  }

  perimeter () {
    const xm = (this.l - this.w) / (this.l + this.w)
    const xk = 1 + xm * xm / 4 + xm * xm * xm * xm / 64
    return Math.PI * (this.l + this.w) * xk
  }

  /**
  * Determine the point on the ellipse perimeter at angle theta from the ellipse center
  * @param {number} theta Angle from ellipse center to the perimeter point (radians)
  */
  pointAt (theta) {
    const cosT = cos(theta)
    const sinT = sin(theta)
    const cosA = cos(this.a)
    const sinA = sin(this.a)
    const x = this.l * cosT * cosA - this.w * sinT * sinA + this.x
    const y = this.l * cosT * sinA + this.w * sinT * cosA + this.y
    return {x, y}
  }
}
