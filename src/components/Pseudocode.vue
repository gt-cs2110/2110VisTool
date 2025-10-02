<script setup lang="ts">
import { computed } from 'vue';
import type { HighlightRange, PseudocodeState } from '../sequences';
    const { pseudocode, cycle, running } = defineProps<{
        pseudocode: PseudocodeState,
        cycle: number,
        running: boolean
    }>();

    const highlightRanges = computed(() => {
        const ranges: HighlightRange[] = [];

        let cursor = 0;
        for (const r of pseudocode.highlights) {
            if (cursor != r.start) {
                ranges.push({ start: cursor, end: r.start, cycle: -1 });
            }
            ranges.push(r);
            cursor = r.end;
        }
        if (cursor != pseudocode.source.length) {
            ranges.push({ start: cursor, end: pseudocode.source.length, cycle: -1 });
        }

        return ranges;
    });

    /**
     * Determines which classes should be provided in the pseudocode
     * based on the current cycle number and running state.
     */
    function getAllEnabledClasses(cycle: number, running: boolean) {
        const cls = Array.from({ length: cycle }, (_, i) => `cy-done-${i}`);
        if (running) {
            cls.push(`cy-active-${cycle}`);
        }

        return cls;
    }
</script>

<template>
  <span
    class="contents"
    :class="getAllEnabledClasses(cycle, running)"
  >
    <!-- eslint-disable-next-line vue/require-v-for-key -->
    <span
      v-for="{start, end, cycle: c} of highlightRanges"
      class="font-mono whitespace-pre-wrap transition-colors"
      :class="{ [`cy-on-${c}`] : typeof c != 'number' || c >= 0 }"
    >
      {{ pseudocode.source.slice(start, end) }}
    </span>
  </span>
</template>

<style lang="css" scoped>
    @reference "@/style.css";

    .cy-on-disabled {
        @apply text-surface-400 dark:text-surface-500;
    }
    .cy-done-0 .cy-on-0 {
        @apply text-active-0;
    }
    .cy-active-0 .cy-on-0 {
        @apply text-active-0-dark dark:text-active-0-light;
    }
    .cy-done-1 .cy-on-1 {
        @apply text-active-1;
    }
    .cy-active-1 .cy-on-1 {
        @apply text-active-1-dark dark:text-active-1-light;
    }
    .cy-done-2 .cy-on-2 {
        @apply text-active-2;
    }
    .cy-active-2 .cy-on-2 {
        @apply text-active-2-dark dark:text-active-2-light;
    }
    .cy-done-3 .cy-on-3 {
        @apply text-active-3;
    }
    .cy-active-3 .cy-on-3 {
        @apply text-active-3-dark dark:text-active-3-light;
    }
    .cy-done-4 .cy-on-4 {
        @apply text-active-4;
    }
    .cy-active-4 .cy-on-4 {
        @apply text-active-4-dark dark:text-active-4-light;
    }
    .cy-done-5 .cy-on-5 {
        @apply text-active-5;
    }
    .cy-active-5 .cy-on-5 {
        @apply text-active-5-dark dark:text-active-5-light;
    }
    .cy-done-6 .cy-on-6 {
        @apply text-active-6;
    }
    .cy-active-6 .cy-on-6 {
        @apply text-active-6-dark dark:text-active-6-light;
    }
</style>