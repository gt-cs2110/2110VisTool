<script setup lang="ts">
    import { ref, useTemplateRef } from 'vue';
    import { VueFlow } from '@vue-flow/core';
    import { Background } from '@vue-flow/background';
    import type { LC3Node } from './flow/types.d';
    import ALUNode from './flow/ALUNode.vue';
    import MuxNode from './flow/MuxNode.vue';
    import LogicNode from './flow/LogicNode.vue';
    import TriStateNode from './flow/TriStateNode.vue';
import BusNode from './flow/BusNode.vue';

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

    const nodes = ref<LC3Node[]>([
        {
            id: "marMux",
            type: "mux",
            position: { x: -100, y: 100 },
            data: { label: "MARMUX" }
        },
        {
            id: "gateMarMux",
            type: "tristate",
            position: { x: -25, y: 0 },
            data: { label: "GateMARMUX" }
        },
        {
            id: "gatePc",
            type: "tristate",
            position: { x: 250, y: 0 },
            data: { label: "GatePC" }
        },
        { 
            id: "pc",
            type: "logic",
            position: { x: 200, y: 100 },
            data: { 
                label: "PC",
                width: 120,
                height: 40
            }
        },
        { 
            id: "pcMux",
            type: "mux",
            position: { x: 200, y: 200 },
            data: { label: "PCMUX" }
        },
        { 
            id: "pcAdder",
            type: "logic",
            position: { x: 400, y: 150 },
            data: { 
                label: "+1",
                width: 50,
                height: 50 
            }
        },
        { 
            id: 'regFile',
            type: "logic",
            position: { x: 600, y: 100 },
            data: {
                label: 'Register File',
                width: 120,
                height: 180
            }
        },
        {
            id: 'zext8',
            type: "logic",
            position: { x: -250, y: 300 },
            data: { 
                label: 'ZEXT',
                width: 80,
                height: 35
            }
        },
        {
            id: 'sext5',
            type: "logic",
            position: { x: 200, y: 500 },
            data: {
                label: 'SEXT',
                width: 80,
                height: 35 
            }
        },
        {
            id: 'sext6',
            type: "logic",
            position: { x: -150, y: 500 },
            data: {
                label: 'SEXT',
                width: 80,
                height: 35 
            }
        },
        {
            id: 'sext9',
            type: "logic",
            position: { x: -150, y: 550 },
            data: {
                label: 'SEXT',
                width: 80,
                height: 35 
            }
        },
        {
            id: 'sext11',
            type: "logic",
            position: { x: -150, y: 600 },
            data: {
                label: 'SEXT',
                width: 80,
                height: 35 
            }
        },
        {
            id: 'ir',
            type: "logic",
            position: { x: -150, y: 700 },
            data: {
                label: 'IR',
                width: 120,
                height: 40  
            }
        },
        {
            id: 'marAdder',
            type: "alu",
            position: { x: 0, y: 300 },
            data: {label: '+'}
        },
        {
            id: 'addr1Mux',
            type: "mux",
            position: { x: 100, y: 400 },
            data: { label: 'ADDR1MUX' }
        },
        {
            id: 'addr2Mux',
            type: "mux",
            position: { x: -100, y: 400 },
            data: { label: 'ADDR2MUX' }
        },
        {
            id: 'fsm',
            type: "logic",
            position: { x: 300, y: 500 },
            data: { 
                label: "Finite State Machine",
                width: 100,
                height: 200,
                padding: 15
            }
        },
        {
            id: 'sr2mux',
            type: "mux",
            position: { x: 550, y: 500 },
            data: { label: "SR2MUX" }
        },
        {
            id: 'alu',
            type: "alu",
            position: { x: 600, y: 600  },
            data: { label: "ALU" }
        },
        {
            id: 'gateAlu',
            type: 'tristate',
            position: { x: 600, y: 700 },
            data: { label: "GateALU" }
        },
        {
            id: 'logic',
            type: "logic",
            position: { x: 100, y: 700},
            data: { 
                label: "Logic",
                width: 80,
                height: 35 
             }
        },
        {
            id: 'nzp',
            type: "logic",
            position: { x: 100, y: 650 },
            data: { 
                label: "NZP",
                width: 80,
                height: 35 
            }
        },
        {
            id: 'ioInput',
            type: "logic",
            position: { x: 350, y: 800 },
            data: {
                label: 'Input',
                width: 100,
                height: 50
            }
        },
        {
            id: 'ioOutput',
            type: "logic",
            position: { x: 500, y: 800 },
            data: {
                label: 'Output',
                width: 100,
                height: 50
            }
        },
        {
            id: 'sr1Mux',
            type: "mux",
            position: { x: 300, y: 900 },
            data: { label: "SR1MUX" }
        },
        {
            id: 'drmux',
            type: "mux",
            position: { x: 500, y: 900 },
            data: { label: "DRMUX" }
        },
        {
            id: "memory",
            type: "logic",
            position: { x: -100, y: 800 },
            data: {
                label: 'Memory',
                width: 150,
                height: 100},
        },
        {
            id: "mar",
            type: "logic",
            position: { x: 100, y: 750 },
            data: { 
                label: "MAR",
                width: 120,
                height: 40
            }
        },
        {
            id: "mdr",
            type: "logic",
            position: { x: -300, y: 750 },
            data: { 
                label: "MDR",
                width: 120,
                height: 40
            }
        },
        {
            id: "mdrMux",
            type: "mux",
            position: {x: -300, y: 825 },
            data: { label: "MDRMUX" }
        },
        {
            id: "gateMdr",
            type: "tristate",
            position: { x: -250, y: 700 },
            data: { label: "GateMDR" }
        },
        {
            id: "bus",
            type: "bus",
            position: { x: -150, y: 0 },
            data: {
            label: "Bus",
            width: 900,
            height: 750
            }
        }
    ])

    // these are our edges
    const edges = ref([]);
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