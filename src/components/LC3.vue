<script setup lang="ts">
    import { ref, useTemplateRef } from 'vue';
    import { VueFlow } from '@vue-flow/core';
    import { Background } from '@vue-flow/background';
    import SpecialNode from './SpecialNode.vue';
    import SpecialEdge from './SpecialEdge.vue';

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

    const nodes = ref([
        // an input node, specified by using `type: 'input'`
        { 
            id: '1',
            type: 'input', 
            position: { x: 250, y: 5 },
            // all nodes can have a data object containing any data you want to pass to the node
            // a label can property can be used for default nodes
            data: { label: 'Node 1' },
        },

        // default node, you can omit `type: 'default'` as it's the fallback type
        { 
            id: '2', 
            position: { x: 100, y: 100 },
            data: { label: 'Node 2' },
        },

        // An output node, specified by using `type: 'output'`
        { 
            id: '3', 
            type: 'output', 
            position: { x: 400, y: 200 },
            data: { label: 'Node 3' },
        },

        // this is a custom node
        // we set it by using a custom type name we choose, in this example `special`
        // the name can be freely chosen, there are no restrictions as long as it's a string
        {
            id: '4',
            type: 'special', // <-- this is the custom node type name
            position: { x: 400, y: 200 },
            data: {
            label: 'Node 4',
            hello: 'world',
            },
        },
    ])

    // these are our edges
    const edges = ref([
        // default bezier edge
        // consists of an edge id, source node id and target node id
        { 
            id: 'e1->2',
            source: '1', 
            target: '2',
        },

        // set `animated: true` to create an animated edge path
        { 
            id: 'e2->3',
            source: '2', 
            target: '3', 
            animated: true,
        },

        // a custom edge, specified by using a custom type name
        // we choose `type: 'special'` for this example
        {
            id: 'e3->4',
            type: 'special',
            source: '3',
            target: '4',

            // all edges can have a data object containing any data you want to pass to the edge
            data: {
            hello: 'world',
            }
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
      
          <!-- bind your custom node type to a component by using slots, slot names are always `node-<type>` -->
          <template #node-special="specialNodeProps">
            <SpecialNode v-bind="specialNodeProps" />
          </template>
      
          <!-- bind your custom edge type to a component by using slots, slot names are always `edge-<type>` -->
          <template #edge-special="specialEdgeProps">
            <SpecialEdge v-bind="specialEdgeProps" />
          </template>
        </VueFlow>
    </div>
</template>