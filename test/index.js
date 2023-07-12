const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const m = data[0].length
const n = data.length
const s = 20
const canvasW = m * s
const canvasH = n * s

function initCanvas() {
  canvas.width = canvasW
  canvas.height = canvasH
  canvas.style.width = `${canvasW / 2}px`
  canvas.style.height = `${canvasH / 2}px`
  console.log('x: ', m, ', y: ', n)
}

const drawBackgroundWithBlocks = grid => {
  grid = grid.data

  ctx.clearRect(0, 0, canvasW, canvasH)
  ctx.strokeStyle = '#ddd'
  ctx.fillStyle = '#ddd'
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (grid[i][j] === 0) {
        ctx.strokeRect(j * s, i * s, s, s)
      } else if (grid[i][j] === -1) {
        ctx.fillStyle = '#dde'
        ctx.fillRect(j * s, i * s, s, s)
        ctx.fillStyle = '#eee'
      } else if (grid[i][j] < -1) {
        ctx.fillStyle = '#aae'
        ctx.fillRect(j * s, i * s, s, s)
        ctx.fillStyle = '#eee'
      } else if (grid[i][j] > 0) {
        ctx.fillRect(j * s, i * s, s, s)
      }
    }
  }
}

const drawBackground = grid => {
  grid = grid.data

  ctx.clearRect(0, 0, canvasW, canvasH)
  ctx.strokeStyle = '#ddd'
  ctx.fillStyle = '#ddd'
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (grid[i][j] <= 0) {
        ctx.strokeRect(j * s, i * s, s, s)
      } else if (grid[i][j] > 0) {
        ctx.fillRect(j * s, i * s, s, s)
      }
    }
  }
}

function drawBlockLabel(grid) {
  const graph = grid.graph

  ctx.fillStyle = '#666'
  ctx.textBaseline = 'top'
  ctx.font = 'normal 24px serif'
  Object.values(graph).forEach(block => {
    ctx.fillText(block.id, block.x1 * s, block.y1 * s)
  })
}

function drawPath(grid, start, end) {
  const graph = grid.graph
  const getCenter = (coord) => {
    return coord.map(c => (c + 0.5) * s)
  }

  const t1 = Date.now()
  const path = grid.findPath(start, end)

  ctx.beginPath()
  ctx.moveTo(...getCenter(start))
  for (let id of path) {
    const { x1, x2, y1, y2 } = graph[id]
    const x0 = Math.floor((x1 + x2) / 2)
    const y0 = Math.floor((y1 + y2) / 2 + 0.5)
    ctx.lineTo(...getCenter([x0, y0]))
  }
  ctx.lineTo(...getCenter(end))
  ctx.strokeStyle = '#222'
  ctx.stroke()

  console.log(path, Date.now() - t1)
}

initCanvas()
const grid = new Grid(data)
drawBackground(grid)
// drawBackgroundWithBlocks(grid)
// drawBlockLabel(grid)
canvas.addEventListener('click', e => {
  const { offsetX: x, offsetY: y } = e
  drawBackground(grid)
  drawPath(grid, [0, 0], [Math.floor((x / s) * 2), Math.floor((y / s) * 2)])
})
