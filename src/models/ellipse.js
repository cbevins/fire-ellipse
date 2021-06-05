export function pointAt (xOrigin, yOrigin, radians, distance) {
  const x = xOrigin + Math.cos(radians)
  const y = yOrigin + Math.sin(radians)
  return [x, y]
}

export function pointInEllipse (xp, yp, x0, y0, len, wid, radians) {
  const cosa = Math.cos(radians)
  const sina = Math.sin(radians)
  const r = ((cosa*(xp-x0) + sina*(yp-y0)) / wid / 2)**2
    + ((sina*(xp-x0) + cosa*(yp-y0)) / len / 2)**2
  return r <= 1
}

export function pointInEllipse2 (xp, yp, x0, y0, len, wid, radians) {
  const cosa = Math.cos(radians)
  const sina = Math.sin(radians)
  const wr = (wid/2) * (wid/2)
  const lr = (len/2) * (len/2)
  const r = (cosa*(xp-x0) + sina*(yp-y0))**2 / wr
    + (sina*(xp-x0) + cosa*(yp-y0))**2 / lr
  return r <= 1
}
/**
 *  Calculate the fire ellipse perimeter from its length and width.
 *
 * @param len Fire ellipse length (arbitrary distance units-of-measure).
 * @param wid Fire ellipse width (arbitrary distance units-of-measure).
 *
 * @return float The fire ellipse perimeter (in same distance units-of-measure as length).
 */

export function perimeter(len, wid) {
  const a = 0.5 * len;
  const b = 0.5 * wid;
  const xm = a + b <= 0 ? 0 : (a - b) / (a + b);
  const xk = 1 + xm * xm / 4 + xm * xm * xm * xm / 64;
  return Math.PI * (a + b) * xk;
}

export function psiFromTheta(thetaFromHead, rosF, rosH) {
  if (rosF <= 0 || rosH <= 0 || thetaFromHead <= 0) {
    return 0;
  }

  const thetaRadians = radians(thetaFromHead);
  const tanPsiRadians = Math.tan(thetaRadians) * rosF / rosH;
  let psiRadians = Math.atan(tanPsiRadians); // psiRadians += ( psiRadians < 0) ? pi : 0
  // psiradians += ( thetaRadians > pi) ? pi : 0
  // Quadrant adjustment
  if (thetaRadians <= 0.5 * Math.PI) ; else if (thetaRadians > 0.5 * Math.PI && thetaRadians <= 1.5 * Math.PI) {
    psiRadians += Math.PI;
  } else if (thetaRadians > 1.5 * Math.PI) {
    psiRadians += 2 * Math.PI;
  } // Convert psi radians to degrees
  return degrees(psiRadians);
}

export function thetaFromBeta(betaHead, rosF, rosG, rosH) {
  if (rosF <= 0 || rosH <= 0) {
    return 0;
  }

  const betaRadians = radians(betaHead);
  const cosBeta = Math.cos(betaRadians);
  const cos2Beta = cosBeta * cosBeta;
  const sin2Beta = 1 - cos2Beta;
  const f2 = rosF * rosF;
  const g2 = rosG * rosG;
  const h2 = rosH * rosH;
  const term = Math.sqrt(h2 * cos2Beta + (f2 - g2) * sin2Beta);
  const num = rosH * cosBeta * term - rosF * rosG * sin2Beta;
  const denom = h2 * cos2Beta + f2 * sin2Beta;
  const cosThetaRadians = num / denom;
  let thetaRadians = Math.acos(cosThetaRadians); // Quadrant adjustment

  if (betaRadians < Math.PI) ; else if (betaRadians >= Math.PI) {
    thetaRadians = 2 * Math.PI - thetaRadians;
  } // Convert theta radians to degrees


  let thetaHead = degrees(thetaRadians);

  if (betaHead > 180) {
    thetaHead = 360 - thetaHead;
  }

  return thetaHead;
}

/** \brief Updates beta wrt head from theta.
 *
 * Calculate the degrees from the fire ignition point given the degrees
 * from the ellipse center and some ellipse paramaters.
 *
 * @param theta Azimuth from the ellipse center wrt the fire head
 * @param rosF spread rate at F
 * @param rosG spread rate at G
 * @param rosH spread rate at H
 * @returns The azimuth from the fire ignition point.
 */
export function betaFromTheta( theta, rosF, rosG, rosH) {
  const thetaRadians = Compass.radians(theta)
  const num = rosH * Math.sin( thetaRadians)
  const denom = rosG + rosF* Math.cos(thetaRadians)
  let betaRadians = ( denom <= 0 ) ? 0 : Math.atan( num / denom )
  // Quandrant adjustment
  const boundary1 = 150
  const boundary2 = 210
  if (theta <= boundary1) {
    // no adjustment required
  } else if (theta > boundary1 && theta <= boundary2) {
    betaRadians += Math.PI
  } else if (theta > boundary2) {
    betaRadians += 2.0 * Math.PI
  }
  // Convert beta radians to degrees
  return Compass.degrees(betaRadians)
}

export function thetaFromPsi( psiHead, rosF, rosH ) {
  if ( rosF <= 0 ) {
    return 0.0
  }
  const tanThetaRadians = Math.tan( psiHead ) * rosH / rosF
  let thetaRadians = Math.atan( tanThetaRadians )
  // Quadrant adjustment
  if ( psiRadians <= 0.5 * Math.PI ) {
    // no adjustment
  } else if ( psiRadians > 0.5 * Math.PI && psiRadians <= 1.5 * Math.PI ) {
    thetaRadians += Math.PI
  } else if ( psiRadians > 1.5 * Math.PI ) {
    thetaRadians += 2 * Math.PI
  }
  //thetaRadians += ( thetaRadians < 0. || psiradians > pi ) ? pi : 0.
  // Convert theta radians to degrees
  thetaDegrees = Compass.degrees( thetaRadians )
  return thetaRadians
}

function testPointInEllipse() {
  const x0 = 0
  const y0 = 0
  const len = 4
  const wid = 2
  const xp = 3
  const yp = 3
  for (let deg=0; deg<360; deg+=15) {
    const rad = deg * Math.PI / 180
    const e1 = pointInEllipse(xp, yp, x0, y0, len, wid, rad)
    const e2 = pointInEllipse(xp, yp, x0, y0, len, wid, rad)
    console.log(deg, rad.toFixed(4), e1, e2)
  }
}
testPointInEllipse()