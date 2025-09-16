import * as Consts from "./constants";
import type { LC3Node } from './types.d';
import { MarkerType, Position, type Edge } from '@vue-flow/core';

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
        position: { x: 16 * Consts.GRID_GAP_SIZE, y: 29.5 * Consts.GRID_GAP_SIZE },
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
        position: { x: 15 * Consts.GRID_GAP_SIZE, y: 13 * Consts.GRID_GAP_SIZE },
        ...Consts.ALU_DIMS,
        data: { label: '+' }
    },
    {
        id: 'addr1Mux',
        type: "mux",
        position: { x: 20 * Consts.GRID_GAP_SIZE, y: 18.5 * Consts.GRID_GAP_SIZE },
        ...Consts.DEFAULT_NODE_DIMS,
        data: { label: 'ADDR1MUX' }
    },
    {
        id: 'addr2Mux',
        type: "mux",
        position: { x: 12.5 * Consts.GRID_GAP_SIZE, y: 18.5 * Consts.GRID_GAP_SIZE },
        ...Consts.DEFAULT_NODE_DIMS,
        data: {
            label: 'ADDR2MUX',
            inputSize: 4,
            selectorLeftUp: true}
    },
    {
        id: 'fsm',
        type: "logic",
        position: { x: 30 * Consts.GRID_GAP_SIZE, y: 29.5 * Consts.GRID_GAP_SIZE },
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
        position: { x: 42 * Consts.GRID_GAP_SIZE, y: 33 * Consts.GRID_GAP_SIZE },
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
        position: { x: 46 * Consts.GRID_GAP_SIZE, y: 37.5 * Consts.GRID_GAP_SIZE },
        ...Consts.TRISTATE_DIMS,
        data: { 
            label: "GateALU",
            orientation: "down"
        }
    },
    {
        id: 'ccLogic',
        type: "logic",
        position: { x: 21 * Consts.GRID_GAP_SIZE, y: 36.5 * Consts.GRID_GAP_SIZE },
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
        position: { x: 21 * Consts.GRID_GAP_SIZE, y: 34 * Consts.GRID_GAP_SIZE },
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
        position: { x: 53 * Consts.GRID_GAP_SIZE, y: 50 * Consts.GRID_GAP_SIZE },
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
        position: { x: 18 * Consts.GRID_GAP_SIZE, y: 45.5 * Consts.GRID_GAP_SIZE },
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
    },
    {
        id: "ldreg",
        type: "signal",
        position: { x: 37.5 * Consts.GRID_GAP_SIZE, y: 7 * Consts.GRID_GAP_SIZE },
        ...Consts.LABEL_DIMS,
        data: {
            label: "LD.REG"
        }
    },
    {
        id: "ldmar",
        type: "signal",
        position: { x: 36 * Consts.GRID_GAP_SIZE, y: 45 * Consts.GRID_GAP_SIZE },
        ...Consts.LABEL_DIMS,
        data: {
            label: "LD.MAR",
            orientation: "left"
        }
    },
    {
        id: "ldpc",
        type: "signal",
        position: { x: 22 * Consts.GRID_GAP_SIZE, y: 5 * Consts.GRID_GAP_SIZE },
        ...Consts.LABEL_DIMS,
        data: {
            label: "LD.PC"
        }
    },
    {
        id: "ldir",
        type: "signal",
        position: { x: -6 * Consts.GRID_GAP_SIZE, y: 35 * Consts.GRID_GAP_SIZE },
        ...Consts.LABEL_DIMS,
        data: {
            label: "LD.IR"
        }
    },
    {
        id: "ldmdr",
        type: "signal",
        position: { x: 2 * Consts.GRID_GAP_SIZE, y: 45 * Consts.GRID_GAP_SIZE },
        ...Consts.LABEL_DIMS,
        data: {
            label: "LD.MDR"
        }
    },
    {
        id: "ldcc",
        type: "signal",
        position: { x: 14 * Consts.GRID_GAP_SIZE, y: 33.5 * Consts.GRID_GAP_SIZE },
        ...Consts.LABEL_DIMS,
        data: {
            label: "LD.CC"
        }
    },
    {
        id: "ldpc",
        type: "signal",
        position: { x: 21.5 * Consts.GRID_GAP_SIZE, y: 5 * Consts.GRID_GAP_SIZE },
        ...Consts.LABEL_DIMS,
        data: {
            label: "LD.PC"
        }
    },
    {
        id: "memen",
        type: "signal",
        position: { x: 17 * Consts.GRID_GAP_SIZE, y: 51.5 * Consts.GRID_GAP_SIZE },
        ...Consts.LABEL_DIMS,
        data: {
            label: "MEM.EN",
            orientation: 'up'
        }
    },
    {
        id: "rw",
        type: "signal",
        position: { x: 21 * Consts.GRID_GAP_SIZE, y: 51.5 * Consts.GRID_GAP_SIZE },
        ...Consts.LABEL_DIMS,
        data: {
            label: "RW",
            orientation: 'up'
        }
    },
    {
        id: "dr",
        type: "signal",
        position: { x: 37.5 * Consts.GRID_GAP_SIZE, y: 5 * Consts.GRID_GAP_SIZE },
        ...Consts.LABEL_DIMS,
        data: {
            label: "DR"
        }
    },
    {
        id: "sr1",
        type: "signal",
        position: { x: 52.5 * Consts.GRID_GAP_SIZE, y: 9 * Consts.GRID_GAP_SIZE },
        ...Consts.LABEL_DIMS,
        data: {
            label: "SR1",
            orientation: "left"
        }
    },
    {
        id: "sr2",
        type: "signal",
        position: { x: 37.5 * Consts.GRID_GAP_SIZE, y: 9 * Consts.GRID_GAP_SIZE },
        ...Consts.LABEL_DIMS,
        data: {
            label: "SR2"
        }
    },
    {
        id: "ir11sr1",
        type: "signal",
        position: { x: 34.5 * Consts.GRID_GAP_SIZE, y: 50 * Consts.GRID_GAP_SIZE },
        ...Consts.LABEL_DIMS,
        data: {
            label: "IR[11:9]"
        }
    },
    {
        id: "ir8sr1",
        type: "signal",
        position: { x: 34.5 * Consts.GRID_GAP_SIZE, y: 53 * Consts.GRID_GAP_SIZE },
        ...Consts.LABEL_DIMS,
        data: {
            label: "IR[8:6]"
        }
    },
    {
        id: "ir11dr",
        type: "signal",
        position: { x: 45.5 * Consts.GRID_GAP_SIZE, y: 50 * Consts.GRID_GAP_SIZE },
        ...Consts.LABEL_DIMS,
        data: {
            label: "IR[11:9]"
        }
    },
    {
        id: "reg7",
        type: "signal",
        position: { x: 45.5 * Consts.GRID_GAP_SIZE, y: 53 * Consts.GRID_GAP_SIZE },
        ...Consts.LABEL_DIMS,
        data: {
            label: "111"
        }
    },
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
        type: 'wire',
        // This needs to appear at least once
        // for it to appear to all edges
        markerEnd: {
            type: MarkerType.ArrowClosed,
        }
    },

    // ADDR2MUX
    {
        id: 'addr2Mux',
        source: 'addr2Mux',
        target: 'marAdder',
        sourceHandle: 'output',
        targetHandle:  'input-b',
        type: 'wire'
    },

    // MARMUX
    {
        id: 'marMuxgateMarMux',
        source: 'marMux',
        target: 'gateMarMux',
        sourceHandle: 'output',
        targetHandle:  'input',
        type: 'wire'
    },

    // MDRMUX
    {
        id: 'mdrMuxmdr',
        source: 'mdrMux',
        target: 'mdr',
        sourceHandle: 'output',
        targetHandle:  'input',
        type: 'wire'
    },

    // PCMUX
    {
        id: 'pcMuxPc',
        source: 'pcMux',
        target: 'pc',
        sourceHandle: 'output',
        targetHandle:  'input',
        type: 'wire'
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
        type: 'wire'
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
        type: 'wire'
    },

    //SEXT [10:0]
    {
        id: 'sext11Addr2Mux',
        source: 'sext11',
        target: 'addr2Mux',
        sourceHandle: 'output',
        targetHandle:  'input-0',
        type: 'wire'
    },

    //SEXT [8:0]
    {
        id: 'sext9Addr2Mux',
        source: 'sext9',
        target: 'addr2Mux',
        sourceHandle: 'output',
        targetHandle:  'input-1',
        type: 'wire'
    },

    //SEXT [5:0]
    {
        id: 'sext6Addr2Mux',
        source: 'sext6',
        target: 'addr2Mux',
        sourceHandle: 'output',
        targetHandle:  'input-2',
        type: 'wire'
    },

    //SEXT [4:0]
    {
        id: 'sext10Sr2Mux',
        source: 'sext5',
        target: 'sr2Mux',
        sourceHandle: 'output',
        targetHandle:  'input-0',
        type: 'wire'
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
        type: 'wire'
    },

    //MAR ADDER
    {
        id: 'marAdderMarMux',
        source: 'marAdder',
        target: 'marMux',
        sourceHandle: 'output',
        targetHandle:  'input-1',
        type: 'wire'
    },
    {
        id: 'marAdderPcMux',
        source: 'marAdder',
        target: 'pcMux',
        sourceHandle: 'output',
        targetHandle:  'input-1',
        type: 'wire'
    },

    // PC ADDER
    {
        id: 'pcAdderPcMux',
        source: 'pcAdder',
        target: 'pcMux',
        sourceHandle: 'output',
        targetHandle:  'input-2',
        type: 'wire'
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
        type: 'wire'
    },

    // MDR
    {
        id: 'mdrMemory',
        source: 'mdr',
        target: 'memory',
        sourceHandle: 'mem-output',
        targetHandle:  'mdr-in',
        type: 'wire'
    },
    {
        id: 'mdrGateMdr',
        source: 'mdr',
        target: 'gateMdr',
        sourceHandle: 'gate-mdr',
        targetHandle:  'input',
        type: 'wire'
    },

    // IR
    {
        id: 'irZext8',
        source: 'ir',
        target: 'zext8',
        sourceHandle: 'output',
        targetHandle:  'input',
        type: 'wire'
    },
    {
        id: 'irSext5',
        source: 'ir',
        target: 'sext5',
        sourceHandle: 'output',
        targetHandle:  'input',
        type: 'wire'
    },
    {
        id: 'irSext6',
        source: 'ir',
        target: 'sext6',
        sourceHandle: 'output',
        targetHandle:  'input',
        type: 'wire'
    },
    {
        id: 'irSext9',
        source: 'ir',
        target: 'sext9',
        sourceHandle: 'output',
        targetHandle:  'input',
        type: 'wire'
    },
    {
        id: 'irSext11',
        source: 'ir',
        target: 'sext11',
        sourceHandle: 'output',
        targetHandle:  'input',
        type: 'wire'
    },
    {
        id: 'irSr2Mux',
        source: 'ir',
        target: 'sr2Mux',
        sourceHandle: 'output',
        targetHandle:  'selector',
        type: 'wire'
    },
    {
        id: 'irFsm',
        source: 'ir',
        target: 'fsm',
        sourceHandle: 'output',
        targetHandle:  'ir-15-9',
        type: 'wire'
    },

    // PC
    {
        id: 'pcAdderPc',
        source: 'pc',
        target: 'pcAdder',
        sourceHandle: 'output',
        targetHandle:  'input',
        type: 'wire'
    },
    {
        id: 'pcGatePc',
        source: 'pc',
        target: 'gatePc',
        sourceHandle: 'output',
        targetHandle:  'input',
        type: 'wire'
    },
    {
        id: 'pcAddr1Mux',
        source: 'pc',
        target: 'addr1Mux',
        sourceHandle: 'output',
        targetHandle:  'input-1',
        type: 'wire'
    },

    // NZP
    {
        id: 'nzp',
        source: 'nzp',
        target: 'fsm',
        sourceHandle: 'output',
        targetHandle:  'nzp',
        type: 'wire'
    },

    // REG FILE
    {
        id: 'regFileSr2Mux',
        source: 'regFile',
        target: 'sr2Mux',
        sourceHandle: 'sr2mux',
        targetHandle:  'input-1',
        type: 'wire'
    },
    {
        id: 'regFileAlu',
        source: 'regFile',
        target: 'alu',
        sourceHandle: 'alu',
        targetHandle:  'input-a',
        type: 'wire'
    },
    {
        id: 'regFileAddr1Mux',
        source: 'regFile',
        target: 'addr1Mux',
        sourceHandle: 'alu',
        targetHandle:  'input-0',
        type: 'wire'
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
        type: 'wire'
    },

    // Gate PC
    {
        id: 'gatePcBus',
        source: 'gatePc',
        target: 'bus',
        sourceHandle: 'output',
        targetHandle:  'gatePc',
        type: 'wire'
    },
    // Gate MARMUX
    {
        id: 'gateMarMuxBus',
        source: 'gateMarMux',
        target: 'bus',
        sourceHandle: 'output',
        targetHandle:  'gateMarMux',
        type: 'wire'
    },

    // Gate MDR
    {
        id: 'gateMdrBus',
        source: 'gateMdr',
        target: 'bus',
        sourceHandle: 'output',
        targetHandle:  'gateMdr',
        type: 'wire'
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
        type: 'wire'
    },

    // LOGIC
    {
        id: 'logicNzp',
        source: 'ccLogic',
        target: 'nzp',
        sourceHandle: 'output',
        targetHandle:  'input',
        type: 'wire'
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
        type: 'wire'
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
        type: 'wire'
    },

    // Output
    {
        id: 'outputBus',
        source: 'ioOutput',
        target: 'bus',
        sourceHandle: 'input',
        targetHandle:  'ioOutput',
        type: 'wire'
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
        type: 'wire'
    },
    {
        id: 'busRegFile',
        source: 'bus',
        target: 'regFile',
        sourceHandle: 'regFile',
        targetHandle:  'bus',
        type: 'wire'
    },
    {
        id: 'busMdrMux',
        source: 'bus',
        target: 'mdrMux',
        sourceHandle: 'mdrMux',
        targetHandle:  'input-0',
        type: 'wire'
    },
    {
        id: 'busIr',
        source: 'bus',
        target: 'ir',
        sourceHandle: 'ir',
        targetHandle:  'input',
        type: 'wire'
    },
    {
        id: 'busLogic',
        source: 'bus',
        target: 'ccLogic',
        sourceHandle: 'ccLogic',
        targetHandle:  'input',
        type: 'wire'
    },
    {
        id: 'busMar',
        source: 'bus',
        target: 'mar',
        sourceHandle: 'mar',
        targetHandle:  'input',
        type: 'wire'
    },
    /**
     * SIGNAL EDGES
     */

    {
        id: 'ldpcPc',
        source: 'ldpc',
        target: 'pc',
        sourceHandle: 'output',
        targetHandle:  'ld',
        type: 'wire'
    },
    {
        id: 'ldccNzp',
        source: 'ldcc',
        target: 'nzp',
        sourceHandle: 'output',
        targetHandle:  'ld',
        type: 'wire'
    },
    {
        id: 'ldirIr',
        source: 'ldir',
        target: 'ir',
        sourceHandle: 'output',
        targetHandle:  'ld',
        type: 'wire'
    },
    {
        id: 'ldmdrMdr',
        source: 'ldmdr',
        target: 'mdr',
        sourceHandle: 'output',
        targetHandle:  'ld-mdr',
        type: 'wire'
    },
    {
        id: 'ldmarMar',
        source: 'ldmar',
        target: 'mar',
        sourceHandle: 'output',
        targetHandle:  'ld',
        type: 'wire'
    },
    {
        id: 'ldregRegfile',
        source: 'ldreg',
        target: 'regFile',
        sourceHandle: 'output',
        targetHandle:  'ld-reg',
        type: 'wire'
    },
    {
        id: 'drRegfile',
        source: 'dr',
        target: 'regFile',
        sourceHandle: 'output',
        targetHandle:  'dr',
        type: 'wire'
    },
    {
        id: 'sr2Regfile',
        source: 'sr2',
        target: 'regFile',
        sourceHandle: 'output',
        targetHandle:  'sr2',
        type: 'wire'
    },
    {
        id: 'sr1Regfile',
        source: 'sr1',
        target: 'regFile',
        sourceHandle: 'output',
        targetHandle:  'sr1',
        type: 'wire'
    },
    {
        id: 'memenMemory',
        source: 'memen',
        target: 'memory',
        sourceHandle: 'output',
        targetHandle:  'mem-en',
        type: 'wire'
    },
    {
        id: 'rwMemory',
        source: 'rw',
        target: 'memory',
        sourceHandle: 'output',
        targetHandle:  'rw',
        type: 'wire'
    },
    {
        id: 'ir11sr1Sr1Mux',
        source: 'ir11sr1',
        target: 'sr1Mux',
        sourceHandle: 'output',
        targetHandle:  'input-0',
        type: 'wire'
    },
    {
        id: 'ir8sr1Sr1Mux',
        source: 'ir8sr1',
        target: 'sr1Mux',
        sourceHandle: 'output',
        targetHandle:  'input-1',
        type: 'wire'
    },
    {
        id: 'ir11drDr1Mux',
        source: 'ir11dr',
        target: 'drmux',
        sourceHandle: 'output',
        targetHandle:  'input-0',
        type: 'wire'
    },
    {
        id: 'reg7Dr1Mux',
        source: 'reg7',
        target: 'drmux',
        sourceHandle: 'output',
        targetHandle:  'input-1',
        type: 'wire'
    },
];