<!-- Bus node component with a square outline and one open side with arrow heads -->

<script setup lang="ts">
import { Position, Handle } from '@vue-flow/core';
import type { HandleType, NodeProps } from '@vue-flow/core';
import { getPositionStyles } from './shapes/index';
import type { HandleProperties } from './types';
import { computed } from 'vue';
import WireArrow from './WireArrow.vue';
  
interface BusHandle {
  /**
   * ID for bus handle
   */
  id: string,
  /**
   * Sources are inputs into registers.
   * Targets are outputs from gates.
   */
  handle: HandleType,
  /**
   * Which side this handle is on
   */
  side: Position.Top | Position.Bottom,
  /**
   * The direction edges come from
   */
  lineSide: Position.Top | Position.Bottom,
  /**
   * Distance along the line.
   */
  distance: number,
}
const props = defineProps<NodeProps<{
    label?: string,
    handles?: BusHandle[]
    activeCycles?: number[]
}>>();

const width = computed(() => props.dimensions.width ?? 900);
const height = computed(() => props.dimensions.height ?? 750);

// Active highlight
const activeCycle = computed(() => props.data.activeCycles?.[props.data.activeCycles.length - 1]);
const activeClass = computed(() => typeof activeCycle.value === "number" ? `active-${activeCycle.value}` : undefined);

const handlePositions = computed(() => (props.data.handles ?? []).map<HandleProperties>(h => ({
  // Handle side decides which direction edges come from,
  // So pick the line side and manually move to the correct side if the side is wrong
  side: h.lineSide,
  depth: h.side == h.lineSide ? "0%" : `calc(100% - ${STROKE_WIDTH}px)`,
  // Other handle properties
  handle: h.handle,
  id: h.id,
  distance: `${h.distance}px`
})));

const STROKE_WIDTH = 10;
// 3 sides of a square, with full bus fitting within SVG bounds
const points = computed(() => [
  [0, STROKE_WIDTH / 2],
  [width.value - STROKE_WIDTH / 2, STROKE_WIDTH / 2],
  [width.value - STROKE_WIDTH / 2, height.value - STROKE_WIDTH / 2],
  [0, height.value - STROKE_WIDTH / 2],
])
</script>

<template>
  <div
    class="bus-node"
    :style="{
      width: `${width}px`,
      height: `${height}px`,
    }"
  >
    <WireArrow
      id="bus-arrow"
      type="arrow"
      :active-class="activeClass"
      :refX="5"
    />
    <!-- Square outline with one missing side -->
    <svg
      :width
      :height
      :class="['shape', activeClass]"
      :style="{ position: 'absolute', top: 0, left: 0, zIndex: 0 }"
    >
      <g :stroke-width="STROKE_WIDTH" fill="none" class="bus-lines">
        <line :x1="points[1][0]" :y1="points[0][1]" :x2="points[0][0]" :y2="points[1][1]" class="with-arrow" />
        <line :x1="points[1][0]" :y1="points[1][1]" :x2="points[2][0]" :y2="points[2][1]" />
        <line :x1="points[2][0]" :y1="points[2][1]" :x2="points[3][0]" :y2="points[3][1]" class="with-arrow" />
      </g>
    </svg>

    <Handle
      v-for="pos of handlePositions"
      :id="pos.id"
      :key="pos.id"
      :type="pos.handle"
      :position="pos.side"
      :style="getPositionStyles(pos.side, pos.distance, pos.depth)"
    />
  </div>
</template>

<style>
.vue-flow__node-bus {
  --vf-handle: var(--vf-node-color);
}
.bus-lines .with-arrow {
  marker-end: url(#bus-arrow);
}
.vue-flow__node-bus svg g {
  stroke: var(--vf-node-bg);
}
.vue-flow__node-bus .marker-arrow {
  stroke: var(--vf-node-bg);
  fill: var(--vf-node-bg);
}
</style>