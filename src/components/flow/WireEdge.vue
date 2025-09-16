<script setup lang="ts">
import type { EdgeProps } from '@vue-flow/core';
import { BaseEdge, getMarkerId, getSmoothStepPath, getStraightPath, MarkerType } from '@vue-flow/core';
import { computed, useTemplateRef } from 'vue';

const props = defineProps<EdgeProps<object>>();

const path = computed(() => {
  const straight = (props.sourceX == props.targetX) || (props.sourceY == props.targetY);
  return straight ? getStraightPath(props) : getSmoothStepPath(props);
});

const baseEl = useTemplateRef("baseEdge");
const pathEl = computed(() => baseEl.value?.pathEl);
const arrowEnd = computed(() => getMarkerId({ type: MarkerType.ArrowClosed }, "lc3-flow-diagram"));

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
function complete() {
  animation?.cancel();
  animation = null;
  if (pathEl.value) {
    pathEl.value.style.strokeDashoffset = '0';
  }
}

props.data.animator = { animate, pause, reset, resume, complete };
defineExpose(props.data.animator);

// temporary
window.addEventListener("keydown", e => {
  animate(1500);
})
if (props.markerEnd != "url('#')") console.log(props.markerEnd);
</script>

<script lang="ts">
export default {
  name: 'WireEdge',
};
</script>

<template>
  <path
    :d="path[0]"
    class="vue-flow__edge-path path-background"
    :marker-end="`url(#${arrowEnd})`"
  />
  <BaseEdge
    :id
    ref="baseEdge"
    :path="path[0]"
    :marker-end="`url(#${arrowEnd})`"
  />
</template>

<style>
  @reference "@/style.css";
  .vue-flow__edge-wire > .vue-flow__edge-path {
    stroke: var(--color-active-0);
    stroke-width: 2;
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;

    &.path-background {
      stroke: var(--color-inactive);
      stroke-dasharray: none;
    }
  }
</style>