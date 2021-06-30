/**
 * A 'fire ellipse' is a regular ellipse that is defined by:
 * - a total length
 * - a total width
 * - a heading direction
 * - time since ignition (optional)
 * - an ignition point at [0,0]
 */
import { cos, sin } from './trig.js'

export class FireEllipse {
  constructor (length, width, headingDegrees=0, timeSinceIgnition=1) {
    if (length <= 0 || width <=0 ) {
      throw new Error('FireEllipse must have non-negative length and width')
    }
    length = (length > width) ? length : width
    width = (length > width) ? width : length
    this._a = length / 2
    this._b = width / 2
    this._c = Math.sqrt(this._a * this._a - this._b * this._b)
    this._e = this._c / this._a
    this._g = this._a - this._c
    this._h = 2 * this._a - this._g // head distance
    this._time = timeSinceIgnition
    this._degrees = headingDegrees
    this._radians = headingDegrees * Math.PI / 180
    this._center = this.rotatePoint({x: this._g, y: 0}, {x:0, y:0}, this._radians)
    this._head = this.rotatePoint({x: this._h, y: 0}, {x:0, y:0}, this._radians)
    this._scanLines = this.scanLines()
  }

  a () { return this._a } // major axis radius
  b () { return this._b } // minor axis radius
  backDist () { return this._g } // backing distance from ignition point
  backRate () { return this._g / this._time } // backing distance from ignition point
  c () { return this._c } // ellipse c (distance from center to focus)
  center () { return this._center } // center point [x,y] coordinate pair
  cx () { return this._center.x } // center point x-coordinate
  cy () { return this._center.y } // center point y-coordinate
  degrees () { return this._degrees } // major axis rotation in degrees
  e () { return this._e } // eccentricity
  g () { return this._g } // distance from focus to vertice (backing distance)
  flankDist () { return this._b } // flanking distance
  flankRate () { return this._b / this._time } // flanking distance
  head () { return this._head } // fire head [x,y] coordinate pair
  hx () { return this._head.x }
  hy () { return this._head.y }
  headDist () { return 2 * this._a - this._g } // heading distance from ignition point
  headRate () { return (2 * this._a - this._g) / this._time } // heading distance from ignition point
  ign () { return {x:0, y:0} } // ignition point [x, y] coordinate pair
  ix () { return 0 } // ignition point x-coordinate
  iy () { return 0 } // ignition point y-coordinate
  length () { return 2 * this._a }
  lwr () { return this._a / this._b }
  radians () { return this._radians } // major
  xOffset () { return this._g } // distance from ignition point x to ellipse center point x
  width () { return 2 * this._b } // ellipse width

  /**
   * Distance from the ignition point to the ellipse perimeter
   * at 'beta' degrees clockwise from the heading direction.
   *
   * @param {number} beta Angle of interest (degrees clockwise from heading direction).
   * @return {number} The distance from ignition point to ellipse perimeter
   * at 'beta' degrees clockwise from the fire head
   */
  betaDist (beta) { return this.betaFactor(beta) * this.headDist() }
  betaFactor (beta) {
    return (Math.abs(beta) === 0) ? 1 : (1 - this._e) / (1 - this._e * Math.cos(beta * Math.PI / 180))
  }
  betaRate (beta) { return this.betaDist() / this._time }

  /**
   * Returns TRUE if point x,y is *within* this Ellipse's boundary by the buffer amount.
   *
   * @param {Point} p Point to be tested
   * @param {number} buffer Buffer zone distance inside the ellipse perimeter
   *  If buffer===0, points on the ellipse boundary are considered within the ellipse.
   * @returns {bool} TRUE if p is inside the perimeter buffer
   */
  containsPoint (point, buffer=0) {
    const cosa = cos(this.headRadians())
    const sina = sin(this.headRadians())
    const x = point.x - this.cx()
    const y = point.y - this.cy()
    const d1 = (cosa * x + sina * y) / this.a()
    const d2 = (sina * x + cosa * y) / this.b()
    return d1 * d1 + d2 * d2 <= (1 - buffer)
  }

  perimeter () {
    const xm = (this.a() - this.b()) / (this.a() + this.b())
    const xk = 1 + xm * xm / 4 + xm * xm * xm * xm / 64
    return Math.PI * (this.a() + this.b()) * xk
  }

  /**
  * Determine the point on the ellipse perimeter at angle theta from the ellipse center
  * @param {number} theta Angle from ellipse center to the perimeter point (radians)
  */
  perimeterPointAt (theta) {
    const cosT = cos(theta)
    const sinT = sin(theta)
    const cosA = cos(this.headRadians())
    const sinA = sin(this.headRadians())
    const x = this.a() * cosT * cosA - this.b() * sinT * sinA + this.cx()
    const y = this.a() * cosT * sinA + this.b() * sinT * cosA + this.cy()
    return {x, y}
  }

