Find a relative short path on a grid-based map.

### Usage

```javascript
const grid = new Grid(data)
const path = grid.findPath([0, 0], [10, 10])
// path: [[1,1], [4, 4], [6, 8], ...]
```

### Data description

* 0 represents available point
* \>0 represent obstacles
* (internal) -1 represents split line
* (internal) <-1 represent block id

### Known bugs / behavior

- throw an error when the target is unreachable.
- include unexpected node when finding path between adjacentblocks.

### Method

1. Draw split lines which divide map into blocks.
2. Give BlockID to each block.
3. Generate a weighted-undirected graph.
4. Use dijkstra algorithm to find a shortest path.
