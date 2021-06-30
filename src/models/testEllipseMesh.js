import { ellipseLine } from './EllipseMesh.js'

function testEllipseLine() {
  // [Eq 1] Elliptical equation is (x-h)^2 / a^2 + (y-k)^2 / b2 = 1
  // Given the ellipse (x-2)^2/3^2 + (y+3)^2/6^2 = 1:
  const h = 2
  const k = -3
  const a = 3
  const b = 6

  // [Eq 2] Linear equation is y = mx + c
  // Given the line 2x − 4y − 5 = 0 →→→ 4y = 2x - 5 →→→ y = 2x/4 - 5/4 →→→ y = 0.5x - 1.25
  const m = 2 / 4 // 0.5
  const c = -5 / 4 // -1.25
  const φ = c - k // φ = c − k →→→ −5/4 + 3 →→→ 1.75

  // Equation 3:
  // [Eq 3] x_(1,2) = (b^2 h-a^2 mφ ± ab√(b^2+a^2 m^2-2mφh-φ^2-m^2 h^2 )) / (b^2+a^2 m^2 )
  // We will break this into (t1 ± √t2) / t3 as follows:
  const t1 = (b*b*h) - (a*a*m*φ) // 54.125
  const t2 = a * b * Math.sqrt(b*b + a*a*m*m - 2*m*φ*h - φ*φ -m*m*h*h) // 99.713
  const t3 = b*b + a*a*m*m // 38.25

  console.log(`h=${h}, k=${k}, a=${a} b=${6} m=${m} c=${c}`)
  console.log(`φ = ${φ}, t1=${t1}, t2=${t2}, t3=${t3}`)

  // Solving equation (3) for x1,2 we get:
  // x_1,2 = (36 * 2 - 9*0.5*1.75 ± 3*6 √(36 + 9*0.25 - 2 * 0.5 * 1.75 * 2 - 1.75^2- 0.5^2 * 4)) / (36 + 9 * 0.5^2)
  // x_1,2 = (64.125 ± 18√30.6875) / 38.25
  // x_1,2 = (64.125 ± 99.713) / 38.25
  const x1 = 4.283355271312981
  const x2 = -0.9304140948423928

  // From the equation of the line we can get the y coordinates:	y=(2x-5)/4=0.5x-1.25
  // y1 = 0.5 · 4.28 − 1.25 = 0.89	y2 = 0.5 · (−0.93) − 1.25 = −1.72
  const y1 = 0.8916776356564906
  const y2 = -1.7152070474211965

  const pts = ellipseLine(h, k, a, b, m, c)
  console.log(`Pt 1 Expected: ${x1}, ${y1}`)
  console.log(`Pt 1 Received: ${pts[0]}, ${pts[1]}`)
  console.log(`Pt 2 Expected: ${x2},${y2}`)
  console.log(`Pt 2 Received: ${pts[2]}, ${pts[3]}`)
}

testEllipseLine()