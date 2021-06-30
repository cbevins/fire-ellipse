export class EllipseMesh {
  // Fire ellipse is defined by heading, backing and flanking distance and direction
  constructor (headDist, backDist, flankDist, degrees, vx=1, hy=1) {
    this._head = headDist
    this._back = backDist
    this._len = headDist + backDist
    this._a = this._len / 2 // major axis radius (also the center x)
    this._b = flankDist // minor axis radius (also the center y)
    this._wid = 2 * flankDist
    this._rad = degrees * Math.PI / 180
    this._vx = vx // vertical scanline separation distance
    this._hy = hy // horizontal scanline separation distance

    // the ignition point is the origin and the rotation point
    this._ix = 0
    this._iy = 0
    // ellipse center point when ignition is the origin point
    this._cx = this._a - backDist
    this._cy = 0

    this._maxR = Math.ceil(headDist/hy)
    this._maxX = this._cx + this._a
    this._minX = this._cx - this._a
    this._maxY = this._cy + this._b
    this._minY = this._cy - this._b
    this._horz = [] // x-scan line end points at each my
    this._vert = [] // y scan line end points at each mx
    //console.log(`cx=${this._cx}, cy=${this._cy}, a=${this._a} b=${this._b}`)
    // this._setScanLines()
  }

  _rotateScanLines (a) {
    a.forEach(([x1, y1, x2, y2], idx) => {
      const [rx1, ry1] = this.rotatePoint(x1, y1, this._ix, this._iy, this._rad)
      const [rx2, ry2] = this.rotatePoint(x2, y2, this._ix, this._iy, this._rad)
      a[idx] = [rx1, ry1, rx2, ry2]
    })
  }

  // Determines the start and end point of each pixel row and column
  _setScanLines() {
    // Traverse each y row to obtain the horizontal scanline end points
    let m = 1
    let cx = this._cx
    let cy = this._cy
    // horizontal scanlines run from top to bottom at 'hy' intervals
    let a1 = []
    let a2 = []
    for (let y=0; y<=this._maxY; y+=this._vx) {
      const [x1, y1, x2, y2] = this.ellipseLine(0, 0, this._a, this._b, m, y)
      a1.push([x1+cx, y1+cy, x2+cx, y2+cy])
      if (y!==0) a2.push([x1+cx, -y1+cy, x2+cx, -y2+cy])
      //console.log(`at cy=${cy}, y=${y}, [${x1+cx}, ${y1+cy}], [${x2+cx}, ${y2+cy}]`)
      //console.log(`at cy=${-cy}, y=${-y}, [${x1+cx}, ${-y1+cy}], [${x2+cx}, ${-y2+cy}]`)
    }
    this._horz = a1.reverse().concat(a2)
    console.log(this._horz)

    // Swap a and b to rotate 90 degrees. and do it again
    // vertical scanlines run from left to right in 'vx' intervals
    console.log('Rotated...')
    a1 = []
    a2 = []
    for (let y=0; y<=this._maxX-this._cx; y+=this._vx) {
      const [y1, x1, y2, x2] = this.ellipseLine(0, 0, this._b, this._a, m, y)
      a1.push([x1+cx, y1+cy, x2+cx, y2+cy])
      if (y!==0) a2.push([cx-x1, -y1+cy, cx-x2, cy-y2])
      // console.log(`at cy=${cy}, y=${y}, [${x1+cx}, ${y1}], [${x2+cx}, ${y2}]`)
      // console.log(`at cy=${-cy}, y=${-y}, [${p[0]}, ${-p[1]}], [${p[2]}, ${cy-p[3]}]`)
    }
    this._vert = a1.reverse().concat(a2)
    console.log(this._vert)
    this._rotateScanLines(this._horz)
    this._rotateScanLines(this._vert)
  }

  // Find the coordinates of the intersection of an unrotated ellipse and a line
  ellipseLine(h, k, a, b, m, c) {
    const φ = c - k
    const t1 = (b*b*h) - (a*a*m*φ)
    const t2 = a * b * Math.sqrt(b*b + a*a*m*m - 2*m*φ*h - φ*φ -m*m*h*h)
    const t3 = b*b + a*a*m*m
    const x1 = (t1 + t2) / t3
    const x2 = (t1 - t2) / t3
    const y1 = m * x1 + c
    const y2 = m * x2 + c
    return [x1, y1, x2, y2]
  }

  // Rotates point 'p' around the center 'c' by 'radians'
  rotatePoint(px, py, cx, cy, rad) {
    const cosa = Math.cos(rad)
    const sina = Math.sin(rad)
    const x = cosa * (px - cx) - sina * (py - cy) + cx
    const y = sina * (px - cx) + cosa * (py - cy) + cy
    return [x, y]
  }
}

function test() {
  const e = new EllipseMesh(4, 1, 2, 0, 1, 1)
  const h = e._cx
  const k = e._cy
  const a = e._a
  const b = e._b
  const rad = 45 * Math.PI / 180
  const iStep = e._hy / Math.cos(rad)
  console.log(iStep)
  for (let i=0; i<=5; i++) {
    console.log(e.ellipseLine(h, k, a, b, rad, i*iStep))
  }
}


