import type { LC3Node } from './types.d';
import { Position, type Edge } from '@vue-flow/core';

export namespace Consts {
    /**
     * Number of pixels in grid gap.
     */
    export const GRID_GAP_SIZE = 20;

    /**
     * Slant for the diagonal edge of ALU/Mux.
     */
    export const ALU_SLANT = 0.8;

    export const BUS_DIMS = {
        width: 55 * GRID_GAP_SIZE,
        height: 40 * GRID_GAP_SIZE,
    }
    
    /**
     * Dimensions of a generic node.
     * 
     * For logic, this is the width/height of the rectangle.
     * For muxes, the width is the long side 
     *     and the height is the short side.
     */
    export const DEFAULT_NODE_DIMS = {
        width:  6 * GRID_GAP_SIZE,
        height: 2 * GRID_GAP_SIZE,
    }

    /**
     * Dimensions of an ALU/adder.
     */
    export const ALU_DIMS = {
        width:  9 * GRID_GAP_SIZE,
        height: 2 * GRID_GAP_SIZE,
    }

    /**
     * Dimensions of tristate.
     * Note that the tristate buffer tries to fit in a square of TRISTATE_SIZE x TRISTATE_SIZE,
     * and does not try to be an equilateral triangle.
     */
    export const TRISTATE_DIMS = {
        width:  GRID_GAP_SIZE,
        height: GRID_GAP_SIZE
    }

    /**
     * Dimensions of the PC [+1] adder logic.
     */
    export const PC_ADDER_DIMS = {
        width:  3 * GRID_GAP_SIZE,
        height: 3 * GRID_GAP_SIZE
    }

    /**
     * Dimensions of sign extenders.
     */
    export const SEXT_NODE_DIMS = {
        width: 4 * GRID_GAP_SIZE,
        height: DEFAULT_NODE_DIMS.height
    }

    /**
     * Dimensions of a generic node.
     * 
     * For logic, this is the width/height of the rectangle.
     * For muxes, the width is the long side 
     *     and the height is the short side.
     */
    export const IO_NODE_DIMS = DEFAULT_NODE_DIMS;

    /**
     * Dimensions for CC/NZP nodes.
     */
    export const CC_NODE_DIMS = {
        width: 4 * GRID_GAP_SIZE,
        height: DEFAULT_NODE_DIMS.height
    }

    /**
     * Dimensions for register file.
     */
    export const REG_FILE_DIMS = {
        width: 6 * GRID_GAP_SIZE,
        height: 9 * GRID_GAP_SIZE
    }

    /**
     * Dimensions for finite state machine.
     */
    export const FSM_DIMS = {
        width: 5 * GRID_GAP_SIZE,
        height: 10 * GRID_GAP_SIZE
    }

    /**
     * Dimensions for memory.
     */
    export const MEMORY_DIMS = {
        width: 8 * GRID_GAP_SIZE,
        height: 5 * GRID_GAP_SIZE
    }
}

