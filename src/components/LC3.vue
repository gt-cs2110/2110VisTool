<script setup lang="ts">
    import { ref, useTemplateRef } from 'vue';
    import { VueFlow } from '@vue-flow/core';
    import { Background } from '@vue-flow/background';
    import type { LC3Node } from './flow/types';

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
            position: { x: 0, y: 0 },
            data: { label: "Mux" }
        },
        {
            id: "gateMarMux",
            type: "tristate",
            position: { x: 0, y: -100 },
            data: { label: "GateMARMUX" },
        },
        {
            id: "gatePc",
            type: "tristate",
            position: { x: 200, y: -100 },
            data: { label: "GatePC" }
        },
        { 
            id: "pc",
            type: "logic",
            position: { x: 200, y: 0 },
            data: { label: "Program Counter" },
        },
        { 
            id: "pcMux",
            type: "mux",
            position: { x: 200, y: 100 },
            data: { label: "PCMUX" },
        },
        { 
            id: "pcAdder",
            type: "logic",
            position: { x: 200, y: 200 },
            data: { label: "+1" },
        },
        { 
            id: 'regFile',
            type: "logic",
            position: { x: 400, y: 0 },
            data: { label: 'Register File' },
        },
        {
            id: 'zext8',
            type: "logic",
            position: { x: 0, y: 100 },
            data: { label: 'ZEXT' },
        },
        {
            id: 'sext5',
            type: "logic",
            position: { x: 0, y: 200 },
            data: { label: 'SEXT' },
        },
        {
            id: 'sext6',
            type: "logic",
            position: { x: 0, y: 300 },
            data: { label: 'SEXT' },
        },
        {
            id: 'sext9',
            type: "logic",
            position: { x: 0, y: 400 },
            data: { label: 'SEXT' },
        },
        {
            id: 'sext11',
            type: "logic",
            position: { x: 0, y: 500 },
            data: { label: 'SEXT' },
        },
        {
            id: 'marAdder',
            type: "alu",
            position: { x: 200, y: 300 },
            data: { label: '+' },
        },
        {
            id: 'addr1Mux',
            type: "mux",
            position: { x: 200, y: 400 },
            data: { label: 'ADDR1MUX' },
        },
        {
            id: 'addr2Mux',
            type: "mux",
            position: { x: 200, y: 500 },
            data: { label: 'ADDR2MUX' },
        },
        {
            id: 'fsm',
            type: "logic",
            position: { x: 400, y: 0 },
            data: { label: "Finite State Machine" },
        },
        {
            id: 'sr2mux',
            type: "mux",
            position: { x: 400, y: 100 },
            data: { label: "SR2MUX" },
        },
        {
            id: 'alu',
            type: "alu",
            position: { x: 400, y: 200 },
            data: { label: "ALU" },
        },
        {
            id: 'gateAlu',
            type: 'tristate',
            position: { x: 400, y: 300 },
            data: { label: "GateALU" },
        },
        {
            id: 'logic',
            type: "logic",
            position: { x: 200, y: 600 },
            data: { label: "Logic" }
        },
        {
            id: 'nzp',
            type: "logic",
            position: { x: 200, y: 700 },
            data: { label: "NZP" },
        },
        {
            id: 'ioInput',
            type: "logic",
            position: { x: 400, y: 700 },
            data: { label: "Input" },
        },
        {
            id: 'ioOutput',
            type: "logic",
            position: { x: 400, y: 800 },
            data: { label: "Output" },
        },
        {
            id: 'sr1Mux',
            type: "mux",
            position: { x: 600, y: 700 },
            data: { label: "SR1MUX" },
        },
        {
            id: 'sr2Mux',
            type: "mux",
            position: { x: 600, y: 800 },
            data: { label: "SR2MUX" },
        },
        {
            id: "memory",
            type: "logic",
            position: { x: 400, y: 400 },
            data: { label: "Memory" }
        },
        {
            id: "mar",
            type: "logic",
            position: { x: 400, y: 500 },
            data: { label: "Memory Address Register" }
        },
        {
            id: "mdr",
            type: "logic",
            position: { x: 400, y: 600 },
            data: { label: "Memory Data Register" }
        },
        {
            id: "mdrMux",
            type: "mux",
            position: { x: 600, y: 600 },
            data: { label: "MDRMUX" }
        },
        {
            id: "gateMdr",
            type: "tristate",
            position: { x: 600, y: 400 },
            data: { label: "GateMDR" }
        },
    ])

    // these are our edges
    const edges = ref([]);
</script>

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

<template>
    <div class="h-full w-full bg-surface-800 rounded">
        <VueFlow :nodes="nodes" :edges="edges">
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

          <template #node-tristate="props">
            <TriStateNode v-bind="props" />
          </template>
        </VueFlow>
    </div>
</template>