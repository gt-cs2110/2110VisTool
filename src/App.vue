<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import LC3 from './components/LC3.vue';
import SEQUENCE_DATA from "./sequences.json";

const DEFAULT_ACTIVE_WIRE_TIME = 200;
const CYCLE_BREAK = "pause-and-clear";

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
const wireQueue = ref<string[]>([]);
const loopId = ref<number>();
const running = computed(() => typeof loopId.value !== "undefined");
const queueIsEmpty = computed(() => wireQueue.value.length === 0);

/**
 * The last tick when a wire was activated.
 */
let lastWireActivate: number = 0;

function queueTick(ts: number) {
    if (wireQueue.value.length === 0) {
        pauseQueueLoop();
        return;
    }

    // If we're ready to queue the next wire:
    if (wireQueue.value[0] === CYCLE_BREAK) {
        if ((ts - lastWireActivate) >= 2 * activeWireTime.value) {
            lc3Diagram.value?.resetWires();
            wireQueue.value.shift();
            lastWireActivate = ts;
        }
    } else {
        if ((ts - lastWireActivate) >= activeWireTime.value) {
            lc3Diagram.value?.activateWire(wireQueue.value.shift()!);
            lastWireActivate = ts;
        }
    }
    loopId.value = requestAnimationFrame(queueTick);
}

/**
 * Start queue loop.
 */
function startQueueLoop() {
    loopId.value = requestAnimationFrame(queueTick);
}
/**
 * Pause queue loop.
 */
function pauseQueueLoop() {
    if (typeof loopId.value === "number") {
        cancelAnimationFrame(loopId.value);
        loopId.value = undefined;
        lastWireActivate = 0;
    }
}
/**
 * Stops queue loop and clears all wires.
 */
function stopQueueLoop() {
    pauseQueueLoop();
    lc3Diagram.value?.resetWires();
    wireQueue.value.length = 0;
}
function toggleQueueLoop() {
  if (running.value) {
    pauseQueueLoop();
  } else {
    startQueueLoop();
  }
}

function activateMacro(key: string) {
    if (!(key in SEQUENCE_DATA)) return;
    let { sequence } = SEQUENCE_DATA[key as keyof typeof SEQUENCE_DATA];

    stopQueueLoop();
    for (let cycle of sequence) {
        wireQueue.value.push(...cycle);
        wireQueue.value.push(CYCLE_BREAK);
    }
    if (sequence.length > 0) wireQueue.value.pop();
    lc3Diagram.value.scrollIntoView();
    startQueueLoop();
}
</script>

<style scoped lang="postcss">
.control-panel {
  --p-slider-track-background: var(--p-stone-500);
  @apply flex items-center gap-3 p-2;
  @apply bg-stone-300 dark:bg-stone-600;
  @apply border-stone-700 border-2 rounded-md;
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
        Speed: 
        <Slider v-model="speedScale" class="w-56" />
        <Button
          :disabled="queueIsEmpty"
          :aria-label="running ? 'Pause' : 'Play'"
          v-tooltip.top="running ? 'Pause' : 'Play'"
          @click="toggleQueueLoop()"
        >
          <mdi-pause v-if="running" />
          <mdi-play v-else />
        </Button>
        <Button @click="stopQueueLoop()">Reset Wires</Button>
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
