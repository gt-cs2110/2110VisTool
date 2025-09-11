<!-- Bus node component with a square outline and one open side with arrow heads -->

<script setup lang="ts">
import { Position, Handle } from '@vue-flow/core';
import type { NodeProps } from '@vue-flow/core';
import { computed } from 'vue';
  
const props = defineProps<NodeProps<{
    label?: string,
    width?: number,
    height?: number,
    padding?: number,
    fontSize?: number,
}>>();


const width = computed(() => props.data.width ?? 100);
const height = computed(() => props.data.height ?? 60);
const padding = computed(() => props.data.padding ?? 10);
</script>

<template>
  <div class="bus-node" :style="{
    width: `${width}px`,
    height: `${height}px`,
    fontSize: props.data.fontSize ? `${props.data.fontSize}px` : '12px'
  }">
    <!-- Square outline with one missing side -->
    <svg 
      :width="width" 
      :height="height" 
      class="bus-outline"
      :style="{ position: 'absolute', top: 0, left: 0, zIndex: 0 }"
    >
      <!-- Draw 3 sides of the square based on openSide -->
      <g stroke="#fff" stroke-width="10" fill="none">
         <line x1="2" y1="2" :x2="width - 2" y2="2" />
         <line :x1="width - 2" y1="2" :x2="width - 2" :y2="height - 2" />
         <line :x1="width - 2" :y1="height - 2" x2="2" :y2="height - 2" />
      </g>

    </svg>

    <!-- Label centered in the node -->
    <div class="bus-label" :style="{ 
      padding: `${padding}px`,
      width: `${width}px`,
      height: `${height}px`
    }">
      {{ props.data.label }}
    </div>

    <Handle type="source" :position="Position.Bottom" />
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

.bus-node {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.bus-label {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--vf-node-text);
  position: relative;
  z-index: 1;
  box-sizing: border-box;
}

.bus-outline {
  pointer-events: none;
}
</style>