<!-- Text, word-wrappable and enclosed in an invisible box. -->

<script setup lang="ts">
    const { points, markStart = false, markEnd = false } = defineProps<{
        points: [x: number, y: number][],
        markStart?: boolean,
        markEnd?: boolean
    }>();
</script>

<template>
    <polyline
        class="diagram-wire"
        :points="points.join(' ')"
        :marker-start="markStart ? 'url(#arrow)' : undefined"
        :marker-end="markEnd ? 'url(#arrow)' : undefined"
    />
</template>