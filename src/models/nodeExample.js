import { Ellipse, Point, deg2rad } from './ellipse.js'

function testContainsPoint() {
  const e = new Ellipse(0, 0, 4, 2, 0)
  const p = new Point(3, 3)
  for (let deg=0; deg<360; deg+=15) {
    e.a = deg2rad(deg)
    console.log(deg, e.a.toFixed(4), e.containsPoint(p))
  }
}

function fmt(v, w, d) { return v.toFixed(d).padStart(w) }
function testPointAt () {
  const e = new Ellipse(0, 0, 400, 200, deg2rad(45))
  console.log(e)
  for (let deg=0; deg<360; deg+=90) {
    const rad = deg2rad(deg)
    const p = e.pointAt(rad)
    console.log(fmt(deg, 3, 0), fmt(p.x, 4, 0), fmt(p.y, 4, 0))
  }
}

//testContainsPoint()
testPointAt()