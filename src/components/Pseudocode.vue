<script setup lang="ts">
import { computed, watch } from 'vue';

    interface PseudocodeState {
        source: string,
        cycles: { start: number, end: number }[][]
    }
    const { pseudocode, cycle, running } = defineProps<{
        pseudocode: PseudocodeState,
        cycle: number,
        running: boolean
    }>();

    function createRangeMap(ranges: { start: number, end: number }[][]) {
        let map = Array.from({ length: pseudocode.source.length }, () => -1);
        // Iterate through all ranges in reverse, to ensure previous cycle stays on top
        for (let i = ranges.length - 1; i >= 0; i--) {
            let rs = ranges[i];
            for (let { start, end } of rs) {
                map.fill(i, start, end);
            }
        }
        return map;
    }
    function flatten(map: number[]): { start: number, end: number, cycle: number }[] {
        let flattenedRanges = [];
        let currentRange = { start: 0, end: 0, cycle: 0 };

        for (let i = 0; i < map.length; i++) {
            currentRange.end = i;
            let currentCycle = map[i];
            if (currentRange.cycle != currentCycle) {
                // Push and create anew
                if (currentRange.end - currentRange.start > 0) {
                    flattenedRanges.push(currentRange);
                }
                currentRange = { start: i, end: i, cycle: currentCycle };
            }
        }
        if (currentRange.end - currentRange.start > 0) {
            flattenedRanges.push(currentRange);
        }

        return flattenedRanges;
    }

    function getAllClasses(cycle: number, running: boolean) {
        let cls = Array.from({ length: cycle }, (_, i) => `done-${i}`);
        if (running) {
            cls.push(`active-${cycle}`);
        }

        return cls;
    }
    watch(() => cycle, () => console.log(cycle));
    const ranges = computed(() => flatten(createRangeMap(pseudocode.cycles)));
</script>

<style lang="css" scoped>
    @reference "@/style.css";

    .done-0 .cycle-0 {
        @apply text-red-500;
    }
    .active-0 .cycle-0 {
        @apply text-red-300;
    }
    .done-1 .cycle-1 {
        @apply text-orange-500;
    }
    .active-1 .cycle-1 {
        @apply text-orange-300;
    }
    .done-2 .cycle-2 {
        @apply text-yellow-500;
    }
    .active-2 .cycle-2 {
        @apply text-yellow-300;
    }
    .done-3 .cycle-3 {
        @apply text-green-500;
    }
    .active-3 .cycle-3 {
        @apply text-green-300;
    }
    .done-4 .cycle-4 {
        @apply text-blue-500;
    }
    .active-4 .cycle-4 {
        @apply text-blue-300;
    }
    .done-5 .cycle-5 {
        @apply text-purple-500;
    }
    .active-5 .cycle-5 {
        @apply text-purple-300;
    }
    .done-6 .cycle-6 {
        @apply text-pink-500;
    }
    .active-6 .cycle-6 {
        @apply text-pink-300;
    }
</style>

<template>
    <span
        class="contents"
        :class="getAllClasses(cycle, running)"
    >
        <span v-for="{start, end, cycle: c} of ranges"
        class="font-mono whitespace-pre-wrap transition-colors"
        :class="{ ['cycle-' + c] : c >= 0 }">
            {{ pseudocode.source.slice(start, end) }}
        </span>
    </span>
</template>