// Copyright Huy Nguyen 2025

function activateWire(wireId) {
    resetWires();
    // Activate selected wire
    document.getElementById(wireId).classList.add('active');
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

document.getElementById('instruction-select').addEventListener('change', function() {
    document.querySelectorAll('.text').forEach(el => el.classList.remove('active'));
    document.getElementById(this.value).classList.add('active');
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

 
function fetch() {
    //clearAllTimeouts();
    //isPaused = false;
    //document.getElementById('pauseBtn').textContent = 'Pause';
    const sequence = [
        //clock cycle 1
        "1 (GatePC)",
        "GatePC (shape)",
        'PC to BUS',      
        'Top Arrow',
        'Mid Arrow',
        'Low Arrow',
        'BUS to MAR',
        "1 (MAR selector)",
        'MAR selector',
        "MAR (shape)",
        "PC to MUXES (joint line)",
        "PC to PCMUX (1)",
        "+1 box",
        "PC to PCMUX (2)",
        "PC to PCMUX (3)",
        "PC to PCMUX (4)",
        "00 (PCMUX selector)",
        "PCMUX selector",
        "PCMUX (shape)",
        "PCMUX to PC",
        "1 (LD.PC)",
        "PC selector",
        "PC (shape)",

        //clock cycle 2
        'MAR to MEMORY',
        "0 (RW)",
        "RW selector",
        "1 (MEM.EN)",
        "MEM.EN selector",
        'Memory (shape)',
        'MEMORY to MDR',
        "1 (LD.MDR)",
        "1 (MDR selector)",
        'MDR selector',
        "MDR (shape)",

        //clock cycle 3
        "1 (Gate.MDR)",
        "GateMDR selector",
        "GateMDR (shape)",
        'MDR to BUS',
        'Low Arrow',
        'Bus to IR',
        "1 (LD.IR)",
        "IR selector",
        "IR (shape)"
    ];

    sequence.forEach((wireId, index) => {
        setTimeout(() => {
                activateWire(wireId);
        }, index * 200);
        //timeoutIds.push(timeoutIds);
    });

}

function decode() {
        const sequence = [
            "IR to FSM (1)",
            "IR to FSM (2)",
            "FSM (shape)"
        ]

        sequence.forEach((wireId, index) => {
            setTimeout(() => {
                    activateWire(wireId);
            }, index * 200);
        });

}

function registerADD() {
        const sequence = [
            "SR2 selector",
            "Register to ALU (joint)",
            "SR1 selector",
            "Register to SR2MUX",
            "0 (SR2MUX selector)",
            "SR2MUX selector",
            "SR2MUX (shape)",
            "SR2MUX to ALU",
            "00: ADD",
            "ALU selector",
            "ALU (shape)",
            "1 (Gate.ALU)",
            "Gate.ALU selector",
            "GateALU (shape)",
            "ALU to BUS",
            'Low Arrow',
            'BUS to CC (1)',
            "logic (rect)",
            'BUS to CC (2)',
            "1 (LD.CC)",
            "CC selector",
            "N box",
            "Z box",
            "P box",
            "CC to FSM (1)",
            "CC to FSM (2)",
            "FSM (shape)",
            'Low Arrow',
            'Mid Arrow',
            'Top Arrow',
            "Bus to Register",
            "DR selector",
            "1 (LD.REG)",
            "LD.REG selector",
            "Register File (shape)"
        ]

        sequence.forEach((wireId, index) => {
            setTimeout(() => {
                    activateWire(wireId);
            }, index * 200);
        });
}
 
function immediateADD() {
    const sequence = [
        "SR2 selector",
        "Register to ALU (joint)",
        "IR to SR2MUX (1)",
        "IR to SR2MUX (2)",
        "SEXT[4:0] (shape)",
        "IR to SR2MUX (3)",
        "IR to SR2MUX (4)",
        "0 (SR2MUX selector)",
        "SR2MUX selector",
        "SR2MUX (shape)",
        "SR2MUX to ALU",
        "00: ADD",
        "ALU selector",
        "ALU (shape)",
        "1 (Gate.ALU)",
        "Gate.ALU selector",
        "GateALU (shape)",
        "ALU to BUS",
        'Low Arrow',
        'BUS to CC (1)',
            "logic (rect)",
            'BUS to CC (2)',
            "1 (LD.CC)",
            "CC selector",
            "N box",
            "Z box",
            "P box",
            "CC to FSM (1)",
            "CC to FSM (2)",
            "FSM (shape)",
            'Low Arrow',
        'Mid Arrow',
        'Top Arrow',
        "Bus to Register",
        "DR selector",
        "1 (LD.REG)",
        "LD.REG selector",
        "Register File (shape)"
    ]

    sequence.forEach((wireId, index) => {
        setTimeout(() => {
                activateWire(wireId);
        }, index * 200);
    });
}

function NOT() {
    const sequence = [
        "SR2 selector",
        "Register to ALU (joint)",
        "10: NOT",
        "ALU selector",
        "ALU (shape)",
        "1 (Gate.ALU)",
        "Gate.ALU selector",
        "GateALU (shape)",
        "ALU to BUS",
        'Low Arrow',
        'BUS to CC (1)',
            "logic (rect)",
            'BUS to CC (2)',
            "1 (LD.CC)",
            "CC selector",
            "N box",
            "Z box",
            "P box",
            "CC to FSM (1)",
            "CC to FSM (2)",
            "FSM (shape)",
            'Low Arrow',
        'Mid Arrow',
        'Top Arrow',
        "Bus to Register",
        "DR selector",
        "1 (LD.REG)",
        "LD.REG selector",
        "Register File (shape)"
    ]

    sequence.forEach((wireId, index) => {
        setTimeout(() => {
                activateWire(wireId);
        }, index * 200);
    });
}
 
function LD() {
    const sequence = [
        //clock cycle 1
        'IR to ZEXT/SEXT (1)',
        'IR to ZEXT/SEXT (2)',
        "Bus to SEXT [8:0]", 
        "SEXT[8:0] (shape)",
        "SEXT9 to MUX (1)",
        "SEXT9 to MUX (2)",
        "10 (ADDR2MUX selector)",
        "ADDR2 selector",
        "ADDR2MUX (shape)",
        "ADDR2MUX to ADDR (1)",
        "ADDR2MUX to ADDR (2)",
        "ADDR2MUX to ADDR (3)",
        "PC to MUXES (joint line)",
        "PC to ADDR1MUX(1)", 
        "PC to ADDR1MUX(2)",
        "PC to ADDR1MUX(3)",
        "PC to ADDR1MUX(4)",
        "0 (ADDR1MUX selector)",
        "ADDR1MUX selector",
        "ADDR1MUX (shape)",
        "ADDR1MUX to ADDR (1)",
        "ADDR1MUX to ADDR (2)",
        "ADDR1MUX to ADDR (3)",
        "ADDR (shape)",
        "ADDR to MUXES (joint)",
        "ADDR to MARMUX (2)",
        "ADDR to MARMUX (3)",
        "1 (MARMUX selector)",
        "MARMUX selector",
        "MARMUX (shape)",               
        "1 (GateMARMUX)",
        "GateMARMUX selector",
        "GateMARMUX (shape)",
        "MARMUX to BUS",
        'Top Arrow',
        'Mid Arrow',
        'Low Arrow',
        'BUS to MAR',
        "1 (MAR selector)",
        'MAR selector',
        "MAR (shape)",

        //clock cycle 2
        'MAR to MEMORY',
        "0 (RW)",
        "RW selector",
        "1 (MEM.EN)",
        "MEM.EN selector",
        'Memory (shape)',
        'MEMORY to MDR',
        "1 (MDR selector)",
        'MDR selector',
        "MDR (shape)",

        //clock cycle 3
        "1 (GateMDR selector)",
        "GateMDR selector",
        "GateMDR (shape)",
        'MDR to BUS',
        'Low Arrow',
        'BUS to CC (1)',
            "logic (rect)",
            'BUS to CC (2)',
            "1 (LD.CC)",
            "CC selector",
            "N box",
            "Z box",
            "P box",
            "CC to FSM (1)",
            "CC to FSM (2)",
            "FSM (shape)",
            'Low Arrow',
        'Mid Arrow',
        'Top Arrow',
        "Bus to Register",
        "DR selector",
        "1 (LD.REG)",
        "LD.REG selector",
        "Register File (shape)"
    ]

    sequence.forEach((wireId, index) => {
        setTimeout(() => {
                activateWire(wireId);
        }, index * 100);
    });
}

function ST() {
    const sequence = [
        //clock cycle 1
        'IR to ZEXT/SEXT (1)',
        'IR to ZEXT/SEXT (2)',
        "Bus to SEXT [8:0]", 
        "SEXT[8:0] (shape)",
        "SEXT9 to MUX (1)",
        "SEXT9 to MUX (2)",
        "10 (ADDR2MUX selector)",
        "ADDR2 selector",
        "ADDR2MUX (shape)",
        "ADDR2MUX to ADDR (1)",
        "ADDR2MUX to ADDR (2)",
        "ADDR2MUX to ADDR (3)",
        "PC to MUXES (joint line)",
        "PC to ADDR1MUX(1)", 
        "PC to ADDR1MUX(2)",
        "PC to ADDR1MUX(3)",
        "PC to ADDR1MUX(4)",
        "0 (ADDR1MUX selector)",
        "ADDR1MUX selector",
        "ADDR1MUX (shape)",
        "ADDR1MUX to ADDR (1)",
        "ADDR1MUX to ADDR (2)",
        "ADDR1MUX to ADDR (3)",
        "ADDR (shape)",
        "ADDR to MUXES (joint)",
        "ADDR to MARMUX (2)",
        "ADDR to MARMUX (3)",
        "1 (MARMUX selector)",
        "MARMUX selector",
        "MARMUX (shape)",               
        "1 (GateMARMUX)",
        "GateMARMUX selector",
        "GateMARMUX (shape)",
        "MARMUX to BUS",
        'Top Arrow',
        'Mid Arrow',
        'Low Arrow',
        'BUS to MAR',
        "1 (MAR selector)",
        'MAR selector',
        "MAR (shape)",

        //clock cycle 2
        "SR2 selector",
        "Register to ALU (joint)",
        "11: PASS",
        "ALU selector",
        "ALU (shape)",
        "1 (Gate.ALU)",
        "GateALU (shape)",
        "ALU to BUS",
        'Low Arrow',
        "BUS to MDR",
        "0 (LD.MDR)",
        "MDR selector",

        //clock cycle 3
        "1 (RW)",
        "RW selector",
        "1 (MEM.EN)",
        "MEM.EN selector",
        "MAR to MEMORY",
        "MDR to MEMORY",
        'Memory (shape)'
    ]

    sequence.forEach((wireId, index) => {
        setTimeout(() => {
                activateWire(wireId);
        }, index * 330);
    });
}

function LDI() {
    const sequence = [
        //clock cycle 1
        'IR to ZEXT/SEXT (1)',
        'IR to ZEXT/SEXT (2)',
        "Bus to SEXT [8:0]", 
        "SEXT[8:0] (shape)",
        "SEXT9 to MUX (1)",
        "SEXT9 to MUX (2)",
        "10 (ADDR2MUX selector)",
        "ADDR2 selector",
        "ADDR2MUX (shape)",
        "ADDR2MUX to ADDR (1)",
        "ADDR2MUX to ADDR (2)",
        "ADDR2MUX to ADDR (3)",
        "PC to MUXES (joint line)",
        "PC to ADDR1MUX(1)", 
        "PC to ADDR1MUX(2)",
        "PC to ADDR1MUX(3)",
        "PC to ADDR1MUX(4)",
        "0 (ADDR1MUX selector)",
        "ADDR1MUX selector",
        "ADDR1MUX (shape)",
        "ADDR1MUX to ADDR (1)",
        "ADDR1MUX to ADDR (2)",
        "ADDR1MUX to ADDR (3)",
        "ADDR (shape)",
        "ADDR to MUXES (joint)",
        "ADDR to MARMUX (2)",
        "ADDR to MARMUX (3)",
        "1 (MARMUX selector)",
        "MARMUX selector",
        "MARMUX (shape)",               
        "1 (GateMARMUX)",
        "GateMARMUX selector",
        "GateMARMUX (shape)",
        "MARMUX to BUS",
        'Top Arrow',
        'Mid Arrow',
        'Low Arrow',
        'BUS to MAR',
        "1 (MAR selector)",
        'MAR selector',
        "MAR (shape)",

        //clock cycle 2
        'MAR to MEMORY',
        "0 (RW)",
        "RW selector",
        "1 (MEM.EN)",
        "MEM.EN selector",
        'Memory (shape)',
        'MEMORY to MDR',
        "1 (MDR selector)",
        'MDR selector',
        "MDR (shape)",

        //clock cycle 3
        "1 (GateMDR selector)",
        "GateMDR selector",
        "GateMDR (shape)",
        'MDR to BUS',
        'Low Arrow',
        "BUS to MAR",
        "1 (MAR selector)",
        'MAR selector',
        "MAR (shape)",

        //clock cycle 4
        'MAR to MEMORY',
        "0 (RW)",
        "RW selector",
        "1 (MEM.EN)",
        "MEM.EN selector",
        'Memory (shape)',
        'MEMORY to MDR',
        "1 (MDR selector)",
        'MDR selector',
        "MDR (shape)",

        //clock cycle 5
        "1 (GateMDR selector)",
        "GateMDR selector",
        "GateMDR (shape)",
        'MDR to BUS',
        'Low Arrow',
        'BUS to CC (1)',
            "logic (rect)",
            'BUS to CC (2)',
            "1 (LD.CC)",
            "CC selector",
            "N box",
            "Z box",
            "P box",
            "CC to FSM (1)",
            "CC to FSM (2)",
            "FSM (shape)",
            'Low Arrow',
        'Mid Arrow',
        'Top Arrow',
        "Bus to Register",
        "DR selector",
        "1 (LD.REG)",
        "LD.REG selector",
        "Register File (shape)"
    ]

    sequence.forEach((wireId, index) => {
        setTimeout(() => {
                activateWire(wireId);
        }, index * 350);
    });
}
 
function STI() {
    const sequence = [
        //clock cycle 1
        'IR to ZEXT/SEXT (1)',
        'IR to ZEXT/SEXT (2)',
        "Bus to SEXT [8:0]", 
        "SEXT[8:0] (shape)",
        "SEXT9 to MUX (1)",
        "SEXT9 to MUX (2)",
        "10 (ADDR2MUX selector)",
        "ADDR2 selector",
        "ADDR2MUX (shape)",
        "ADDR2MUX to ADDR (1)",
        "ADDR2MUX to ADDR (2)",
        "ADDR2MUX to ADDR (3)",
        "PC to MUXES (joint line)",
        "PC to ADDR1MUX(1)", 
        "PC to ADDR1MUX(2)",
        "PC to ADDR1MUX(3)",
        "PC to ADDR1MUX(4)",
        "0 (ADDR1MUX selector)",
        "ADDR1MUX selector",
        "ADDR1MUX (shape)",
        "ADDR1MUX to ADDR (1)",
        "ADDR1MUX to ADDR (2)",
        "ADDR1MUX to ADDR (3)",
        "ADDR (shape)",
        "ADDR to MUXES (joint)",
        "ADDR to MARMUX (2)",
        "ADDR to MARMUX (3)",
        "1 (MARMUX selector)",
        "MARMUX selector",
        "MARMUX (shape)",               
        "1 (GateMARMUX)",
        "GateMARMUX selector",
        "GateMARMUX (shape)",
        "MARMUX to BUS",
        'Top Arrow',
        'Mid Arrow',
        'Low Arrow',
        'BUS to MAR',
        "1 (MAR selector)",
        'MAR selector',
        "MAR (shape)",
        //clock cycle 2
        'MAR to MEMORY',
        "0 (RW)",
        "RW selector",
        "1 (MEM.EN)",
        "MEM.EN selector",
        'Memory (shape)',
        'MEMORY to MDR',
        "1 (MDR selector)",,
        'MDR selector',
        "MDR (shape)",
        //clock cycle 3
        "1 (GateMDR selector)",
        "GateMDR selector",
        "GateMDR (shape)",
        'MDR to BUS',
        'Low Arrow',
        "BUS to MAR",
        "1 (MAR selector)",
        'MAR selector',
        "MAR (shape)",
        //clock cycle 4
        "SR2 selector",
        "Register to ALU (joint)",
        "11: PASS",
        "ALU selector",
        "ALU (shape)",
        "1 (Gate.ALU)",
        "GateALU (shape)",
        "ALU to BUS",
        'Low Arrow',
        "BUS to MDR",
        "0 (LD.MDR)",
        "MDR selector",
        //clock cycle 5
        "1 (RW)",
        "RW selector",
        "1 (MEM.EN)",
        "MEM.EN selector",
        "MAR to MEMORY",
        "MDR to MEMORY",
        'Memory (shape)',
    ]

    sequence.forEach((wireId, index) => {
        setTimeout(() => {
                activateWire(wireId);
        }, index * 350);
    });
}
 
function LDR() {
    const sequence = [
        //clock cycle 1
        "IR to ZEXT/SEXT (1)",
        "IR to ZEXT/SEXT (2)",
        "Bus to SEXT [5:0]",
        "SEXT[5:0] (shape)",
        "SEXT6 to MUX (1)",
        "SEXT6 to MUX (2)",
        "10 (ADDR2MUX selector)",
        "ADDR2 selector",
        "ADDR2MUX (shape)",
        "ADDR2MUX to ADDR (1)",
        "ADDR2MUX to ADDR (2)",
        "ADDR2MUX to ADDR (3)",
        "Register to ALU (joint)",
        "SR1 to ADDR1MUX (1)",
        "SR1 to ADDR1MUX (2)",
        "1 (ADDR1MUX selector)",
        "ADDR1MUX selector",
        "ADDR1MUX (shape)",
        "ADDR1MUX to ADDR (1)",
        "ADDR1MUX to ADDR (2)",
        "ADDR1MUX to ADDR (3)",
        "ADDR (shape)",
        "ADDR to MUXES (joint)",
        "ADDR to MARMUX (2)",
        "ADDR to MARMUX (3)",
        "1 (MARMUX selector)",
        "MARMUX selector",
        "MARMUX (shape)",               
        "1 (GateMARMUX)",
        "GateMARMUX selector",
        "GateMARMUX (shape)",
        "MARMUX to BUS",
        'Top Arrow',
        'Mid Arrow',
        'Low Arrow',
        'BUS to MAR',
        "1 (MAR selector)",
        'MAR selector',
        "MAR (shape)",
        //clock cycle 2
        'MAR to MEMORY',
        "0 (RW)",
        "RW selector",
        "1 (MEM.EN)",
        "MEM.EN selector",
        'Memory (shape)',
        'MEMORY to MDR',
        "1 (MDR selector)",
        'MDR selector',
        "MDR (shape)",
        //clock cycle 3
        "1 (GateMDR selector)",
        "GateMDR selector",
        "GateMDR (shape)",
        'MDR to BUS',
        'Low Arrow',
        'BUS to CC (1)',
            "logic (rect)",
            'BUS to CC (2)',
            "1 (LD.CC)",
            "CC selector",
            "N box",
            "Z box",
            "P box",
            "CC to FSM (1)",
            "CC to FSM (2)",
            "FSM (shape)",
            'Low Arrow',
        'Mid Arrow',
        'Top Arrow',
        "Bus to Register",
        "DR selector",
        "1 (LD.REG)",
        "LD.REG selector",
        "Register File (shape)"
    ]
    
    sequence.forEach((wireId, index) => {
        setTimeout(() => {
                activateWire(wireId);
        }, index * 350);
    });
}
 
function STR() {
    const sequence = [
        //clock cycle 1
        "IR to ZEXT/SEXT (1)",
        "IR to ZEXT/SEXT (2)",
        "Bus to SEXT [5:0]",
        "SEXT[5:0] (shape)",
        "SEXT6 to MUX (1)",
        "SEXT6 to MUX (2)",
        "01 (ADDR2MUX selector)",
        "ADDR2 selector",
        "ADDR2MUX (shape)",
        "ADDR2MUX to ADDR (1)",
        "ADDR2MUX to ADDR (2)",
        "ADDR2MUX to ADDR (3)",
        "Register to ALU (joint)",
        "SR1 to ADDR1MUX (1)",
        "SR1 to ADDR1MUX (2)",
        "1 (ADDR1MUX selector)",
        "ADDR1MUX selector",
        "ADDR1MUX (shape)",
        "ADDR1MUX to ADDR (1)",
        "ADDR1MUX to ADDR (2)",
        "ADDR1MUX to ADDR (3)",
        "ADDR (shape)",
        "ADDR to MUXES (joint)",
        "ADDR to MARMUX (2)",
        "ADDR to MARMUX (3)",
        "1 (MARMUX selector)",
        "MARMUX selector",
        "MARMUX (shape)",               
        "1 (GateMARMUX)",
        "GateMARMUX selector",
        "GateMARMUX (shape)",
        "MARMUX to BUS",
        'Top Arrow',
        'Mid Arrow',
        'Low Arrow',
        'BUS to MAR',
        "1 (MAR selector)",
        'MAR selector',
        "MAR (shape)",
        //clock cycle 2
        "SR2 selector",
        "Register to ALU (joint)",
        "11: PASS",
        "ALU selector",
        "ALU (shape)",
        "1 (Gate.ALU)",
        "GateALU (shape)",
        "ALU to BUS",
        'Low Arrow',
        "BUS to MDR",
        "0 (LD.MDR)",
        "MDR selector",
        //clock cycle 3
        "1 (RW)",
        "RW selector",
        "1 (MEM.EN)",
        "MEM.EN selector",
        "MAR to MEMORY",
        "MDR to MEMORY",
        'Memory (shape)'
    ]
    
    sequence.forEach((wireId, index) => {
        setTimeout(() => {
                activateWire(wireId);
        }, index * 350);
    });
}
 
function LEA() {
    const sequence = [
        //clock cycle 1
        'IR to ZEXT/SEXT (1)',
        'IR to ZEXT/SEXT (2)',
        "Bus to SEXT [8:0]", 
        "SEXT[8:0] (shape)",
        "SEXT9 to MUX (1)",
        "SEXT9 to MUX (2)",
        "10 (ADDR2MUX selector)",
        "ADDR2 selector",
        "ADDR2MUX (shape)",
        "ADDR2MUX to ADDR (1)",
        "ADDR2MUX to ADDR (2)",
        "ADDR2MUX to ADDR (3)",
        "PC to MUXES (joint line)",
        "PC to ADDR1MUX(1)", 
        "PC to ADDR1MUX(2)",
        "PC to ADDR1MUX(3)",
        "PC to ADDR1MUX(4)",
        "0 (ADDR1MUX selector)",
        "ADDR1MUX selector",
        "ADDR1MUX (shape)",
        "ADDR1MUX to ADDR (1)",
        "ADDR1MUX to ADDR (2)",
        "ADDR1MUX to ADDR (3)",
        "ADDR (shape)",
        "ADDR to MUXES (joint)",
        "ADDR to MARMUX (2)",
        "ADDR to MARMUX (3)",
        "1 (MARMUX selector)",
        "MARMUX selector",
        "MARMUX (shape)",               
        "1 (GateMARMUX)",
        "GateMARMUX selector",
        "GateMARMUX (shape)",
        "MARMUX to BUS",
        'Top Arrow',
        "Bus to Register",
        "DR selector",
        "1 (LD.REG)",
        "LD.REG selector",
        "Register File (shape)"
    ]

    sequence.forEach((wireId, index) => {
        setTimeout(() => {
                activateWire(wireId);
        }, index * 350);
    });
}
 
function BR() {
    const sequence = [
        'IR to ZEXT/SEXT (1)',
        'IR to ZEXT/SEXT (2)',
        "Bus to SEXT [8:0]", 
        "SEXT[8:0] (shape)",
        "SEXT9 to MUX (1)",
        "SEXT9 to MUX (2)",
        "10 (ADDR2MUX selector)",
        "ADDR2 selector",
        "ADDR2MUX (shape)",
        "ADDR2MUX to ADDR (1)",
        "ADDR2MUX to ADDR (2)",
        "ADDR2MUX to ADDR (3)",
        "PC to MUXES (joint line)",
        "PC to ADDR1MUX(1)", 
        "PC to ADDR1MUX(2)",
        "PC to ADDR1MUX(3)",
        "PC to ADDR1MUX(4)",
        "0 (ADDR1MUX selector)",
        "ADDR1MUX selector",
        "ADDR1MUX (shape)",
        "ADDR1MUX to ADDR (1)",
        "ADDR1MUX to ADDR (2)",
        "ADDR1MUX to ADDR (3)",
        "ADDR (shape)",
        "ADDR to MUXES (joint)",
        "ADDR to PCMUX (1)",
        "ADDR to PCMUX (2)",
        "ADDR to PCMUX (3)",
        "01 (PCMUX selector)",
        "PCMUX selector",
        "PCMUX (shape)",
        "PCMUX to PC",
        "1 (LD.PC)",
        "PC selector",
        "PC (shape)"
    ]

    sequence.forEach((wireId, index) => {
        setTimeout(() => {
            activateWire(wireId);
        }, index * 350);
    });
}
 
function JMP() {
    const sequence = [
        "Register to ALU (joint)",
        "SR1 to ADDR1MUX (1)",
        "SR1 to ADDR1MUX (2)",
        "1 (ADDR1MUX selector)",
        "ADDR1MUX selector",
        "ADDR1MUX (shape)",
        "ADDR1MUX to ADDR (1)",
        "ADDR1MUX to ADDR (2)",
        "ADDR1MUX to ADDR (3)",
        "00 ADDR2MUX input",
        "00 (ADDR2MUX selector)",
        "ADDR2 selector",
        "ADDR2MUX (shape)",
        "ADDR2MUX to ADDR (1)",
        "ADDR2MUX to ADDR (2)",
        "ADDR2MUX to ADDR (3)",
        "ADDR (shape)",
        "ADDR to MUXES (joint)",
        "ADDR to PCMUX (1)",
        "ADDR to PCMUX (2)",
        "ADDR to PCMUX (3)",
        "PCMUX selector",
        "PCMUX (shape)",
        "PCMUX to PC",
        "1 (LD.PC)",
        "PC selector",
        "PC (shape)"
    ]
    
    sequence.forEach((wireId, index) => {
        setTimeout(() => {
            activateWire(wireId);
        }, index * 250);
    });
}
 
function JSR() {
    const sequence = [
        //Clock Cycle 1: Updating R7
        "1 (GatePC)",
        "GatePC (shape)",
        'PC to BUS',      
        'Top Arrow',
        "Bus to Register",
        "1 (LD.REG)",
        "LD.REG selector",
        "Register File (shape)",

        //Clock Cycle 2
        'IR to ZEXT/SEXT (1)',
        'IR to ZEXT/SEXT (2)',
        "Bus to SEXT [10:0]",
        "SEXT[10:0] (shape)",
        "SEXT11 to MUX (1)",
        "SEXT11 to MUX (2)",
        "11 (ADDR2MUX selector)",
        "ADDR2 selector",
        "ADDR2MUX (shape)",
        "ADDR2MUX to ADDR (1)",
        "ADDR2MUX to ADDR (2)",
        "ADDR2MUX to ADDR (3)",
        "PC to MUXES (joint line)",
        "PC to ADDR1MUX(1)", 
        "PC to ADDR1MUX(2)",
        "PC to ADDR1MUX(3)",
        "PC to ADDR1MUX(4)",
        "0 (ADDR1MUX selector)",
        "ADDR1MUX selector",
        "ADDR1MUX (shape)",
        "ADDR1MUX to ADDR (1)",
        "ADDR1MUX to ADDR (2)",
        "ADDR1MUX to ADDR (3)",
        "ADDR (shape)",
        "ADDR to MUXES (joint)",
        "ADDR to PCMUX (1)",
        "ADDR to PCMUX (2)",
        "ADDR to PCMUX (3)",
        "PCMUX selector",
        "PCMUX (shape)",
        "PCMUX to PC",
        "1 (LD.PC)",
        "PC selector",
        "PC (shape)",
        
    ]

    sequence.forEach((wireId, index) => {
        setTimeout(() => {
            activateWire(wireId);
        }, index * 250);
    });
}

function JSRR() {
    const sequence = [
        //Clock Cycle 1: Updating R7
        "1 (GatePC)",
        "GatePC (shape)",
        'PC to BUS',      
        'Top Arrow',
        "Bus to Register",
        "1 (LD.REG)",
        "LD.REG selector",
        "Register File (shape)",

        //Clock Cycle 2
        "Register to ALU (joint)",
        "SR1 to ADDR1MUX (1)",
        "SR1 to ADDR1MUX (2)",
        "1 (ADDR1MUX selector)",
        "ADDR1MUX selector",
        "ADDR1MUX (shape)",
        "ADDR1MUX to ADDR (1)",
        "ADDR1MUX to ADDR (2)",
        "ADDR1MUX to ADDR (3)",
        "00 ADDR2MUX input",
        "00 (ADDR2MUX selector)",
        "ADDR2 selector",
        "ADDR2MUX (shape)",
        "ADDR2MUX to ADDR (1)",
        "ADDR2MUX to ADDR (2)",
        "ADDR2MUX to ADDR (3)",
        "ADDR (shape)",
        "ADDR to MUXES (joint)",
        "ADDR to PCMUX (1)",
        "ADDR to PCMUX (2)",
        "ADDR to PCMUX (3)",
        "PCMUX selector",
        "PCMUX (shape)",
        "PCMUX to PC",
        "1 (LD.PC)",
        "PC selector",
        "PC (shape)"
    ]

    sequence.forEach((wireId, index) => {
        setTimeout(() => {
            activateWire(wireId);
        }, index * 250);
    });
}

function TRAP() {
    const sequence = [
        //clock cycle 1
        'IR to ZEXT/SEXT (1)',
        'IR to ZEXT/SEXT (2)',
        "ZEXT shape",
        "ZEXT to MARMUX (1)",
        "ZEXT to MARMUX (2)",
        "ZEXT to MARMUX (3)",
        "1 (MARMUX selector)",
        "MARMUX selector",
        "MARMUX (shape)",               
        "1 (GateMARMUX)",
        "GateMARMUX selector",
        "GateMARMUX (shape)",
        "MARMUX to BUS",
        'Top Arrow',
        'Mid Arrow',
        'Low Arrow',
        'BUS to MAR',
        "1 (MAR selector)",
        'MAR selector',
        "MAR (shape)",
        //clock cycle 2
        'MAR to MEMORY',
        "0 (RW)",
        "RW selector",
        "1 (MEM.EN)",
        "MEM.EN selector",
        'Memory (shape)',
        'MEMORY to MDR',
        "1 (MDR selector)",
        'MDR selector',
        "MDR (shape)",
        //clock cycle 3
        "1 (GateMDR selector)",
        "GateMDR selector",
        "GateMDR (shape)",
        'MDR to BUS',
        'Low Arrow',
        'Mid Arrow',
        'Top Arrow',
        "Bus to PCMUX (1)",
        "Bus to PCMUX (2)",
        "Bus to PCMUX (3)",
        "10 (PCMUX selector)",
        "PCMUX selector",
        "PCMUX (shape)",
        "PCMUX to PC",
        "1 (LD.PC)",
        "PC selector",
        "PC (shape)",
        
    ]

    sequence.forEach((wireId, index) => {
        setTimeout(() => {
                activateWire(wireId);
        }, index * 300);
    });
}
