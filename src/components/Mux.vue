<!-- The trapezoidal component for all MUXes. -->


<script setup lang="ts">
import { computed } from 'vue';
import { computeLabelProps } from '../position';

    const { x, y, width, height, orientation, slant = 0.8, label = "", labelSize = "md", labelPos = "inside" } = defineProps<{
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
         * The difference in size between the long and short sides of the MUX.
         * 
         * If the long side is `s` pixels, then the short side is `s * (2 * slant - 1)` pixels.
         */
        slant?: number,
        /**
         * The text to add in the center of the MUX.
         */
        label?: string,
        /**
         * The size of the text in the center of the MUX.
         */
        labelSize?: "sm" | "md" | "lg",
        labelPos?: "inside" | "up" | "down" | "left" | "right",
    }>();

    const points = computed<[number, number][]>(() => {
        if (orientation == "up") {
            return [[x + (1 - slant) * width, y], [x, y + height], [x + width, y + height], [x + slant * width, y]];
        } else if (orientation == "down") {
            return [[x, y], [x + (1 - slant) * width, y + height], [x + slant * width, y + height], [x + width, y]];
        } else if (orientation == "left") {
            return [[x, y + (1 - slant) * height], [x, y + slant * height], [x + width, y + height], [x + width, y]];
        } else if (orientation == "right") {
            return [[x, y], [x, y + height], [x + width, y + slant * height], [x + width, y + (1 - slant) * height]];
        } else {
            return [];
        }
    });

    const labelProps = computed(() => {
        if (labelPos == "inside") {
            return {
                x,
                y: orientation == "down" ? y : y + height / 3,
                width: width,
                height: 2 * height / 3,
                over: "component",
                overflow: "center"
            };
        } else {
            return computeLabelProps(labelPos, x, y, width, height);
        }
    })
</script>

<template>
    <g class="diagram-shape">
        <polygon :points="points.join(' ')" />
        <TextBox v-bind="labelProps" :size="labelSize">
            {{ label }}
        </TextBox>
    </g>
</template>