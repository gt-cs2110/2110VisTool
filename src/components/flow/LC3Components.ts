import type { LC3Node } from './types.d';
import type { Edge } from '@vue-flow/core';

export const initialNodes: LC3Node[] = [
    {
        id: "marMux",
        type: "mux",
        position: { x: -100, y: 100 },
        data: {
            label: "MARMUX",
            selectorLeftUp: true}
    },
    {
        id: "gateMarMux",
        type: "tristate",
        position: { x: -25, y: 0 },
        data: { label: "GateMARMUX" }
    },
    {
        id: "gatePc",
        type: "tristate",
        position: { x: 250, y: 0 },
        data: { label: "GatePC" }
    },
    { 
        id: "pc",
        type: "logic",
        position: { x: 200, y: 100 },
        width: 120,
        height: 40,
        data: { 
            label: "PC",
            componentType: 'register'
        }
    },
    { 
        id: "pcMux",
        type: "mux",
        position: { x: 200, y: 200 },
        data: { 
            label: "PCMUX",
            inputSize: 3,
            selectorLeftUp: true}
    },
    { 
        id: "pcAdder",
        type: "logic",
        position: { x: 400, y: 150 },
        width: 50,
        height: 50, 
        data: { 
            label: "+1",
            orientation: 'down',
            componentType: 'extender'
        }
    },
    { 
        id: 'regFile',
        type: "logic",
        position: { x: 600, y: 100 },
        width: 120,
        height: 180,
        data: {
            label: 'Register File',
            componentType: "regfile"
        }
    },
    {
        id: 'zext8',
        type: "logic",
        position: { x: -250, y: 300 },
        width: 80,
        height: 35,
        data: { 
            label: 'ZEXT',
            orientation: 'up',
            componentType: 'extender'
        }
    },
    {
        id: 'sext5',
        type: "logic",
        position: { x: 200, y: 500 },
        width: 80,
        height: 35,
        data: {
            label: 'SEXT',
            componentType: 'extender'
        }
    },
    {
        id: 'sext6',
        type: "logic",
        position: { x: -150, y: 600 },
        width: 80,
        height: 35,
        data: {
            label: 'SEXT',
            componentType: 'extender'
        }
    },
    {
        id: 'sext9',
        type: "logic",
        position: { x: -150, y: 550 },
        width: 80,
        height: 35,
        data: {
            label: 'SEXT',
            componentType: 'extender'
        }
    },
    {
        id: 'sext11',
        type: "logic",
        position: { x: -150, y: 500 },
        width: 80,
        height: 35,
        data: {
            label: 'SEXT',
            componentType: 'extender'
        }
    },
    {
        id: 'ir',
        type: "logic",
        position: { x: -150, y: 700 },
        width: 120,
        height: 40,
        data: {
            label: 'IR',
            componentType: "register"
        }
    },
    {
        id: 'marAdder',
        type: "alu",
        position: { x: 0, y: 300 },
        data: { label: '+' }
    },
    {
        id: 'addr1Mux',
        type: "mux",
        position: { x: 100, y: 400 },
        data: { label: 'ADDR1MUX' }
    },
    {
        id: 'addr2Mux',
        type: "mux",
        position: { x: -100, y: 400 },
        data: {
            label: 'ADDR2MUX',
            inputSize: 4,
            selectorLeftUp: true}
    },
    {
        id: 'fsm',
        type: "logic",
        position: { x: 300, y: 500 },
        width: 100,
        height: 200,
        data: { 
            label: "Finite State Machine",
            componentType: "fsm"
        }
    },
    {
        id: 'sr2Mux',
        type: "mux",
        position: { x: 550, y: 500 },
        data: { 
            label: "SR2MUX",
            orientation: 'down',
        }
    },
    {
        id: 'alu',
        type: "alu",
        position: { x: 600, y: 600  },
        data: {
            label: "ALU",
            orientation: "down",
            selector: true
        }
    },
    {
        id: 'gateAlu',
        type: 'tristate',
        position: { x: 600, y: 700 },
        data: { 
            label: "GateALU",
            orientation: "down"
        }
    },
    {
        id: 'logic',
        type: "logic",
        position: { x: 100, y: 700},
        width: 80,
        height: 35,
        data: { 
            label: "Logic",
            orientation: 'up',
            componentType: 'extender'
         }
    },
    {
        id: 'nzp',
        type: "logic",
        position: { x: 100, y: 650 },
        width: 80,
        height: 35,
        data: { 
            label: "NZP",
            orientation: "left",
            componentType: "register"
        }
    },
    {
        id: 'ioInput',
        type: "logic",
        position: { x: 350, y: 900 },
        width: 100,
        height: 50, 
        data: {
            label: 'Input',
            orientation: 'left'
        }
    },
    {
        id: 'ioOutput',
        type: "logic",
        position: { x: 500, y: 900 },
        width: 100,
        height: 50,
        data: {
            label: 'Output',
            orientation: 'left'
        }
    },
    {
        id: 'sr1Mux',
        type: "mux",
        position: { x: 300, y: 1000 },
        data: { 
            label: "SR1MUX",
            orientation: "right",
            selectorLeftUp: true}
    },
    {
        id: 'drmux',
        type: "mux",
        position: { x: 500, y: 1000 },
        data: {
            label: "DRMUX",
            orientation: "right",
            selectorLeftUp: true}
    },
    {
        id: "memory",
        type: "logic",
        position: { x: -100, y: 900 },
        width: 150,
        height: 100,
        data: {
            label: 'Memory',
            componentType: 'memory'
        },
    },
    {
        id: "mar",
        type: "logic",
        position: { x: 100, y: 900 },
        width: 120,
        height: 40,
        data: { 
            label: "MAR",
            orientation: 'left',
            componentType: 'register'
        }
    },
    {
        id: "mdr",
        type: "logic",
        position: { x: -300, y: 925 },
        width: 120,
        height: 40, 
        data: { 
            label: "MDR",
            componentType: 'mdr'
        }
    },
    {
        id: "mdrMux",
        type: "mux",
        position: {x: -300, y: 1000 },
        data: { label: "MDRMUX" }
    },
    {
        id: "gateMdr",
        type: "tristate",
        position: { x: -200, y: 850 },
        data: { label: "GateMDR" }
    },
    {
        id: "bus",
        type: "bus",
        position: { x: -400, y: -25 },
        data: {
            label: "Bus",
            width: 1200,
            height: 850,
        }
    }
];

