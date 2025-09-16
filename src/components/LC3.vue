<script setup lang="ts">
    import { ref, useTemplateRef } from 'vue';
    import { VueFlow } from '@vue-flow/core';
    import { Background } from '@vue-flow/background';
    import ALUNode from './flow/ALUNode.vue';
    import MuxNode from './flow/MuxNode.vue';
    import LogicNode from './flow/LogicNode.vue';
    import TriStateNode from './flow/TriStateNode.vue';
    import BusNode from './flow/BusNode.vue';
    import SignalNode from './flow/SignalNode.vue';
    import { GRID_GAP_SIZE } from './flow/constants';
    import { initialNodes, initialEdges } from './flow/LC3Components';
    import WireEdge from './flow/WireEdge.vue';

    const top = useTemplateRef<HTMLDivElement>("top");
    defineExpose({
        /**
         * Activates the wire with the given ID, causing it to light up.
         * @param wireId ID of the wire to activate.
         */
        activateWire(wireId: string, cycle: number) {
                // Activate selected wire
            const wire = document.getElementById(wireId);
            if (wire) {
                wire.classList.remove(
                    ...Array.from(wire.classList.values())
                        .filter(cls => cls.startsWith("active-"))
                );
                wire.classList.add("active", `active-${cycle}`);
            } else {
                console.warn("Failed to activate missing wire:", wireId);
            }
        },
        /**
         * Deactivates the wire with the given ID, causing it to turn off.
         * @param wireId ID of the wire to activate.
         */
        deactivateWire(wireId: string) {
            const wire = document.getElementById(wireId);
            if (wire) {
                wire.classList.remove(
                    'active',
                    ...Array.from(wire.classList.values())
                        .filter(cls => cls.startsWith("active-"))
                );
            } else {
                console.warn("Failed to deactivate missing wire:", wireId);
            }
        },

        /**
         * Resets all wires, removing their light-up status.
         */
        resetWires() {
            document.querySelectorAll('.wire').forEach(wire => {
                wire.classList.remove('active');
            });
        },

        scrollIntoView() {
            top.value?.scrollIntoView();
        }
    })

    const nodes = ref(initialNodes);
    const edges = ref(initialEdges);
</script>

<template>
  <div
    ref="top"
    class="h-full w-full bg-surface-800 rounded"
  >
    <VueFlow
      id="lc3-flow-diagram"
      :nodes
      :edges
      :nodes-draggable="true"
      class="vue-flow-container"
      snap-to-grid
      :snap-grid="[GRID_GAP_SIZE / 2, GRID_GAP_SIZE / 2]"
      :default-viewport="{ x: 2 * GRID_GAP_SIZE, y: 1 * GRID_GAP_SIZE, zoom: 0.5 }"
      @node-click="(e) => console.log(e.node.id, {...e.node.position})"
    >
      <Background
        pattern-color="var(--color-surface-500)"
        :gap="GRID_GAP_SIZE"
        :offset="-GRID_GAP_SIZE / 2"
      />
      
      <template #node-alu="props">
        <ALUNode v-bind="props" />
      </template>

      <template #node-mux="props">
        <MuxNode v-bind="props" />
      </template>

      <template #node-logic="props">
        <LogicNode v-bind="props" />
      </template>
          
      <template #node-bus="props">
        <BusNode v-bind="props" />
      </template>

      <template #node-tristate="props">
        <TriStateNode v-bind="props" />
      </template>

      <template #node-signal="props">
        <SignalNode v-bind="props" />
      </template>

      <template #edge-wire="props">
        <WireEdge v-bind="props" />
      </template>
    </VueFlow>
  </div>
</template>

<style>
.vue-flow__node {
    font-size: 25px;
    .small-label {
        font-size: 17.5px;
    }
}
</style>
<style scoped>
    @reference "@/style.css";

    :deep(.vue-flow__edge-wire > .vue-flow__edge-path) {
        &.active-0 {
            stroke: var(--color-active-0);
        }
        &.active-1 {
            stroke: var(--color-active-1);
        }
        &.active-2 {
            stroke: var(--color-active-2);
        }
        &.active-3 {
            stroke: var(--color-active-3);
        }
        &.active-4 {
            stroke: var(--color-active-4);
        }
        &.active-5 {
            stroke: var(--color-active-5);
        }
        &.active-6 {
            stroke: var(--color-active-6);
        }
    }

    :deep(.vue-flow__node svg.shape) {
        &.active-0 {
            fill: var(--color-active-0-light);
            stroke: var(--color-active-0);
        }
        &.active-1 {
            fill: var(--color-active-1-light);
            stroke: var(--color-active-1);
        }
        &.active-2 {
            fill: var(--color-active-2-light);
            stroke: var(--color-active-2);
        }
        &.active-3 {
            fill: var(--color-active-3-light);
            stroke: var(--color-active-3);
        }
        &.active-4 {
            fill: var(--color-active-4-light);
            stroke: var(--color-active-4);
        }
        &.active-5 {
            fill: var(--color-active-5-light);
            stroke: var(--color-active-5);
        }
        &.active-6 {
            fill: var(--color-active-6-light);
            stroke: var(--color-active-6);
        }
    }

    :deep(.vue-flow__node-logic) {
        &.active-0 {
            background-color: var(--color-active-0-light);
            border-color: var(--color-active-0);
        }
        &.active-1 {
            background-color: var(--color-active-1-light);
            border-color: var(--color-active-1);
        }
        &.active-2 {
            background-color: var(--color-active-2-light);
            border-color: var(--color-active-2);
        }
        &.active-3 {
            background-color: var(--color-active-3-light);
            border-color: var(--color-active-3);
        }
        &.active-4 {
            background-color: var(--color-active-4-light);
            border-color: var(--color-active-4);
        }
        &.active-5 {
            background-color: var(--color-active-5-light);
            border-color: var(--color-active-5);
        }
        &.active-6 {
            background-color: var(--color-active-6-light);
            border-color: var(--color-active-6);
        }
    }
</style>