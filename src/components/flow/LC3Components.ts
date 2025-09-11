import type { LC3Node } from './types.d';
import type { Edge } from '@vue-flow/core';

export const initialNodes: LC3Node[] = [
    {
        id: "marMux",
        type: "mux",
        position: { x: -100, y: 100 },
        data: { label: "MARMUX" }
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
            height: 40
        }
    },
    { 
        id: "pcMux",
        type: "mux",
        position: { x: 200, y: 200 },
        data: { label: "PCMUX" }
    },
    { 
        id: "pcAdder",
        type: "logic",
        position: { x: 400, y: 150 },
        data: { 
            label: "+1",
            width: 50,
            height: 50 
        }
    },
    { 
        id: 'regFile',
        type: "logic",
        position: { x: 600, y: 100 },
        data: {
            label: 'Register File',
            width: 120,
            height: 180
        }
    },
    {
        id: 'zext8',
        type: "logic",
        position: { x: -250, y: 300 },
        data: { 
            label: 'ZEXT',
            width: 80,
            height: 35
        }
    },
    {
        id: 'sext5',
        type: "logic",
        position: { x: 200, y: 500 },
        data: {
            label: 'SEXT',
            width: 80,
            height: 35 
        }
    },
    {
        id: 'sext6',
        type: "logic",
        position: { x: -150, y: 500 },
        data: {
            label: 'SEXT',
            width: 80,
            height: 35 
        }
    },
    {
        id: 'sext9',
        type: "logic",
        position: { x: -150, y: 550 },
        data: {
            label: 'SEXT',
            width: 80,
            height: 35 
        }
    },
    {
        id: 'sext11',
        type: "logic",
        position: { x: -150, y: 600 },
        data: {
            label: 'SEXT',
            width: 80,
            height: 35 
        }
    },
    {
        id: 'ir',
        type: "logic",
        position: { x: -150, y: 700 },
        data: {
            label: 'IR',
            width: 120,
            height: 40  
        }
    },
    {
        id: 'marAdder',
        type: "alu",
        position: { x: 0, y: 300 },
        data: {label: '+'}
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
        data: { label: 'ADDR2MUX' }
    },
    {
        id: 'fsm',
        type: "logic",
        position: { x: 300, y: 500 },
        data: { 
            label: "Finite State Machine",
            width: 100,
            height: 200,
            padding: 15
        }
    },
    {
        id: 'sr2mux',
        type: "mux",
        position: { x: 550, y: 500 },
        data: { label: "SR2MUX" }
    },
    {
        id: 'alu',
        type: "alu",
        position: { x: 600, y: 600  },
        data: { label: "ALU" }
    },
    {
        id: 'gateAlu',
        type: 'tristate',
        position: { x: 600, y: 700 },
        data: { label: "GateALU" }
    },
    {
        id: 'logic',
        type: "logic",
        position: { x: 100, y: 700},
        data: { 
            label: "Logic",
            width: 80,
            height: 35 
         }
    },
    {
        id: 'nzp',
        type: "logic",
        position: { x: 100, y: 650 },
        data: { 
            label: "NZP",
            width: 80,
            height: 35 
        }
    },
    {
        id: 'ioInput',
        type: "logic",
        position: { x: 350, y: 800 },
        data: {
            label: 'Input',
            width: 100,
            height: 50
        }
    },
    {
        id: 'ioOutput',
        type: "logic",
        position: { x: 500, y: 800 },
        data: {
            label: 'Output',
            width: 100,
            height: 50
        }
    },
    {
        id: 'sr1Mux',
        type: "mux",
        position: { x: 300, y: 900 },
        data: { label: "SR1MUX" }
    },
    {
        id: 'drmux',
        type: "mux",
        position: { x: 500, y: 900 },
        data: { label: "DRMUX" }
    },
    {
        id: "memory",
        type: "logic",
        position: { x: -100, y: 800 },
        data: {
            label: 'Memory',
            width: 150,
            height: 100},
    },
    {
        id: "mar",
        type: "logic",
        position: { x: 100, y: 750 },
        data: { 
            label: "MAR",
            width: 120,
            height: 40
        }
    },
    {
        id: "mdr",
        type: "logic",
        position: { x: -300, y: 750 },
        data: { 
            label: "MDR",
            width: 120,
            height: 40
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
    {
        id: 'e1',
        source: 'gateMarMux',
        target: 'marMux',
        type: 'step',
        animated: true
    },
    {
        id: 'e2', 
        source: 'pc',
        target: 'gatePc',
        type: 'step',
        animated: true
    },
    {
        id: 'e3',
        source: 'pcMux',
        target: 'pc',
        type: 'step',
        animated: true
    },
    {
        id: 'e4',
        source: 'pc',
        target: 'pcAdder',
        type: 'step',
        animated: true
    },
    {
        id: 'e5',
        source: 'pcAdder',
        target: 'pcMux',
        type: 'step',
        animated: true
    },
    {
        id: 'e6',
        source: 'regFile',
        target: 'sr2mux',
        type: 'step',
        animated: true
    },
    {
        id: 'e7',
        source: 'sr2mux',
        target: 'alu',
        type: 'step',
        animated: true
    },
    {
        id: 'e8',
        source: 'alu',
        target: 'gateAlu',
        type: 'step',
        animated: true
    },
    {
        id: 'e9',
        source: 'addr1Mux',
        target: 'marAdder',
        type: 'step',
        animated: true
    },
    {
        id: 'e10',
        source: 'addr2Mux',
        target: 'marAdder',
        type: 'step',
        animated: true
    },
    {
        id: 'e11',
        source: 'sext5',
        target: 'addr2Mux',
        type: 'step',
        animated: true
    },
    {
        id: 'e12',
        source: 'sext6',
        target: 'addr2Mux',
        type: 'step',
        animated: true
    },
    {
        id: 'e13',
        source: 'sext9',
        target: 'addr2Mux',
        type: 'step',
        animated: true
    },
    {
        id: 'e14',
        source: 'sext11',
        target: 'addr2Mux',
        type: 'step',
        animated: true
    },
    {
        id: 'e15',
        source: 'ir',
        target: 'sext5',
        type: 'step',
        animated: true
    },
    {
        id: 'e16',
        source: 'ir',
        target: 'sext6',
        type: 'step',
        animated: true
    },
    {
        id: 'e17',
        source: 'ir',
        target: 'sext9',
        type: 'step',
        animated: true
    },
    {
        id: 'e18',
        source: 'ir',
        target: 'sext11',
        type: 'step',
        animated: true
    },
    {
        id: 'e19',
        source: 'memory',
        target: 'mdrMux',
        type: 'step',
        animated: true
    },
    {
        id: 'e20',
        source: 'mdrMux',
        target: 'mdr',
        type: 'step',
        animated: true
    },
    {
        id: 'e21',
        source: 'mdr',
        target: 'gateMdr',
        type: 'step',
        animated: true
    }
];