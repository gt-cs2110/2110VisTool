<!-- Logic node component for various LC3 components like registers, memory, etc. -->

<script setup lang="ts">
import { Position, Handle } from '@vue-flow/core';
import type { NodeProps } from '@vue-flow/core';
import { computeHandleOriented, getPositionStyles, type Orientation } from './shapes';
import type { HandleProperties } from './types';
import { computed } from 'vue';
  
const props = defineProps<NodeProps<{
    label?: string,
    orientation?: Orientation,
    handles?: HandleProperties[],
}>>();

const orientation = computed(() => props.data.orientation ?? 'right');

const defaultHandles: HandleProperties[] = [
    { id: "output", side: Position.Right, handle: "source" },
];

const handlePositions = computed(() => {
    const handles = props.data.handles || defaultHandles;
    return handles.map(p => computeHandleOriented(p, orientation.value));
});
</script>

<template>
  <div class="size-full">
    <div class="signal-label">
      {{ props.data.label }}
    </div>

    <Handle
      v-for="pos of handlePositions"
      :id="pos.id"
      :key="pos.id || `${pos.side}-${pos.distance}`"
      :type="pos.handle"
      :position="pos.side"
      :style="{...getPositionStyles(pos.side, pos.distance, pos.depth), opacity: 0}"
    />
  </div>
</template>

<style>
.vue-flow__node-signal {
  --vf-handle: var(--vf-node-color);
  text-align: center;
  color: white;
  background: transparent;
  font-size: 20px !important;
}
</style>

<style lang="css" scoped>
  .signal-label {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
</style>