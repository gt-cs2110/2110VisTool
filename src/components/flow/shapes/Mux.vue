<!-- Trapezoidal shape (used for MUXes). -->

<script setup lang="ts">
import { computed } from 'vue';
import { drawOriented, type Orientation } from '.';
import type { Dimensions } from '@vue-flow/core';

    const { dimensions, orientation, slant = 0.8 } = defineProps<{
        /**
         * Dimensions of the bounding box.
         */
        dimensions: Dimensions,
        /**
         * The direction that the short side is pointing.
         */
        orientation: Orientation,
        /**
         * The difference in size between the long and short sides of the MUX.
         * 
         * If the long side is `s` pixels, then the short side is `s * (2 * slant - 1)` pixels.
         */
        slant?: number
    }>();

    function trapezoid(mainLength: number, crossLength: number, slant: number): [main: number, cross: number][] {
        return [
            [0, 0],
            [0, crossLength],
            [mainLength, slant * crossLength],
            [mainLength, (1 - slant) * crossLength]
        ];
    }

    const width = computed(() => dimensions.width);
    const height = computed(() => dimensions.height);
    const points = computed<[number, number][]>(() => {
        return drawOriented((m, c) => trapezoid(m, c, slant), orientation, width.value, height.value);
    });
</script>

<template>
    <svg :viewBox="`0 0 ${width} ${height}`" xmlns="http://www.w3.org/2000/svg" class="node-bg">
        <polygon :points="points.join(' ')" />
    </svg>
</template>