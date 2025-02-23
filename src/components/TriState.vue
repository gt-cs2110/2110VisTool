<!-- A triangular component for all tri-state buffers. -->
 
<script setup lang="ts">
import { computed } from 'vue';

    const { x, y, size, orientation, label = "", labelSize = "sm", labelPos = "right" } = defineProps<{
        /**
         * Leftmost X position of component
         */
        x: number,
        /**
         * Topmost Y position of component
         */
        y: number,
        /**
         * The side length of the triangle.
         * 
         * This component is an equilateral triangle, 
         * so if the main axis has a length of `size`, the cross axis has a length of `size * sqrt(3) / 2`.
         */
        size: number,
        /**
         * The direction the pointy side is facing.
         */
        orientation: "up" | "down" | "left" | "right",
        /**
         * The label for this component.
         */
        label?: string,
        /**
         * The size of the label for this component.
         */
        labelSize?: "sm" | "md" | "lg",

        labelPos?: "left" | "right"
    }>();

    const SQRT3_2 = Math.sqrt(3) / 2;

    const width = computed(() => {
        return orientation === "up" || orientation === "down" ? size : SQRT3_2 * size;
    });
    const height = computed(() => {
        return orientation === "up" || orientation === "down" ? SQRT3_2 * size : size;
    });
    const points = computed<[number, number][]>(() => {
        const base = size;
        const hght = size * SQRT3_2;
        if (orientation == "up") {
            return [[x, y + hght], [x + base, y + hght], [x + 0.5 * base, y]];
        } else if (orientation == "down") {
            return [[x, y], [x + base, y], [x + 0.5 * base, y + hght]];
        } else if (orientation == "left") {
            return [[x + hght, y], [x + hght, y + base], [x, y + 0.5 * base]];
        } else if (orientation == "right") {
            return [[x, y], [x, y + base], [x + hght, y + 0.5 * base]];
        } else {
            return [];
        }
    });
</script>

<template>
    <g class="diagram-shape">
        <Port 
            :x="labelPos == 'right' ? x + width * 3 / 4 : x + width / 4"
            :y="y + height / 2"
            :r="10"
            :ports="2"
            :orientation="labelPos"
            :label
            :label-size
        />
        <polygon :points="points.join(' ')" />
    </g>
</template>