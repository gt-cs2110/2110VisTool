<script setup lang="ts">
    const { x, y, width, height, label = "", labelSize = "md" } = defineProps<{
        x: number,
        y: number,
        width: number,
        height: number,
        label?: string,
        labelSize?: "sm" | "md" | "lg"
    }>();
</script>

<template>
    <g class="diagram-shape">
        <rect :x :y :width :height />
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