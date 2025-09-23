<script setup lang="ts">
defineProps({
  id: String,
  type: String,
  strokeWidth: {
    type: Number,
    default: 1,
  },
  width: {
    type: Number,
    default: 8,
  },
  height: {
    type: Number,
    default: 8,
  },
  activeClass: {
    type: String,
    default: undefined,
  },
})
</script>

<template>
  <svg class="vue-flow__marker vue-flow__container">
    <defs>
      <marker
        :id="id"
        :class="['vue-flow__arrowhead', activeClass]"
        viewBox="-10 -10 20 20"
        refX="10"
        refY="0"
        :markerWidth="width"
        :markerHeight="height"
        markerUnits="strokeWidth"
        orient="auto-start-reverse"
      >
        <path
          :class="['marker-arrow', activeClass]"
          :style="{
            strokeWidth,
          }"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M 0,-5 L 10,0 L 0,5 Z"
        />
      </marker>
    </defs>
  </svg>
</template>

<style scoped>
.marker-arrow {
  stroke: var(--color-inactive);
  fill: var(--color-inactive);
}
</style>