<!-- Bus node component with a square outline and one open side with arrow heads -->

<script setup lang="ts">
import { Position, Handle } from '@vue-flow/core';
import type { HandleType, NodeProps } from '@vue-flow/core';
import { getCrossProperty } from './shapes/index';
import { computed } from 'vue';
  
const props = defineProps<NodeProps<{
    label?: string,
}>>();

const width = computed(() => props.dimensions.width ?? 900);
const height = computed(() => props.dimensions.height ?? 750);

interface HandleProperties {
    id?: string,
    side: Position,
    distance?: string,
    handle: HandleType,
}
const handlePositions = computed(() => {
    const handles: HandleProperties[] = [
        { side: Position.Top, distance: "20%", handle: "target", id: "gateMarMux" },
        { side: Position.Top, distance: "40%", handle: "source", id: "pcMux" },
        { side: Position.Top, distance: "60%", handle: "target", id: "gatePc" },
        { side: Position.Top, distance: "80%", handle: "source", id: "regFile" },
        { side: Position.Bottom, distance: "5%", handle: "target", id: "mdrMux" },
        { side: Position.Bottom, distance: "20%", handle: "source", id: "gateMdr" },
        { side: Position.Bottom, distance: "30%", handle: "source", id: "ir" },
        { side: Position.Bottom, distance: "40%", handle: "source", id: "logic" },
        { side: Position.Bottom, distance: "50%", handle: "source", id: "mar" },
        { side: Position.Bottom, distance: "60%", handle: "target", id: "input" },
        { side: Position.Bottom, distance: "80%", handle: "target", id: "gateAlu" },
        { side: Position.Bottom, distance: "90%", handle: "source", id: "output" }
    ];
    return handles;
});

</script>

<template>
  <div class="bus-node" :style="{
    width: `${width}px`,
    height: `${height}px`,
  }">
    <!-- Square outline with one missing side -->
    <svg
      :width="width"
      :height="height"
      class="bus-outline"
      :style="{ position: 'absolute', top: 0, left: 0, zIndex: 0 }"
    >
      <!-- 3 sides of square -->
      <g stroke="#fff" stroke-width="10" fill="none">
        <line x1="2" y1="2" :x2="width - 2" y2="2" />
        <line :x1="width - 2" y1="2" :x2="width - 2" :y2="height - 2" />
        <line :x1="width - 2" :y1="height - 2" x2="2" :y2="height - 2" />
      </g>
    </svg>

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
.vue-flow__node-bus {
  --vf-handle: var(--vf-node-color);
  position: relative;
  background: transparent;
  border: none;
  box-shadow: none;
  border-radius: 0;
}
</style>