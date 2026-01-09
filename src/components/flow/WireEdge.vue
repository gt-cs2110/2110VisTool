<script setup lang="ts">
import type { EdgeProps, XYPosition } from '@vue-flow/core';
import { BaseEdge, getSmoothStepPath, getStraightPath, useEdge } from '@vue-flow/core';
import { computed, ref, useTemplateRef, watch } from 'vue';
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
const animInProgress = ref(false);
watch([animInProgress, activeClass], ([inProgress, activeCls]) => {
  if (!inProgress) {
    arrowEndClass.value = activeCls;
  }
});
const { edgeEl } = useEdge();
const baseEl = useTemplateRef("baseEdge");
const pathEl = computed(() => baseEl.value?.pathEl);
const arrowEnd = computed(() => `arrow-marker-${props.id}`);
const arrowEndClass = ref<string>();

// Put higher cycle elements on top
watch(activeCycle, c => {
  if (edgeEl.value && edgeEl.value.parentElement) {
    edgeEl.value.parentElement.style.zIndex = String((c ?? -1) + 1);
  }
});
// Update length of wire
watch(pathEl, path => {
  if (path) {
    const length = String(path.getTotalLength());
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
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

const startOffset = (path: SVGPathElement) => String(path.getTotalLength());
const endOffset = (_path: SVGPathElement) => "0";

const animator: Animator = {
  animation: null,
  animate(duration: number) {
    const path = pathEl.value;
      // Apply animation
      if (path) {
        animInProgress.value = true;
        this.animation = path.animate([{ strokeDashoffset: startOffset(path) }, { strokeDashoffset: endOffset(path) }], {
          duration,
          direction: 'normal',
          easing: 'linear',
          iterations: 1,
        });

        this.animation.oncancel = () => {
          animInProgress.value = false;
        }
        this.animation.onfinish = () => {
          path.style.strokeDashoffset = endOffset(path);
          animInProgress.value = false;
        }
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
        pathEl.value.style.strokeDashoffset = startOffset(pathEl.value);
      }
    },
    complete() {
      this.animation?.finish();
      this.animation = null;
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
    v-if="!props.target.startsWith('gate')"
    :id="arrowEnd"
    type="arrow"
    :active-class="arrowEndClass"
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

    &.path-background {
      stroke: var(--color-inactive);
      stroke-dasharray: none;
    }
  }
</style>