import * as Consts from "./constants";
import type { LC3Node } from './types.d';
import { MarkerType, Position, type Edge } from '@vue-flow/core';

export const enum NodeId {
    Bus = "bus",
    MarMux = "marMux",
    GateMarMux = "gateMarMux",
    GatePC = "gatePc",
    PC = "pc",
    PCMux = "pcMux",
    PCAdder = "pcAdder",
    RegFile = 'regFile',
    Zext8 = 'zext8',
    Sext5 = 'sext5',
    Sext6 = 'sext6',
    Sext9 = 'sext9',
    Sext11 = 'sext11',
    IR = 'ir',
    MarAdder = 'marAdder',
    Addr1Mux = 'addr1Mux',
    Addr2Mux = 'addr2Mux',
    FSM = 'fsm',
    SR2Mux = 'sr2Mux',
    ALU = 'alu',
    GateALU = 'gateAlu',
    CCLogic = 'ccLogic',
    NZP = 'nzp',
    IOInput = 'ioInput',
    IOOutput = 'ioOutput',
    SR1Mux = 'sr1Mux',
    DrMux = 'drmux',
    Memory = "memory",
    MAR = "mar",
    MDR = "mdr",
    MdrMux = "mdrMux",
    GateMdr = "gateMdr",
    SignalLdReg = "ldreg",
    SignalLdMar = "ldmar",
    SignalLdIR = "ldir",
    SignalLdMDR = "ldmdr",
    SignalLdCC = "ldcc",
    SignalLdPC = "ldpc",
    SignalMemEn = "memen",
    SignalRW = "rw",
    SignalRF_DR = "dr",
    SignalRF_SR1 = "sr1",
    SignalRF_SR2 = "sr2",
    SignalSR1_IR11 = "ir11sr1",
    SignalSR1_IR8 = "ir8sr1",
    SignalDR_IR11 = "ir11dr",
    SignalDR_R7 = "reg7",
}
export const initialNodes: LC3Node[] = [
    {
        id: NodeId.Bus,
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
        id: NodeId.MarMux,
        type: "mux",
        position: { x: 10 * Consts.GRID_GAP_SIZE, y: 5 * Consts.GRID_GAP_SIZE },
        ...Consts.DEFAULT_NODE_DIMS,
        data: {
            label: "MARMUX",
            selectorLeftUp: true}
    },
    {
        id: NodeId.GateMarMux,
        type: "tristate",
        position: { x: 12.5 * Consts.GRID_GAP_SIZE, y: 2 * Consts.GRID_GAP_SIZE },
        ...Consts.TRISTATE_DIMS,
        data: { label: "GateMARMUX" }
    },
    {
        id: NodeId.GatePC,
        type: "tristate",
        position: { x: 31.5 * Consts.GRID_GAP_SIZE, y: 2 * Consts.GRID_GAP_SIZE },
        ...Consts.TRISTATE_DIMS,
        data: { label: "GatePC" }
    },
    { 
        id: NodeId.PC,
        type: "logic",
        position: { x: 29 * Consts.GRID_GAP_SIZE, y: 5 * Consts.GRID_GAP_SIZE },
        ...Consts.DEFAULT_NODE_DIMS,
        data: { 
            label: "PC",
            componentType: 'register'
        }
    },
    { 
        id: NodeId.PCMux,
        type: "mux",
        position: { x: 29 * Consts.GRID_GAP_SIZE, y: 10 * Consts.GRID_GAP_SIZE },
        ...Consts.DEFAULT_NODE_DIMS,
        data: { 
            label: "PCMUX",
            inputSize: 3,
            selectorLeftUp: true}
    },
    { 
        id: NodeId.PCAdder,
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
        id: NodeId.RegFile,
        type: "logic",
        position: { x: 45 * Consts.GRID_GAP_SIZE, y: 4 * Consts.GRID_GAP_SIZE },
        ...Consts.REG_FILE_DIMS,
        data: {
            label: 'Register File',
            componentType: "regfile"
        }
    },
    {
        id: NodeId.Zext8,
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
        id: NodeId.Sext5,
        type: "logic",
        position: { x: 16 * Consts.GRID_GAP_SIZE, y: 29.5 * Consts.GRID_GAP_SIZE },
        ...Consts.SEXT_NODE_DIMS,
        data: {
            label: 'SEXT',
            componentType: 'extender'
        }
    },
    {
        id: NodeId.Sext6,
        type: "logic",
        position: { x: 6 * Consts.GRID_GAP_SIZE, y: 26 * Consts.GRID_GAP_SIZE },
        ...Consts.SEXT_NODE_DIMS,
        data: {
            label: 'SEXT',
            componentType: 'extender'
        }
    },
    {
        id: NodeId.Sext9,
        type: "logic",
        position: { x: 6 * Consts.GRID_GAP_SIZE, y: 24 * Consts.GRID_GAP_SIZE },
        ...Consts.SEXT_NODE_DIMS,
        data: {
            label: 'SEXT',
            componentType: 'extender'
        }
    },
    {
        id: NodeId.Sext11,
        type: "logic",
        position: { x: 6 * Consts.GRID_GAP_SIZE, y: 22 * Consts.GRID_GAP_SIZE },
        ...Consts.SEXT_NODE_DIMS,
        data: {
            label: 'SEXT',
            componentType: 'extender'
        }
    },
    {
        id: NodeId.IR,
        type: "logic",
        position: { x: 1 * Consts.GRID_GAP_SIZE, y: 35 * Consts.GRID_GAP_SIZE },
        ...Consts.DEFAULT_NODE_DIMS,
        data: {
            label: 'IR',
            componentType: "register"
        }
    },
    {
        id: NodeId.MarAdder,
        type: "alu",
        position: { x: 15 * Consts.GRID_GAP_SIZE, y: 13 * Consts.GRID_GAP_SIZE },
        ...Consts.ALU_DIMS,
        data: { label: '+' }
    },
    {
        id: NodeId.Addr1Mux,
        type: "mux",
        position: { x: 20 * Consts.GRID_GAP_SIZE, y: 18.5 * Consts.GRID_GAP_SIZE },
        ...Consts.DEFAULT_NODE_DIMS,
        data: { label: 'ADDR1MUX' }
    },
    {
        id: NodeId.Addr2Mux,
        type: "mux",
        position: { x: 12.5 * Consts.GRID_GAP_SIZE, y: 18.5 * Consts.GRID_GAP_SIZE },
        ...Consts.DEFAULT_NODE_DIMS,
        data: {
            label: 'ADDR2MUX',
            inputSize: 4,
            selectorLeftUp: true}
    },
    {
        id: NodeId.FSM,
        type: "logic",
        position: { x: 30 * Consts.GRID_GAP_SIZE, y: 29.5 * Consts.GRID_GAP_SIZE },
        ...Consts.FSM_DIMS,
        data: { 
            label: "Finite State Machine",
            componentType: "fsm"
        }
    },
    {
        id: NodeId.SR2Mux,
        type: "mux",
        position: { x: 41 * Consts.GRID_GAP_SIZE, y: 27.5 * Consts.GRID_GAP_SIZE },
        ...Consts.DEFAULT_NODE_DIMS,
        data: { 
            label: "SR2MUX",
            orientation: 'down',
        }
    },
    {
        id: NodeId.ALU,
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
        id: NodeId.GateALU,
        type: 'tristate',
        position: { x: 46 * Consts.GRID_GAP_SIZE, y: 37.5 * Consts.GRID_GAP_SIZE },
        ...Consts.TRISTATE_DIMS,
        data: { 
            label: "GateALU",
            orientation: "down"
        }
    },
    {
        id: NodeId.CCLogic,
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
        id: NodeId.NZP,
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
        id: NodeId.IOInput,
        type: "logic",
        position: { x: 42 * Consts.GRID_GAP_SIZE, y: 45 * Consts.GRID_GAP_SIZE },
        ...Consts.IO_NODE_DIMS,
        data: {
            label: 'Input',
            orientation: 'left'
        }
    },
    {
        id: NodeId.IOOutput,
        type: "logic",
        position: { x: 49 * Consts.GRID_GAP_SIZE, y: 45 * Consts.GRID_GAP_SIZE },
        ...Consts.IO_NODE_DIMS,
        data: {
            label: 'Output',
            orientation: 'left'
        }
    },
    {
        id: NodeId.SR1Mux,
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
        id: NodeId.DrMux,
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
        id: NodeId.Memory,
        type: "logic",
        position: { x: 18 * Consts.GRID_GAP_SIZE, y: 45.5 * Consts.GRID_GAP_SIZE },
        ...Consts.MEMORY_DIMS,
        data: {
            label: 'Memory',
            componentType: 'memory'
        },
    },
    {
        id: NodeId.MAR,
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
        id: NodeId.MDR,
        type: "logic",
        position: { x: 9 * Consts.GRID_GAP_SIZE, y: 45 * Consts.GRID_GAP_SIZE },
        ...Consts.DEFAULT_NODE_DIMS,
        data: { 
            label: "MDR",
            componentType: 'mdr'
        }
    },
    {
        id: NodeId.MdrMux,
        type: "mux",
        position: { x: 9 * Consts.GRID_GAP_SIZE, y: 50 * Consts.GRID_GAP_SIZE },
        ...Consts.DEFAULT_NODE_DIMS,
        data: { label: "MDRMUX" }
    },
    {
        id: NodeId.GateMdr,
        type: "tristate",
        position: { x: 11.5 * Consts.GRID_GAP_SIZE, y: 42 * Consts.GRID_GAP_SIZE },
        ...Consts.TRISTATE_DIMS,
        data: { label: "GateMDR" }
    },
    {
        id: NodeId.SignalLdReg,
        type: "signal",
        position: { x: 37.5 * Consts.GRID_GAP_SIZE, y: 7 * Consts.GRID_GAP_SIZE },
        ...Consts.LABEL_DIMS,
        data: {
            label: "LD.REG"
        }
    },
    {
        id: NodeId.SignalLdMar,
        type: "signal",
        position: { x: 36 * Consts.GRID_GAP_SIZE, y: 45 * Consts.GRID_GAP_SIZE },
        ...Consts.LABEL_DIMS,
        data: {
            label: "LD.MAR",
            orientation: "left"
        }
    },
    {
        id: NodeId.SignalLdIR,
        type: "signal",
        position: { x: -6 * Consts.GRID_GAP_SIZE, y: 35 * Consts.GRID_GAP_SIZE },
        ...Consts.LABEL_DIMS,
        data: {
            label: "LD.IR"
        }
    },
    {
        id: NodeId.SignalLdMDR,
        type: "signal",
        position: { x: 2 * Consts.GRID_GAP_SIZE, y: 45 * Consts.GRID_GAP_SIZE },
        ...Consts.LABEL_DIMS,
        data: {
            label: "LD.MDR"
        }
    },
    {
        id: NodeId.SignalLdCC,
        type: "signal",
        position: { x: 14 * Consts.GRID_GAP_SIZE, y: 33.5 * Consts.GRID_GAP_SIZE },
        ...Consts.LABEL_DIMS,
        data: {
            label: "LD.CC"
        }
    },
    {
        id: NodeId.SignalLdPC,
        type: "signal",
        position: { x: 21.5 * Consts.GRID_GAP_SIZE, y: 5 * Consts.GRID_GAP_SIZE },
        ...Consts.LABEL_DIMS,
        data: {
            label: "LD.PC"
        }
    },
    {
        id: NodeId.SignalMemEn,
        type: "signal",
        position: { x: 17 * Consts.GRID_GAP_SIZE, y: 51.5 * Consts.GRID_GAP_SIZE },
        ...Consts.LABEL_DIMS,
        data: {
            label: "MEM.EN",
            orientation: 'up'
        }
    },
    {
        id: NodeId.SignalRW,
        type: "signal",
        position: { x: 21 * Consts.GRID_GAP_SIZE, y: 51.5 * Consts.GRID_GAP_SIZE },
        ...Consts.LABEL_DIMS,
        data: {
            label: "RW",
            orientation: 'up'
        }
    },
    {
        id: NodeId.SignalRF_DR,
        type: "signal",
        position: { x: 37.5 * Consts.GRID_GAP_SIZE, y: 5 * Consts.GRID_GAP_SIZE },
        ...Consts.LABEL_DIMS,
        data: {
            label: "DR"
        }
    },
    {
        id: NodeId.SignalRF_SR1,
        type: "signal",
        position: { x: 52.5 * Consts.GRID_GAP_SIZE, y: 9 * Consts.GRID_GAP_SIZE },
        ...Consts.LABEL_DIMS,
        data: {
            label: "SR1",
            orientation: "left"
        }
    },
    {
        id: NodeId.SignalRF_SR2,
        type: "signal",
        position: { x: 37.5 * Consts.GRID_GAP_SIZE, y: 9 * Consts.GRID_GAP_SIZE },
        ...Consts.LABEL_DIMS,
        data: {
            label: "SR2"
        }
    },
    {
        id: NodeId.SignalSR1_IR11,
        type: "signal",
        position: { x: 34.5 * Consts.GRID_GAP_SIZE, y: 50 * Consts.GRID_GAP_SIZE },
        ...Consts.LABEL_DIMS,
        data: {
            label: "IR[11:9]"
        }
    },
    {
        id: NodeId.SignalSR1_IR8,
        type: "signal",
        position: { x: 34.5 * Consts.GRID_GAP_SIZE, y: 53 * Consts.GRID_GAP_SIZE },
        ...Consts.LABEL_DIMS,
        data: {
            label: "IR[8:6]"
        }
    },
    {
        id: NodeId.SignalDR_IR11,
        type: "signal",
        position: { x: 45.5 * Consts.GRID_GAP_SIZE, y: 50 * Consts.GRID_GAP_SIZE },
        ...Consts.LABEL_DIMS,
        data: {
            label: "IR[11:9]"
        }
    },
    {
        id: NodeId.SignalDR_R7,
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
 * id: sourceId-TargetId
 */

export const initialEdges: Edge[] = [
    /**
     * MUX EDGES 
     */

    // ADDR1MUX
    {
        id: `${NodeId.Addr1Mux}-${NodeId.MarAdder}`,
        source: NodeId.Addr1Mux,
        target: NodeId.MarAdder,
        sourceHandle: 'output',
        targetHandle: 'input-a',
        type: 'wire',
        // This needs to appear at least once
        // for it to appear to all edges
        markerEnd: {
            type: MarkerType.ArrowClosed,
        }
    },

    // ADDR2MUX
    {
        id: `${NodeId.Addr2Mux}-${NodeId.MarAdder}`,
        source: NodeId.Addr2Mux,
        target: NodeId.MarAdder,
        sourceHandle: 'output',
        targetHandle: 'input-b',
        type: 'wire'
    },

    // MARMUX
    {
        id: `${NodeId.MarMux}-${NodeId.GateMarMux}`,
        source: NodeId.MarMux,
        target: NodeId.GateMarMux,
        sourceHandle: 'output',
        targetHandle: 'input',
        type: 'wire'
    },

    // MDRMUX
    {
        id: `${NodeId.MdrMux}-${NodeId.MDR}`,
        source: NodeId.MdrMux,
        target: NodeId.MDR,
        sourceHandle: 'output',
        targetHandle: 'input',
        type: 'wire'
    },

    // PCMUX
    {
        id: `${NodeId.PCMux}-${NodeId.PC}`,
        source: NodeId.PCMux,
        target: NodeId.PC,
        sourceHandle: 'output',
        targetHandle: 'input',
        type: 'wire'
    },

    // SR1MUX
    // TODO: Needs text labels

    // SR2MUX
    {
        id: `${NodeId.SR2Mux}-${NodeId.ALU}`,
        source: NodeId.SR2Mux,
        target: NodeId.ALU,
        sourceHandle: 'output',
        targetHandle: 'input-b',
        type: 'wire'
    },

    // DR MUX
    // TODO: Needs text labels

    /**
     * EXTENDER EDGES  
     */

    //ZEXT
    {
        id: `${NodeId.Zext8}-${NodeId.MarMux}`,
        source: NodeId.Zext8,
        target: NodeId.MarMux,
        sourceHandle: 'output',
        targetHandle: 'input-0',
        type: 'wire'
    },

    //SEXT [10:0]
    {
        id: `${NodeId.Sext11}-${NodeId.Addr2Mux}`,
        source: NodeId.Sext11,
        target: NodeId.Addr2Mux,
        sourceHandle: 'output',
        targetHandle: 'input-0',
        type: 'wire'
    },

    //SEXT [8:0]
    {
        id: `${NodeId.Sext9}-${NodeId.Addr2Mux}`,
        source: NodeId.Sext9,
        target: NodeId.Addr2Mux,
        sourceHandle: 'output',
        targetHandle: 'input-1',
        type: 'wire'
    },

    //SEXT [5:0]
    {
        id: `${NodeId.Sext6}-${NodeId.Addr2Mux}`,
        source: NodeId.Sext6,
        target: NodeId.Addr2Mux,
        sourceHandle: 'output',
        targetHandle: 'input-2',
        type: 'wire'
    },

    //SEXT [4:0]
    {
        id: `${NodeId.Sext5}-${NodeId.SR2Mux}`,
        source: NodeId.Sext5,
        target: NodeId.SR2Mux,
        sourceHandle: 'output',
        targetHandle: 'input-0',
        type: 'wire'
    },

    /**
     * ALU EDGES  
     */

    //ALU
    {
        id: `${NodeId.ALU}-${NodeId.GateALU}`,
        source: NodeId.ALU,
        target: NodeId.GateALU,
        sourceHandle: 'output',
        targetHandle: 'input',
        type: 'wire'
    },

    //MAR ADDER
    {
        id: `${NodeId.MarAdder}-${NodeId.MarMux}`,
        source: NodeId.MarAdder,
        target: NodeId.MarMux,
        sourceHandle: 'output',
        targetHandle: 'input-1',
        type: 'wire'
    },
    {
        id: `${NodeId.MarAdder}-${NodeId.PCMux}`,
        source: NodeId.MarAdder,
        target: NodeId.PCMux,
        sourceHandle: 'output',
        targetHandle: 'input-1',
        type: 'wire'
    },

    // PC ADDER
    {
        id: `${NodeId.PCAdder}-${NodeId.PCMux}`,
        source: NodeId.PCAdder,
        target: NodeId.PCMux,
        sourceHandle: 'output',
        targetHandle: 'input-2',
        type: 'wire'
    },

    /**
     * REGISTER EDGES  
     */

    // MAR
    {
        id: `${NodeId.MAR}-${NodeId.Memory}`,
        source: NodeId.MAR,
        target: NodeId.Memory,
        sourceHandle: 'output',
        targetHandle: 'mar-in',
        type: 'wire'
    },

    // MDR
    {
        id: `${NodeId.MDR}-${NodeId.Memory}`,
        source: NodeId.MDR,
        target: NodeId.Memory,
        sourceHandle: 'mem-output',
        targetHandle: 'mdr-in',
        type: 'wire'
    },
    {
        id: `${NodeId.MDR}-${NodeId.GateMdr}`,
        source: NodeId.MDR,
        target: NodeId.GateMdr,
        sourceHandle: 'gate-mdr',
        targetHandle: 'input',
        type: 'wire'
    },

    // IR
    {
        id: `${NodeId.IR}-${NodeId.Zext8}`,
        source: NodeId.IR,
        target: NodeId.Zext8,
        sourceHandle: 'output',
        targetHandle: 'input',
        type: 'wire'
    },
    {
        id: `${NodeId.IR}-${NodeId.Sext5}`,
        source: NodeId.IR,
        target: NodeId.Sext5,
        sourceHandle: 'output',
        targetHandle: 'input',
        type: 'wire'
    },
    {
        id: `${NodeId.IR}-${NodeId.Sext6}`,
        source: NodeId.IR,
        target: NodeId.Sext6,
        sourceHandle: 'output',
        targetHandle: 'input',
        type: 'wire'
    },
    {
        id: `${NodeId.IR}-${NodeId.Sext9}`,
        source: NodeId.IR,
        target: NodeId.Sext9,
        sourceHandle: 'output',
        targetHandle: 'input',
        type: 'wire'
    },
    {
        id: `${NodeId.IR}-${NodeId.Sext11}`,
        source: NodeId.IR,
        target: NodeId.Sext11,
        sourceHandle: 'output',
        targetHandle: 'input',
        type: 'wire'
    },
    {
        id: `${NodeId.IR}-${NodeId.SR2Mux}`,
        source: NodeId.IR,
        target: NodeId.SR2Mux,
        sourceHandle: 'output',
        targetHandle: 'selector',
        type: 'wire'
    },
    {
        id: `${NodeId.IR}-${NodeId.FSM}`,
        source: NodeId.IR,
        target: NodeId.FSM,
        sourceHandle: 'output',
        targetHandle: 'ir-15-9',
        type: 'wire'
    },

    // PC
    {
        id: `${NodeId.PC}-${NodeId.PCAdder}`,
        source: NodeId.PC,
        target: NodeId.PCAdder,
        sourceHandle: 'output',
        targetHandle: 'input',
        type: 'wire'
    },
    {
        id: `${NodeId.PC}-${NodeId.GatePC}`,
        source: NodeId.PC,
        target: NodeId.GatePC,
        sourceHandle: 'output',
        targetHandle: 'input',
        type: 'wire'
    },
    {
        id: `${NodeId.PC}-${NodeId.Addr1Mux}`,
        source: NodeId.PC,
        target: NodeId.Addr1Mux,
        sourceHandle: 'output',
        targetHandle: 'input-1',
        type: 'wire'
    },

    // NZP
    {
        id: `${NodeId.NZP}-${NodeId.FSM}`,
        source: NodeId.NZP,
        target: NodeId.FSM,
        sourceHandle: 'output',
        targetHandle: 'nzp',
        type: 'wire'
    },

    // REG FILE
    {
        id: `${NodeId.RegFile}-${NodeId.SR2Mux}`,
        source: NodeId.RegFile,
        target: NodeId.SR2Mux,
        sourceHandle: 'sr2mux',
        targetHandle: 'input-1',
        type: 'wire'
    },
    {
        id: `${NodeId.RegFile}-${NodeId.ALU}`,
        source: NodeId.RegFile,
        target: NodeId.ALU,
        sourceHandle: 'alu',
        targetHandle: 'input-a',
        type: 'wire'
    },
    {
        id: `${NodeId.RegFile}-${NodeId.Addr1Mux}`,
        source: NodeId.RegFile,
        target: NodeId.Addr1Mux,
        sourceHandle: 'alu',
        targetHandle: 'input-0',
        type: 'wire'
    },

    /**
     * GATE EDGES
     *
     * TODO: Create Bus handles 
     */

    // Gate ALU
    {
        id: `${NodeId.GateALU}-${NodeId.Bus}`,
        source: NodeId.GateALU,
        target: NodeId.Bus,
        sourceHandle: 'output',
        targetHandle: 'gateAlu',
        type: 'wire'
    },

    // Gate PC
    {
        id: `${NodeId.GatePC}-${NodeId.Bus}`,
        source: NodeId.GatePC,
        target: NodeId.Bus,
        sourceHandle: 'output',
        targetHandle: 'gatePc',
        type: 'wire'
    },
    // Gate MARMUX
    {
        id: `${NodeId.GateMarMux}-${NodeId.Bus}`,
        source: NodeId.GateMarMux,
        target: NodeId.Bus,
        sourceHandle: 'output',
        targetHandle: 'gateMarMux',
        type: 'wire'
    },

    // Gate MDR
    {
        id: `${NodeId.GateMdr}-${NodeId.Bus}`,
        source: NodeId.GateMdr,
        target: NodeId.Bus,
        sourceHandle: 'output',
        targetHandle: 'gateMdr',
        type: 'wire'
    },

    /**
     * LOGIC EDGES
     */

    // FSM
    {
        id: `${NodeId.FSM}-${NodeId.ALU}`,
        source: NodeId.FSM,
        target: NodeId.ALU,
        sourceHandle: 'aluk',
        targetHandle: 'selector',
        type: 'wire'
    },

    // LOGIC
    {
        id: `${NodeId.CCLogic}-${NodeId.NZP}`,
        source: NodeId.CCLogic,
        target: NodeId.NZP,
        sourceHandle: 'output',
        targetHandle: 'input',
        type: 'wire'
    },
    
    /**
     * MEMORY EDGES
     */

    // Memory
    {
        id: `${NodeId.Memory}-${NodeId.MdrMux}`,
        source: NodeId.Memory,
        target: NodeId.MdrMux,
        sourceHandle: 'mdr-out',
        targetHandle: 'input-1',
        type: 'wire'
    },

    /**
     * I/O EDGES
     */

    // Input
    {
        id: `${NodeId.IOInput}-${NodeId.Bus}`,
        source: NodeId.IOInput,
        target: NodeId.Bus,
        sourceHandle: 'input',
        targetHandle: 'ioInput',
        type: 'wire'
    },

    // Output
    {
        id: `${NodeId.IOOutput}-${NodeId.Bus}`,
        source: NodeId.IOOutput,
        target: NodeId.Bus,
        sourceHandle: 'input',
        targetHandle: 'ioOutput',
        type: 'wire'
    },

    /**
     * BUS EDGES
     */

    {
        id: `${NodeId.Bus}-${NodeId.PCMux}`,
        source: NodeId.Bus,
        target: NodeId.PCMux,
        sourceHandle: 'pcMux',
        targetHandle: 'input-0',
        type: 'wire'
    },
    {
        id: `${NodeId.Bus}-${NodeId.RegFile}`,
        source: NodeId.Bus,
        target: NodeId.RegFile,
        sourceHandle: 'regFile',
        targetHandle: 'bus',
        type: 'wire'
    },
    {
        id: `${NodeId.Bus}-${NodeId.MdrMux}`,
        source: NodeId.Bus,
        target: NodeId.MdrMux,
        sourceHandle: 'mdrMux',
        targetHandle: 'input-0',
        type: 'wire'
    },
    {
        id: `${NodeId.Bus}-${NodeId.IR}`,
        source: NodeId.Bus,
        target: NodeId.IR,
        sourceHandle: 'ir',
        targetHandle: 'input',
        type: 'wire'
    },
    {
        id: `${NodeId.Bus}-${NodeId.CCLogic}`,
        source: NodeId.Bus,
        target: NodeId.CCLogic,
        sourceHandle: 'ccLogic',
        targetHandle: 'input',
        type: 'wire'
    },
    {
        id: `${NodeId.Bus}-${NodeId.MAR}`,
        source: NodeId.Bus,
        target: NodeId.MAR,
        sourceHandle: 'mar',
        targetHandle: 'input',
        type: 'wire'
    },
    /**
     * SIGNAL EDGES
     */

    {
        id: `${NodeId.SignalLdPC}-${NodeId.PC}`,
        source: NodeId.SignalLdPC,
        target: NodeId.PC,
        sourceHandle: 'output',
        targetHandle: 'ld',
        type: 'wire'
    },
    {
        id: `${NodeId.SignalLdCC}-${NodeId.NZP}`,
        source: NodeId.SignalLdCC,
        target: NodeId.NZP,
        sourceHandle: 'output',
        targetHandle: 'ld',
        type: 'wire'
    },
    {
        id: `${NodeId.SignalLdIR}-${NodeId.IR}`,
        source: NodeId.SignalLdIR,
        target: NodeId.IR,
        sourceHandle: 'output',
        targetHandle: 'ld',
        type: 'wire'
    },
    {
        id: `${NodeId.SignalLdMDR}-${NodeId.MDR}`,
        source: NodeId.SignalLdMDR,
        target: NodeId.MDR,
        sourceHandle: 'output',
        targetHandle: 'ld-mdr',
        type: 'wire'
    },
    {
        id: `${NodeId.SignalLdMar}-${NodeId.MAR}`,
        source: NodeId.SignalLdMar,
        target: NodeId.MAR,
        sourceHandle: 'output',
        targetHandle: 'ld',
        type: 'wire'
    },
    {
        id: `${NodeId.SignalLdReg}-${NodeId.RegFile}`,
        source: NodeId.SignalLdReg,
        target: NodeId.RegFile,
        sourceHandle: 'output',
        targetHandle: 'ld-reg',
        type: 'wire'
    },
    {
        id: `${NodeId.SignalRF_DR}-${NodeId.RegFile}`,
        source: NodeId.SignalRF_DR,
        target: NodeId.RegFile,
        sourceHandle: 'output',
        targetHandle: 'dr',
        type: 'wire'
    },
    {
        id: `${NodeId.SignalRF_SR2}-${NodeId.RegFile}`,
        source: NodeId.SignalRF_SR2,
        target: NodeId.RegFile,
        sourceHandle: 'output',
        targetHandle: 'sr2',
        type: 'wire'
    },
    {
        id: `${NodeId.SignalRF_SR1}-${NodeId.RegFile}`,
        source: NodeId.SignalRF_SR1,
        target: NodeId.RegFile,
        sourceHandle: 'output',
        targetHandle: 'sr1',
        type: 'wire'
    },
    {
        id: `${NodeId.SignalMemEn}-${NodeId.Memory}`,
        source: NodeId.SignalMemEn,
        target: NodeId.Memory,
        sourceHandle: 'output',
        targetHandle: 'mem-en',
        type: 'wire'
    },
    {
        id: `${NodeId.SignalRW}-${NodeId.Memory}`,
        source: NodeId.SignalRW,
        target: NodeId.Memory,
        sourceHandle: 'output',
        targetHandle: 'rw',
        type: 'wire'
    },
    {
        id: `${NodeId.SignalSR1_IR11}-${NodeId.SR1Mux}`,
        source: NodeId.SignalSR1_IR11,
        target: NodeId.SR1Mux,
        sourceHandle: 'output',
        targetHandle: 'input-0',
        type: 'wire'
    },
    {
        id: `${NodeId.SignalSR1_IR8}-${NodeId.SR1Mux}`,
        source: NodeId.SignalSR1_IR8,
        target: NodeId.SR1Mux,
        sourceHandle: 'output',
        targetHandle: 'input-1',
        type: 'wire'
    },
    {
        id: `${NodeId.SignalDR_IR11}-${NodeId.DrMux}`,
        source: NodeId.SignalDR_IR11,
        target: NodeId.DrMux,
        sourceHandle: 'output',
        targetHandle: 'input-0',
        type: 'wire'
    },
    {
        id: `${NodeId.SignalDR_R7}-${NodeId.DrMux}`,
        source: NodeId.SignalDR_R7,
        target: NodeId.DrMux,
        sourceHandle: 'output',
        targetHandle: 'input-1',
        type: 'wire'
    },
];