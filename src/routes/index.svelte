<script>
  import { writable } from 'svelte/store'
  import { ignite, grow } from '../models/ellipse.js'
  import SvgGridDef from '../components/SvgGridDef.svelte'

  // array of fire polygon boundary points
  let boundary = writable([])
  // string representation for use with <polyline>
  let polyline = writable('')

  // Simulation parameters
  let buffer = 1e-8 // Ellipse.containsPoint() buffer
  let degrees = 30 // 12 boundary points spawned per ellipse
  let dur = 1
  let steps = 0
  let start = 0
  let current = start

  function north (a, x, y) { return `rotate(${a - 90}, ${x}, ${y})` }

  function update (bdyPts) {
    $boundary = bdyPts
    steps++
    current = start + steps * dur
  }

  function step () {
    update(grow($boundary, current, dur, degrees, buffer))
  }

  // Ignite the fire ...
  let [ellipse, bdyPts] = ignite(500, 500, start, dur, degrees)
  update(bdyPts)
</script>

<svelte:head>
	<title>Tinker Project</title>
</svelte:head>

<h1>Fire Ellipse Tinker Project</h1>

<p>Currently at step {steps} with {$boundary.length} points</p>
<button on:click={step}>Grow</button>

<svg viewbox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <SvgGridDef id='grid'/>
  </defs>

  <use xlink:href="#grid" />
  {#each $boundary as e}
    <circle cx={e.x} cy={e.y} r="4" stroke="black" stroke-width="1" fill="red" />
  {/each}
</svg>
