import { point, polygon } from '@turf/helpers'
import distance from '@turf/distance'
import { Ellipse, Point } from './ellipse.js'
import union from '@turf/union'

function distanceExample () {
  const thirdSec = 1 / (60 * 60 * 3)
  console.log(`1/3 arc-second is ${thirdSec} degrees`)
  const pt1 = point([-114.00730, 46.85714], {name: '1/3 arc-second east-west'})
  const pt2 = point([-114.00730+thirdSec, 46.85714], {name: 'Home'})
  const pt3 = point([-114.00730, 46.85714+thirdSec], {name: '1/3 arc sec north-south'})
  let ew = distance(pt1, pt2, { units: 'kilometers' })
  let ns = distance(pt1, pt3, { units: 'kilometers' })
  console.log(`1/3 arc-sec north-south is ${1000 * ns} m at 47 lat`)
  console.log(`1/3 arc-sec east-west is ${1000 * ew} m at 47 lat`)

  pt2.geometry.coordinates = [-114.00730+0.00001, 46.85714]
  pt3.geometry.coordinates = [-114.00730, 46.85714+0.00001]
  ew = distance(pt1, pt2, { units: 'kilometers' })
  ns = distance(pt1, pt3, { units: 'kilometers' })
  console.log(`0.00001 degrees north-south is ${1000 * ns} m at 47 lat`)
  console.log(`0.00001 degrees east-west is ${1000 * ew} m at 47 lat`)
}

const poly1 = polygon([[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]], { name: 'poly1' });
const poly2 = polygon([[[5, 5], [15, 5], [15, 15], [5, 15], [5, 5]]], { name: 'poly2' });
const poly3 = union(poly1, poly2)
console.log(poly3.geometry.coordinates)