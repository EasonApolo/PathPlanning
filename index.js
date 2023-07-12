function Grid(data, verbose = false) {
  const t1 = Date.now()
  this.data = data
  this.verbose = verbose
  let m = (this.m = data[0].length)
  let n = (this.n = data.length)

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      this.check(j, i)
    }
  }

  this.blockId = -2
  this.graph = {}
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      this.buildBlocks(j, i)
    }
  }
  this.buildGraph()

  if (verbose) {
    console.log('[grid] pre-computing time: ', `${Date.now() - t1}ms`)
  }
}

Grid.prototype.check = function (r, c) {
  const grid = this.data
  const m = this.m
  const n = this.n

  if (grid[r][c] <= 0) return
  const n_adj =
    (grid[r][c + 1] > 0) +
    (grid[r][c - 1] > 0) +
    (grid[r - 1][c] > 0) +
    (grid[r + 1][c] > 0)
  if (n_adj > 2) {
    return
  }
  if (
    n_adj === 2 &&
    ((grid[r][c + 1] > 0 && grid[r][c - 1] > 0) ||
      (grid[r - 1][c] > 0 && grid[r + 1][c] > 0))
  ) {
    return
  }
  if (grid[r][c + 1] === 0) {
    for (let i = c + 1; i < m; i++) {
      if (grid[r][i] <= 0) {
        grid[r][i] = -1
      } else {
        break
      }
    }
  }
  if (grid[r][c - 1] === 0) {
    for (let i = c - 1; i > -1; i--) {
      if (grid[r][i] <= 0) {
        grid[r][i] = -1
      } else {
        break
      }
    }
  }
  if (grid[r + 1][c] === 0) {
    for (let i = r + 1; i < n; i++) {
      if (grid[i][c] <= 0) {
        grid[i][c] = -1
      } else {
        break
      }
    }
  }
  if (grid[r - 1][c] === 0) {
    for (let i = r - 1; i > -1; i--) {
      if (grid[i][c] <= 0) {
        grid[i][c] = -1
      } else {
        break
      }
    }
  }
}

Grid.prototype.buildBlocks = function (r, c) {
  const grid = this.data
  const m = this.m
  const n = this.n
  const graph = this.graph

  if (grid[r][c] !== 0) {
    return
  }
  let max_c = 0,
    max_r = 0
  for (let i = c; i < m; i++) {
    max_c = i
    if (grid[r][i] !== 0) {
      max_c = i - 1
      break
    }
  }
  for (let i = r; i < n; i++) {
    max_r = i
    if (grid[i][c] !== 0) {
      max_r = i - 1
      break
    }
  }

  const id = this.blockId--
  for (let i = r; i <= max_r; i++) {
    for (let j = c; j <= max_c; j++) {
      grid[i][j] = id
    }
  }
  graph[id] = { id, x1: c, y1: r, x2: max_c, y2: max_r, adj: [] }

  const w = max_c - c
  const h = max_r - r
  return
}

Grid.prototype.getNext = function ({ r, c }, direction) {
  const m = this.m
  const n = this.n

  if (direction === 'l') {
    if (c - 1 < 0) {
      return
    }
    return { r, c: c - 1 }
  } else if (direction === 'r') {
    if (c + 1 >= m) {
      return
    }
    return { r, c: c + 1 }
  } else if (direction === 't') {
    if (r - 1 < 0) {
      return
    }
    return { r: r - 1, c }
  } else if (direction === 'b') {
    if (r + 1 >= n) {
      return
    }
    return { r: r + 1, c }
  }
}

Grid.prototype.buildGraph = function () {
  const grid = this.data
  const graph = this.graph

  function getW(b1, b2, x) {
    if (x) {
      const w1 = b1.x2 - b1.x1
      const w2 = b2.x2 - b2.x1
      return (w1 + w2) / 2
    } else {
      const h1 = b1.y2 - b1.y1
      const h2 = b2.y2 - b2.y1
      return (h1 + h2) / 2
    }
  }
  Object.entries(graph).forEach(([id, block]) => {
    const { x1, x2, y1, y2 } = block
    let adj_id
    for (let d of ['l', 'r', 'b', 't']) {
      let next = d === 'l' || d === 't' ? { r: y1, c: x1 } : { r: y2, c: x2 }
      let wd = d === 'l' || d === 'r'
      let i = 0
      while (true) {
        next = this.getNext(next, d)
        if (next) {
          const { r, c } = next
          if (grid[r][c] === -1) {
            continue
          } else if (grid[r][c] < -1) {
            block.adj.push({
              id: grid[r][c],
              w: getW(block, graph[grid[r][c]], wd) + ++i,
            })
            break
          } else if (grid[r][c] > 0) {
            break
          }
        } else {
          break
        }
      }
    }
  })
}

Grid.prototype.getBlockByCoord = function ([x, y]) {
  const grid = this.data
  const graph = this.graph

  if (grid[y][x] === -1) {
    // debugger
    let i = 0
    const nextMap = {
      l: { r: y, c: x },
      r: { r: y, c: x },
      b: { r: y, c: x },
      t: { r: y, c: x },
    }
    const ds = new Set(['l', 'r', 'b', 't'])
    while (i < 10) {
      i++
      for (let d of ds) {
        const next = this.getNext(nextMap[d], d)
        if (next) {
          const { r, c } = next
          if (grid[r][c] < -1) {
            return graph[grid[r][c]]
          } else if (grid[r][c] > 0) {
            ds.delete(d)
            break
          } else if (grid[r][c] === -1) {
            nextMap[d] = next
            continue
          }
        }
      }
    }
  }
  return Object.values(graph).find(({ x1, x2, y1, y2 }) => {
    if (x1 <= x && x <= x2 && y1 <= y && y <= y2) {
      return true
    }
  })
}

Grid.prototype.dijkstra = function (start, end) {
  const graph = this.graph

  const V = new Set() // visited
  const U = new Set() // unvisited
  const path = {}
  const pathInfo = {}
  Object.values(graph).forEach(node => {
    if (node === start) {
      V.add(node.id)
      pathInfo[node.id] = [node.id]
    } else {
      U.add(node.id)
      pathInfo[node.id] = []
    }
  })
  for (let child of start.adj) {
    pathInfo[child.id] = [start.id, child.id]
  }

  function getShortestNode(node) {
    let min = Infinity
    let res
    for (let child of node.adj) {
      if (U.has(child.id)) {
        if (child.w < min) {
          min = child.w
          res = child
        }
      }
    }
    return res
  }
  function computePath(start) {
    let adj = getShortestNode(start)
    if (!adj) return
    const cur = graph[adj.id]
    V.add(cur.id)
    U.delete(cur.id)
    for (let node of cur.adj) {
      if (!path[cur.id]) {
        path[cur.id] = adj.w
      }
      if (path[cur.id] + node.w < (path[node.id] || Infinity)) {
        path[node.id] = path[cur.id] + node.w
        pathInfo[node.id] = [...pathInfo[cur.id], node.id]
        V.delete(node.id)
        U.add(node.id)
      }
    }
    computePath(start)
    computePath(cur)
  }
  computePath(start)
  return pathInfo[end.id]
}

Grid.prototype.findPath = function (start, end) {
  const t1 = Date.now()
  const startBlock = this.getBlockByCoord(start)
  const endBlock = this.getBlockByCoord(end)

  const path = this.dijkstra(startBlock, endBlock)

  if (this.verbose) {
    console.log('[grid] find path time: ', `${Date.now() - t1}ms`)
  }
  return path
}

module.exports = Grid
