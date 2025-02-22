<script setup lang="ts">
import { computed } from 'vue';

    const { x, y, size, orientation, label = "", labelSize = "md" } = defineProps<{
        x: number,
        y: number,
        size: number,
        orientation: "up" | "down" | "left" | "right",
        label?: string,
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