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
  if (bit[5] == 0) {
    DR = SR1 + SR2;
  } else {
    DR = SR1 + SEXT(imm5);
  }
  setCC();`,
  "and": `\
Operation AND:
  if (bit[5] == 0) {
    DR = SR1 & SR2;
  } else {
    DR = SR1 & SEXT(imm5);
  }
  setCC();`,
  "not": `\
Operation NOT:
  DR = ~SR1;
  setCC();
`
};
/**
 * A queue of wires to activate.
 */
const wireQueue: string[] = [];

let loopId: number | undefined = undefined;
/**
 * The last tick when a wire was activated.
 */
let lastWireActivate: number = 0;

function queueTick(ts: number) {
    if (wireQueue.length === 0) {
        pauseQueueLoop();
        return;
    }

    // If we're ready to queue the next wire:
    if (wireQueue[0] === CYCLE_BREAK) {
        if ((ts - lastWireActivate) >= 2 * activeWireTime.value) {
            lc3Diagram.value?.resetWires();
            wireQueue.shift();
            lastWireActivate = ts;
        }
    } else {
        if ((ts - lastWireActivate) >= activeWireTime.value) {
            lc3Diagram.value?.activateWire(wireQueue.shift()!);
            lastWireActivate = ts;
        }
    }
    loopId = requestAnimationFrame(queueTick);
}

/**
 * Start queue loop.
 */
function startQueueLoop() {
    loopId = requestAnimationFrame(queueTick);
}
/**
 * Pause queue loop.
 */
function pauseQueueLoop() {
    if (typeof loopId === "number") {
        cancelAnimationFrame(loopId);
        loopId = undefined;
        lastWireActivate = 0;
    }
}
/**
 * Stops queue loop and clears all wires.
 */
function stopQueueLoop() {
    pauseQueueLoop();
    lc3Diagram.value?.resetWires();
    wireQueue.length = 0;
}

function activateMacro(key: string) {
    if (!(key in SEQUENCE_DATA)) return;
    let { sequence } = SEQUENCE_DATA[key as keyof typeof SEQUENCE_DATA];

    stopQueueLoop();
    for (let cycle of sequence) {
        wireQueue.push(...cycle);
        wireQueue.push(CYCLE_BREAK);
    }
    if (sequence.length > 0) wireQueue.pop();
    startQueueLoop();
}
</script>

<template>
  <div class="flex-container">
    <header>
          <h1>CS 2110 Computer Organization and Programming Visualization Tool</h1>
          <h3>Designed by Huy Nguyen</h3>
    </header>

    <select v-model="instrDropdownValue">
          <option value="add">ADD</option>
          <option value="and">AND</option>
          <option value="not">NOT</option>
          <option value="ld">LD</option>
    </select>
    
    <div class="middle">
      <LC3 ref="lc3" />
      <div class="text">
          {{ instrDDStrings[instrDropdownValue] }}
      </div>
    </div>
  </div>

  <div>
    <div class="control-panel">
      <input type="range" min="0" max="100" v-model="speedScale">
      <button @click="startQueueLoop()">Play</button>
      <button @click="pauseQueueLoop()">Pause</button>
      <button @click="stopQueueLoop()">Reset Wires</button>
    </div>
    <div class="control-panel">
      <button 
        v-for="[key, { label }] in Object.entries(SEQUENCE_DATA)" 
        @click="activateMacro(key)"
      >
        {{ label }}
      </button>
    </div>
  </div>
</template>
