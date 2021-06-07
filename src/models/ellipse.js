// Helper functions
export function deg2rad (deg) { return deg * Math.PI / 180 }
export function rad2deg (rad) { return rad * 180 / Math.PI }
export function cos (r) { return Math.cos(r) }
export function cosdeg (deg) { return rad2deg(cos(deg2rad(deg))) }
export function sin (r) { return Math.sin(r) }
export function sindeg (deg) { return rad2deg(sin(deg2rad(deg))) }
export function sqrt (v) { return (v <= 0) ? 0 : Math.sqrt(v) }

// -----------------------------------------------------------

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

// -----------------------------------------------------------

export class Ellipse {
  constructor (xCenter=0, yCenter=0, length=1, width=1, angle=0) {
    this.x = xCenter
    this.y = yCenter
    this.l = length / 2 // major axis length
    this.w = width / 2 // minor axis length
    this.a = angle // angle of major axis (radians)
  }

  /**
   * Returns TRUE if point x,y is *within* this Ellipse's boundary
   * by the buffer amount.
   *
   * @param {Point} p  Point to be tested
   * @param {number} buffer If buffer is zero,
   *  then boundary points are considered within the ellipse
   * @returns {bool} TRUE if p is inside or on the perimeter of e
   */
  containsPoint (p, buffer=0) {
    const cosa = cos(this.a)
    const sina = sin(this.a)
    const x = p.x - this.x
    const y = p.y - this.y
    const d1 = (cosa*x + sina*y) / this.w
    const d2 = (sina*x + cosa*y) / this.l
    return d1 * d1 + d2 * d2 <= (1 - buffer)
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

// -----------------------------------------------------------

// Returns an Ellipse with center at x, y
// and length, width, and angle at x,y from t0 to t1
// (and any other props such as ros, flame length, etc)
export function fireBehavior (e, start=0, dur=1) {
  // Determine fire behavior at e.x, e.y from start for duration
  e.l = 100
  e.w = 50
  e.a = 0
}

export function grow (pts, start, dur, degrees, buffer) {
  // array of e boundary points at *degrees* intervals at start+dur
  const spawn = []
  // examine each boundary point
  pts.forEach(e => {
    fireBehavior(e, start, dur) // add len, wid, angle, etc
    for(let deg=0; deg<360; deg+=degrees) {
      const p = e.pointAt(deg2rad(deg))
      // if this point is NOT within the boundary point's parent ellipse
      // if (e.p.containsPoint(p, buffer)) {
        const pe = new Ellipse(p.x, p.y) // point on boundary of e at deg
        pe.p = e // set the point ellipse as this spawn's parent
        spawn.push(pe) // add this point to the next boundary
      // }
    }
  })
  // Iterate over spawned points, eliminating those within other
  return spawn
}

// Start a new fire polygon at position [x,y],
// start time, and time duration
export function ignite (x, y, start, dur, degrees) {
  const e = new Ellipse(x, y)
  e.p = null // the ignition ellipse has no parent
  fireBehavior(e, start, dur) // adds the len, wid, angle, etc
  // array of e boundary points at *degrees* intervals at start+dur
  const spawn = []
  for(let deg=0; deg<360; deg+=degrees) {
    const p = e.pointAt(deg2rad(deg))
    const pe = new Ellipse(p.x, p.y) // point on boundary of e at deg
    pe.p = e // set the root ellipse as this point ellipse's parent
    spawn.push(pe)
  }
  return [e, spawn]
}
