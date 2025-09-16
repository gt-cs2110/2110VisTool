<script setup lang="ts">
import type { EdgeProps } from '@vue-flow/core';
import { BaseEdge, getSmoothStepPath, getStraightPath } from '@vue-flow/core';
import { computed, useTemplateRef } from 'vue';

const props = defineProps<EdgeProps<object>>();
console.log(props.data);

const path = computed(() => {
  const straight = (props.sourceX == props.targetX) || (props.sourceY == props.targetY);
  return straight ? getStraightPath(props) : getSmoothStepPath(props);
});

const baseEl = useTemplateRef("baseEdge");
const pathEl = computed(() => baseEl.value?.pathEl);

let animation: Animation | null = null;

function animate(duration: number) {
  const path = pathEl.value;
  // Apply animation
  if (path) {
    animation = path.animate([{ strokeDashoffset: '1000' }, { strokeDashoffset: '0' }], {
      duration,
      direction: 'normal',
      easing: 'linear',
      iterations: 1,
    });
    animation.onfinish = () => path.style.strokeDashoffset = "0";
  }
}
function pause() {
  animation?.pause();
}
function resume() {
  animation?.play();
}
function reset() {
  animation?.cancel();
  animation = null;
  if (pathEl.value) {
    pathEl.value.style.strokeDashoffset = '1000';
  }
}

defineExpose({ animate, pause, reset, resume });

// temporary
window.addEventListener("keydown", e => {
  animate(1500);
})
</script>

<script lang="ts">
export default {
  name: 'CustomEdge',
};
</script>

<template>
  <path
    :d="path[0]"
    class="vue-flow__edge-path path-background"
  />
  <BaseEdge
    :id
    ref="baseEdge"
    :path="path[0]"
  />
</template>

<style>
  .vue-flow__edge-custom > .vue-flow__edge-path {
    stroke: red;
    stroke-width: 2;
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;

    &.path-background {
      stroke: white;
      stroke-dasharray: none;
    }
  }
</style>