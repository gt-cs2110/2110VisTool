<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import LC3 from './components/LC3.vue';
import SEQUENCE_DATA from "./sequences.json";

const DEFAULT_ACTIVE_WIRE_TIME = 200;
const CYCLE_BREAK = "CYCLE_BREAK";

const speedScale = ref(50);
const activeWireTime = computed(() => {
  let scale = Math.pow(4, speedScale.value / 100) / 2;
  return DEFAULT_ACTIVE_WIRE_TIME / scale;
});
const lc3Diagram = useTemplateRef("lc3");

const instrDropdownValue = ref("add");
const instrDDStrings: Record<string, string> = { // TODO: resolve hack
  "add": `\
Operation ADD:
  if bit[5] == 0:
     DR = SR1 + SR2;
  else:
     DR = SR1 + SEXT(imm5);
  
  setCC();`,

  "and": `\
Operation AND:
  if bit[5] == 0:
     DR = SR1 & SR2;
  else:
     DR = SR1 & SEXT(imm5);
  
  setCC();`,

  "not": `\
Operation NOT:
  DR = ~SR1;
  setCC();`,

  "ld": `\
Operation LD:
  DR = mem[PC* + SEXT(PCoffset9)];
  setCC();`,

  "ldi": `\
Operation LDI:
  DR = mem[mem[PC* + SEXT(PCoffset9)]];
  setCC();`,

  "ldr": `\
Operation LDR:
  DR = mem[BaseR* + SEXT(PCoffset6)];
  setCC();`,

  "st": `\
Operation ST:
  mem[PC* + SEXT(PCoffset9)] = SR;`,

  "sti": `\
Operation STI:
  mem[mem[PC* + SEXT(PCoffset9)] = SR];`,

  "str": `\
Operation STR:
  mem[BaseR + SEXT(offset6)] = SR;`,

  "lea": `\
Operation LEA:
  DR = PC* + SEXT(PCoffset9);`,

  "br": `\
Operation BR:
  if (n AND N) OR (z AND Z) OR (p AND P):
      PC = PC* + SEXT(PCoffset9);`,

 "jmp": `\
Operation JMP:
   PC = BaseR;`,

  "jsr/jsrr": `\
Operation JSR/JSRR:
  R7 = PC*;
  if bit[11] == 0:
      PC = BaseR;
  else:
      PC = PC* + SEXT(PCoffset11)`,

  "trap": `\
Operation TRAP:
  R7 = PC*;
  PC = mem[ZEXT(trapvect8)];`

};

/**
 * A queue of wires to activate.
 */
const wireState = ref({
  wires: [] as string[],
  step: 0,
  stop: 0,
  cycle: 0
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

  const wire = wireState.value.wires[wireState.value.step];
  if (wire == CYCLE_BREAK) {
    wireState.value.cycle--;
  } else {
    lc3Diagram.value?.deactivateWire(wire);
  }
  wireState.value.step--;
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
function startDiagramLoop(stop: "end" | "cycle" = "end") {
  if (stop == "end") wireState.value.stop = wireState.value.wires.length;
  if (stop == "cycle") {
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
      cycle: 0
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
    let { sequence } = SEQUENCE_DATA[key as keyof typeof SEQUENCE_DATA];

    resetDiagramLoop();

    // Add CYCLE_BREAKs between the cycles
    for (let cycle of sequence) {
      wireState.value.wires.push(...cycle, CYCLE_BREAK);
    }
    wireState.value.stop = wireState.value.wires.length;
    lc3Diagram.value?.scrollIntoView();
    startDiagramLoop();
}
</script>

<style scoped>
@reference "@/style.css";

.control-panel {
  @apply flex items-stretch gap-2 p-2;
  @apply bg-surface-300 dark:bg-surface-600;
  @apply border-surface border-2 rounded-md;
}
</style>

<template>
  <header class="p-4">
    <h1 class="text-center text-5xl">LC-3 Visualization Tool</h1>
    <h3 class="text-center text-xl">Designed by Huy Nguyen and Henry Bui</h3>
  </header>
  <div class="flex flex-col gap-3 h-screen">
    <!-- <div class="flex justify-center">
      <select v-model="instrDropdownValue">
          <option v-for="value of Object.keys(instrDDStrings)" :value>
            {{ value.toUpperCase() }}
          </option>
      </select>
    </div> -->
    
    <div class="flex flex-1 justify-center">
      <!-- The SVG diagram -->
      <LC3 ref="lc3" />
      <!-- The pseudocode -->
      <!-- <pre class="justify-self-center">{{ instrDDStrings[instrDropdownValue] }}</pre> -->
    </div>

    <div>
      <div class="control-panel">
        <div class="flex items-center gap-2">
          Speed: 
          <Slider v-model="speedScale" class="w-56" />
        </div>
        <Button
          :disabled="isLoopDone"
          :aria-label="running ? 'Pause' : 'Play'"
          v-tooltip.top="running ? 'Pause' : 'Play'"
          @click="toggleDiagramLoop()"
          class="transition"
          icon="pi"
        >
          <mdi-pause v-if="running" />
          <mdi-play v-else />
        </Button>
        <Divider layout="vertical" />
        <div class="flex gap-2 items-center">
          Step
          <Button
            aria-label="Step Backward"
            v-tooltip.top="'Step Backward'"
            @click="() => { pauseDiagramLoop(); stepBack() }"
          >
            <mdi-step-backward />
          </Button>
          <Button
            :disabled="isLoopDone"
            aria-label="Step Forward"
            v-tooltip.top="'Step Forward'"
            @click="() => { pauseDiagramLoop(); stepFwd() }"
          >
            <mdi-step-forward />
          </Button>
        </div>
        <Divider layout="vertical" />
        <Button
          :disabled="isLoopDone || running"
          @click="startDiagramLoop('cycle')"
        >
          Play to Next Cycle
        </Button>
        <Button :disabled="wireState.wires.length == 0" @click="resetDiagramLoop()">Reset Wires</Button>
      </div>
      <div class="control-panel flex-wrap">
        <Button 
          size="small"
          v-for="[key, { label }] in Object.entries(SEQUENCE_DATA)" 
          @click="activateMacro(key)"
        >
          {{ label }}
        </Button>
      </div>
    </div>
  </div>
</template>
