<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import LC3 from './components/LC3.vue';
import SEQUENCE_DATA from "./sequences";

const DEFAULT_ACTIVE_WIRE_TIME = 200;
const CYCLE_BREAK = "CYCLE_BREAK";

const speedScale = ref(50);
const activeWireTime = computed(() => {
  let scale = Math.pow(4, speedScale.value / 100) / 2;
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
const loopId = ref<number>();
const running = computed(() => typeof loopId.value !== "undefined");
const isLoopDone = computed(() => wireState.value.step >= wireState.value.wires.length);

/**
 * The last tick when a wire was activated.
 */
let lastWireActivate: number = 0;

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
    lc3Diagram.value?.deactivateWire(wire);
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
    let { sequence } = SEQUENCE_DATA[key];

    resetDiagramLoop();

    wireState.value.macro = key;
    // Add CYCLE_BREAKs between the cycles
    for (let cycle of sequence) {
      wireState.value.wires.push(...cycle, CYCLE_BREAK);
    }
    wireState.value.stop = wireState.value.wires.length;
}
</script>

<style scoped>
@reference "@/style.css";

.control-panel {
  @apply flex flex-col items-stretch;
  @apply bg-surface-ui border-surface border-2 rounded-t px-2;
}
</style>

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
    
    <Dialog v-model:visible="infoDialogVisible" modal dismissableMask header="About">
      This visualization tool is an interactive guide on how to trace the LC-3 datapath.<br>

      Designed by Huy Nguyen & Henry Bui, maintained by the <a class="text-blue-500 underline" href="https://github.com/gt-cs2110/">GT CS 2110 TA Team</a>.

      <template #footer>
        <a title="Source Code" aria-label="Source Code" href="https://github.com/gt-cs2110/2110VisTool">
          <SiGithub />
        </a>
      </template>
    </Dialog>

    <!-- SVG + pseudocode -->
    <div class="flex grow gap-3 px-2">
      <!-- The SVG diagram -->
      <LC3 ref="lc3" />
      <!-- The pseudocode -->
        <div class="flex grow flex-col items-center justify-center">
          <Card v-if="wireState.macro && SEQUENCE_DATA[wireState.macro].pseudocode">
            <template #title>{{SEQUENCE_DATA[wireState.macro].label}} Pseudocode</template>
            <template #content>
              <Pseudocode
                :pseudocode="{ source: SEQUENCE_DATA[wireState.macro].pseudocode, cycles: [[{start: 14, end: 26}], [{ start: 5, end: 12}], [{ start: 0, end: 13}]] }"
                :cycle="wireState.cycle"
                :running
              />
            </template>
          </Card>
        </div>
    </div>

    <!-- Control panel -->
    <div class="control-panel">
      <div class="flex items-stretch gap-2 py-2">
        <div class="flex items-center gap-2">
          Speed: 
          <Slider v-model="speedScale" class="w-56" />
          <div class="pl-1">
            <Button
              :disabled="isLoopDone"
              :aria-label="running ? 'Pause' : 'Play'"
              v-tooltip.top="running ? 'Pause' : 'Play'"
              @click="toggleDiagramLoop()"
              class="transition"
              icon="pi"
              rounded
            >
              <mdi-pause v-if="running" />
              <mdi-play v-else />
            </Button>
          </div>
        </div>
        <Divider layout="vertical" />
        <Divider layout="vertical" />
        <div class="flex gap-2 items-center">
          Step
          <div class="flex gap-0.5">
            <Button
              aria-label="Step Backward"
              v-tooltip.top="'Step Backward'"
              @click="() => { pauseDiagramLoop(); stepBack() }"
              :dt="{
                root: {
                  borderRadius: '{form.field.border.radius} 0 0 {form.field.border.radius}'
                }
              }"
            >
              <mdi-step-backward />
            </Button>
            <Button
              :disabled="isLoopDone"
              aria-label="Step Forward"
              v-tooltip.top="'Step Forward'"
              @click="() => { pauseDiagramLoop(); stepFwd() }"
              :dt="{
                root: {
                  borderRadius: '0 {form.field.border.radius} {form.field.border.radius} 0'
                }
              }"
            >
              <mdi-step-forward />
            </Button>
          </div>
        </div>
        <Divider layout="vertical" />
        <Button
          :disabled="isLoopDone || running"
          @click="startDiagramLoop('cycle')"
        >
          Next Cycle
        </Button>
        <Button :disabled="wireState.wires.length == 0" @click="resetDiagramLoop()">Reset Wires</Button>
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
        class="px-0"
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
