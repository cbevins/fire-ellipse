export function deg2rad (deg) { return deg * Math.PI / 180 }

export function rad2deg (rad) { return rad * 180 / Math.PI }

export function cos (r) { return Math.cos(r) }

export function cosdeg (deg) { return rad2deg(cos(deg2rad(deg))) }

export function sin (r) { return Math.sin(r) }

export function sindeg (deg) { return rad2deg(sin(deg2rad(deg))) }

export function sqrt (v) { return (v <= 0) ? 0 : Math.sqrt(v) }
