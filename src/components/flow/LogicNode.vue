<!-- Logic node component for various LC3 components like registers, memory, etc. -->

<script setup lang="ts">
import { Position, Handle } from '@vue-flow/core';
import type { HandleType, NodeProps } from '@vue-flow/core';
import { computeHandleOriented, getCrossProperty, type Orientation } from './shapes';
import { computed } from 'vue';
  
const props = defineProps<NodeProps<{
    label?: string,
    orientation?: Orientation,
    handles?: HandleConfig[],
    componentType?: LogicComponentType
}>>();

const orientation = computed(() => props.data.orientation ?? 'right');

interface HandleConfig {
    id?: string,
    side: Position,
    distance?: string,
    type: HandleType,
}

interface HandleProperties {
    id?: string,
    side: Position,
    distance?: string,
    handle: HandleType,
}

type LogicComponentType = 'register' | 'regfile' | 'memory' | 'fsm' | 'mdr' | 'extender' | 'default';

const componentHandleConfigs: Record<LogicComponentType, HandleConfig[]> = {
    register: [
        { side: Position.Top, distance: "50%", type: "source", id: "output"},
        { side: Position.Left, distance: "50%", type: "target", id: "ld" },
        { side: Position.Bottom, distance: "50%", type: "target", id: "input" }
    ],
    regfile: [
        { side: Position.Top, distance: "50%", type: "target", id: "bus"},
        { side: Position.Left, distance: "30%", type: "target", id: "dr" },
        { side: Position.Left, distance: "50%", type: "target", id: "ld-reg" },
        { side: Position.Left, distance: "70%", type: "target", id: "sr2" },
        { side: Position.Right, distance: "70%", type: "target", id: "sr1" },
        { side: Position.Bottom, distance: "40%", type: "source", id: "sr2mux" },
        { side: Position.Bottom, distance: "60%", type: "source", id: "alu" }
    ],
    memory: [
        { side: Position.Right, distance: "25%", type: "target", id: "mar-in" },
        { side: Position.Left, distance: "50%", type: "target", id: "mdr-in" },
        { side: Position.Bottom, distance: "10%", type: "source", id: "mdr-out" },
        { side: Position.Bottom, distance: "25%", type: "target", id: "rw" },
        { side: Position.Bottom, distance: "75%", type: "target", id: "mem-en" }
    ],
    fsm: [
        { side: Position.Left, distance: "20%", type: "target", id: "ir-15-9" },
        { side: Position.Left, distance: "40%", type: "target", id: "ready" },
        { side: Position.Left, distance: "60%", type: "target", id: "nzp" },
        { side: Position.Right, distance: "10%", type: "source", id: "source1" },
        { side: Position.Right, distance: "20%", type: "source", id: "source2" },
        { side: Position.Right, distance: "30%", type: "source", id: "aluk" },
        { side: Position.Right, distance: "40%", type: "source", id: "source3" },
        { side: Position.Right, distance: "50%", type: "source", id: "source4" },
        { side: Position.Right, distance: "60%", type: "source", id: "source5" },
        { side: Position.Right, distance: "70%", type: "source", id: "source6" },
    ],
    mdr: [
      { side: Position.Top, distance: "50%", type: "source", id: "gate-mdr" },
      { side: Position.Left, distance: "50%", type: "target", id: "ld-mdr" },
      { side: Position.Right, distance: "50%", type: "source", id: "mem-output" },
      { side: Position.Bottom, distance: "50%", type: "target", id: "input" }
    ],
    extender: [
        { side: Position.Left, distance: "50%", type: "target", id: "input" },
        { side: Position.Right, distance: "50%", type: "source", id: "output" }
    ],
    default: [
        { side: Position.Bottom, distance: "50%", type: "source", id: "input" }
    ]
};

const handlePositions = computed(() => {
    const componentType = props.data.componentType || 'default';
    const handles = props.data.handles || componentHandleConfigs[componentType];
    return handles.map<HandleProperties>(handle => ({
        id: handle.id,
        side: handle.side,
        distance: handle.distance,
        handle: handle.type
    })).map(p => computeHandleOriented(p, orientation.value));
});
</script>

<template>
  <div class="size-full">
    <div class="logic-label">{{ props.data.label }}</div>

    <Handle
        v-for="pos of handlePositions"
        :key="pos.id || `${pos.side}-${pos.distance}`"
        :id="pos.id"
        :type="pos.handle"
        :position="pos.side"
        :style="pos.distance ? { [getCrossProperty(pos.side)]: pos.distance } : {}"
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