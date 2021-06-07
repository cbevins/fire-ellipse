<script>
  export let id = 'svg-grid-default'
  export let rows = 10
  export let cols = 10
  export let rowHt = 100
  export let colWd = 100
  export let colStyle = "stroke:rgb(127,127,127);stroke-width:2"
  export let rowStyle = "stroke:rgb(127,127,127);stroke-width:2"

  let xBeg = 0
  let xEnd = cols * colWd
  let yBeg = 0
  let yEnd = rows * rowHt
  let rowIdx = []
  let colIdx = []
  for (let i=0; i<rows; i++) rowIdx.push(i)
  for (let i=0; i<cols; i++) colIdx.push(i)
</script>

<svg xmlns="http://www.w3.org/2000/svg">
  <defs>
    <g id={id}>
      {#each rowIdx as row}
        <line x1={xBeg} x2={xEnd}
          y1={row * rowHt} y2={row * rowHt} style={rowStyle}/>
      {/each}
      {#each colIdx as col}
        <line x1={col * colWd} x2={col * colWd}
          y1={yBeg} y2={yEnd} style={colStyle}/>
      {/each}
    </g>
  </defs>
</svg>
