<script>
  import { writable } from 'svelte/store'
  import { FirePerimeter } from '../models/FirePerimeter.js'
  import SvgGridDef from '../components/SvgGridDef.svelte'

  // array of fire polygon boundary points
  let boundary = writable([])
  let fp = new FirePerimeter()

  function grow () { $boundary = fp.grow() }

  // Ignite the fire ...
  $boundary = fp.ignite(500, 500, 0)
</script>

<svelte:head>
	<title>Tinker Project</title>
</svelte:head>

<h3>DEPRECATED - Fire Ellipse Tinker Project</h3>
<p class='mb-2'>
  Currently at step {fp.currentStep()} with {$boundary.length} points
</p>
<button class='btn-primary mb-2' on:click={grow}>Grow</button>

<svg viewbox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <SvgGridDef id='grid'/>
  </defs>

  <use xlink:href="#grid" />
  {#each fp.ignitionBoundary() as e}
    <circle cx={e.x} cy={e.y} r="4" fill='blue' stroke="black" stroke-width="1" />
  {/each}
  {#each $boundary as e}
    <circle cx={e.x} cy={e.y} r="4" stroke="black" stroke-width="1"
      fill='red' />
  {/each}
</svg>
