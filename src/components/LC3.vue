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

    const top = useTemplateRef("top");
    const flow = useTemplateRef("flow");

    defineExpose({
        /**
         * Activates the wire with the given ID, causing it to light up.
         * @param wireId ID of the wire to activate.
         */
        activateWire(wireId: string, cycle: number) {
            if (!flow.value) return;

            const edge = flow.value.findEdge(wireId);
            if (edge) {
                (edge.data.activeCycles ??= []).push(cycle);
                edge.data.animator.animate(1000);
                return;
            }

            const node = flow.value.findNode(wireId);
            if (node) {
                (node.data.activeCycles ??= []).push(cycle);
                return;
            }

            console.warn("Failed to activate missing wire:", wireId);
        },
        /**
         * Deactivates the wire with the given ID, causing it to turn off.
         * @param wireId ID of the wire to activate.
         */
        deactivateWire(wireId: string) {
            if (!flow.value) return;

            const edge = flow.value.findEdge(wireId);
            if (edge) {
                (edge.data.activeCycles ??= []).pop();
                return;
            }

            const node = flow.value.findNode(wireId);
            if (node) {
                (node.data.activeCycles ??= []).pop();
                return;
            }

            console.warn("Failed to deactivate missing wire:", wireId);
        },

        /**
         * Resets all wires, removing their light-up status.
         */
        resetWires() {
            if (!flow.value) return;

            for (const node of flow.value.nodes) {
                node.data.activeCycles = [];
            }
            for (const edge of flow.value.edges) {
                edge.data.activeCycles = [];
                edge.data.animator.reset();
            }
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
      ref="flow"
      :nodes
      :edges
      :nodes-draggable="true"
      class="vue-flow-container"
      snap-to-grid
      :snap-grid="[GRID_GAP_SIZE / 2, GRID_GAP_SIZE / 2]"
      :default-viewport="{ x: 3 * GRID_GAP_SIZE, y: 1 * GRID_GAP_SIZE, zoom: 0.5 }"
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
    /* EDGE ACTIVE STATES */
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
    /* WIRE ARROW ACTIVE STATES */
    :deep(.vue-flow__arrowhead path) {
        &.active-0 {
            stroke: var(--color-active-0) !important;
            fill: var(--color-active-0);
        }
        &.active-1 {
            stroke: var(--color-active-1) !important;
            fill: var(--color-active-1);
        }
        &.active-2 {
            stroke: var(--color-active-2) !important;
            fill: var(--color-active-2);
        }
        &.active-3 {
            stroke: var(--color-active-3) !important;
            fill: var(--color-active-3);
        }
        &.active-4 {
            stroke: var(--color-active-4) !important;
            fill: var(--color-active-4);
        }
        &.active-5 {
            stroke: var(--color-active-5) !important;
            fill: var(--color-active-5);
        }
        &.active-6 {
            stroke: var(--color-active-6) !important;
            fill: var(--color-active-6);
        }
    }
    /* NODE SVG ACTIVE STATES */
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
    /* BUS ACTIVE STATES */
    :deep(.vue-flow__node-bus svg.shape) {
        &.active-0 g {
            stroke: var(--color-active-0) !important;
        }
        &.active-1 g {
            stroke: var(--color-active-1) !important;
        }
        &.active-2 g {
            stroke: var(--color-active-2) !important;
        }
        &.active-3 g {
            stroke: var(--color-active-3) !important;
        }
        &.active-4 g {
            stroke: var(--color-active-4) !important;
        }
        &.active-5 g {
            stroke: var(--color-active-5) !important;
        }
        &.active-6 g {
            stroke: var(--color-active-6) !important;
        }
    }
    /* LOGIC NODE ACTIVE STATES */
    :deep(.vue-flow__node-logic) {
        &:has(.active-0) {
            background-color: var(--color-active-0-light);
            border-color: var(--color-active-0);
        }
        &:has(.active-1) {
            background-color: var(--color-active-1-light);
            border-color: var(--color-active-1);
        }
        &:has(.active-2) {
            background-color: var(--color-active-2-light);
            border-color: var(--color-active-2);
        }
        &:has(.active-3) {
            background-color: var(--color-active-3-light);
            border-color: var(--color-active-3);
        }
        &:has(.active-4) {
            background-color: var(--color-active-4-light);
            border-color: var(--color-active-4);
        }
        &:has(.active-5) {
            background-color: var(--color-active-5-light);
            border-color: var(--color-active-5);
        }
        &:has(.active-6) {
            background-color: var(--color-active-6-light);
            border-color: var(--color-active-6);
        }
    }
</style>