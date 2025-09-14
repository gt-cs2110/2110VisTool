<!-- Pants shape (used for ALU + adder). -->

<script setup lang="ts">
import type { Dimensions } from '@vue-flow/core';
import { computed } from 'vue';
import { drawOriented, type Orientation } from '.';
import { ALU_SLANT } from '../constants';

    const { dimensions, orientation, slant = ALU_SLANT } = defineProps<{
        /**
         * Dimensions of the bounding box.
         */
        dimensions: Dimensions,
        /**
         * The direction that the short side is pointing.
         */
        orientation: Orientation,
        /**
         * The difference in size between the long and short sides of the ALU component.
         * 
         * If the long side is `s` pixels, then the short side is `s * (2 * slant - 1)` pixels.
         */
        slant?: number,
    }>();
    
    function alu(mainLength: number, crossLength: number, slant: number): [main: number, cross: number][] {
        return [
            [0, 0],
            [0, crossLength * slant / 2],
            [mainLength / 2, crossLength / 2],
            [0, crossLength * (1 - slant / 2)],
            [0, crossLength],
            [mainLength, slant * crossLength],
            [mainLength, (1 - slant) * crossLength]
        ];
    }

    const width = computed(() => dimensions.width);
    const height = computed(() => dimensions.height);
    const points = computed<[number, number][]>(() => {
        return drawOriented((m, c) => alu(m, c, slant), orientation, width.value, height.value);
    });
</script>

<template>
  <svg
    :viewBox="`0 0 ${width} ${height}`"
    xmlns="http://www.w3.org/2000/svg"
    class="node-bg"
  >
    <polygon :points="points.join(' ')" />
  </svg>
</template>