<script>
	import { onMount } from 'svelte'
  import { FireLandscape } from '../models/FireLandscape.js'
  import { FireWavelet } from '../models/FireWavelet.js'

  // FireEllipse properties
  let feHeadRos = 93.3012701892219
  let feLength = 100
  let feWidth = 50
  let feDegrees = 135
  let feTime = 1
  let feSpacing = 5
  let sceneWidth = 1000
  let sceneHeight = 1000
  let fl = new FireLandscape(sceneWidth, sceneHeight, feSpacing)
  let fe = new FireWavelet(feLength, feWidth, feDegrees, feTime, feSpacing)

  // These properties are set by onMount()
	let canvas // reference to the on-screen HTML <canvas> element
  let ctx // reference to the canvas 2d context
  let frame // id of the current animation frame
  let cx, cy // canvas center
  let ix = 100 // Firelet ignition point
  let iy = 100

  function drawFireWavelet () {
    ctx.beginPath()
    ctx.fillStyle = "green"
    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.fill()
    ctx.strokeStyle = "red"
    ctx.lineWidth = 1
    fe.hlines().forEach(([y, x1, x2]) => {
      ctx.moveTo(x1+ix, iy-y)
      ctx.lineTo(x2+ix, iy-y)
    })
    fe.vlines().forEach(([x, y1, y2]) => {
      ctx.moveTo(x+ix, iy-y1)
      ctx.lineTo(x+ix, iy-y2)
    })
    ctx.stroke()
  }

	onMount(() => {
    cx = canvas.width / 2
    cy = canvas.height / 2
		ctx = canvas.getContext('2d')
    drawFireWavelet()
		return () => { cancelAnimationFrame(frame) }
	})

  function rotate () {
    feDegrees += 15
    feDegrees = feDegrees % 360
    update()
  }

  function update () {
    fl = new FireLandscape(sceneWidth, sceneHeight, feSpacing)
    fe = new FireWavelet(feLength, feWidth, feDegrees, feTime, feSpacing)
    drawFireWavelet()
  }
</script>

<svelte:head>
	<title>Firelet</title>
</svelte:head>

<h5 class='mb-3'>Simple STandalone Firelet Tinker Toy</h5>
  <div class="row">
    <div class="col">
      <label for="ellipseLength" class="form-label">Firelet Length {feLength}</label>
      <input bind:value={feLength} type="range" class="form-range" min="1" max="200" id="ellipseLength">
    </div>
    <div class="col">
      <label for="ellipseWidth" class="form-label">Firelet Width {feWidth}</label>
      <input bind:value={feWidth} type="range" class="form-range" min="1" max="100" id="ellipseWidth">
    </div>
    <div class="col">
      <label for="ellipseDegrees" class="form-label">Firelet Heading {feDegrees}&deg;</label>
      <input bind:value={feDegrees} type="range" class="form-range" min="0" max="360" step='15'id="ellipseDegrees">
    </div>
    <div class="col">
      <label for="ellipseSpacing" class="form-label">Scanline Spacing {feSpacing}</label>
      <input bind:value={feSpacing} type="range" class="form-range" min="1" max="50" id="ellipseSpacing">
    </div>
  </div>
  <div class="row">
    <div class="col">
      <button class='btn-primary mb-3' on:click={rotate}>Rotate</button>
      <button class='btn-primary mb-3' on:click={update}>Update</button>
    </div>
  </div>

  <canvas bind:this={canvas} width={sceneWidth} height={sceneHeight}></canvas>

  <style>
	canvas {
		width: 100%;
		height: 100%;
    border: 1px solid black;
		background-color: #666;
	}
</style>
