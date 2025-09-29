<!-- The pants-shaped component for all diagram components that are arithmetic operations (e.g., adder/ALU). -->

<script setup lang="ts">
import { Position, Handle } from '@vue-flow/core';
import type { NodeProps } from '@vue-flow/core';
import TriState from "./shapes/TriState.vue";
import { computeHandleOriented, type Orientation } from './shapes';
import type { HandleProperties } from './types';
import { computed } from 'vue';
  
const props = defineProps<NodeProps<{
    label?: string,
    description?: string,
    orientation?: Orientation,
    activeCycles?: number[]
}>>();

const orientation = computed(() => props.data.orientation ?? 'up');

const handlePositions = computed(() => Array.from<HandleProperties, HandleProperties>([
    { id: "output", side: Position.Right, handle: "source" },
    { id: "input", side: Position.Left, handle: "target" },
], p => computeHandleOriented(p, orientation.value)));

// Active highlight
const activeCycle = computed(() => props.data.activeCycles?.[props.data.activeCycles.length - 1]);
const activeClass = computed(() => typeof activeCycle.value === "number" ? `active-${activeCycle.value}` : undefined);

</script>

<template>
  <div v-tooltip.top="props.data.description">
    <TriState
      :dimensions="props.dimensions"
      :orientation
      :class="activeClass"
    />
    <!-- <div>{{ props.data.label }}</div> -->

    <Handle 
      v-for="pos of handlePositions"
      :id="pos.id"
      :key="pos.id"
      :position="pos.side"
      :type="pos.handle"
    />
  </div>
</template>

<style>
.vue-flow__node-tristate {
  --vf-handle: var(--vf-node-color);

  padding: 10px;
  width: 10px;
  font-size: 12px;
  text-align: center;
  color: var(--vf-node-text);

  /* Equilateral triangle */
  aspect-ratio: 2 / calc(sqrt(3));
}
</style>