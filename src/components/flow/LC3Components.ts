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
        data: { 
            label: "PC",
            width: 120,
            height: 40,
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
        data: { 
            label: "+1",
            width: 50,
            height: 50, 
            orientation: 'up',
            componentType: 'extender'
        }
    },
    { 
        id: 'regFile',
        type: "logic",
        position: { x: 600, y: 100 },
        data: {
            label: 'Register File',
            width: 120,
            height: 180,
            componentType: "regfile"
        }
    },
    {
        id: 'zext8',
        type: "logic",
        position: { x: -250, y: 300 },
        data: { 
            label: 'ZEXT',
            width: 80,
            height: 35,
            orientation: 'up',
            componentType: 'extender'
        }
    },
    {
        id: 'sext5',
        type: "logic",
        position: { x: 200, y: 500 },
        data: {
            label: 'SEXT',
            width: 80,
            height: 35,
            componentType: 'extender'
        }
    },
    {
        id: 'sext6',
        type: "logic",
        position: { x: -150, y: 500 },
        data: {
            label: 'SEXT',
            width: 80,
            height: 35,
            componentType: 'extender'
        }
    },
    {
        id: 'sext9',
        type: "logic",
        position: { x: -150, y: 550 },
        data: {
            label: 'SEXT',
            width: 80,
            height: 35,
            componentType: 'extender'
        }
    },
    {
        id: 'sext11',
        type: "logic",
        position: { x: -150, y: 600 },
        data: {
            label: 'SEXT',
            width: 80,
            height: 35,
            componentType: 'extender'
        }
    },
    {
        id: 'ir',
        type: "logic",
        position: { x: -150, y: 700 },
        data: {
            label: 'IR',
            width: 120,
            height: 40,
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
        data: { 
            label: "Finite State Machine",
            width: 100,
            height: 200,
            componentType: "fsm"
        }
    },
    {
        id: 'sr2mux',
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
        data: { 
            label: "Logic",
            width: 80,
            height: 35,
            orientation: 'up',
            componentType: 'extender'
         }
    },
    {
        id: 'nzp',
        type: "logic",
        position: { x: 100, y: 650 },
        data: { 
            label: "NZP",
            width: 80,
            height: 35,
            orientation: "left",
            componentType: "register"
        }
    },
    {
        id: 'ioInput',
        type: "logic",
        position: { x: 350, y: 800 },
        data: {
            label: 'Input',
            width: 100,
            height: 50, 
            orientation: 'left'
        }
    },
    {
        id: 'ioOutput',
        type: "logic",
        position: { x: 500, y: 800 },
        data: {
            label: 'Output',
            width: 100,
            height: 50,
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
        data: {
            label: 'Memory',
            width: 150,
            height: 100,
            componentType: 'memory'
        },
    },
    {
        id: "mar",
        type: "logic",
        position: { x: 100, y: 750 },
        data: { 
            label: "MAR",
            width: 120,
            height: 40,
            orientation: 'left',
            componentType: 'register'
        }
    },
    {
        id: "mdr",
        type: "logic",
        position: { x: -300, y: 750 },
        data: { 
            label: "MDR",
            width: 120,
            height: 40, 
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
        height: 750
        }
    }
];

export const initialEdges: Edge[] = [
    //TODO: create all edges
    // example edge
    {
        id: 'e1',
        source: 'zext8',
        target: 'marMux',
        sourceHandle: 'output',
        targetHandle:  'input-0',
        type: 'step',
        animated: true
    },
];