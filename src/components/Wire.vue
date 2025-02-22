<!-- Text, word-wrappable and enclosed in an invisible box. -->

<script setup lang="ts">
    const { points } = defineProps<{
        points: [x: number, y: number][],
    }>();
</script>

<template>
    <polyline class="diagram-wire" :points="points.join(' ')" marker-start="url(#triangle)" marker-end="url(#triangle)" />
</template>