export const initialNodes: LC3Node[] = [
    {
        id: "bus",
        type: "bus",
        position: { x: 0, y: 0 },
        ...Consts.BUS_DIMS,
        draggable: false,
        data: {
            label: "Bus",
            handles: [
                // Top handles
                { side: Position.Top, lineSide: Position.Bottom, distance: 13 * Consts.GRID_GAP_SIZE, handle: "target", id: "gateMarMux" },
                { side: Position.Top, lineSide: Position.Bottom, distance: 24 * Consts.GRID_GAP_SIZE, handle: "source", id: "pcMux" },
                { side: Position.Top, lineSide: Position.Bottom, distance: 32 * Consts.GRID_GAP_SIZE, handle: "target", id: "gatePc" },
                { side: Position.Top, lineSide: Position.Bottom, distance: 48 * Consts.GRID_GAP_SIZE, handle: "source", id: "regFile" },
                // Bottom handles
                { side: Position.Bottom, lineSide: Position.Top, distance: 4 * Consts.GRID_GAP_SIZE, handle: "source", id: "ir" },
                { side: Position.Bottom, lineSide: Position.Bottom, distance: 6 * Consts.GRID_GAP_SIZE, handle: "target", id: "mdrMux" },
                { side: Position.Bottom, lineSide: Position.Bottom, distance: 12 * Consts.GRID_GAP_SIZE, handle: "source", id: "gateMdr" },
                { side: Position.Bottom, lineSide: Position.Top, distance: 24 * Consts.GRID_GAP_SIZE, handle: "source", id: "ccLogic" },
                { side: Position.Bottom, lineSide: Position.Bottom, distance: 32 * Consts.GRID_GAP_SIZE, handle: "source", id: "mar" },
                { side: Position.Bottom, lineSide: Position.Bottom, distance: 45 * Consts.GRID_GAP_SIZE, handle: "target", id: "ioInput" },
                { side: Position.Bottom, lineSide: Position.Top, distance: 46.5 * Consts.GRID_GAP_SIZE, handle: "target", id: "gateAlu" },
                { side: Position.Bottom, lineSide: Position.Bottom, distance: 52 * Consts.GRID_GAP_SIZE, handle: "source", id: "ioOutput" }
            ]
        }
    },
    {
        id: "marMux",
        type: "mux",
        position: { x: 10 * Consts.GRID_GAP_SIZE, y: 5 * Consts.GRID_GAP_SIZE },
        ...Consts.DEFAULT_NODE_DIMS,
        data: {
            label: "MARMUX",
            selectorLeftUp: true}
    },
    {
        id: "gateMarMux",
        type: "tristate",
        position: { x: 12.5 * Consts.GRID_GAP_SIZE, y: 2 * Consts.GRID_GAP_SIZE },
        ...Consts.TRISTATE_DIMS,
        data: { label: "GateMARMUX" }
    },
    {
        id: "gatePc",
        type: "tristate",
        position: { x: 31.5 * Consts.GRID_GAP_SIZE, y: 2 * Consts.GRID_GAP_SIZE },
        ...Consts.TRISTATE_DIMS,
        data: { label: "GatePC" }
    },
    { 
        id: "pc",
        type: "logic",
        position: { x: 29 * Consts.GRID_GAP_SIZE, y: 5 * Consts.GRID_GAP_SIZE },
        ...Consts.DEFAULT_NODE_DIMS,
        data: { 
            label: "PC",
            componentType: 'register'
        }
    },
    { 
        id: "pcMux",
        type: "mux",
        position: { x: 29 * Consts.GRID_GAP_SIZE, y: 10 * Consts.GRID_GAP_SIZE },
        ...Consts.DEFAULT_NODE_DIMS,
        data: { 
            label: "PCMUX",
            inputSize: 3,
            selectorLeftUp: true}
    },
    { 
        id: "pcAdder",
        type: "logic",
        position: { x: 36 * Consts.GRID_GAP_SIZE, y: 5 * Consts.GRID_GAP_SIZE },
        ...Consts.PC_ADDER_DIMS,
        data: { 
            label: "+1",
            orientation: 'down',
            componentType: 'extender'
        }
    },
    { 
        id: 'regFile',
        type: "logic",
        position: { x: 45 * Consts.GRID_GAP_SIZE, y: 4 * Consts.GRID_GAP_SIZE },
        ...Consts.REG_FILE_DIMS,
        data: {
            label: 'Register File',
            componentType: "regfile"
        }
    },
    {
        id: 'zext8',
        type: "logic",
        position: { x: 2 * Consts.GRID_GAP_SIZE, y: 15 * Consts.GRID_GAP_SIZE },
        ...Consts.SEXT_NODE_DIMS,
        data: { 
            label: 'ZEXT',
            orientation: 'up',
            componentType: 'extender'
        }
    },
    {
        id: 'sext5',
        type: "logic",
        position: { x: 16 * Consts.GRID_GAP_SIZE, y: 29 * Consts.GRID_GAP_SIZE },
        ...Consts.SEXT_NODE_DIMS,
        data: {
            label: 'SEXT',
            componentType: 'extender'
        }
    },
    {
        id: 'sext6',
        type: "logic",
        position: { x: 6 * Consts.GRID_GAP_SIZE, y: 26 * Consts.GRID_GAP_SIZE },
        ...Consts.SEXT_NODE_DIMS,
        data: {
            label: 'SEXT',
            componentType: 'extender'
        }
    },
    {
        id: 'sext9',
        type: "logic",
        position: { x: 6 * Consts.GRID_GAP_SIZE, y: 24 * Consts.GRID_GAP_SIZE },
        ...Consts.SEXT_NODE_DIMS,
        data: {
            label: 'SEXT',
            componentType: 'extender'
        }
    },
    {
        id: 'sext11',
        type: "logic",
        position: { x: 6 * Consts.GRID_GAP_SIZE, y: 22 * Consts.GRID_GAP_SIZE },
        ...Consts.SEXT_NODE_DIMS,
        data: {
            label: 'SEXT',
            componentType: 'extender'
        }
    },
    {
        id: 'ir',
        type: "logic",
        position: { x: 1 * Consts.GRID_GAP_SIZE, y: 35 * Consts.GRID_GAP_SIZE },
        ...Consts.DEFAULT_NODE_DIMS,
        data: {
            label: 'IR',
            componentType: "register"
        }
    },
    {
        id: 'marAdder',
        type: "alu",
        position: { x: 15 * Consts.GRID_GAP_SIZE, y: 15 * Consts.GRID_GAP_SIZE },
        ...Consts.ALU_DIMS,
        data: { label: '+' }
    },
    {
        id: 'addr1Mux',
        type: "mux",
        position: { x: 20 * Consts.GRID_GAP_SIZE, y: 19.5 * Consts.GRID_GAP_SIZE },
        ...Consts.DEFAULT_NODE_DIMS,
        data: { label: 'ADDR1MUX' }
    },
    {
        id: 'addr2Mux',
        type: "mux",
        position: { x: 12.5 * Consts.GRID_GAP_SIZE, y: 19.5 * Consts.GRID_GAP_SIZE },
        ...Consts.DEFAULT_NODE_DIMS,
        data: {
            label: 'ADDR2MUX',
            inputSize: 4,
            selectorLeftUp: true}
    },
    {
        id: 'fsm',
        type: "logic",
        position: { x: 30 * Consts.GRID_GAP_SIZE, y: 29 * Consts.GRID_GAP_SIZE },
        ...Consts.FSM_DIMS,
        data: { 
            label: "Finite State Machine",
            componentType: "fsm"
        }
    },
    {
        id: 'sr2Mux',
        type: "mux",
        position: { x: 41 * Consts.GRID_GAP_SIZE, y: 27.5 * Consts.GRID_GAP_SIZE },
        ...Consts.DEFAULT_NODE_DIMS,
        data: { 
            label: "SR2MUX",
            orientation: 'down',
        }
    },
    {
        id: 'alu',
        type: "alu",
        position: { x: 42 * Consts.GRID_GAP_SIZE, y: 31 * Consts.GRID_GAP_SIZE },
        ...Consts.ALU_DIMS,
        data: {
            label: "ALU",
            orientation: "down",
            selector: true
        }
    },
    {
        id: 'gateAlu',
        type: 'tristate',
        position: { x: 46 * Consts.GRID_GAP_SIZE, y: 35 * Consts.GRID_GAP_SIZE },
        ...Consts.TRISTATE_DIMS,
        data: { 
            label: "GateALU",
            orientation: "down"
        }
    },
    {
        id: 'ccLogic',
        type: "logic",
        position: { x: 22 * Consts.GRID_GAP_SIZE, y: 36 * Consts.GRID_GAP_SIZE },
        ...Consts.CC_NODE_DIMS,
        data: { 
            label: "CC Logic",
            orientation: 'up',
            componentType: 'extender'
         }
    },
    {
        id: 'nzp',
        type: "logic",
        position: { x: 22 * Consts.GRID_GAP_SIZE, y: 33.5 * Consts.GRID_GAP_SIZE },
        ...Consts.CC_NODE_DIMS,
        data: { 
            label: "NZP",
            orientation: "right",
            componentType: "register"
        }
    },
    {
        id: 'ioInput',
        type: "logic",
        position: { x: 42 * Consts.GRID_GAP_SIZE, y: 45 * Consts.GRID_GAP_SIZE },
        ...Consts.IO_NODE_DIMS,
        data: {
            label: 'Input',
            orientation: 'left'
        }
    },
    {
        id: 'ioOutput',
        type: "logic",
        position: { x: 49 * Consts.GRID_GAP_SIZE, y: 45 * Consts.GRID_GAP_SIZE },
        ...Consts.IO_NODE_DIMS,
        data: {
            label: 'Output',
            orientation: 'left'
        }
    },
    {
        id: 'sr1Mux',
        type: "mux",
        position: { x: 42 * Consts.GRID_GAP_SIZE, y: 50 * Consts.GRID_GAP_SIZE },
        // Inverted because rotated 90
        width: Consts.DEFAULT_NODE_DIMS.height,
        height: Consts.DEFAULT_NODE_DIMS.width,
        data: { 
            label: "SR1MUX",
            orientation: "right",
            selectorLeftUp: true}
    },
    {
        id: 'drmux',
        type: "mux",
        position: { x: 49 * Consts.GRID_GAP_SIZE, y: 50 * Consts.GRID_GAP_SIZE },
        // Inverted because rotated 90
        width: Consts.DEFAULT_NODE_DIMS.height,
        height: Consts.DEFAULT_NODE_DIMS.width,
        data: {
            label: "DRMUX",
            orientation: "right",
            selectorLeftUp: true}
    },
    {
        id: "memory",
        type: "logic",
        position: { x: 18 * Consts.GRID_GAP_SIZE, y: 45 * Consts.GRID_GAP_SIZE },
        ...Consts.MEMORY_DIMS,
        data: {
            label: 'Memory',
            componentType: 'memory'
        },
    },
    {
        id: "mar",
        type: "logic",
        position: { x: 29 * Consts.GRID_GAP_SIZE, y: 45 * Consts.GRID_GAP_SIZE },
        ...Consts.DEFAULT_NODE_DIMS,
        data: { 
            label: "MAR",
            orientation: 'left',
            componentType: 'register'
        }
    },
    {
        id: "mdr",
        type: "logic",
        position: { x: 9 * Consts.GRID_GAP_SIZE, y: 45 * Consts.GRID_GAP_SIZE },
        ...Consts.DEFAULT_NODE_DIMS,
        data: { 
            label: "MDR",
            componentType: 'mdr'
        }
    },
    {
        id: "mdrMux",
        type: "mux",
        position: { x: 9 * Consts.GRID_GAP_SIZE, y: 50 * Consts.GRID_GAP_SIZE },
        ...Consts.DEFAULT_NODE_DIMS,
        data: { label: "MDRMUX" }
    },
    {
        id: "gateMdr",
        type: "tristate",
        position: { x: 11.5 * Consts.GRID_GAP_SIZE, y: 42 * Consts.GRID_GAP_SIZE },
        ...Consts.TRISTATE_DIMS,
        data: { label: "GateMDR" }
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
        sourceHandle: 'output',
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
        source: 'ccLogic',
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
        targetHandle:  'ioInput',
        type: 'step',
        animated: true
    },

    // Output
    {
        id: 'outputBus',
        source: 'ioOutput',
        target: 'bus',
        sourceHandle: 'input',
        targetHandle:  'ioOutput',
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
        target: 'ccLogic',
        sourceHandle: 'ccLogic',
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