<!-- A generic rectangular component for all non-specially-shaped components (e.g., registers, SEXT, FSM, Memory) -->

<script setup lang="ts">
    const { x, y, width, height, label = "", labelSize = "md" } = defineProps<{
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
         * The text to add in the center of the component.
         */
        label?: string,
        /**
         * The size of the text in the center of the component.
         */
        labelSize?: "sm" | "md" | "lg"
    }>();
</script>

<template>
    <g class="diagram-shape">
        <rect :x :y :width :height />
        <TextBox :x :y :width :height :size="labelSize">
            {{ label }}
        </TextBox>
    </g>
</template>