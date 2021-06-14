import { Tile } from './Tile.js'
import { Ellipse } from './Ellipse.js'
import { deg2rad } from './trig.js'

export class FirePerimeter {
  constructor (duration=1, arc=30, buffer=1e-8) {
    this._arc = arc // 30-deg yields 12 boundary points spawned per ellipse
    this._buffer = buffer // Ellipse.containsPoint() buffer
    this._duration = duration // growth time step duration
    this._current = {
      _boundary: [], // current boundary points
      _step: 0, // completed time steps to the current boundary
    }
    this._ignition = {
      _boundary: [], // boundary points of ignition ellipse
      _ellipse: null, // ignition ellipse
      _time: 0, // ignition time in user-space
    }
    this._tile = new Tile(16)
  }

  currentBoundary() { return this._current._boundary }
  currentElapsed () { return this._current._step * this._duration }
  currentStep () { return this._current._step }
  currentTime () { return this.ignitionTime() + this.currentElapsed() }
  ignitionBoundary() { return this._ignition._boundary }
  ignitionEllipse () { return this._ignition._ellipse }
  ignitionTime () { return this._ignition._time }

  // Determines the length, width, angle (and possibly other behaviors)
  // of a newly ignited Ellipse with center at x, y at current time
  // \TODO Use the fire-behavior-simulator
  fireBehavior (e) {
    e.l = 100
    e.w = 50
    e.a = 0
  }

  growTile () {
    this._current._step++
    // array of e boundary points at *degrees* intervals at start+dur
    const spawn = []
    // examine each boundary point
    this.currentBoundary().forEach(e => {
      this.fireBehavior(e) // add len, wid, angle, etc
      for(let deg=0; deg<360; deg+=this._arc) {
        const p = e.perimeterPointAt(deg2rad(deg))
        if (this._tile.markCell(p.x, p.y) === 'marked') {
          const pe = new Ellipse(p.x, p.y) // point on boundary of e at deg
          pe.p = e // set the point ellipse as this spawn's parent
          spawn.push(pe) // add this point to the next boundary
        }
      }
    })
    this._current._boundary = spawn
    return this._current._boundary
  }

  grow () {
    this._current._step++
    // array of e boundary points at *degrees* intervals at start+dur
    const spawn = []
    // examine each boundary point
    this.currentBoundary().forEach(e => {
      this.fireBehavior(e) // add len, wid, angle, etc
      for(let deg=0; deg<360; deg+=this._arc) {
        const p = e.perimeterPointAt(deg2rad(deg))
        if (! e.p.containsPoint(p, this._buffer)) {
          const pe = new Ellipse(p.x, p.y) // point on boundary of e at deg
          pe.p = e // set the point ellipse as this spawn's parent
          spawn.push(pe) // add this point to the next boundary
        }
      }
    })
    return this.thin(spawn)
  }

  growTurf () {
    this._current._step++
    // array of e boundary points at *degrees* intervals at start+dur
    const spawn = []
    // examine each boundary point
    this.currentBoundary().forEach(e => {
      this.fireBehavior(e) // add len, wid, angle, etc
      for(let deg=0; deg<360; deg+=this._arc) {
        const p = e.perimeterPointAt(deg2rad(deg))
        if (! e.p.containsPoint(p, this._buffer)) {
          const pe = new Ellipse(p.x, p.y) // point on boundary of e at deg
          pe.p = e // set the point ellipse as this spawn's parent
          spawn.push(pe) // add this point to the next boundary
        }
      }
    })
    return this.thin(spawn)
  }

  // Start a new fire polygon centered at [x,y],
  // using conditions from start time for a time duration
  ignite (x, y, startTime) {
    // Create the ignition Ellipse and grow for step 1
    const e = new Ellipse(x, y)
    e.p = null // the ignition ellipse has no parent
    this.fireBehavior(e, startTime) // determine length, width, angle, etc
    this._ignition_boundary = []
    for(let deg=0; deg<360; deg+=this._arc) {
      const p = e.perimeterPointAt(deg2rad(deg))
      const pe = new Ellipse(p.x, p.y) // point on boundary of e at deg
      pe.p = e // set the root ellipse as this point ellipse's parent
      this._ignition._boundary.push(pe)
    }
    this._ignition._time = startTime
    this._ignition._ellipse = e
    this._current._boundary = this._ignition._boundary
    return this._ignition._boundary
  }

  thin (spawn) {
    // Iterate over spawned points, eliminating those within other
    this._current._boundary = []
    for (let i=0; i<spawn.length; i++) {
      let keep = true
      for (let j=0; j<spawn.length; j++) {
        if (spawn[i] !== spawn[j] &&
          spawn[j].containsPoint(spawn[i], this._buffer)) {
          keep = false
          break
        }
      }
      if (keep) this._current._boundary.push(spawn[i])
    }
    return this._current._boundary
  }
}