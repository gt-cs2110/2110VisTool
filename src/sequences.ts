import dedent from "dedent-js";
import { NodeId } from "./components/flow/LC3Components";
interface MacroData {
    /**
     * THe text label of the macro.
     */
    label: string,
    /**
     * The pseudocode of the macro.
     */
    pseudocode?: PseudocodeState,
    /**
     * The sequence of signals taken in this macro.
     * Each element consists of a single cycle, 
     * which consists of an array of signals in the cycle.
     */
    sequence: string[][]
}
export interface HighlightRange {
    /**
     * Start of the highlight range.
     */
    start: number,
    /**
     * End of the highlight range (exclusive).
     */
    end: number,
    /**
     * Which cycle number (which decides the color) to assign this range.
     * 
     * This can also be "disabled", which indicates a different color type.
     */
    cycle: number | "disabled"
}
export interface PseudocodeState {
    /**
     * The pseudocode text.
     */
    source: string,
    /**
     * Index range to highlight and with which cycle number.
     * 
     * Each range in this list must be disjoint and sorted by start index.
     */
    highlights: HighlightRange[]
}
const DISABLED = "disabled";

/**
 * Creates a `PseudocodeState` object out of a template string.
 * 
 * This function should be called like pseudocode`abc` (yes, without parentheses).
 * Any formatted items should be formatted by replacing the text with ${["text", 1]},
 *     where 1 is the cycle number of the text.
 * 
 * For example, FETCH's pseudocode looks like:
 * ```
 *     IR = mem[PC];
 *     PC = PC + 1;
 * ```
 * If you wanted to light it up such that the PC line and PC text highlights on cycle 0, 
 *     mem[...] on cycle 1, and the rest on cycle 2,
 * you'd enter:
 * ```
 * pseudocode`
 *     ${["IR = ", 2]}${["mem[PC]", 1]}${[";", 2]}
 *     ${["PC = PC + 1;", 0]}
 * `
 * ```
 * 
 * A text segment should not have the text "{@}" and should not cross lines.
 */
function pseudocode(parts: TemplateStringsArray | string, ...subs: [string, HighlightRange["cycle"]][]): PseudocodeState {
    if (typeof parts === "string") return { source: dedent(parts), highlights: [] };
    
    let template = dedent(parts.join("{@}"));
    const highlights: HighlightRange[] = [];

    for (const [source, cycle] of subs) {
        const start = template.indexOf("{@}");
        if (start == -1) {
            throw new TypeError("Input was not a well-formed template string");
        }
        template = template.replace("{@}", source);
        highlights.push({
            start, end: start + source.length, cycle
        });
    }

    highlights.sort((a, b) => a.start - b.start);
    return { source: template, highlights };
}

function edge(source: string, target: string) {
    return `${source}-${target}`;
}

