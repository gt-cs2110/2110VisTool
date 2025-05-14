<!-- The pants-shaped component for all diagram components that are arithmetic operations (e.g., adder/ALU). -->

<script setup lang="ts">
import { Position, Handle } from '@vue-flow/core';
import type { NodeProps } from '@vue-flow/core';
  
const props = defineProps<NodeProps<{
    label?: string
}>>();

// TODO: ports
</script>

<template>
  <div>
    <div>{{ props.data.label }}</div>

    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<style>
.vue-flow__node-logic {
  --vf-handle: var(--vf-node-color);

  padding: 10px;
  width: 150px;
  font-size: 12px;
  text-align: center;
  color: var(--vf-node-text);

  background-color: var(--vf-node-bg);
  border: 1px solid var(--vf-node-color);
  border-radius: 3px;
}
</style>