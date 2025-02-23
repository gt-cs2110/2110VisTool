<!-- Text, word-wrappable and enclosed in an invisible box. -->

<script setup lang="ts">
    const { x, y, width, height, size = "md", over = 'component', overflow = "center" } = defineProps<{
        /**
         * Leftmost X position of component
         */
        x: number,
        /**
         * Topmost Y position of component
         */
        y: number,
        /**
         * The width of the box enclosing this text
         */
        width: number,
        /**
         * The height of the box enclosing this text
         */
        height: number,
        /**
         * The size of the text.
         */
        size?: 'sm' | 'md' | 'lg',
        /**
         * Whether this text is over a component or over a background.
         */
        over?: 'component' | "background",

        overflow?: "center" | "left" | "right",
    }>();
</script>

<template>
    <foreignObject v-if="$slots.default" :x :y :width :height 
        class="diagram-text" 
        :class="{
            [`diagram-text-${over}`]: true,
            'overflow-visible': typeof overflow !== 'undefined',
        }"
    >
    <div 
        xmlns="http://www.w3.org/1999/xhtml"
        class="w-full h-full flex items-center"
        :class="{
            'text-xl': size == 'sm',
            'text-3xl': size == 'md',
            'text-4xl': size == 'lg',
            'justify-center': overflow == 'center',
            'justify-start': overflow == 'right',
            'justify-end': overflow == 'left',
        }"
    >
        <span>
            <slot />
        </span>
    </div>
</foreignObject>
</template>