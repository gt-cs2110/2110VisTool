<script setup lang="ts">
    import { ref, useTemplateRef } from 'vue';
    import { VueFlow, type Edge, type Node } from '@vue-flow/core';
    import { Background } from '@vue-flow/background';

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

    const nodes = ref<Node[]>([
        { 
            id: '1',
            type: 'input', 
            position: { x: 250, y: 5 },
            data: { label: 'Node 1' },
        },
        { 
            id: '2', 
            position: { x: 100, y: 100 },
            data: { label: 'Node 2' },
        },
        { 
            id: '3', 
            type: 'alu', 
            position: { x: 400, y: 200 },
            data: { label: 'ALU', orientation: "up" },
        },
        { 
            id: '4', 
            type: 'mux', 
            position: { x: 400, y: 200 },
            data: { label: 'Mux' },
        },
        { 
            id: '5', 
            type: 'tristate', 
            position: { x: 400, y: 200 },
        },
        { 
            id: '6', 
            type: 'logic', 
            position: { x: 400, y: 200 },
            data: { label: 'Register' },
        },
    ])

    // these are our edges
    const edges = ref<Edge[]>([
        { 
            id: 'e1->2',
            source: '1', 
            target: '2',
        },
        { 
            id: 'e2->3',
            source: '2', 
            target: '3', 
            animated: true,
        },
        {
            id: 'e3->4',
            source: '3',
            target: '4',
        },
    ]);
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