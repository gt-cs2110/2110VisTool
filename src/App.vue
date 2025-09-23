<script setup lang="ts">
import { computed, ref, useTemplateRef, onMounted, onUnmounted } from 'vue';
import LC3 from './components/LC3.vue';
import SEQUENCE_DATA from "./sequences";

const DEFAULT_ACTIVE_WIRE_TIME = 200;
const CYCLE_BREAK = "CYCLE_BREAK";

const speedScale = ref(50);
const activeWireTime = computed(() => {
  const scale = Math.pow(1.5, speedScale.value / 100);
  return DEFAULT_ACTIVE_WIRE_TIME / scale;
});
const lc3Diagram = useTemplateRef("lc3");

const infoDialogVisible = ref(false);

/**
 * A queue of wires to activate.
 */
const wireState = ref({
  wires: [] as string[],
  step: 0,
  stop: 0,
  cycle: 0,
  macro: undefined as string | undefined,
});
/**
 * Track activation history for each wire to enable stack-like color behavior
 */
const wireActivationHistory = ref<Map<string, number[]>>(new Map());
const loopId = ref<number>();
const running = computed(() => typeof loopId.value !== "undefined");
const isLoopDone = computed(() => wireState.value.step >= wireState.value.wires.length);
const macroCycleCount = computed(() => wireState.value.macro ? SEQUENCE_DATA[wireState.value.macro].sequence.length : undefined);
/**
 * The last tick when a wire was activated.
 */
let lastWireActivate: number = 0;