/**
 * Initial edges that connect LC3 Components together.
 * 
 * Edges are grouped by type of component. An edge is listed
 * under a specific component if it is a source.
 * 
 * id: sourceIdTargetId
 */

export const initialEdges: Edge[] = [
    /**
     * MUX EDGES 
     */

    // ADDR1MUX
    {
        id: 'addr1MuxMarAdder',
        source: 'addr1Mux',
        target: 'marAdder',
        sourceHandle: 'output',
        targetHandle:  'input-a',
        type: 'step',
        animated: true
    },

    // ADDR2MUX
    {
        id: 'addr2Mux',
        source: 'addr2Mux',
        target: 'marAdder',
        sourceHandle: 'output',
        targetHandle:  'input-b',
        type: 'step',
        animated: true
    },

    // MARMUX
    {
        id: 'marMuxgateMarMux',
        source: 'marMux',
        target: 'gateMarMux',
        sourceHandle: 'output',
        targetHandle:  'input',
        type: 'step',
        animated: true
    },

    // MDRMUX
    {
        id: 'mdrMuxmdr',
        source: 'mdrMux',
        target: 'mdr',
        sourceHandle: 'output',
        targetHandle:  'input',
        type: 'step',
        animated: true
    },

    // PCMUX
    {
        id: 'pcMux',
        source: 'pcMux',
        target: 'pc',
        sourceHandle: 'output',
        targetHandle:  'input',
        type: 'step',
        animated: true
    },

    // SR1MUX
    // TODO: Needs text labels

    // SR2MUX
    {
        id: 'sr2MuxAlu',
        source: 'sr2Mux',
        target: 'alu',
        sourceHandle: 'output',
        targetHandle:  'input-b',
        type: 'step',
        animated: true
    },

    // DR MUX
    // TODO: Needs text labels

    /**
     * EXTENDER EDGES  
     */

    //ZEXT
    {
        id: 'zext8MarMux',
        source: 'zext8',
        target: 'marMux',
        sourceHandle: 'output',
        targetHandle:  'input-0',
        type: 'step',
        animated: true
    },

    //SEXT [10:0]
    {
        id: 'sext11Addr2Mux',
        source: 'sext11',
        target: 'addr2Mux',
        sourceHandle: 'output',
        targetHandle:  'input-0',
        type: 'step',
        animated: true
    },

    //SEXT [8:0]
    {
        id: 'sext9Addr2Mux',
        source: 'sext9',
        target: 'addr2Mux',
        sourceHandle: 'output',
        targetHandle:  'input-1',
        type: 'step',
        animated: true
    },

    //SEXT [5:0]
    {
        id: 'sext6Addr2Mux',
        source: 'sext6',
        target: 'addr2Mux',
        sourceHandle: 'output',
        targetHandle:  'input-2',
        type: 'step',
        animated: true
    },

    //SEXT [4:0]
    {
        id: 'sext10Sr2Mux',
        source: 'sext5',
        target: 'sr2Mux',
        sourceHandle: 'output',
        targetHandle:  'input-0',
        type: 'step',
        animated: true
    },

    /**
     * ALU EDGES  
     */

    //ALU
    {
        id: 'aluGateAlu',
        source: 'alu',
        target: 'gateAlu',
        sourceHandle: 'output',
        targetHandle:  'input',
        type: 'step',
        animated: true
    },

    //MAR ADDER
    {
        id: 'marAdderMarMux',
        source: 'marAdder',
        target: 'marMux',
        sourceHandle: 'output',
        targetHandle:  'input-1',
        type: 'step',
        animated: true
    },
    {
        id: 'marAdderPcMux',
        source: 'marAdder',
        target: 'pcMux',
        sourceHandle: 'output',
        targetHandle:  'input-1',
        type: 'step',
        animated: true
    },

    // PC ADDER
    {
        id: 'pcAdderPcMux',
        source: 'pcAdder',
        target: 'pcMux',
        sourceHandle: 'output',
        targetHandle:  'input-2',
        type: 'step',
        animated: true
    },

    /**
     * REGISTER EDGES  
     */

    // MAR
    {
        id: 'marMemory',
        source: 'mar',
        target: 'memory',
        sourceHandle: 'output',
        targetHandle:  'mar-in',
        type: 'step',
        animated: true
    },

    // MDR
    {
        id: 'mdrMemory',
        source: 'mdr',
        target: 'memory',
        sourceHandle: 'mem-output',
        targetHandle:  'mdr-in',
        type: 'step',
        animated: true
    },
    {
        id: 'mdrGateMdr',
        source: 'mdr',
        target: 'gateMdr',
        sourceHandle: 'gate-mdr',
        targetHandle:  'input',
        type: 'step',
        animated: true
    },

    // IR
    {
        id: 'irZext8',
        source: 'ir',
        target: 'zext8',
        sourceHandle: 'output',
        targetHandle:  'input',
        type: 'step',
        animated: true
    },
    {
        id: 'irSext5',
        source: 'ir',
        target: 'sext5',
        sourceHandle: 'output',
        targetHandle:  'input',
        type: 'step',
        animated: true
    },
    {
        id: 'irSext6',
        source: 'ir',
        target: 'sext6',
        sourceHandle: 'output',
        targetHandle:  'input',
        type: 'step',
        animated: true
    },
    {
        id: 'irSext9',
        source: 'ir',
        target: 'sext9',
        sourceHandle: 'output',
        targetHandle:  'input',
        type: 'step',
        animated: true
    },
    {
        id: 'irSext11',
        source: 'ir',
        target: 'sext11',
        sourceHandle: 'output',
        targetHandle:  'input',
        type: 'step',
        animated: true
    },
    {
        id: 'irSr2Mux',
        source: 'ir',
        target: 'sr2Mux',
        sourceHandle: 'output',
        targetHandle:  'selector',
        type: 'step',
        animated: true
    },
    {
        id: 'irFsm',
        source: 'ir',
        target: 'fsm',
        sourceHandle: 'output',
        targetHandle:  'ir-15-9',
        type: 'step',
        animated: true
    },

    // PC
    {
        id: 'pcAdderPc',
        source: 'pc',
        target: 'pcAdder',
        sourceHandle: 'output',
        targetHandle:  'input',
        type: 'step',
        animated: true
    },
    {
        id: 'pcGatePc',
        source: 'pc',
        target: 'gatePc',
        sourceHandle: 'output',
        targetHandle:  'input',
        type: 'step',
        animated: true
    },
    {
        id: 'pcAddr1Mux',
        source: 'pc',
        target: 'addr1Mux',
        sourceHandle: 'output',
        targetHandle:  'input-1',
        type: 'step',
        animated: true
    },

    // NZP
    {
        id: 'nzp',
        source: 'nzp',
        target: 'fsm',
        sourceHandle: 'input',
        targetHandle:  'nzp',
        type: 'step',
        animated: true
    },

    // REG FILE
    {
        id: 'regFileSr2Mux',
        source: 'regFile',
        target: 'sr2Mux',
        sourceHandle: 'sr2mux',
        targetHandle:  'input-1',
        type: 'step',
        animated: true
    },
    {
        id: 'regFileAlu',
        source: 'regFile',
        target: 'alu',
        sourceHandle: 'alu',
        targetHandle:  'input-a',
        type: 'step',
        animated: true
    },
    {
        id: 'regFileAddr1Mux',
        source: 'regFile',
        target: 'addr1Mux',
        sourceHandle: 'alu',
        targetHandle:  'input-0',
        type: 'step',
        animated: true
    },

    /**
     * GATE EDGES
     *
     * TODO: Create Bus handles 
     */

    // Gate ALU
    {
        id: 'gateAluBus',
        source: 'gateAlu',
        target: 'bus',
        sourceHandle: 'output',
        targetHandle:  'gateAlu',
        type: 'step',
        animated: true
    },

    // Gate PC
    {
        id: 'gatePc',
        source: 'gatePc',
        target: 'bus',
        sourceHandle: 'output',
        targetHandle:  'gatePc',
        type: 'step',
        animated: true
    },
    // Gate MARMUX
    {
        id: 'gateMarMux',
        source: 'gateMarMux',
        target: 'bus',
        sourceHandle: 'output',
        targetHandle:  'gateMarMux',
        type: 'step',
        animated: true
    },

    // Gate MDR
    {
        id: 'gateMdr',
        source: 'gateMdr',
        target: 'bus',
        sourceHandle: 'output',
        targetHandle:  'gateMdr',
        type: 'step',
        animated: true
    },

    /**
     * LOGIC EDGES
     */

    // FSM
    {
        id: 'fsmAlu',
        source: 'fsm',
        target: 'alu',
        sourceHandle: 'aluk',
        targetHandle:  'selector',
        type: 'step',
        animated: true
    },

    // LOGIC
    {
        id: 'logicNzp',
        source: 'logic',
        target: 'nzp',
        sourceHandle: 'output',
        targetHandle:  'input',
        type: 'step',
        animated: true
    },
    
    /**
     * MEMORY EDGES
     */

    // Memory
    {
        id: 'memoryMdrMux',
        source: 'memory',
        target: 'mdrMux',
        sourceHandle: 'mdr-out',
        targetHandle:  'input-1',
        type: 'step',
        animated: true
    },

    /**
     * I/O EDGES
     */

    // Input
    {
        id: 'inputBus',
        source: 'ioInput',
        target: 'bus',
        sourceHandle: 'input',
        targetHandle:  'input',
        type: 'step',
        animated: true
    },

    // Output
    {
        id: 'outputBus',
        source: 'ioOutput',
        target: 'bus',
        sourceHandle: 'input',
        targetHandle:  'output',
        type: 'step',
        animated: true
    },

    /**
     * BUS EDGES
     */

    {
        id: 'busPcMux',
        source: 'bus',
        target: 'pcMux',
        sourceHandle: 'pcMux',
        targetHandle:  'input-0',
        type: 'step',
        animated: true
    },
    {
        id: 'busRegFile',
        source: 'bus',
        target: 'regFile',
        sourceHandle: 'regFile',
        targetHandle:  'bus',
        type: 'step',
        animated: true
    },
    {
        id: 'busMdrMux',
        source: 'bus',
        target: 'mdrMux',
        sourceHandle: 'mdrMux',
        targetHandle:  'input-0',
        type: 'step',
        animated: true
    },
    {
        id: 'busIr',
        source: 'bus',
        target: 'ir',
        sourceHandle: 'ir',
        targetHandle:  'input',
        type: 'step',
        animated: true
    },
    {
        id: 'busLogic',
        source: 'bus',
        target: 'logic',
        sourceHandle: 'logic',
        targetHandle:  'input',
        type: 'step',
        animated: true
    },
    {
        id: 'busMar',
        source: 'bus',
        target: 'mar',
        sourceHandle: 'mar',
        targetHandle:  'input',
        type: 'step',
        animated: true
    },
];