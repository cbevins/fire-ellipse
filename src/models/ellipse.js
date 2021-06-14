import { cos, sin } from './trig.js'

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
   * @param {Point} p  Point (or object with 'x', 'y') to be tested
   * @param {number} buffer Perimeter inside buffer. If buffer is zero,
   *  the ellipse boundary points are considered within the ellipse
   * @returns {bool} TRUE if p is inside the perimeter buffer
   */
  containsPoint (p, buffer=0) {
    const cosa = cos(this.a)
    const sina = sin(this.a)
    const x = p.x - this.x
    const y = p.y - this.y
    const d1 = (cosa*x + sina*y) / this.l
    const d2 = (sina*x + cosa*y) / this.w
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
  perimeterPointAt (theta) {
    const cosT = cos(theta)
    const sinT = sin(theta)
    const cosA = cos(this.a)
    const sinA = sin(this.a)
    const x = this.l * cosT * cosA - this.w * sinT * sinA + this.x
    const y = this.l * cosT * sinA + this.w * sinT * cosA + this.y
    return {x, y}
  }
}
