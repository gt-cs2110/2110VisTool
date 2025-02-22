<!-- A triangular component for all tri-state buffers. -->
 
<script setup lang="ts">
import { computed } from 'vue';

    const { x, y, size, orientation, label = "", labelSize = "md" } = defineProps<{
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
        labelSize?: "sm" | "md" | "lg"
    }>();

    const SQRT3_2 = Math.sqrt(3) / 2;
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
    const width = computed(() => {
        return orientation === "up" || orientation === "down" ? size : SQRT3_2 * size;
    });
    const height = computed(() => {
        return orientation === "up" || orientation === "down" ? SQRT3_2 * size : size;
    });
</script>

<template>
    <g class="diagram-shape">
        <polygon :points="points.join(' ')" />
        <TextBox :x :y :width :height :label :size="labelSize" />
    </g>
</template>