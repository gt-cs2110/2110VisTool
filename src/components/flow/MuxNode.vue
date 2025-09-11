<!-- The pants-shaped component for all diagram components that are arithmetic operations (e.g., adder/ALU). -->

<script setup lang="ts">
import { Position, Handle } from '@vue-flow/core';
import type { HandleType, NodeProps } from '@vue-flow/core';
import Mux from "./shapes/Mux.vue";
import { computeHandleOriented, getCrossProperty, type Orientation } from './shapes';
import { computed } from 'vue';
  
const props = defineProps<NodeProps<{
    label?: string,
    orientation?: Orientation,
    inputSize?: number,
    selectorLeftUp?: boolean
}>>();

const orientation = computed(() => props.data.orientation ?? 'up');
const nInputs = computed(() => props.data.inputSize ?? 2);
const leftUp = computed(() => !!props.data.selectorLeftUp);

interface HandleProperties {
    id?: string,
    side: Position,
    distance?: string,
    handle: HandleType,
}

function computeDistance(i: number, nInputs: number) {
  // 1/2n distance around the edges, and 1/n between ports
  // return 100 * (1/2n + i / n);
  return (50 + 100 * i) / nInputs;
}
const handlePositions = computed(() => {
  const selectorSide = leftUp.value ? Position.Top : Position.Bottom;
  const selectorDistance = "50%";
  
  return Array.from<HandleProperties, HandleProperties>([
    { id: 'output', side: Position.Right, handle: "source" },
    ...Array.from<unknown, HandleProperties>({ length: nInputs.value }, (_, i) => (
      { id: `input-${i}`, side: Position.Left, handle: "target", distance: `${computeDistance(i, nInputs.value)}%` }
    )),
    { id: "selector", side: selectorSide, handle: "target", distance: selectorDistance }
  ], p => computeHandleOriented(p, orientation.value));
});
</script>

<template>
  <div>
    <Mux :dimensions="props.dimensions" :orientation />
    <div>{{ props.data.label }}</div>

    <Handle
        v-for="pos of handlePositions"
        :id="pos.id"
        :type="pos.handle"
        :position="pos.side"
        :style="pos.distance ? { [getCrossProperty(pos.side)]: pos.distance } : {}"
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