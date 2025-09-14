<!-- A triangular shape (used for tri-state buffers). -->
 
<script setup lang="ts">
import type { Dimensions } from '@vue-flow/core';
import { computed } from 'vue';
import { drawOriented, type Orientation } from '.';

    const { dimensions, orientation } = defineProps<{
        /**
         * Dimensions of the bounding box.
         */
        dimensions: Dimensions,
        /**
         * The direction the pointy side is facing.
         */
        orientation: Orientation,
    }>();

    function triangle(mainLength: number, crossLength: number): [main: number, cross: number][] {
        return [
            [0, 0],
            [mainLength, crossLength / 2],
            [0, crossLength]
        ];
    }

    const width = computed(() => dimensions.width);
    const height = computed(() => dimensions.height);
    const points = computed<[number, number][]>(() => {
        return drawOriented(triangle, orientation, width.value, height.value)
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