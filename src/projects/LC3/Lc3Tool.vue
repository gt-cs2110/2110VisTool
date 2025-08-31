<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
// Adjusted paths: all LC3 tool resources are now siblings inside projects/LC3
import LC3 from './LC3.vue';
import Pseudocode from './Pseudocode.vue';
import SEQUENCE_DATA from './sequences';

const DEFAULT_ACTIVE_WIRE_TIME = 200;
const CYCLE_BREAK = 'CYCLE_BREAK';
const speedScale = ref(50);
const activeWireTime = computed(() => {
  const scale = Math.pow(4, speedScale.value / 100) / 2;
  return DEFAULT_ACTIVE_WIRE_TIME / scale;
});
// Replace problematic template ref typing with generic HTMLElement fallback to silence TS error if vue shim not yet loaded.
const lc3Diagram = ref<any>();
const infoDialogVisible = ref(false);
const wireState = ref({
  wires: [] as string[],
  step: 0,
  stop: 0,
  cycle: 0,
  macro: undefined as string | undefined,
});
const wireActivationHistory = ref<Map<string, number[]>>(new Map());
const loopId = ref<number>();
const running = computed(() => typeof loopId.value !== 'undefined');
const isLoopDone = computed(() => wireState.value.step >= wireState.value.wires.length);
const macroCycleCount = computed(() => wireState.value.macro ? SEQUENCE_DATA[wireState.value.macro].sequence.length : undefined);
// Derive current sequence entry (typed as any fallback) to simplify template typing
const currentSequence = computed(() => wireState.value.macro ? (SEQUENCE_DATA as any)[wireState.value.macro] : undefined);
let lastWireActivate = 0;
function handleKeydown(event: KeyboardEvent) {
  if (event.code === 'Escape') (document.activeElement as HTMLElement)?.blur();
  if (document.activeElement == document.body || document.activeElement == document.documentElement) {
    if (event.code === 'ArrowLeft') { pauseDiagramLoop(); stepBack(); }
    else if (event.code === 'ArrowRight') { pauseDiagramLoop(); stepFwd(); }
  }
}
onMounted(() => window.addEventListener('keydown', handleKeydown));
onUnmounted(() => window.removeEventListener('keydown', handleKeydown));
function stepBack() {
  if (wireState.value.step <= 0) return;
  wireState.value.step--;
  const wire = wireState.value.wires[wireState.value.step];
  if (wire == CYCLE_BREAK) wireState.value.cycle--;
  else {
    const history = wireActivationHistory.value.get(wire) || [];
    if (history.length > 0) {
      history.pop();
      if (history.length > 0) lc3Diagram.value?.activateWire(wire, history[history.length - 1]);
      else { lc3Diagram.value?.deactivateWire(wire); wireActivationHistory.value.delete(wire); }
    }
  }
}
function stepFwd() {
  if (wireState.value.step >= wireState.value.stop) return;
  const wire = wireState.value.wires[wireState.value.step];
  if (wire == CYCLE_BREAK) wireState.value.cycle++;
  else {
    if (!wireActivationHistory.value.has(wire)) wireActivationHistory.value.set(wire, []);
    wireActivationHistory.value.get(wire)!.push(wireState.value.cycle);
    lc3Diagram.value?.activateWire(wire, wireState.value.cycle);
  }
  wireState.value.step++;
}
function runTick(ts: number) {
  if (wireState.value.step >= wireState.value.stop) { pauseDiagramLoop(); return; }
  const wire = wireState.value.wires[wireState.value.step];
  const delta = ts - lastWireActivate;
  const wireCooldown = wire == CYCLE_BREAK ? 2 * activeWireTime.value : activeWireTime.value;
  if (delta >= wireCooldown) { stepFwd(); lastWireActivate = ts; }
  loopId.value = requestAnimationFrame(runTick);
}
function startDiagramLoop(pauseAt: 'end' | 'cycle' = 'end') {
  if (pauseAt == 'end') wireState.value.stop = wireState.value.wires.length;
  if (pauseAt == 'cycle') {
    let next = wireState.value.wires.indexOf(CYCLE_BREAK, wireState.value.step + 1);
    if (next == -1) next = wireState.value.wires.length;
    wireState.value.stop = next;
  }
  loopId.value = requestAnimationFrame(runTick);
}
function pauseDiagramLoop() {
  if (typeof loopId.value === 'number') {
    cancelAnimationFrame(loopId.value);
    loopId.value = undefined;
    lastWireActivate = 0;
  }
}
function resetDiagramLoop() {
  pauseDiagramLoop();
  lc3Diagram.value?.resetWires();
  wireState.value = { wires: [], step: 0, stop: 0, cycle: 0, macro: undefined };
  wireActivationHistory.value.clear();
}
function toggleDiagramLoop() { running.value ? pauseDiagramLoop() : startDiagramLoop(); }
function activateMacro(key: string) {
  if (!(key in SEQUENCE_DATA)) return;
  const { sequence } = SEQUENCE_DATA[key];
  resetDiagramLoop();
  wireState.value.macro = key;
  for (const cycle of sequence) wireState.value.wires.push(...cycle, CYCLE_BREAK);
  wireState.value.stop = wireState.value.wires.length;
}
</script>
<template>
  <div class="flex flex-col gap-3 h-full">
    <header class="p-4">
      <div class="flex gap-1 items-center justify-center">
        <h1 class="text-center text-4xl">LC-3 Visualization Tool</h1>
        <Button severity="secondary" variant="text" icon="pi" aria-label="About" rounded @click="infoDialogVisible = true">
          <MdiInformationOutline />
        </Button>
      </div>
    </header>
    <Dialog v-model:visible="infoDialogVisible" modal dismissableMask header="About">
      This visualization tool is an interactive guide on how to trace the LC-3 datapath.<br />Designed by Huy Nguyen & Henry Bui, maintained by the
      <a class="text-blue-500 underline" href="https://github.com/gt-cs2110/">GT CS 2110 TA Team</a>
      <template #footer>
        <a title="Source Code" aria-label="Source Code" href="https://github.com/gt-cs2110/2110VisTool">
          <SiGithub />
        </a>
      </template>
    </Dialog>
    <div class="grid grid-cols-2 grow gap-3 px-2">
      <div class="flex justify-end">
  <LC3 ref="lc3Diagram" />
      </div>
      <div class="flex grow flex-col items-center 2xl:items-start justify-center">
        <Card v-if="currentSequence?.pseudocode">
          <template #title>{{ currentSequence.label }} Pseudocode</template>
          <template #content>
            <Pseudocode :pseudocode="currentSequence.pseudocode" :cycle="wireState.cycle" :running />
          </template>
        </Card>
      </div>
    </div>
    <div class="control-panel">
      <div class="flex items-stretch gap-2 py-2">
        <div class="flex items-center gap-2">
          Speed:
          <Slider v-model="speedScale" class="w-56" />
          <div class="pl-1">
            <Button :disabled="isLoopDone" :aria-label="running ? 'Pause' : 'Play'" v-tooltip.top="running ? 'Pause' : 'Play'" @click="toggleDiagramLoop()" class="transition" icon="pi" rounded>
              <mdi-pause v-if="running" />
              <mdi-play v-else />
            </Button>
          </div>
        </div>
        <Divider layout="vertical" />
        <div class="flex gap-2 items-center">
          Step
          <div class="flex gap-0.5">
            <Button aria-label="Step Backward" v-tooltip.top="'Step Backward'" @click="() => { pauseDiagramLoop(); stepBack(); }" :dt="{ root: { borderRadius: '{form.field.border.radius} 0 0 {form.field.border.radius}' } }">
              <mdi-step-backward />
            </Button>
            <Button :disabled="isLoopDone" aria-label="Step Forward" v-tooltip.top="'Step Forward'" @click="() => { pauseDiagramLoop(); stepFwd(); }" :dt="{ root: { borderRadius: '0 {form.field.border.radius} {form.field.border.radius} 0' } }">
              <mdi-step-forward />
            </Button>
          </div>
        </div>
        <Divider layout="vertical" />
        <div class="flex items-center">
          Cycle&nbsp;
          <span class="font-mono" v-if="wireState.macro">{{ Math.min(wireState.cycle + 1, macroCycleCount ?? Infinity) }}</span>
          <span class="font-mono" v-else>-</span>
          &nbsp;of&nbsp;
          <span class="font-mono" v-if="wireState.macro">{{ macroCycleCount ?? '-' }}</span>
          <span class="font-mono" v-else>-</span>
        </div>
        <Button :disabled="isLoopDone || running" @click="startDiagramLoop('cycle')">Next Cycle</Button>
        <Divider layout="vertical" />
        <Button :disabled="wireState.wires.length == 0" @click="resetDiagramLoop()">Reset Wires</Button>
      </div>
      <Divider />
  <Menubar :model="(Object.entries(SEQUENCE_DATA) as [string, any][]).map(([key, val]) => ({ label: val.label, key, command: (e: any) => activateMacro(e.item.key!) }))" :dt="{ root: { background: 'transparent', borderColor: 'transparent', borderRadius: '0' } }" class="px-0">
        <template #item="{ item, label, props }">
          <a v-bind="props.action" class="transition-colors rounded text-sm p-1 xl:text-base xl:p-2" :class="{ 'outline outline-surface-500': wireState.macro != item.key, 'bg-primary hover:bg-primary-emphasis text-primary-contrast': wireState.macro == item.key && !isLoopDone, 'outline outline-primary-500': wireState.macro == item.key && isLoopDone }">
            {{ label }}
          </a>
        </template>
      </Menubar>
    </div>
  </div>
</template>
<style scoped>
.control-panel { display: flex; flex-direction: column; align-items: stretch; }
</style>
