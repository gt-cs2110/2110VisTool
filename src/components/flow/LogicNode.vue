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
    componentType?: LogicComponentType
}>>();

const orientation = computed(() => props.data.orientation ?? 'right');

type LogicComponentType = 'register' | 'regfile' | 'memory' | 'fsm' | 'mdr' | 'extender' | 'default';

const componentHandleConfigs: Record<LogicComponentType, HandleProperties[]> = {
    register: [
        { side: Position.Top, distance: "50%", handle: "source", id: "output"},
        { side: Position.Left, distance: "50%", handle: "target", id: "ld" },
        { side: Position.Bottom, distance: "50%", handle: "target", id: "input" }
    ],
    regfile: [
        { side: Position.Top, distance: "50%", handle: "target", id: "bus"},
        { side: Position.Left, distance: "30%", handle: "target", id: "dr" },
        { side: Position.Left, distance: "50%", handle: "target", id: "ld-reg" },
        { side: Position.Left, distance: "70%", handle: "target", id: "sr2" },
        { side: Position.Right, distance: "70%", handle: "target", id: "sr1" },
        { side: Position.Bottom, distance: "calc(100% / 3)", handle: "source", id: "sr2mux" },
        { side: Position.Bottom, distance: "calc(100% * 2 / 3)", handle: "source", id: "alu" }
    ],
    memory: [
        { side: Position.Right, distance: "80%", handle: "target", id: "mar-in" },
        { side: Position.Left, distance: "20%", handle: "target", id: "mdr-in" },
        { side: Position.Bottom, distance: "10%", handle: "source", id: "mdr-out" },
        { side: Position.Bottom, distance: "75%", handle: "target", id: "rw" },
        { side: Position.Bottom, distance: "25%", handle: "target", id: "mem-en" }
    ],
    fsm: [
        { side: Position.Left, distance: "30%", handle: "target", id: "ir-15-9" },
        { side: Position.Left, distance: "50%", handle: "target", id: "ready" },
        { side: Position.Left, distance: "70%", handle: "target", id: "nzp" },
        { side: Position.Right, distance: "10%", handle: "source", id: "source1" },
        { side: Position.Right, distance: "20%", handle: "source", id: "source2" },
        { side: Position.Right, distance: "30%", handle: "source", id: "aluk" },
        { side: Position.Right, distance: "40%", handle: "source", id: "source3" },
        { side: Position.Right, distance: "50%", handle: "source", id: "source4" },
        { side: Position.Right, distance: "60%", handle: "source", id: "source5" },
        { side: Position.Right, distance: "70%", handle: "source", id: "source6" },
    ],
    mdr: [
      { side: Position.Top, distance: "50%", handle: "source", id: "gate-mdr" },
      { side: Position.Left, distance: "50%", handle: "target", id: "ld-mdr" },
      { side: Position.Right, distance: "50%", handle: "source", id: "mem-output" },
      { side: Position.Bottom, distance: "50%", handle: "target", id: "input" }
    ],
    extender: [
        { side: Position.Left, distance: "50%", handle: "target", id: "input" },
        { side: Position.Right, distance: "50%", handle: "source", id: "output" }
    ],
    default: [
        { side: Position.Bottom, distance: "50%", handle: "source", id: "input" }
    ]
};

const handlePositions = computed(() => {
    const componentType = props.data.componentType || 'default';
    const handles = props.data.handles || componentHandleConfigs[componentType];
    return handles.map(p => computeHandleOriented(p, orientation.value));
});
</script>

<template>
  <div class="size-full">
    <div class="logic-label">
      {{ props.data.label }}
    </div>

    <Handle
      v-for="pos of handlePositions"
      :id="pos.id"
      :key="pos.id || `${pos.side}-${pos.distance}`"
      :type="pos.handle"
      :position="pos.side"
      :style="getPositionStyles(pos.side, pos.distance, pos.depth)"
    />
  </div>
</template>

<style>
.vue-flow__node-logic {
  --vf-handle: var(--vf-node-color);

  text-align: center;
  color: var(--vf-node-text);
  font-size: 12px;
  background-color: var(--vf-node-bg);
  border: 1px solid var(--vf-node-color);
  border-radius: 3px;
}
</style>

<style lang="css" scoped>
    /* Center label */
    .logic-label {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>