  // Rotates 'point' around the 'center' by 'radians'
  rotatePoint(point, center, rad) {
    const cosa = Math.cos(rad)
    const sina = Math.sin(rad)
    const x = cosa * (point.x - center.x) - sina * (point.y - center.y) + center.x
    const y = sina * (point.x - center.x) + cosa * (point.y - center.y) + center.y
    return {x, y}
  }

  scanLines() {
    const map = new Map()
    for(let a=0; a<360; a+=1) {
      let p = this.perimeterPointAt(a * Math.PI / 180)
      const key = Math.trunc(p.y) // Use the y-coordinate integer as a key
      if (map.has(key)) {
        const [xmin, xmax] = map.get(key)
        if (p.x < xmin) {
          map.set(key, [p.x, xmax]) // found a new minimum x at this y scanline
        } else if (p.x > xmax) {
          map.set(key, [xmin, p.x]) // found a new maximum x at this y scanline
        }
      } else {
        map.set(key, [p.x, p.x]) // found first entry for this y scanline
      }
    }
    this._scanLines = map
  }
 /**
  * Calculates the angle (radians) defined by the 3 points 'a', the ignition point,
  * and the fire ellipse head
  * @param {object} a Point of interest
  * @returns ANgle between head -> ign -> point
  */
  betaAngle(A) {
    const B = {x: 0, y: 0}
    const C = {x: this._head.x, y: this._head.y}
    const AB = Math.sqrt((B.x-A.x)*(B.x-A.x) + (B.y-A.y)*(B.y-A.y))
    const BC = Math.sqrt((B.x-C.x)*(B.x-C.x) + (B.y-C.y)*(B.y-C.y))
    const AC = Math.sqrt((C.x-A.x)*(C.x-A.x) + (C.y-A.y)*(C.y-A.y))
    return Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB))
  }
  /**
   * Calculates fire arrival time at each point in a Cartesian grid from a
   * FireEllipse ignition point.
   *
   * @param {number} spacing X and y distance between grid points
   */
  ignGrid (spacing, width=10) {
    const twoPi = 2 * Math.PI
    const headRad = this.headRadians()
    const grid = []
    for (let x=0, i=0; x<=width; x++) {
      const dx = x * spacing
      for (let y=0; y<=width; y++, i++) {
        const dy = y * spacing
        const vectDist = Math.sqrt(dx*dx + dy*dy)
        const vectRad = (x === 0) ? 0 : Math.atan(dy / dx) // vector cartesians radians
        const betaRad = (vectRad < headRad) ? twoPi - (headRad-vectRad) : vectRad - headRad
        const beta
      }
    }
  }
}

// Alternate method of creating a FireEllipse
// given a spread rate, length-to-width ratio, angle, and time
function createFireEllipse (headRate, lwr, headingDegrees=0, time=1) {
  const x = lwr * lwr - 1
  const e = ( x > 0 ) ? ( Math.sqrt( x ) / lwr ) : 0
  const backRate = headRate * (1-e) / (1+e)
  const length = time * (headRate + backRate)
  const width = length / lwr
  return new FireEllipse(length, width, headingDegrees, time)
}

function test() {
  const headRos = 93.3012701892219
  const length = 100
  const width = 50
  const degrees = 45
  const time = 1
  const fe1 = new FireEllipse(length, width, degrees, time)
  const fe2 = createFireEllipse(headRos, length/width, degrees, time)
  console.log('headDist', fe1.headDist(), fe2.headDist())
  console.log('headRate', fe1.headRate(), fe2.headRate())
  console.log('backDist', fe1.backDist(), fe2.backDist())
  console.log('backRate', fe1.backRate(), fe2.backRate())
  console.log('flankDist', fe1.flankDist(), fe2.flankDist())
  console.log('flankRate', fe1.flankRate(), fe2.flankRate())
  console.log('degrees', fe1.headDegrees(), fe2.headDegrees())
  console.log('radians', fe1.headRadians(), fe2.headRadians())
  console.log('length', fe1.length(), fe2.length())
  console.log('width', fe1.width(), fe2.width())
  console.log('lwr', fe1.lwr(), fe2.lwr())
  console.log('a', fe1.a(), fe2.a())
  console.log('b', fe1.b(), fe2.b())
  console.log('c', fe1.c(), fe2.c())
  console.log('e', fe1.e(), fe2.e())
  console.log('g', fe1.g(), fe2.g())
  console.log('ign pt:', fe1.ign(), fe2.ign())
  console.log('center pt:  ', fe1.center(), fe2.center())
  console.log('head pt:', fe1.head(), fe2.head())
  const p1 = fe1.perimeterPointAt(0 * Math.PI / 180)
  const p2 = fe2.perimeterPointAt(0 * Math.PI / 180)
  console.log('Perim pt at a=0:', p1, p2)
  for (let d=0; d<=180; d+=15) {
    console.log('at degrees', d, 'dist', fe1.betaDist(d))
  }
  const p3 = {x:1,y:0}
  console.log('Beta angle to', p3, 'is', fe1.betaAngle(p3) * 180 / Math.PI)
}

test()