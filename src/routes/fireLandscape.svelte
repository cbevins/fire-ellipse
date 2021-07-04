<script>
	import { onMount } from 'svelte'
  import { FireLandscape } from '../models/FireLandscape.js'
  import { FireWavelet } from '../models/FireWavelet.js'

  // FireEllipse properties
  let feHeadRos = 93.3012701892219
  let feLength = 100
  let feWidth = 50
  let feDegrees = 135
  let timeRes = 1
  let spacing = 5
  let sceneWidth = 1000
  let sceneHeight = 1000
  let fl = new FireLandscape(sceneWidth, sceneHeight, timeRes, spacing)
  let fe = new FireWavelet(feLength, feWidth, feDegrees, timeRes, spacing)

  // These properties are set by onMount()
	let canvas // reference to the on-screen HTML <canvas> element
  let ctx // reference to the canvas 2d context
  let frame // id of the current animation frame
  let cx, cy // canvas center
  let ix = 100, iy = 100 // ignition center

  function draw() {
    drawFireLandscape()
    drawFireWavelet()
  }

  function drawFireLandscape () {
    ctx.beginPath()
    ctx.strokeStyle = "green"
    ctx.lineWidth = 1
    fl.hlines().forEach(([y, x1, x2]) => {
      ctx.moveTo(x1+ix, iy-y)
      ctx.lineTo(x2+ix, iy-y)
    })
    fl.vlines().forEach(([x, y1, y2]) => {
      ctx.moveTo(x+ix, iy-y1)
      ctx.lineTo(x+ix, iy-y2)
    })
    ctx.stroke()
  }

  function drawFireLandscape0 () {
    ctx.beginPath()
    ctx.fillStyle = "green"
    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.fill()
  }

  function drawFireWavelet () {
    ctx.beginPath()
    ctx.strokeStyle = "red"
    ctx.lineWidth = 1
    fe.hScans().forEach(([y, x1, x2]) => {
      ctx.moveTo(x1+ix, iy-y)
      ctx.lineTo(x2+ix, iy-y)
    })
    fe.vScans().forEach(([x, y1, y2]) => {
      ctx.moveTo(x+ix, iy-y1)
      ctx.lineTo(x+ix, iy-y2)
    })
    ctx.stroke()
    ctx.beginPath()
    ctx.fillStyle = 'yellow'
    ctx.arc(ix, iy, 1, 0, 2*Math.PI, true)
    ctx.fill()
  }

	onMount(() => {
    cx = canvas.width / 2
    cy = canvas.height / 2
		ctx = canvas.getContext('2d')
    draw()
		return () => { cancelAnimationFrame(frame) }
	})

  function rotate () {
    feDegrees += 15
    feDegrees = feDegrees % 360
    update()
  }

  function update () {
    fl = new FireLandscape(sceneWidth, sceneHeight, timeRes, spacing)
    fe = new FireWavelet(feLength, feWidth, feDegrees, timeRes, spacing)
    draw()
  }
</script>

<svelte:head>
  <title>FireLandscape</title>
</svelte:head>

<h5 class='mb-3'>Fire Landscape Tinker Toy</h5>
  <div class="row">
    <div class="col">
      <label for="ellipseLength" class="form-label">Length {feLength}</label>
      <input bind:value={feLength} type="range" class="form-range" min="1" max="200" id="ellipseLength">
    </div>
    <div class="col">
      <label for="ellipseWidth" class="form-label">Width {feWidth}</label>
      <input bind:value={feWidth} type="range" class="form-range" min="1" max="100" id="ellipseWidth">
    </div>
    <div class="col">
      <label for="ellipseDegrees" class="form-label">Heading {feDegrees}&deg;</label>
      <input bind:value={feDegrees} type="range" class="form-range" min="0" max="360" step='15'id="ellipseDegrees">
    </div>
    <div class="col">
      <label for="ellipseSpacing" class="form-label">Spacing {spacing}</label>
      <input bind:value={spacing} type="range" class="form-range" min="1" max="50" id="ellipseSpacing">
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
