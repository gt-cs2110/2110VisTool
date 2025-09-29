<!-- The pants-shaped component for all diagram components that are arithmetic operations (e.g., adder/ALU). -->

<script setup lang="ts">
import { Position, Handle } from '@vue-flow/core';
import type { NodeProps } from '@vue-flow/core';
import Mux from "./shapes/Mux.vue";
import { computeHandleOriented, getPositionStyles, type Orientation } from './shapes';
import type { HandleProperties } from './types';
import { computed } from 'vue';
import { ALU_SLANT } from './constants';
  
const props = defineProps<NodeProps<{
    label?: string,
    description?: string,
    orientation?: Orientation,
    inputSize?: number,
    selectorLeftUp?: boolean,
    activeCycles?: number[]
}>>();

const orientation = computed(() => props.data.orientation ?? 'up');
const nInputs = computed(() => props.data.inputSize ?? 2);
const leftUp = computed(() => !!props.data.selectorLeftUp);
// Active highlight
const activeCycle = computed(() => props.data.activeCycles?.[props.data.activeCycles.length - 1]);
const activeClass = computed(() => typeof activeCycle.value === "number" ? `active-${activeCycle.value}` : undefined);

function computeDistance(i: number, nInputs: number) {
  // 1/2n distance around the edges, and 1/n between ports
  // return 100 * (1/2n + i / n);
  return (50 + 100 * i) / nInputs;
}
const handlePositions = computed(() => {
  const selectorSide = leftUp.value ? Position.Top : Position.Bottom;
  
  const selectorDistance = "50%";
  const selectorDepth = `${Math.round((1 - ALU_SLANT) * 100 / 2)}%`;
  
  return Array.from<HandleProperties, HandleProperties>([
    { id: 'output', side: Position.Right, handle: "source" },
    ...Array.from<unknown, HandleProperties>({ length: nInputs.value }, (_, i) => (
      { id: `input-${i}`, side: Position.Left, handle: "target", distance: `${computeDistance(i, nInputs.value)}%` }
    )),
    { id: "selector", side: selectorSide, handle: "target", distance: selectorDistance, depth: selectorDepth }
  ], p => computeHandleOriented(p, orientation.value));
});
</script>

<template>
  <div class="size-full" v-tooltip.top="props.data.description">
    <Mux
      :class="activeClass"
      :dimensions="props.dimensions"
      :orientation
      :n-inputs="nInputs"
      :input-handles="handlePositions.filter(h => h.id && h.id.startsWith('input-'))"
    />
    <div class="mux-label small-label">
      {{ props.data.label }}
    </div>

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
.vue-flow__node-mux {
  --vf-handle: var(--vf-node-color);

  padding: 10px;
  width: 150px;
  font-size: 12px;
  text-align: center;
  color: var(--vf-node-text);
}
</style>
<style lang="css" scoped>
  .mux-label {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
</style>