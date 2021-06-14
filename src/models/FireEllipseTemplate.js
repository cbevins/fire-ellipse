export class FireEllipseTemplate {
  // Fire ellipse template definition
  constructor (headDist, backDist, flankDist, headDeg) {
    this.init(headDist, backDist, flankDist, headDeg)
  }

  init (headDist, backDist, flankDist, headDeg) {
    this._head = headDist
    this._back = backDist
    this._flank = flankDist
    this._degrees = headDeg

    // Fire ellipse template derived properties
    this._length = headDist + backDist // total ellipse length
    this._a = this._length / 2 // major axis radius
    this._b = flankDist // minor axis radius
    this._width = 2 * flankDist // total ellipse width
    // fire ellipse ignition point (unrotated, untransalted)
    this._ignition = {
      _x: backDist,
      _y: 0,
      _xoffset: this._a - backDist // x-offset to move ignition point to 0
    }
    // fire ellipse center point (unrotated, untransalted)
    this._center = {
      _x: this._a,
      _y: 0
    }
    this._canvas = null
    this._ctx = null
    return this
  }
  a () { return this._a }
  b () { return this._b }
  centerX () { return this._center._x }
  centerY () { return this._center._y }
  ignX () { return this._ignition._x }
  ignY () { return this._ignition._y }
  length () { return this._length }
  width () { return this._width }
  xoffset () { return this._ignition._xoffset }
  setCanvas (canvas, ctx) {
    this._canvas = canvas
    this._ctx = ctx
  }

  draw (canvas, ctx, angle=null) {
    const arcBeg = 0
    const arcEnd = 2 * Math.PI
    const atX = canvas.width / 2
    const atY = canvas.height / 2

    // Rotate ellipse center around the ignition pt
    const ang = angle ? angle : this._degrees
    const rot = ang * Math.PI / 180
    const cosa = Math.cos(rot)
    const sina = Math.sin(rot)
    let cx = atX + this.xoffset()
    let cy = atY
    const rx = cosa * (-this.xoffset()) - sina * (atY - cy) + cx
    const ry = sina * (-this.xoffset()) + cosa * (atY - cy) + cy
    cx = atX + tem.xoffset() - (rx - atX)

    // fire ellipse centered on ignition pt
    ctx.setLineDash([])
    ctx.fillStyle = 'rgba(200, 0, 0, 10)'
    ctx.beginPath()
    ctx.ellipse(cx, cy-(ry-atY), this.a(), this.b(), rot, arcBeg, arcEnd)
    ctx.fill()
    ctx.stroke()

    // ignition pt (green) centered at origin
    ctx.fillStyle = 'rgb(0, 250, 0)'
    ctx.beginPath()
    ctx.ellipse(atX, atY, 5, 5, 0, arcBeg, arcEnd)
    ctx.fill()

    // Draw axis
    ctx.beginPath()
    ctx.setLineDash([5, 5])
    ctx.moveTo(0, canvas.height/2)
    ctx.lineTo(canvas.width, canvas.height/2)
    ctx.moveTo(canvas.width/2, 0)
    ctx.lineTo(canvas.width/2, canvas.height)
    ctx.stroke()
  }
}

// const e = new FireEllipseTemplate(180, 20, 50, 0)
