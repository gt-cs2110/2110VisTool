<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router';
const route = useRoute();
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="flex items-center justify-between px-4 py-3 gap-4 border-b border-surface">
      <RouterLink to="/" class="text-xl font-semibold flex items-center gap-2">
        <MdiHomeOutline class="w-5 h-5" />
        <span>2110 Visualization Tool</span>
      </RouterLink>
      <nav class="flex gap-2 items-center">
        <RouterLink to="/lc3" class="px-3 py-1 rounded hover:bg-primary hover:text-primary-contrast transition" :class="{ 'bg-primary text-primary-contrast': route.path.startsWith('/lc3') }">LC-3</RouterLink>
        <RouterLink to="/ieee" class="px-3 py-1 rounded hover:bg-primary hover:text-primary-contrast transition" :class="{ 'bg-primary text-primary-contrast': route.path.startsWith('/ieee') }">IEEE</RouterLink>
        <RouterLink to="/kmap" class="px-3 py-1 rounded hover:bg-primary hover:text-primary-contrast transition" :class="{ 'bg-primary text-primary-contrast': route.path.startsWith('/kmap') }">Kmap</RouterLink>
        <a href="https://github.com/gt-cs2110/2110VisTool" class="px-2" title="Source on GitHub"><SiGithub /></a>
      </nav>
    </header>
    <main class="flex-1 min-h-0">
      <RouterView />
    </main>
    <footer class="text-center text-sm py-4 opacity-70">GT CS 2110 Teaching Team</footer>
  </div>
</template>

<style scoped>
</style>
