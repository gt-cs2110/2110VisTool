<script setup lang="ts">
    import { ref, useTemplateRef } from 'vue';
    import { VueFlow } from '@vue-flow/core';
    import { Background } from '@vue-flow/background';
    import ALUNode from './flow/ALUNode.vue';
    import MuxNode from './flow/MuxNode.vue';
    import LogicNode from './flow/LogicNode.vue';
    import TriStateNode from './flow/TriStateNode.vue';
import BusNode from './flow/BusNode.vue';
import { initialNodes, initialEdges } from './flow/LC3Components';

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

<style scoped>
    @import "@/style.css";

    .wire.active {
        fill: var(--p-surface-500, #888888);
        stroke: var(--p-surface-500, #888888);
        animation: wire-pulse 1s infinite;
    }
    .wire.active.active-0 { /* red-500 */
        fill: #ef4444; stroke: #ef4444;
    }
    .wire.active.active-1 { /* orange-500 */
        fill: #f97316; stroke: #f97316;
    }
    .wire.active.active-2 { /* yellow-500 */
        fill: #eab308; stroke: #eab308;
    }
    .wire.active.active-3 { /* green-500 */
        fill: #22c55e; stroke: #22c55e;
    }
    .wire.active.active-4 { /* blue-500 */
        fill: #3b82f6; stroke: #3b82f6;
    }
    .wire.active.active-5 { /* purple-500 */
        fill: #a855f7; stroke: #a855f7;
    }
    .wire.active.active-6 { /* pink-500 */
        fill: #ec4899; stroke: #ec4899;
    }
/*
    @keyframes wire-pulse {
        0% { stroke-opacity: 1; }
        50% { stroke-opacity: 0.5; }
        100% { stroke-opacity: 1; }
    }
        */
    .lc3-container { padding:0; line-height:0; display:flex; align-items:stretch; justify-content:stretch; }
    .lc3-svg { display:block; width:100%; height:auto; }
    
    .vue-flow-container {
        height: 100%;
        width: 100%;
    }
</style>

<template>
    <div ref="top" class="h-full w-full bg-surface-800 rounded">
        <VueFlow :nodes="nodes" :edges="edges" :nodesDraggable="false" class="vue-flow-container">
          <Background pattern-color="var(--color-surface-500)" :gap="16" />
      
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