<script>
	import { onMount } from 'svelte';
  import { burningRgba, burningPixelCount, unburnedRgba } from '../models/imageData.js'

  // These properties define a fire ellipse
  let head = 180
  let back = 20
  let flank = 50
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

  function animate() {
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
        console.log(burningPixels(), updateImageData())
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
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    let [cx, cy] = ellipseCenter(ignX, ignY, head, back, angle)
    const rot = angle * Math.PI / 180
    const a = (head + back) / 2
    const b = flank
    // fire ellipse centered on ignition pt
    ctx.fillStyle = burningRgba
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

  function scanLines () {
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const row = []
    for (let y=0; y<img.height; y++) {
      let first = -1
      let last = -1
      for (let x=0; x<img.width; x++) {
        const red = getRed(img, x, y)
        if (red === burning && first < 0) { // first burning pixel of row
          first = x
        } else if (red !== burning && first >= 0) { // last burning pixel of row
          last = x-1
          row.push([y-atY, first-x, last-x]) // NOTE: y above ignY are negative
          break
        }
      }
    }
    return row
  }

  function start () {
    if ( running ) {
      running = false
      cancelAnimationFrame(frame)
      label = 'Start'
    } else { // not running, so we are starting...
      angle = 0
      started = Date.now()
      running = true
      label = 'Stop'
      animate()
    }
  }

  function step () {
    drawEllipse(ctx, atX, atY, head, back, flank, angle++)
    // console.log(burningPixels(), getPixel(200, 200))
    // scanLines().forEach(([row, first, last]) => {
    //   console.log(row, first, last, (last - first + 1))
    // } )
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
    console.log('pixels=', burningPixelCount(img),
      'area=', Math.round(area(head, back, flank)),
      'perim=', Math.round(perimeter(head, back, flank)))
  }
</script>

<svelte:head>
	<title>Tinker Project</title>
</svelte:head>

<button class='btn-primary mb-3' on:click={start}>{label}</button>
<button class='btn-primary mb-3' on:click={step}>Step</button>
<canvas bind:this={canvas} width={400} height={400}></canvas>

<style>
	canvas {
		width: 100%;
		height: 100%;
    border: 1px solid black;
		background-color: #666;
	}
</style>