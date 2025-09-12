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
            orientation: 'up',
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
        position: { x: -150, y: 500 },
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
        position: { x: -150, y: 600 },
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
        position: { x: 350, y: 800 },
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
        position: { x: 500, y: 800 },
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
        position: { x: 300, y: 900 },
        data: { 
            label: "SR1MUX",
            orientation: "right",
            selectorLeftUp: true}
    },
    {
        id: 'drmux',
        type: "mux",
        position: { x: 500, y: 900 },
        data: {
            label: "DRMUX",
            orientation: "right",
            selectorLeftUp: true}
    },
    {
        id: "memory",
        type: "logic",
        position: { x: -100, y: 800 },
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
        position: { x: 100, y: 750 },
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
        position: { x: -300, y: 750 },
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
        position: {x: -300, y: 825 },
        data: { label: "MDRMUX" }
    },
    {
        id: "gateMdr",
        type: "tristate",
        position: { x: -250, y: 700 },
        data: { label: "GateMDR" }
    },
    {
        id: "bus",
        type: "bus",
        position: { x: -150, y: 0 },
        data: {
            label: "Bus",
            width: 900,
            height: 750,
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
        id: 'pcMuxPc',
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
        id: 'e',
        source: 'zext8',
        target: 'marMux',
        sourceHandle: 'output',
        targetHandle:  'input-0',
        type: 'step',
        animated: true
    },

    //SEXT [10:0]
    

    //SEXT [8:0]

    //SEXT [5:0]

    //SEXT [4:0]

    /**
     * ALU EDGES  
     */

    //ALU

    //MAR ADDER

    // PC ADDER

    /**
     * REGISTER EDGES  
     */

    // MAR

    // MDR

    // IR

    // PC 

    // NZP

    // REG FILE

    /**
     * GATE EDGES  
     */

    // MAR

    // MDR

    // 

    /**
     * GATE EDGES  
     */

    // Gate ALU

    // Gate PC

    // Gate MARMUX

    // Gate MDR

    /**
     * LOGIC EDGES
     */

    // FSM

    // LOGIC

    /**
     * MEMORY EDGES
     */

    // Memory

    /**
     * I/O EDGES
     */

    // Input

    // Output

];