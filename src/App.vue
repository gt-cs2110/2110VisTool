<script setup lang="ts">
// Clean root shell. Home and project routes render inside <router-view />.
</script>

<template>
  <router-view />
</template>

<style scoped>
/* Minimal shell */
:host { display:block; min-height:100%; }
</style>
