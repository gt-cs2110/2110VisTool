<!-- The pants-shaped component for all diagram components that are arithmetic operations (e.g., adder/ALU). -->

<script setup lang="ts">
import { Position, Handle } from '@vue-flow/core';
import type { NodeProps } from '@vue-flow/core';
  
const props = defineProps<NodeProps<{
    label?: string,
    width?: number,
    height?: number,
    padding?: number,
    fontSize?: number
}>>();

// TODO: ports
</script>

<template>
  <div :style="{
    width: props.data.width ? `${props.data.width}px` : '150px',
    height: props.data.height ? `${props.data.height}px` : 'auto',
    padding: props.data.padding ? `${props.data.padding}px` : '10px',
    fontSize: props.data.fontSize ? `${props.data.fontSize}px` : '12px'
  }">
    <div>{{ props.data.label }}</div>

    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<style>
.vue-flow__node-logic {
  --vf-handle: var(--vf-node-color);

  text-align: center;
  color: var(--vf-node-text);

  background-color: var(--vf-node-bg);
  border: 1px solid var(--vf-node-color);
  border-radius: 3px;
}
</style>