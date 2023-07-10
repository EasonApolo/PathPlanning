<template>
  <div id="app">
    <canvas id="canvas" width="2000" height="1500"></canvas>
  </div>
</template>

<script>
import { Grid, Astar } from 'fast-astar'

export default {
  name: 'App',
  mounted() {
  },
  data() {
    return {
      a: undefined,
    }
  },
  methods: {
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#canvas {
  width: 1000px;
  height: 750px;
}
</style>
