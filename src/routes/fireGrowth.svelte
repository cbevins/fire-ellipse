<script>
	import { onMount } from 'svelte';
  import { Ellipse } from '../models/Ellipse.js'
  import { burning, burningRgba, getFireFront, setGreen, setRed, unburnedRgba }from '../models/imageData.js'

  // These properties define a fire ellipse
  let e = null

  // These properties are set by onMount()
	let canvas // reference to the on-screen HTML <canvas> element
  let ctx // reference to the canvas 2d context
  let frame // id of the current animation frame
  let atX // canvas location for the fire template ignition point
  let atY
  let running = false
  let label = 'Start'
  let started = null
  let front = [200, 200]

  // Draws the fire ellipse 'e' with its ignition point at atX, atY
  function drawEllipse(ctx, atX, atY) {
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
    e.scanLines.forEach((x, y) => { // scanLine [x,y] are relative to [e.ix, e.iy]
      const xmin = Math.trunc(x[0])
      const xmax = Math.trunc(x[1])
      for (let x=xmin; x<=xmax; x++) {
        setRed(img, atX + x, atY + y, burning)
        setGreen(img, atX + x, atY + y, 0)
      }
    })
    ctx.putImageData(img, 0, 0)
  }

	onMount(() => {
    atX = canvas.width / 2
    atY = canvas.height / 2
		ctx = canvas.getContext('2d')
    ctx.fillStyle = unburnedRgba
    ctx.strokeStyle = unburnedRgba
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    e = new Ellipse(0, 0, 90, 10, 25, 45)
    front = [200, 200]
		return () => { cancelAnimationFrame(frame) }
	})

  function startGrowth () {
    if ( running ) {
      running = false
      cancelAnimationFrame(frame)
      label = 'Start'
    } else { // not running, so we are starting...
      started = Date.now()
      running = true
      label = 'Stop'
      animateGrowth()
    }
  }

  function stepGrowth () {
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
    // Step 1 - set all burning pixels to burned
    // Step 2 - overlay fire template on all fire front pixels
    // front.forEach(([atX, atY]) => {
      console.log(front)
      drawEllipse(ctx, atX, atY)
    //})
    // Step 3 - get status, which also cleans up artifacts
    // status = burnStatus(img)
    // Step 4 - get the next round of fire front pixels
    front = getFireFront(img)
    drawFront(img)
    console.log('Fire front = ', front.length)
  }
</script>

<svelte:head>
	<title>Tinker Project</title>
</svelte:head>

<button class='btn-primary mb-3' on:click={startGrowth}>{label} Growth</button>
<button class='btn-primary mb-3' on:click={stepGrowth}>Step Growth</button>
<canvas bind:this={canvas} width={400} height={400}></canvas>

<style>
	canvas {
		width: 100%;
		height: 100%;
    border: 1px solid black;
		background-color: #666;
	}
</style>
