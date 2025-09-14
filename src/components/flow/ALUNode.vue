<!-- The pants-shaped component for all diagram components that are arithmetic operations (e.g., adder/ALU). -->

<script setup lang="ts">
import { Position, Handle } from '@vue-flow/core';
import type { NodeProps } from '@vue-flow/core';
import ALU from "./shapes/ALU.vue";
import { computeHandleOriented, getPositionStyles, type Orientation } from './shapes';
import type { HandleProperties } from './types';
import { computed } from 'vue';
import { Consts } from './LC3Components';
  
const props = defineProps<NodeProps<{
    label?: string,
    orientation?: Orientation,
    selector?: boolean
}>>();

const orientation = computed(() => props.data.orientation ?? 'up');

const handlePositions = computed(() => {
    const handles: HandleProperties[] = [
        { side: Position.Right, distance: "50%", handle: "source", id: "output" },
        { side: Position.Left, distance: "calc(100% * 2 / 9)", handle: "target", id: "input-b" },
        { side: Position.Left, distance: "calc(100% * 7 / 9)", handle: "target", id: "input-a" },
    ];    
    if (props.data.selector) {
        handles.push({
          side: Position.Bottom,
          distance: "50%",
          depth: `${Math.round((1 - Consts.ALU_SLANT) * 100 / 2)}%`,
          handle: "target",
          id: "selector"
        });
    }
    return Array.from(handles, p => computeHandleOriented(p, orientation.value));
});
</script>

<template>
  <div class="size-full">
    <ALU
      :dimensions="props.dimensions"
      :orientation
    />
    <div
      class="alu-label" 
      :class="`alu-label-${orientation}`"
    >
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
.vue-flow__node-alu {
  --vf-handle: var(--vf-node-color);

  width: 150px;
  height: 38px;
  font-size: 12px;
  text-align: center;
  color: var(--vf-node-text);
}
</style>
<style lang="css" scoped>
  .alu-label {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  .alu-label-up {
    align-items: start;
  }
  .alu-label-down {
    align-items: end;
  }
  .alu-label-left {
    justify-content: start;
  }
  .alu-label-right {
    justify-content: end;
  }
</style>