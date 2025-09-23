<script setup lang="ts">
import type { EdgeProps, XYPosition } from '@vue-flow/core';
import { BaseEdge, getSmoothStepPath, getStraightPath, useEdge } from '@vue-flow/core';
import { computed, useTemplateRef, watch } from 'vue';
import { getManualPath } from './edgePath';
import WireArrow from './WireArrow.vue';

const props = defineProps<EdgeProps<{
  activeCycles?: number[],
  animator?: Animator,
  intermediateNodes?: XYPosition[]
}>>();

const activeCycle = computed(() => props.data.activeCycles?.[props.data.activeCycles.length - 1]);
const activeClass = computed(() => typeof activeCycle.value === "number" ? `active-${activeCycle.value}` : undefined);

const path = computed(() => {
  const straight = (props.sourceX == props.targetX) || (props.sourceY == props.targetY);
  if (straight) return getStraightPath(props);

  const hasIntermediates = props.data.intermediateNodes && props.data.intermediateNodes.length > 0;
  if (hasIntermediates) {
    const source = { x: props.sourceX, y: props.sourceY };
    const target = { x: props.targetX, y: props.targetY };
    return getManualPath({ source, intermediate: props.data.intermediateNodes, target });
  }

  return getSmoothStepPath(props);
});

const { edgeEl } = useEdge();
const baseEl = useTemplateRef("baseEdge");
const pathEl = computed(() => baseEl.value?.pathEl);
const arrowEnd = computed(() => `arrow-marker-${props.id}`);

// Put higher cycle elements on top
watch(activeCycle, c => {
  if (edgeEl.value && edgeEl.value.parentElement) {
    console.log(edgeEl.value.parentElement, "set to ", c);
    edgeEl.value.parentElement.style.zIndex = String((c ?? -1) + 1);
  }
});

interface Animator {
  animation: Animation | null,
  animate(duration: number): void,
  pause(): void,
  resume(): void,
  reset(): void,
  complete(): void
}

const animator: Animator = {
  animation: null,
  animate(duration: number) {
    const path = pathEl.value;
      // Apply animation
      if (path) {
        this.animation = path.animate([{ strokeDashoffset: '1000' }, { strokeDashoffset: '0' }], {
          duration,
          direction: 'normal',
          easing: 'linear',
          iterations: 1,
        });
        this.animation.onfinish = () => path.style.strokeDashoffset = "0";
      }
    },
    pause() {
      this.animation?.pause();
    },
    resume() {
      this.animation?.play();
    },
    reset() {
      this.animation?.cancel();
      this.animation = null;
      if (pathEl.value) {
        pathEl.value.style.strokeDashoffset = '1000';
      }
    },
    complete() {
      this.animation?.cancel();
      this.animation = null;
      if (pathEl.value) {
        pathEl.value.style.strokeDashoffset = '0';
      }
    }
}

// Needed to be accessible by Vue Flow
// eslint-disable-next-line vue/no-mutating-props
props.data.animator = animator;
</script>

<script lang="ts">
export default {
  name: 'WireEdge',
};
</script>

<template>
  <WireArrow
    :id="arrowEnd"
    type="arrow"
    :active-class="activeClass"
  />
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
    :class="activeClass"
  />
</template>

<style>
  @reference "@/style.css";
  .vue-flow__edge-wire > .vue-flow__edge-path {
    stroke-width: 3;
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;

    &.path-background {
      stroke: var(--color-inactive);
      stroke-dasharray: none;
    }
  }
</style>