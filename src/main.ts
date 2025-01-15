// Copyright Huy Nguyen 2025
import SEQUENCE_DATA from "./sequences.json";

const ACTIVE_WIRE_TIME = 200;
const controlPanel = document.getElementsByClassName("control-panel")[0];
const instrSelect = document.getElementById('instruction-select')!;

function activateWire(wireId: string) {
    resetWires();
    // Activate selected wire
    document.getElementById(wireId)!.classList.add('active');
}

function resetWires() {
    document.querySelectorAll('.wire').forEach(wire => {
        wire.classList.remove('active');
    });
}


// Handle item selection
// items.forEach(item => {
//     item.addEventListener('click', () => {
//         dropdownButton.textContent = item.textContent;
//         content.classList.remove('show');
//     });
// });

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
    controlPanel.append(btn);
}
for (let [key, { label }] of Object.entries(SEQUENCE_DATA)) {
    createCtrlPanelButton(label, () => activateMacro(key));
}
createCtrlPanelButton("Reset Wires", () => resetWires());

function activateMacro(key: string) {
    if (!(key in SEQUENCE_DATA)) return;
    let { sequence } = SEQUENCE_DATA[key as keyof typeof SEQUENCE_DATA];

    // TODO: Use global queue system instead of setTimeout
    let i = 0;
    for (let cycle of sequence) {
        for (let item of cycle) {
            setTimeout(() => activateWire(item), ACTIVE_WIRE_TIME * i++);
        }
    }
}
