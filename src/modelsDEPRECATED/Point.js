import { cos, sin, sqrt } from './trig.js'
export class Point {
  constructor (x=0, y=0) {
    this.x = x
    this.y = y
  }

  // Returns distance between *this* point and another point 'p'
  distanceToPoint (p) {
    return sqrt((this.x - p.x) * (this.x - p.x)
      + (this.y - p.y) * (this.y - p.y))
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
