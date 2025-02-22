<script setup lang="ts">
import { computed } from 'vue';

    const { x, y, width, height, orientation, slant = 0.8, label = "", labelSize = "md" } = defineProps<{
        x: number,
        y: number,
        width: number,
        height: number,
        orientation: "up" | "down" | "left" | "right",
        slant?: number,
        label?: string,
        labelSize?: "sm" | "md" | "lg"
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
</script>

<template>
    <g class="diagram-shape">
        <polygon :points="points.join(' ')" />
        <foreignObject v-if="label" :x :y :width :height class="diagram-text">
            <div 
                xmlns="http://www.w3.org/1999/xhtml"
                class="w-full h-full flex justify-center items-center"
                :class="{
                    'text-xl': labelSize == 'sm',
                    'text-3xl': labelSize == 'md',
                    'text-4xl': labelSize == 'lg'
                }"
            >
                <span>{{ label }}</span>
            </div>
        </foreignObject>
    </g>
</template>