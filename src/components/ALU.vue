<!-- The pants-shaped component for all diagram components that are arithmetic operations (e.g., adder/ALU). -->

<script setup lang="ts">
import { computed } from 'vue';

    const { x, y, width, height, orientation, slant = 0.8, label = "", labelSize = "md" } = defineProps<{
        /**
         * Leftmost X position of component
         */
        x: number,
        /**
         * Topmost Y position of component
         */
        y: number,
        /**
         * Width of component
         */
        width: number,
        /**
         * Height of component
         */
        height: number,
        /**
         * The direction that the short side is pointing.
         */
        orientation: "up" | "down" | "left" | "right",
        /**
         * The difference in size between the long and short sides of the ALU component.
         * 
         * If the long side is `s` pixels, then the short side is `s * (2 * slant - 1)` pixels.
         */
        slant?: number,
        /**
         * The text to add in the center of the ALU.
         */
        label?: string,
        /**
         * The size of the text in the center of the ALU.
         */
        labelSize?: "sm" | "md" | "lg"
    }>();

    const points = computed<[number, number][]>(() => {
        if (orientation == "up") {
            return [
                [x + (1 - slant) * width, y], 
                [x, y + height],
                [x + width * slant / 2, y + height],
                [x + width / 2, y + height / 2],
                [x + width * (1 - slant / 2), y + height],
                [x + width, y + height], 
                [x + slant * width, y]
            ];
        } else if (orientation == "down") {
            return [
                [x, y],
                [x + (1 - slant) * width, y + height],
                [x + slant * width, y + height],
                [x + width, y],
                [x + width * (1 - slant / 2), y],
                [x + width / 2, y + height / 2],
                [x + width * slant / 2, y],
            ];
        } else if (orientation == "left") {
            return [
                [x, y + (1 - slant) * height],
                [x, y + slant * height],
                [x + width, y + height],
                [x + width, y + height * (1 - slant / 2)],
                [x + width / 2, y + height / 2],
                [x + width, y + height * slant / 2],
                [x + width, y]
            ];
        } else if (orientation == "right") {
            return [
                [x, y],
                [x, y + height * slant / 2],
                [x + width / 2, y + height / 2],
                [x, y + height * (1 - slant / 2)],
                [x, y + height],
                [x + width, y + slant * height],
                [x + width, y + (1 - slant) * height]
            ];
        } else {
            return [];
        }
    });
</script>

<template>
    <g class="diagram-shape">
        <polygon :points="points.join(' ')" />
        <TextBox 
            :x
            :y="orientation == 'down' ? y + height / 2 : y" 
            :width
            :height="height / 2" 
            :size="labelSize"
        >
            {{ label }}
        </TextBox>
    </g>
</template>