<!-- Trapezoidal shape (used for MUXes). -->

<script setup lang="ts">
import { computed } from 'vue';
import { drawOriented, type Orientation } from '.';
import type { Dimensions } from '@vue-flow/core';
import type { HandleProperties } from '../types';
import { ALU_SLANT } from '../constants';

    const { dimensions, orientation, slant = ALU_SLANT, nInputs, inputHandles } = defineProps<{
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
        /**
         * The number of inputs to this MUX.
         */
        nInputs: number
        /**
         * 
         */
        inputHandles: HandleProperties[]
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

    function percentToCoord(distance?: string, side?: string) {
    const d = distance ? parseFloat(distance) / 100 : 0.5;

    switch (side) {
      case 'left':  return { x: 0, y: d * height.value };
      case 'right': return { x: width.value, y: d * height.value };
      case 'top':   return { x: d * width.value, y: 0 };
      case 'bottom':return { x: d * width.value, y: height.value };
      default:      return { x: 0, y: 0 };
    }
  }

  const inputLabels = computed(() =>
    (inputHandles ?? []).map((h, i) => {
      const { x, y } = percentToCoord(h.distance, h.side);
      return {
        text: i.toString(2).padStart(Math.ceil(Math.log2(nInputs ?? 2)), '0'),
        x,
        y
      };
    })
  );
</script>

<template>
  <svg
    :viewBox="`0 0 ${width} ${height}`"
    xmlns="http://www.w3.org/2000/svg"
    class="shape"
  >
    <polygon :points="points.join(' ')" />
    <text
      v-for="(label, i) in inputLabels"
      :key="i"
      :x="label.x + (label.x === 0 ? 10 : label.x === width ? -10 : 0)"  
      :y="label.y + (label.y === 0 ? 10 : label.y === height ? -10 : 0)" 
      fill="blue"
      font-size="12"
      dominant-baseline="middle"
      text-anchor="middle"
    >
      {{ label.text }}
    </text>

  </svg>
</template>