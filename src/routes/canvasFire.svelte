<script>
	import { onMount } from 'svelte';
  import {ellipseLineIntersection} from '../models/ellipseLineIntersection.js'

	let canvas

  function drawLine(ctx, x1, y1, x2, y2) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }

  function rotate (px, py, ox, oy, cosa, sina) {
    const rx = cosa * (px-ox) - sina * (py-oy) + ox
    const ry = sina * (px-ox) + cosa * (py-oy) + py-oy
    return [rx, ry]
  }

	onMount(() => {
    const ctx = canvas.getContext('2d')
    let width = 101
    let height = 51
    let step = 10
    let atX = 200
    let atY = 200
    let angle = 45
    let rot = angle * Math.PI / 180
    let cosa = Math.cos(-rot)
    let sina = Math.sin(-rot)
    let cosr = Math.cos(rot)
    let sinr = Math.sin(rot)
    ctx.setLineDash([])
    ctx.beginPath()
    ctx.ellipse(atX, atY, width, height, rot, 0, 2 * Math.PI)
    ctx.stroke()
    // Vertical lines
    for (let x=-width; x <= width; x+=step) {
      // Rotate [x,height] around [x,0]
      const [rx1, ry1] = rotate(x, -height-step, x, 0, cosa, sina)
      const [rx2, ry2] = rotate(x, height+step, x, 0, cosa, sina)
      const p = ellipseLineIntersection(width, height, rx1, ry1, rx2, ry2, false)
      if (p.length === 1) p.push(p[0])
      if (p.length === 2) {
        const [px0, py0] = rotate(p[0][0], p[0][1], 0, 0, cosr, sinr)
        const [px1, py1] = rotate(p[1][0], p[1][1], 0, 0, cosr, sinr)
        drawLine(ctx, atX + px0, atY + py0, atX + px1, atY + py1)
        // drawLine(ctx, atX + p[0][0], atY + p[0][1], atX + p[1][0], atY + p[1][1])
        // drawLine(ctx, atX + rx1, atY + ry1, atX + rx2, atY + ry2)
      }
    }
    // Horizontal lines
    // for (let y=-height; y <= height; y+=step) {
    //   const p = ellipseLineIntersection(width, height, width-step, y, width+step, y, false)
    //   if (p.length === 1) p.push(p[0])
    //   if (p.length === 2) {
    //   drawLine(ctx, atX + p[0][0], atY + p[0][1], atX + p[1][0], atY + p[1][1])
    //   }
    // }
	})
</script>

<svelte:head>
	<title>Tinker Project</title>
</svelte:head>

<canvas bind:this={canvas} width={400} height={400}>
</canvas>

<style>
	canvas {
		width: 100%;
		height: 100%;
    border: 1px solid black;
		background-color: #666;
	}
</style>