const sequences: Record<string, MacroData> = {
    "FETCH": {
        "label": "Fetch",
        "pseudocode": pseudocode`
            ${["IR = ", 2]}${["mem[", 1]}${["PC", 0]}${["]", 1]}${[";", 2]}
            ${["PC = PC + 1;", 0]}
        `,
        "sequence": [
            [
                // CC1: MAR <- PC
                edge(NodeId.PC, NodeId.GatePC),
                NodeId.GatePC,
                edge(NodeId.GatePC, NodeId.Bus),
                NodeId.Bus,
                edge(NodeId.Bus, NodeId.MAR),
                edge(NodeId.SignalLdMar, NodeId.MAR),
                NodeId.MAR,
                
                // CC1:PC <- PC + 1
                edge(NodeId.PC, NodeId.PCAdder),
                NodeId.PCAdder,
                edge(NodeId.PCAdder, NodeId.PCMux),
                NodeId.PCMux,
                edge(NodeId.PCMux, NodeId.PC),
                edge(NodeId.SignalLdPC, NodeId.PC),
                NodeId.PC,
        ], [
                // CC2: MDR <- Mem[MAR]
                edge(NodeId.MAR, NodeId.Memory),
                NodeId.Memory,
                edge(NodeId.SignalMemEn, NodeId.Memory),
                edge(NodeId.Memory, NodeId.MdrMux),
                NodeId.MdrMux,
                edge(NodeId.MdrMux, NodeId.MDR),
                edge(NodeId.SignalLdMDR, NodeId.MDR),
                NodeId.MDR,
            ], [
                // CC3: IR <- MDR
                edge(NodeId.MDR, NodeId.GateMdr),
                NodeId.GateMdr,
                edge(NodeId.GateMdr, NodeId.Bus),
                NodeId.Bus,
                edge(NodeId.Bus, NodeId.IR),
                edge(NodeId.SignalLdIR, NodeId.IR),
                NodeId.IR,
            ]
        ]
    },
    "DECODE": {
        "label": "Decode",
        "pseudocode": pseudocode`
            ${["IR[15:12] => FSM ", 0]}
        `,
        "sequence": [
            [
                // CC1: FSM <- IR
                edge(NodeId.IR, NodeId.FSM),
                NodeId.FSM
            ]
        ]
    },
    "ADD_REG": {
        "label": "ADD (reg)",
        "pseudocode": pseudocode`
            if (bit[5] == 0)
                ${["DR = SR1 + SR2;", 0]}
            else
                ${["DR = SR1 + SEXT(imm5);", DISABLED]}
            ${["setcc();", 0]}
        `,
        "sequence": [
            [
                // CC1: ALU <- SR1
                edge(NodeId.SignalSR1_IR8, NodeId.SR1Mux),
                NodeId.SR1Mux,
                edge(NodeId.SignalRF_SR1, NodeId.RegFile),
                edge(NodeId.RegFile, NodeId.ALU),

                // CC1: ALU <- SR2
                edge(NodeId.SignalRF_SR2, NodeId.RegFile),
                edge(NodeId.RegFile, NodeId.SR2Mux),
                NodeId.SR2Mux,
                edge(NodeId.ALU, NodeId.SR2Mux),
                edge(NodeId.SR2Mux, NodeId.ALU),

                //CC1: CC <- ALU
                NodeId.ALU,
                edge(NodeId.ALU, NodeId.GateALU),
                NodeId.GateALU,
                edge(NodeId.GateALU, NodeId.Bus),
                NodeId.Bus,
                edge(NodeId.Bus, NodeId.CCLogic),
                NodeId.CCLogic,
                edge(NodeId.CCLogic, NodeId.NZP),
                edge(NodeId.SignalLdCC, NodeId.NZP),
                NodeId.NZP,

                //CC1: RegFile <- Bus
                edge(NodeId.Bus, NodeId.RegFile),
                edge(NodeId.SignalLdReg, NodeId.RegFile),

                //CC1: DRMUX
                edge(NodeId.SignalDR_IR11, NodeId.DrMux),
                NodeId.DrMux,
            ]
        ]
    },
    "ADD_IMM": {
        "label": "ADD (imm)",
        "pseudocode": pseudocode`
            if (bit[5] == 0)
                ${["DR = SR1 + SR2;", DISABLED]}
            else
                ${["DR = SR1 + SEXT(imm5);", 0]}
            ${["setcc();", 0]}
        `,
        "sequence": [
            [
                // CC1: ALU <- SR1
                edge(NodeId.SignalSR1_IR8, NodeId.SR1Mux),
                NodeId.SR1Mux,
                edge(NodeId.SignalRF_SR1, NodeId.RegFile),
                edge(NodeId.RegFile, NodeId.ALU),

                // CC1: ALU <- IR
                edge(NodeId.IR, NodeId.Sext5),
                NodeId.Sext5,
                edge(NodeId.Sext5, NodeId.SR2Mux),
                NodeId.SR2Mux,
                edge(NodeId.SR2Mux, NodeId.ALU),

                //CC1: ALU <- CC
                NodeId.ALU,
                edge(NodeId.ALU, NodeId.GateALU),
                NodeId.GateALU,
                edge(NodeId.GateALU, NodeId.Bus),
                NodeId.Bus,
                edge(NodeId.Bus, NodeId.CCLogic),
                NodeId.CCLogic,
                edge(NodeId.CCLogic, NodeId.NZP),
                edge(NodeId.SignalLdCC, NodeId.NZP),
                NodeId.NZP,

                //CC1: RegFile <- Bus
                edge(NodeId.Bus, NodeId.RegFile),
                edge(NodeId.SignalLdReg, NodeId.RegFile),
                NodeId.RegFile,

                //CC1: DRMUX
                edge(NodeId.SignalDR_IR11, NodeId.DrMux),
                NodeId.DrMux,
            ]
        ]
    },
    "NOT": {
        "label": "NOT",
        "pseudocode": pseudocode`
            ${["DR = NOT(SR);", 0]}
            ${["setcc();", 0]}
        `,
        "sequence": [
            [
                // CC1: ALU <- SR1
                edge(NodeId.SignalSR1_IR8, NodeId.SR1Mux),
                NodeId.SR1Mux,
                edge(NodeId.RegFile, NodeId.ALU),
                edge(NodeId.SignalRF_SR1, NodeId.RegFile),

                //CC1: ALU <- CC
                NodeId.ALU,
                edge(NodeId.ALU, NodeId.GateALU),
                NodeId.GateALU,
                edge(NodeId.GateALU, NodeId.Bus),
                NodeId.Bus,
                edge(NodeId.Bus, NodeId.CCLogic),
                NodeId.CCLogic,
                edge(NodeId.CCLogic, NodeId.NZP),
                edge(NodeId.SignalLdCC, NodeId.NZP),
                NodeId.NZP,

                //CC1: RegFile <- Bus
                edge(NodeId.Bus, NodeId.RegFile),
                edge(NodeId.SignalLdReg, NodeId.RegFile),
                NodeId.RegFile,

                //CC1: DRMUX
                edge(NodeId.SignalDR_IR11, NodeId.DrMux),
                NodeId.DrMux,
            ]
        ]
    },
    "LD": {
        "label": "LD",
        "pseudocode": pseudocode`
            ${["DR = ", 2]}${["mem[", 1]}${["PC + SEXT(PCoffset9)", 0]}${["]", 1]}${[";", 2]}
            ${["setcc();", 2]}
        `,
        "sequence": [
            [
                //CC1: MAR <- IR (SEXT9)
                edge(NodeId.IR, NodeId.Sext9),
                NodeId.Sext9,
                edge(NodeId.Sext9, NodeId.Addr2Mux),
                NodeId.Addr2Mux,
                edge(NodeId.Addr2Mux, NodeId.MarAdder),
                NodeId.MarAdder,
                edge(NodeId.PC, NodeId.Addr1Mux),
                NodeId.Addr1Mux,
                edge(NodeId.MarAdder, NodeId.MarMux),
                NodeId.MarMux,
                edge(NodeId.MarMux, NodeId.GateMarMux),
                NodeId.GateMarMux,
                edge(NodeId.GateMarMux, NodeId.Bus),
                NodeId.Bus,
                edge(NodeId.Bus, NodeId.MAR),
                edge(NodeId.SignalLdMar, NodeId.MAR),
                NodeId.MAR,
            ], [
                //CC2: MEMORY <- MAR
                edge(NodeId.MAR, NodeId.Memory),
                edge(NodeId.SignalMemEn, NodeId.Memory),
                NodeId.Memory,
                edge(NodeId.Memory, NodeId.MdrMux),
                NodeId.MdrMux,
                edge(NodeId.MdrMux, NodeId.MDR),
                edge(NodeId.SignalLdMDR, NodeId.MDR),
                NodeId.MDR,
            ], [
                //CC3: RegFile <- MDR
                edge(NodeId.MDR, NodeId.GateMdr),
                NodeId.GateMdr,
                edge(NodeId.GateMdr, NodeId.Bus),
                NodeId.Bus,
                edge(NodeId.Bus, NodeId.RegFile),
                edge(NodeId.SignalLdReg, NodeId.RegFile),
                edge(NodeId.SignalDR_IR11, NodeId.DrMux),
                NodeId.DrMux,
                NodeId.RegFile,
                //CC3: CC <- Bus
                edge(NodeId.Bus, NodeId.CCLogic),
                NodeId.CCLogic,
                edge(NodeId.CCLogic, NodeId.NZP),
                edge(NodeId.SignalLdCC, NodeId.NZP),
                NodeId.NZP
            ]
        ]
    },
    "LDI": {
        "label": "LDI",
        "pseudocode": pseudocode`
            ${["DR = ", 4]}${["mem[", 3]}${["mem[", 2]}${["PC + SEXT(PCoffset9)", 0]}${["]", 2]}${["]", 3]}${[";", 4]}
            ${["setcc();", 4]}
        `,
        "sequence": [
            [
                //CC1: MAR <- IR (SEXT9)
                edge(NodeId.IR, NodeId.Sext9),
                NodeId.Sext9,
                edge(NodeId.Sext9, NodeId.Addr2Mux),
                NodeId.Addr2Mux,
                edge(NodeId.Addr2Mux, NodeId.MarAdder),
                NodeId.MarAdder,
                edge(NodeId.PC, NodeId.Addr1Mux),
                NodeId.Addr1Mux,
                edge(NodeId.MarAdder, NodeId.MarMux),
                NodeId.MarMux,
                edge(NodeId.MarMux, NodeId.GateMarMux),
                NodeId.GateMarMux,
                edge(NodeId.GateMarMux, NodeId.Bus),
                NodeId.Bus,
                edge(NodeId.Bus, NodeId.MAR),
                edge(NodeId.SignalLdMar, NodeId.MAR),
                NodeId.MAR,
            ], [
                //CC2: MDR <- MAR
                edge(NodeId.MAR, NodeId.Memory),
                edge(NodeId.SignalMemEn, NodeId.Memory),
                NodeId.Memory,
                edge(NodeId.Memory, NodeId.MdrMux),
                NodeId.MdrMux,
                edge(NodeId.MdrMux, NodeId.MDR),
                edge(NodeId.SignalLdMDR, NodeId.MDR),
                NodeId.MDR,
            ], [
                //CC3: RegFile <- MDR
                edge(NodeId.MDR, NodeId.GateMdr),
                NodeId.GateMdr,
                edge(NodeId.GateMdr, NodeId.Bus),
                NodeId.Bus,
                edge(NodeId.Bus, NodeId.MAR),
                edge(NodeId.SignalLdMar, NodeId.MAR),
                NodeId.MAR

            ], [
                //CC4: MAR <- MDR
                edge(NodeId.MAR, NodeId.Memory),
                edge(NodeId.SignalMemEn, NodeId.Memory),
                NodeId.Memory,
                edge(NodeId.Memory, NodeId.MdrMux),
                NodeId.MdrMux,
                edge(NodeId.MdrMux, NodeId.MDR),
                edge(NodeId.SignalLdMDR, NodeId.MDR),
                NodeId.MDR,
            ], [
                //CC5: RegFile <- MDR
                edge(NodeId.MDR, NodeId.GateMdr),
                NodeId.GateMdr,
                edge(NodeId.GateMdr, NodeId.Bus),
                NodeId.Bus,
                edge(NodeId.Bus, NodeId.RegFile),
                edge(NodeId.SignalLdReg, NodeId.RegFile),
                edge(NodeId.SignalRF_DR, NodeId.RegFile),
                edge(NodeId.SignalDR_IR11, NodeId.DrMux),
                NodeId.DrMux,
                NodeId.RegFile,
                //CC5: CC <- Bus
                edge(NodeId.Bus, NodeId.CCLogic),
                NodeId.CCLogic,
                edge(NodeId.CCLogic, NodeId.NZP),
                edge(NodeId.SignalLdCC, NodeId.NZP),
                NodeId.NZP
            ]
        ]
    },
    "LDR": {
        "label": "LDR",
        "pseudocode": pseudocode`
            ${["DR = ", 2]}${["mem[", 1]}${["BaseR + SEXT(offset6)", 0]}${["]", 1]}${[";", 2]}
            ${["setcc();", 2]}
        `,
        "sequence": [
            [
                //CC1: MAR <- IR (SEXT6)
                edge(NodeId.IR, NodeId.Sext6),
                NodeId.Sext6,
                edge(NodeId.Sext6, NodeId.Addr2Mux),
                NodeId.Addr2Mux,
                edge(NodeId.Addr2Mux, NodeId.MarAdder),
                NodeId.MarAdder,
                edge(NodeId.RegFile, NodeId.Addr1Mux),
                NodeId.Addr1Mux,
                edge(NodeId.MarAdder, NodeId.MarMux),
                NodeId.MarMux,
                edge(NodeId.MarMux, NodeId.GateMarMux),
                NodeId.GateMarMux,
                edge(NodeId.GateMarMux, NodeId.Bus),
                NodeId.Bus,
                edge(NodeId.Bus, NodeId.MAR),
                edge(NodeId.SignalLdMar, NodeId.MAR),
                NodeId.MAR,
            ], [
                //CC2: MEMORY <- MAR
                edge(NodeId.MAR, NodeId.Memory),
                edge(NodeId.SignalMemEn, NodeId.Memory),
                NodeId.Memory,
                edge(NodeId.Memory, NodeId.MdrMux),
                NodeId.MdrMux,
                edge(NodeId.MdrMux, NodeId.MDR),
                edge(NodeId.SignalLdMDR, NodeId.MDR),
                NodeId.MDR,
            ], [
                //CC3: RegFile <- MDR
                edge(NodeId.MDR, NodeId.GateMdr),
                NodeId.GateMdr,
                edge(NodeId.GateMdr, NodeId.Bus),
                NodeId.Bus,
                edge(NodeId.Bus, NodeId.RegFile),
                edge(NodeId.SignalLdReg, NodeId.RegFile),
                edge(NodeId.SignalDR_IR11, NodeId.DrMux),
                NodeId.DrMux,
                NodeId.RegFile,
                //CC3: CC <- Bus
                edge(NodeId.Bus, NodeId.CCLogic),
                NodeId.CCLogic,
                edge(NodeId.CCLogic, NodeId.NZP),
                edge(NodeId.SignalLdCC, NodeId.NZP),
                NodeId.NZP
            ]
        ]
    },
    "ST": {
        "label": "ST",
        "pseudocode": pseudocode`
            ${["mem[", 2]}${["PC + SEXT(PCoffset9)", 0]}${["] = ", 2]}${["SR", 1]}${[";", 2]}
        `,
        "sequence": [
            [
                "IR to ZEXT/SEXT (1)",
                "IR to ZEXT/SEXT (2)",
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
                "Top Arrow",
                "Mid Arrow",
                "Low Arrow",
                "BUS to MAR",
                "1 (MAR selector)",
                "MAR selector",
                "MAR (shape)"
            ], [
                "0 (SR1MUX selector)",
                "SR1MUX selector",
                "IR[11:9] (SR1MUX text)",
                "IR[11:9] (SR1MUX selector)",
                "SR1MUX (shape)",
                "SR1MUX (output)",
                "SR1 selector",
                "Register to ALU (joint)",
                "11: PASS",
                "ALU selector",
                "ALU (shape)",
                "1 (Gate.ALU)",
                "ALU selector",
                "Gate.ALU selector",
                "GateALU (shape)",
                "ALU to BUS",
                "Low Arrow",
                "BUS to MDRMUX (1)",
                "BUS to MDRMUX (2)",
                "BUS to MDRMUX (3)",
                "0 (MDRMUX selector)",
                "MDRMUX selector",
                "MDRMUX (shape)",
                "MDRMUX to MDR",
                "1 (LD.MDR)",
                "MDR selector",
                "MDR (shape)"
            ], [
                "1 (RW)",
                "RW selector",
                "1 (MEM.EN)",
                "MEM.EN selector",
                "MAR to MEMORY",
                "MDR to MEMORY",
                "Memory (shape)"
            ]
        ]
    },
    "STI": {
        "label": "STI",
        "pseudocode": pseudocode`
            ${["mem[", 4]}${["mem[", 2]}${["PC + SEXT(PCoffset9)", 0]}${["]", 2]}${["] = ", 4]}${["SR", 3]}${[";", 4]}
        `,
        "sequence": [
            [
                "IR to ZEXT/SEXT (1)",
                "IR to ZEXT/SEXT (2)",
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
                "Top Arrow",
                "Mid Arrow",
                "Low Arrow",
                "BUS to MAR",
                "1 (MAR selector)",
                "MAR selector",
                "MAR (shape)"
            ], [
                "MAR to MEMORY",
                "0 (RW)",
                "RW selector",
                "1 (MEM.EN)",
                "MEM.EN selector",
                "Memory (shape)",
                "MEMORY to MDRMUX (1)",
                "MEMORY to MDRMUX (2)",
                "MEMORY to MDRMUX (3)",
                "1 (MDRMUX selector)",
                "MDRMUX selector",
                "MDRMUX (shape)",
                "MDRMUX to MDR",
                "MDR selector",
                "MDR (shape)"
            ], [
                "GateMDR selector",
                "GateMDR (shape)",
                "MDR to BUS",
                "Low Arrow",
                "BUS to MAR",
                "1 (MAR selector)",
                "MAR selector",
                "MAR (shape)"
            ], [
                "0 (SR1MUX selector)",
                "SR1MUX selector",
                "IR[11:9] (SR1MUX text)",
                "IR[11:9] (SR1MUX selector)",
                "SR1MUX (shape)",
                "SR1MUX (output)",
                "SR1 selector",
                "Register to ALU (joint)",
                "11: PASS",
                "ALU selector",
                "ALU (shape)",
                "1 (Gate.ALU)",
                "Gate.ALU selector",
                "GateALU (shape)",
                "ALU to BUS",
                "Low Arrow",
                "BUS to MDRMUX (1)",
                "BUS to MDRMUX (2)",
                "BUS to MDRMUX (3)",
                "0 (MDRMUX selector)",
                "MDRMUX selector",
                "MDRMUX (shape)",
                "MDRMUX to MDR",
                "1 (LD.MDR)",
                "MDR selector",
                "MDR (shape)"
            ], [
                "1 (RW)",
                "RW selector",
                "1 (MEM.EN)",
                "MEM.EN selector",
                "MAR to MEMORY",
                "MDR to MEMORY",
                "Memory (shape)"
            ]
        ]
    },
    "STR": {
        "label": "STR",
        "pseudocode": pseudocode`
            ${["mem[", 2]}${["BaseR + SEXT(offset6)", 0]}${["] = ", 2]}${["SR", 1]}${[";", 2]}
        `,
        "sequence": [
            [
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
                "1 (SR1MUX selector)",
                "SR1MUX selector",
                "IR[8:6] (SR1MUX text)",
                "IR[8:6] (SR1MUX selector)",
                "SR1MUX (shape)",
                "SR1MUX (output)",
                "SR1 selector",
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
                "Top Arrow",
                "Mid Arrow",
                "Low Arrow",
                "BUS to MAR",
                "1 (MAR selector)",
                "MAR selector",
                "MAR (shape)"
            ], [
                "0 (SR1MUX selector)",
                "SR1MUX selector",
                "IR[11:9] (SR1MUX text)",
                "IR[11:9] (SR1MUX selector)",
                "SR1MUX (shape)",
                "SR1MUX (output)",
                "SR1 selector",
                "Register to ALU (joint)",
                "11: PASS",
                "ALU selector",
                "ALU (shape)",
                "1 (Gate.ALU)",
                "Gate.ALU selector",
                "GateALU (shape)",
                "ALU to BUS",
                "Low Arrow",
                "BUS to MDRMUX (1)",
                "BUS to MDRMUX (2)",
                "BUS to MDRMUX (3)",
                "0 (MDRMUX selector)",
                "MDRMUX selector",
                "MDRMUX (shape)",
                "MDRMUX to MDR",
                "1 (LD.MDR)",
                "MDR selector",
                "MDR (shape)"
            ], [
                "1 (RW)",
                "RW selector",
                "1 (MEM.EN)",
                "MEM.EN selector",
                "MAR to MEMORY",
                "MDR to MEMORY",
                "Memory (shape)"
            ]
        ]
    },
    "LEA": {
        "label": "LEA",
        "pseudocode": pseudocode`
            ${["DR = PC + SEXT(PCoffset9);", 0]}
        `,
        "sequence": [
            [
                "IR to ZEXT/SEXT (1)",
                "IR to ZEXT/SEXT (2)",
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
                "Top Arrow",
                "Bus to Register",
                "00 (DRMUX selector)",
                "DRMUX selector",
                "IR[11:9] (DRMUX text)",
                "IR[11:9] (DRMUX selector)",
                "DRMUX (shape)",
                "DRMUX (output)",
                "DR selector",
                "1 (LD.REG)",
                "LD.REG selector",
                "Register File (shape)"
            ]
        ]
    },
    "BR": {
        "label": "BR (taken)",
        "pseudocode": pseudocode`
            if ((n AND N) OR (z AND Z) OR (p AND P))
                ${["PC = PC + SEXT(PCoffset9);", 0]}
        `,
        "sequence": [
            [
                "IR to ZEXT/SEXT (1)",
                "IR to ZEXT/SEXT (2)",
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
                "0 (ADDR1MUX selector)",
                "ADDR1MUX selector",
                "ADDR1MUX (shape)",
                "ADDR1MUX to ADDR (1)",
                "ADDR1MUX to ADDR (2)",
                "ADDR1MUX to ADDR (3)",
                "ADDR (shape)",
                "ADDR to MUXES (joint)",
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
        ]
    },
    "JMP": {
        "label": "JMP",
        "pseudocode": pseudocode`
            ${["PC = BaseR;", 0]}
        `,
        "sequence": [
            [
                "1 (SR1MUX selector)",
                "SR1MUX selector",
                "IR[8:6] (SR1MUX text)",
                "IR[8:6] (SR1MUX selector)",
                "SR1MUX (shape)",
                "SR1MUX (output)",
                "SR1 selector",
                "Register to ALU (joint)",
                "SR1 to ADDR1MUX (1)",
                "SR1 to ADDR1MUX (2)",
                "1 (ADDR1MUX selector)",
                "ADDR1MUX selector",
                "ADDR1MUX (shape)",
                "ADDR1MUX to ADDR (1)",
                "ADDR1MUX to ADDR (2)",
                "ADDR1MUX to ADDR (3)",
                "0 (16-bit) (text)",
                "00 ADDR2MUX input",
                "00 (ADDR2MUX selector)",
                "ADDR2 selector",
                "ADDR2MUX (shape)",
                "ADDR2MUX to ADDR (1)",
                "ADDR2MUX to ADDR (2)",
                "ADDR2MUX to ADDR (3)",
                "ADDR (shape)",
                "ADDR to MUXES (joint)",
                "ADDR to PCMUX (2)",
                "ADDR to PCMUX (3)",
                "PCMUX selector",
                "PCMUX (shape)",
                "PCMUX to PC",
                "1 (LD.PC)",
                "PC selector",
                "PC (shape)"
            ]
        ]
    },
    "JSR": {
        "label": "JSR",
        "pseudocode": pseudocode`
            ${["[R7, PC] = [PC, PC + SEXT(PCOffset11)];", 0]}
        `,
        "sequence": [
            [
                "1 (GatePC)",
                "GatePC selector",
                "GatePC (shape)",
                "PC to BUS",      
                "Top Arrow",
                "Bus to Register",
                "01 (DRMUX selector)",
                "DRMUX selector",
                "Reg 7 (DRMUX text)",
                "Reg 7 (DRMUX selector)",
                "DRMUX (shape)",
                "DRMUX (output)",
                "DR selector",
                "1 (LD.REG)",
                "LD.REG selector",
                "Register File (shape)",
                "IR to ZEXT/SEXT (1)",
                "IR to ZEXT/SEXT (2)",
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
                "0 (ADDR1MUX selector)",
                "ADDR1MUX selector",
                "ADDR1MUX (shape)",
                "ADDR1MUX to ADDR (1)",
                "ADDR1MUX to ADDR (2)",
                "ADDR1MUX to ADDR (3)",
                "ADDR (shape)",
                "ADDR to MUXES (joint)",
                "ADDR to PCMUX (2)",
                "ADDR to PCMUX (3)",
                "PCMUX selector",
                "PCMUX (shape)",
                "PCMUX to PC",
                "1 (LD.PC)",
                "PC selector",
                "PC (shape)"
            ]
        ]
    },
    "JSRR": {
        "label": "JSRR",
        "pseudocode": pseudocode`
            ${["[R7, PC] = [PC, BaseR];", 0]}
        `,
        "sequence": [
            [
                "1 (GatePC)",
                "GatePC selector",
                "GatePC (shape)",
                "PC to BUS",
                "Top Arrow",
                "Bus to Register",
                "01 (DRMUX selector)",
                "DRMUX selector",
                "Reg 7 (DRMUX text)",
                "Reg 7 (DRMUX selector)",
                "DRMUX (shape)",
                "DRMUX (output)",
                "DR selector",
                "1 (LD.REG)",
                "LD.REG selector",
                "Register File (shape)",
                "1 (SR1MUX selector)",
                "SR1MUX selector",
                "IR[8:6] (SR1MUX text)",
                "IR[8:6] (SR1MUX selector)",
                "SR1MUX (shape)",
                "SR1MUX (output)",
                "SR1 selector",
                "Register to ALU (joint)",
                "SR1 to ADDR1MUX (1)",
                "SR1 to ADDR1MUX (2)",
                "1 (ADDR1MUX selector)",
                "ADDR1MUX selector",
                "ADDR1MUX (shape)",
                "ADDR1MUX to ADDR (1)",
                "ADDR1MUX to ADDR (2)",
                "ADDR1MUX to ADDR (3)",
                "0 (16-bit) (text)",
                "00 ADDR2MUX input",
                "00 (ADDR2MUX selector)",
                "ADDR2 selector",
                "ADDR2MUX (shape)",
                "ADDR2MUX to ADDR (1)",
                "ADDR2MUX to ADDR (2)",
                "ADDR2MUX to ADDR (3)",
                "ADDR (shape)",
                "ADDR to MUXES (joint)",
                "ADDR to PCMUX (2)",
                "ADDR to PCMUX (3)",
                "PCMUX selector",
                "PCMUX (shape)",
                "PCMUX to PC",
                "1 (LD.PC)",
                "PC selector",
                "PC (shape)"
            ]
        ]

    },
    "TRAP": {
        "label": "TRAP (simplified)",
        "pseudocode": pseudocode`
            (interrupt logic)
            ${["PC = ", 2]}${["mem[", 1]}${["ZEXT(trapvect8)", 0]}${["]", 1]}${[";", 2]}
        `,
        "sequence": [
            [
                "IR to ZEXT/SEXT (1)",
                "IR to ZEXT/SEXT (2)",
                "ZEXT shape",
                "ZEXT to MARMUX (1)",
                "ZEXT to MARMUX (2)",
                "ZEXT to MARMUX (3)",
                "0 (MARMUX selector)",
                "MARMUX selector",
                "MARMUX (shape)",
                "1 (GateMARMUX)",
                "GateMARMUX selector",
                "GateMARMUX (shape)",
                "MARMUX to BUS",
                "Top Arrow",
                "Mid Arrow",
                "Low Arrow",
                "BUS to MAR",
                "1 (MAR selector)",
                "MAR selector",
                "MAR (shape)"
            ], [
                "MAR to MEMORY",
                "0 (RW)",
                "RW selector",
                "1 (MEM.EN)",
                "MEM.EN selector",
                "Memory (shape)",
                "MEMORY to MDRMUX (1)",
                "MEMORY to MDRMUX (2)",
                "MEMORY to MDRMUX (3)",
                "1 (MDRMUX selector)",
                "MDRMUX selector",
                "MDRMUX (shape)",
                "MDRMUX to MDR",
                "1 (LD.MDR)",
                "MDR selector",
                "MDR (shape)"
            ], [
                "1 (GateMDR text)",
                "GateMDR selector",
                "GateMDR (shape)",
                "MDR to BUS",
                "Low Arrow",
                "Mid Arrow",
                "Top Arrow",
                "Bus to PCMUX (1)",
                "Bus to PCMUX (2)",
                "Bus to PCMUX (3)",
                "10 (PCMUX selector)",
                "PCMUX selector",
                "PCMUX (shape)",
                "PCMUX to PC",
                "1 (LD.PC)",
                "PC selector",
                "PC (shape)"
            ]
        ]
    }
}
export default sequences;