function handleKeydown(event: KeyboardEvent) {
  // If escape is pressed, unfocus on whatever
  if (event.code === "Escape") {
    (document.activeElement as HTMLElement)?.blur();
  }

  if (document.activeElement == document.body || document.activeElement == document.documentElement) {
    if (event.code === 'ArrowLeft') {
      // On left, step back
      pauseDiagramLoop();
      stepBack();
    } else if (event.code === 'ArrowRight') {
      // On right, step fwd.
      pauseDiagramLoop();
      stepFwd();
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

function stepBack() {
  if (wireState.value.step <= 0) {
    return;
  }

  //Decrement step first to get the correct wire
  wireState.value.step--;

  const wire = wireState.value.wires[wireState.value.step];
  if (wire == CYCLE_BREAK) {
    wireState.value.cycle--;
  } else {
    const history = wireActivationHistory.value.get(wire) || [];
    if (history.length > 0) {
      history.pop(); 
      
      if (history.length > 0) {
        const previousCycle = history[history.length - 1];
        lc3Diagram.value?.activateWire(wire, previousCycle);
      } else {
        lc3Diagram.value?.deactivateWire(wire);
        wireActivationHistory.value.delete(wire);
      }
    }
  }
}
function stepFwd() {
  if (wireState.value.step >= wireState.value.stop) {
    return;
  }

  const wire = wireState.value.wires[wireState.value.step];
  if (wire == CYCLE_BREAK) {
    wireState.value.cycle++;
  } else {
    // Track this activation in the history
    if (!wireActivationHistory.value.has(wire)) {
      wireActivationHistory.value.set(wire, []);
    }
    wireActivationHistory.value.get(wire)!.push(wireState.value.cycle);
    
    lc3Diagram.value?.activateWire(wire, wireState.value.cycle);
  }
  wireState.value.step++;
}

function runTick(ts: number) {
  if (wireState.value.step >= wireState.value.stop) {
    pauseDiagramLoop();
    return;
  }

    const wire = wireState.value.wires[wireState.value.step];
    const delta = ts - lastWireActivate;
    const wireCooldown = wire == CYCLE_BREAK ? 2 * activeWireTime.value : activeWireTime.value;

    // Check if we're ready to play the next wire:
    if (delta >= wireCooldown) {
      stepFwd();
      lastWireActivate = ts;
    }
    
    loopId.value = requestAnimationFrame(runTick);
}

/**
 * Start queue loop.
 */
function startDiagramLoop(pauseAt: "end" | "cycle" = "end") {
  if (pauseAt == "end") wireState.value.stop = wireState.value.wires.length;
  if (pauseAt == "cycle") {
    let next = wireState.value.wires.indexOf(CYCLE_BREAK, wireState.value.step + 1);
    if (next == -1) next = wireState.value.wires.length;
    wireState.value.stop = next;
  }

  loopId.value = requestAnimationFrame(runTick);
}
/**
 * Pause queue loop.
 */
function pauseDiagramLoop() {
    if (typeof loopId.value === "number") {
        cancelAnimationFrame(loopId.value);
        loopId.value = undefined;
        lastWireActivate = 0;
    }
}
/**
 * Stops queue loop and clears all wires.
 */
function resetDiagramLoop() {
    pauseDiagramLoop();
    lc3Diagram.value?.resetWires();

    wireState.value = {
      wires: [],
      step: 0,
      stop: 0,
      cycle: 0,
      macro: undefined
    };
    
    // Clear the activation history
    wireActivationHistory.value.clear();
}
function toggleDiagramLoop() {
  if (running.value) {
    pauseDiagramLoop();
  } else {
    startDiagramLoop();
  }
}

function activateMacro(key: string) {
    if (!(key in SEQUENCE_DATA)) return;
    const { sequence } = SEQUENCE_DATA[key];

    resetDiagramLoop();

    wireState.value.macro = key;
    // Add CYCLE_BREAKs between the cycles
    for (const cycle of sequence) {
      wireState.value.wires.push(...cycle, CYCLE_BREAK);
    }
    wireState.value.stop = wireState.value.wires.length;
}
</script>

<template>
  <div class="flex flex-col gap-3 h-screen">
    <!-- Header -->
    <header class="p-4">
      <div class="flex gap-1 items-center justify-center">
        <h1 class="text-center text-4xl">
          LC-3 Visualization Tool
        </h1>
        <Button
          severity="secondary"
          variant="text"
          icon="pi"
          aria-label="About"
          rounded
          @click="infoDialogVisible = true"
        >
          <MdiInformationOutline />
        </Button>
      </div>
    </header>
    
    <Dialog
      v-model:visible="infoDialogVisible"
      modal
      dismissable-mask
      header="About"
    >
      This visualization tool is an interactive guide on how to trace the LC-3 datapath.<br>

      Designed by Huy Nguyen & Henry Bui, maintained by the <a
        class="text-blue-500 underline"
        href="https://github.com/gt-cs2110/"
      >GT CS 2110 TA Team</a>.

      <template #footer>
        <a
          title="Source Code"
          aria-label="Source Code"
          href="https://github.com/gt-cs2110/2110VisTool"
        >
          <SiGithub />
        </a>
      </template>
    </Dialog>

    <!-- SVG + pseudocode -->
    <div class="grid grid-cols-2 grow gap-3 px-2">
      <!-- The SVG diagram -->
      <div class="flex justify-end">
        <LC3 ref="lc3" />
      </div>
      <!-- The pseudocode -->
      <div class="flex grow flex-col items-center 2xl:items-start justify-center">
        <Card v-if="wireState.macro && SEQUENCE_DATA[wireState.macro].pseudocode">
          <template #title>
            {{ SEQUENCE_DATA[wireState.macro].label }} Pseudocode
          </template>
          <template #content>
            <Pseudocode
              :pseudocode="SEQUENCE_DATA[wireState.macro].pseudocode"
              :cycle="wireState.cycle"
              :running
            />
          </template>
        </Card>
      </div>
    </div>

    <!-- Control panel -->
    <div class="control-panel">
      <div class="flex items-stretch gap-2 py-2 justify-center">
        <div class="flex items-center gap-2">
          Speed: 
          <Slider
            v-model="speedScale"
            class="w-56"
          />
          <div class="pl-1">
            <Button
              v-tooltip.top="running ? 'Pause' : 'Play'"
              :disabled="isLoopDone"
              :aria-label="running ? 'Pause' : 'Play'"
              class="transition"
              icon="pi"
              rounded
              @click="toggleDiagramLoop()"
            >
              <mdi-pause v-if="running" />
              <mdi-play v-else />
            </Button>
          </div>
        </div>
        <Divider layout="vertical" />
        <div class="flex gap-2 items-center">
          Step
          <div class="flex gap-0.5">
            <Button
              v-tooltip.top="'Step Backward'"
              aria-label="Step Backward"
              :dt="{
                root: {
                  borderRadius: '{form.field.border.radius} 0 0 {form.field.border.radius}'
                }
              }"
              @click="() => { pauseDiagramLoop(); stepBack() }"
            >
              <mdi-step-backward />
            </Button>
            <Button
              v-tooltip.top="'Step Forward'"
              :disabled="isLoopDone"
              aria-label="Step Forward"
              :dt="{
                root: {
                  borderRadius: '0 {form.field.border.radius} {form.field.border.radius} 0'
                }
              }"
              @click="() => { pauseDiagramLoop(); stepFwd() }"
            >
              <mdi-step-forward />
            </Button>
          </div>
        </div>
        <Divider layout="vertical" />
        <div class="flex items-center">
          Cycle&nbsp;
          <span
            v-if="wireState.macro"
            class="font-mono"
          >{{ Math.min(wireState.cycle + 1, macroCycleCount ?? Infinity) }}</span>
          <span
            v-else
            class="font-mono"
          >-</span>
          &nbsp;of&nbsp;
          <span
            v-if="wireState.macro"
            class="font-mono"
          >{{ macroCycleCount ?? '-' }}</span>
          <span
            v-else
            class="font-mono"
          >-</span>
        </div>
        <Button
          :disabled="isLoopDone || running"
          @click="startDiagramLoop('cycle')"
        >
          Next Cycle
        </Button>
        <Divider layout="vertical" />
        <Button
          :disabled="wireState.wires.length == 0"
          @click="resetDiagramLoop()"
        >
          Reset Wires
        </Button>
      </div>
      <Divider />
      <Menubar
        :model="Object.entries(SEQUENCE_DATA).map(([key, { label }]) => ({ label, key, command(e) { activateMacro(e.item.key!); } }))"
        :dt="{
          // Remove all background effects from menubar,
          // but keep command shortcuts
          root: {
            background: 'transparent',
            borderColor: 'transparent',
            borderRadius: '0',
          }
        }"
        class="px-0 justify-center"
      >
        <template #item="{ item, label, props }">
          <a
            v-bind="props.action"
            class="transition-colors rounded text-sm p-1 xl:text-base xl:p-2"
            :class="{
              'outline outline-surface-500': wireState.macro != item.key,
              'bg-primary hover:bg-primary-emphasis text-primary-contrast': wireState.macro == item.key && !isLoopDone,
              'outline outline-primary-500': wireState.macro == item.key && isLoopDone,
            }"
          >
            {{ label }}
          </a>
        </template>
      </Menubar>
    </div>
  </div>
</template>

<style scoped>
@reference "@/style.css";

.control-panel {
  @apply flex flex-col items-stretch;
  @apply bg-surface-ui border-surface border-2 rounded-t px-2;
}
</style>
