<!-- Bus node component with a square outline and one open side with arrow heads -->

<script setup lang="ts">
import { Position, Handle } from '@vue-flow/core';
import type { HandleType, NodeProps } from '@vue-flow/core';
import { getPositionStyles } from './shapes/index';
import type { HandleProperties } from './types';
import { computed } from 'vue';
  
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
}>>();

const width = computed(() => props.dimensions.width ?? 900);
const height = computed(() => props.dimensions.height ?? 750);

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
  <div class="bus-node" :style="{
    width: `${width}px`,
    height: `${height}px`,
  }">
    <!-- Square outline with one missing side -->
    <svg
      :width
      :height
      class="bus-outline"
      :style="{ position: 'absolute', top: 0, left: 0, zIndex: 0 }"
    >
      <!-- 3 sides of square -->
      <g stroke="#fff" :stroke-width="STROKE_WIDTH" fill="none">
        <polyline :points="points.join(' ')"/>
      </g>
    </svg>

    <Handle
        v-for="pos of handlePositions"
        :id="pos.id"
        :type="pos.handle"
        :position="pos.side"
        :style="getPositionStyles(pos.side, pos.distance, pos.depth)"
    />
  </div>
</template>

<style>
.vue-flow__node-bus {
  --vf-handle: var(--vf-node-color);
  position: relative;
  background: transparent;
  border: none;
  box-shadow: none;
  border-radius: 0;
}
</style>