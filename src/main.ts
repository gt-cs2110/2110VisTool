// Copyright Huy Nguyen 2025
import SEQUENCE_DATA from "./sequences.json";

const DEFAULT_ACTIVE_WIRE_TIME = 200;
let activeWireTime = DEFAULT_ACTIVE_WIRE_TIME;

const CYCLE_BREAK = "pause-and-clear";

const [topControlPanel, btmControlPanel] = document.getElementsByClassName("control-panel");
const speedScaleSlider = document.getElementById("speed-scale-slider")! as HTMLInputElement;
const playBtn = document.getElementById("btn-play")!;
const pauseBtn = document.getElementById("btn-pause")!;
const instrSelect = document.getElementById('instruction-select')! as HTMLSelectElement;


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
        if ((ts - lastWireActivate) >= 2 * activeWireTime) {
            resetWires();
            wireQueue.shift();
            lastWireActivate = ts;
        }
    } else {
        if ((ts - lastWireActivate) >= activeWireTime) {
            activateWire(wireQueue.shift()!);
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
    resetWires();
    wireQueue.length = 0;
}

function activateWire(wireId: string) {
    // Activate selected wire
    const wire = document.getElementById(wireId);
    if (wire) {
        wire.classList.add('active');
    } else {
        console.warn("Failed to activate missing wire:", wireId);
    }
}
function resetWires() {
    document.querySelectorAll('.wire').forEach(wire => {
        wire.classList.remove('active');
    });
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


// Handle item selection
// items.forEach(item => {
//     item.addEventListener('click', () => {
//         dropdownButton.textContent = item.textContent;
//         content.classList.remove('show');
//     });
// });

speedScaleSlider.addEventListener("change", () => {
    let scale = Math.pow(4, +speedScaleSlider.value / 100) / 2;
    activeWireTime = DEFAULT_ACTIVE_WIRE_TIME / scale;
})
playBtn.onclick = () => startQueueLoop();
pauseBtn.onclick = () => pauseQueueLoop();
topControlPanel.append(
    createCtrlPanelButton("Reset Wires", () => stopQueueLoop())
);

instrSelect.addEventListener('change', function() {
    document.querySelectorAll('.text').forEach(el => el.classList.remove('active'));
    instrSelect.classList.add('active');
});

/*
let isPaused = false;
let timeoutIds = [];
function togglePause() {
    isPaused = !isPaused;
    const pauseBtn = document.getElementById('pauseBtn');
    pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
    
    if (isPaused) {
        clearAllTimeouts();
    }
}

function clearAllTimeouts() {
    timeoutIds.forEach(id => clearTimeout(id));
    timeoutIds = [];
}
*/

// For every defined item, create a button for it.
function createCtrlPanelButton(textContent: string, onclick: (e: MouseEvent) => any) {
    const btn = document.createElement("button");
    btn.textContent = textContent;
    btn.onclick = onclick;
    return btn;
}
for (let [key, { label }] of Object.entries(SEQUENCE_DATA)) {
    const btn = createCtrlPanelButton(label, () => activateMacro(key));
    btmControlPanel.append(btn);
}