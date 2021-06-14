<script>
	import { onMount } from 'svelte';

	let canvas
  let angle = 0
	onMount(() => {
		const ctx = canvas.getContext('2d')


		let frame = requestAnimationFrame(loop)
		function loop(t) {
			frame = requestAnimationFrame(loop)
      angle = (angle>=360) ? 0 : angle+15
	// 		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  //     for (let p = 0; p < imageData.data.length; p += 4) {
	// 			const i = p / 4
	// 			const x = i % canvas.width
	// 			const y = i / canvas.height >>> 0

	// 			const r = 64 + (128 * x / canvas.width) + (64 * Math.sin(t / 1000))
	// 			const g = 64 + (128 * y / canvas.height) + (64 * Math.cos(t / 1000))
	// 			const b = 128;

	// 			imageData.data[p + 0] = r
	// 			imageData.data[p + 1] = g
	// 			imageData.data[p + 2] = b
	// 			imageData.data[p + 3] = 255
	// 		}
      ctx.fillStyle = 'rgb(200, 0, 0)';
      ctx.beginPath();
      // x, y, l, w,
      ctx.ellipse(100, 100, 50, 75, Math.PI / 4, 0, 2 * Math.PI);
      ctx.fill()
      // Draw the ellipse's line of reflection
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.moveTo(0, 200);
      ctx.lineTo(200, 0);
      ctx.stroke();

	// 		ctx.putImageData(imageData, 0, 0)
    }
		return () => { cancelAnimationFrame(frame) }
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