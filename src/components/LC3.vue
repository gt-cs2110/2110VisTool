<script setup lang="ts">
    import { ref, useTemplateRef } from 'vue';
    import { VueFlow } from '@vue-flow/core';
    import { Background } from '@vue-flow/background';
    import ALUNode from './flow/ALUNode.vue';
    import MuxNode from './flow/MuxNode.vue';
    import LogicNode from './flow/LogicNode.vue';
    import TriStateNode from './flow/TriStateNode.vue';
    import BusNode from './flow/BusNode.vue';
    import { initialNodes, initialEdges, Consts } from './flow/LC3Components';

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
      :nodes
      :edges
      :nodes-draggable="false"
      class="vue-flow-container"
      snap-to-grid
      :snap-grid="[Consts.GRID_GAP_SIZE / 2, Consts.GRID_GAP_SIZE / 2]"
      :default-viewport="{ x: 2 * Consts.GRID_GAP_SIZE, y: 1 * Consts.GRID_GAP_SIZE, zoom: 0.5 }"
      @node-click="(e) => console.log(e.node.id, {...e.node.position})"
    >
      <Background
        pattern-color="var(--color-surface-500)"
        :gap="Consts.GRID_GAP_SIZE"
        :offset="-Consts.GRID_GAP_SIZE / 2"
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
    </VueFlow>
  </div>
</template>

<style scoped>
    @reference "@/style.css";

    .wire.active {
        @apply fill-surface-500 stroke-surface-500;
        animation: wire-pulse 1s infinite;
    }
    .wire.active.active-0 {
        @apply fill-red-500 stroke-red-500;
    }
    .wire.active.active-1 {
        @apply fill-orange-500 stroke-orange-500;
    }
    .wire.active.active-2 {
        @apply fill-yellow-500 stroke-yellow-500;
    }
    .wire.active.active-3 {
        @apply fill-green-500 stroke-green-500;
    }
    .wire.active.active-4 {
        @apply fill-blue-500 stroke-blue-500;
    }
    .wire.active.active-5 {
        @apply fill-purple-500 stroke-purple-500;
    }
    .wire.active.active-6 {
        @apply fill-pink-500 stroke-pink-500;
    }

    @keyframes wire-pulse {
        0% { stroke-opacity: 1; }
        50% { stroke-opacity: 0.5; }
        100% { stroke-opacity: 1; }
    }
</style>