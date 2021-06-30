<script>
	import { onMount } from 'svelte';
  import { burnStatus, burningRgba, unburnedRgba }from '../models/imageData.js'

  // These properties define a fire ellipse
  let head = 90
  let back = 10
  let flank = 25
  let angle = 0

  // These properties are set by onMount()
	let canvas // reference to the on-screen canavs
  let ctx // reference to the canvas 2d context
  let frame // id of the current animation frame
  let atX // canvas location for the fire template ignition point
  let atY
  let running = false
  let label = 'Start'
  let started = null
  let status = {unburned: 0, burning: 0, burned: 0, unburnable: 0, fixed: 0,
    total:0, adjacent: 0}

  function animateRotation() {
		frame = requestAnimationFrame(loop)
		function loop(t) {
      if (running) {
        frame = requestAnimationFrame(loop)
        angle += 1
        if (angle>=360) {
          cancelAnimationFrame(frame)
          console.log(`Elapsed time: ${Date.now()-started}`)
          running = false
        }
        drawEllipse(ctx, atX, atY, head, back, flank, angle)
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
        status = burnStatus(img)
      }
    }
  }

  function area (head, back, flank) {
    const a = (head + back) / 2
    const b = flank
    return Math.PI * a * b
  }

  // Draws a fire ellipse with ignition point at ignX, ignY
  function drawEllipse(ctx, ignX, ignY, head, back, flank, angle) {
    ctx.fillStyle = unburnedRgba
    ctx.strokeStyle = unburnedRgba
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    let [cx, cy] = ellipseCenter(ignX, ignY, head, back, angle)
    const rot = angle * Math.PI / 180
    const a = (head + back) / 2
    const b = flank
    // fire ellipse centered on ignition pt
    ctx.fillStyle = burningRgba
    ctx.strokeStyle = burningRgba
    ctx.beginPath()
    ctx.ellipse(cx, cy, a, b, rot, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
  }

  // Returns the center [cx,cy] of an ellipse
  // when its ignition point is position at [ignX, ignY]
  function ellipseCenter (ignX, ignY, head, back, angle) {
    const dx = ((head + back) / 2) - back
    const rot = angle * Math.PI / 180
    const cx = ignX + dx * Math.cos(rot)
    const cy = ignY + dx * Math.sin(rot)
    return [cx, cy]
  }

	onMount(() => {
    atX = canvas.width / 2
    atY = canvas.height / 2
		ctx = canvas.getContext('2d')
		return () => { cancelAnimationFrame(frame) }
	})

  function perimeter (head, back, flank) {
    const a = (head + back) / 2
    const b = flank
    const xm = (a - b) / (a + b)
    const xk = 1 + xm * xm / 4 + xm * xm * xm * xm / 64
    return Math.PI * (a + b) * xk
  }

  function startRotation () {
    if ( running ) {
      running = false
      cancelAnimationFrame(frame)
      label = 'Start'
    } else { // not running, so we are starting...
      angle = 0
      started = Date.now()
      running = true
      label = 'Stop'
      animateRotation()
    }
  }

  function stepRotation () {
    drawEllipse(ctx, atX, atY, head, back, flank, angle++)
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
    console.log('area=', Math.round(area(head, back, flank)),
      'perim=', Math.round(perimeter(head, back, flank)))
    status = burnStatus(img)
  }
</script>

<svelte:head>
	<title>Tinker Project</title>
</svelte:head>

<button class='btn-primary mb-3' on:click={startRotation}>{label} Rotation</button>
<button class='btn-primary mb-3' on:click={stepRotation}>Step Rotation</button>
<p>Unburned={status.unburned} Burning={status.burning}, Burned={status.burned}, Fixed={status.fixed} Adjacent={status.adjacent}</p>
<canvas bind:this={canvas} width={400} height={400}></canvas>

<style>
	canvas {
		width: 100%;
		height: 100%;
    border: 1px solid black;
		background-color: #666;
	}
</style>