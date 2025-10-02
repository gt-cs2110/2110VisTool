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
                edge(NodeId.Addr1Mux, NodeId.MarAdder),
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
                edge(NodeId.Addr1Mux, NodeId.MarAdder),
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
                edge(NodeId.Addr1Mux, NodeId.MarAdder),
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
                //CC1: MAR <- IR (SEXT9)
                edge(NodeId.IR, NodeId.Sext9),
                NodeId.Sext9,
                edge(NodeId.Sext9, NodeId.Addr2Mux),
                NodeId.Addr2Mux,
                edge(NodeId.Addr2Mux, NodeId.MarAdder),
                NodeId.MarAdder,
                edge(NodeId.PC, NodeId.Addr1Mux),
                NodeId.Addr1Mux,
                edge(NodeId.Addr1Mux, NodeId.MarAdder),
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
                //CC2: MDR <- RegFile
                edge(NodeId.SignalSR1_IR11, NodeId.SR1Mux),
                NodeId.SR1Mux,
                edge(NodeId.SignalRF_SR1, NodeId.RegFile),
                edge(NodeId.RegFile, NodeId.ALU),
                NodeId.ALU,
                edge(NodeId.ALU, NodeId.GateALU),
                NodeId.GateALU,
                edge(NodeId.GateALU, NodeId.Bus),
                NodeId.Bus,
                edge(NodeId.Bus, NodeId.MdrMux),
                NodeId.MdrMux,
                edge(NodeId.SignalLdMDR, NodeId.MDR),
                edge(NodeId.MdrMux, NodeId.MDR),
            ], [
                //CC3: MEM <- MDR, MEM <- MAR
                edge(NodeId.MDR, NodeId.Memory),
                edge(NodeId.MAR, NodeId.Memory),
                NodeId.Memory,
                edge(NodeId.SignalMemEn, NodeId.Memory),
                edge(NodeId.SignalRW, NodeId.Memory),
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
                //CC1: MAR <- IR (SEXT9)
                edge(NodeId.IR, NodeId.Sext9),
                NodeId.Sext9,
                edge(NodeId.Sext9, NodeId.Addr2Mux),
                NodeId.Addr2Mux,
                edge(NodeId.Addr2Mux, NodeId.MarAdder),
                NodeId.MarAdder,
                edge(NodeId.PC, NodeId.Addr1Mux),
                NodeId.Addr1Mux,
                edge(NodeId.Addr1Mux, NodeId.MarAdder),
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
                //CC3: MAR <- MDR
                edge(NodeId.MDR, NodeId.GateMdr),
                NodeId.GateMdr,
                edge(NodeId.GateMdr, NodeId.Bus),
                NodeId.Bus,
                edge(NodeId.Bus, NodeId.MAR),
                edge(NodeId.SignalLdMar, NodeId.MAR),
                NodeId.MAR

            ], [
                //CC4: MDR <- RegFile
                edge(NodeId.SignalSR1_IR11, NodeId.SR1Mux),
                NodeId.SR1Mux,
                edge(NodeId.SignalRF_SR1, NodeId.RegFile),
                edge(NodeId.RegFile, NodeId.ALU),
                NodeId.ALU,
                edge(NodeId.ALU, NodeId.GateALU),
                NodeId.GateALU,
                edge(NodeId.GateALU, NodeId.Bus),
                NodeId.Bus,
                edge(NodeId.Bus, NodeId.MdrMux),
                NodeId.MdrMux,
                edge(NodeId.MdrMux, NodeId.MDR),
                edge(NodeId.SignalLdMDR, NodeId.MDR),
                NodeId.MDR
            ], [
                //CC5: MEM <- MDR, MEM <- MAR
                edge(NodeId.MDR, NodeId.Memory),
                edge(NodeId.MAR, NodeId.Memory),
                NodeId.Memory,
                edge(NodeId.SignalMemEn, NodeId.Memory),
                edge(NodeId.SignalRW, NodeId.Memory),
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
                //CC1: MAR <- IR (SEXT6)
                edge(NodeId.IR, NodeId.Sext6),
                NodeId.Sext6,
                edge(NodeId.Sext6, NodeId.Addr2Mux),
                NodeId.Addr2Mux,
                edge(NodeId.Addr2Mux, NodeId.MarAdder),
                NodeId.MarAdder,
                edge(NodeId.RegFile, NodeId.Addr1Mux),
                NodeId.Addr1Mux,
                edge(NodeId.Addr1Mux, NodeId.MarAdder),
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
                //CC2: MDR <- RegFile
                edge(NodeId.SignalSR1_IR11, NodeId.SR1Mux),
                NodeId.SR1Mux,
                edge(NodeId.SignalRF_SR1, NodeId.RegFile),
                edge(NodeId.RegFile, NodeId.ALU),
                NodeId.ALU,
                edge(NodeId.ALU, NodeId.GateALU),
                NodeId.GateALU,
                edge(NodeId.GateALU, NodeId.Bus),
                NodeId.Bus,
                edge(NodeId.Bus, NodeId.MdrMux),
                NodeId.MdrMux,
                edge(NodeId.SignalLdMDR, NodeId.MDR),
                NodeId.MDR,
                edge(NodeId.MdrMux, NodeId.MDR),
            ], [
                //CC3: MEM <- MDR, MEM <- MAR
                edge(NodeId.MDR, NodeId.Memory),
                edge(NodeId.MAR, NodeId.Memory),
                NodeId.Memory,
                edge(NodeId.SignalMemEn, NodeId.Memory),
                edge(NodeId.SignalRW, NodeId.Memory),
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
                //CC1: RegFile <- IR (SEXT9)
                edge(NodeId.IR, NodeId.Sext9),
                NodeId.Sext9,
                edge(NodeId.Sext9, NodeId.Addr2Mux),
                NodeId.Addr2Mux,
                edge(NodeId.Addr2Mux, NodeId.MarAdder),
                NodeId.MarAdder,
                edge(NodeId.PC, NodeId.Addr1Mux),
                NodeId.Addr1Mux,
                edge(NodeId.Addr1Mux, NodeId.MarAdder),
                edge(NodeId.MarAdder, NodeId.MarMux),
                NodeId.MarMux,
                edge(NodeId.MarMux, NodeId.GateMarMux),
                NodeId.GateMarMux,
                edge(NodeId.GateMarMux, NodeId.Bus),
                NodeId.Bus,
                edge(NodeId.Bus, NodeId.RegFile),
                NodeId.RegFile,
                edge(NodeId.SignalLdReg, NodeId.RegFile),
                edge(NodeId.SignalRF_DR, NodeId.RegFile), 
                edge(NodeId.SignalDR_IR11, NodeId.DrMux),
                NodeId.DrMux 
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
                //CC1: PC <- IR (SEXT9)
                edge(NodeId.IR, NodeId.Sext9),
                NodeId.Sext9,
                edge(NodeId.Sext9, NodeId.Addr2Mux),
                NodeId.Addr2Mux,
                edge(NodeId.Addr2Mux, NodeId.MarAdder),
                edge(NodeId.PC, NodeId.Addr1Mux),
                NodeId.Addr1Mux,
                edge(NodeId.Addr1Mux, NodeId.MarAdder),
                NodeId.MarAdder,
                edge(NodeId.MarAdder, NodeId.PCMux),
                NodeId.PCMux,
                edge(NodeId.PCMux, NodeId.PC),
                edge(NodeId.SignalLdPC, NodeId.PC),
                NodeId.PC
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
                //CC1: PC <- RegFile
                edge(NodeId.SignalSR1_IR8, NodeId.SR1Mux),
                NodeId.SR1Mux,
                edge(NodeId.SignalRF_SR1, NodeId.RegFile),
                edge(NodeId.RegFile, NodeId.ALU),
                NodeId.ALU,
                edge(NodeId.ALU, NodeId.GateALU),
                NodeId.GateALU, 
                edge(NodeId.GateALU, NodeId.Bus),
                NodeId.Bus, 
                edge(NodeId.Bus, NodeId.PCMux),
                NodeId.PCMux,
                edge(NodeId.PCMux, NodeId.PC),
                edge(NodeId.SignalLdPC, NodeId.PC),
                NodeId.PC
            ]
        ]
    },
    "JSR": {
        "label": "JSR",
        "pseudocode": pseudocode`
            ${["R7 = PC", 0]}
            ${["PC = PC + SEXT(PCoffset9);", 0]}
        `,
        "sequence": [
            [
                //CC1: R7 <- PC
                edge(NodeId.PC, NodeId.GatePC),
                NodeId.GatePC,
                edge(NodeId.GatePC, NodeId.Bus),
                NodeId.Bus,
                edge(NodeId.SignalDR_R7, NodeId.DrMux),
                NodeId.DrMux,
                edge(NodeId.Bus, NodeId.RegFile),
                edge(NodeId.SignalRF_DR, NodeId.RegFile),
                edge(NodeId.SignalLdReg, NodeId.RegFile),
                NodeId.RegFile,

                //CC1: PC <- PC + SEXT11
                edge(NodeId.IR, NodeId.Sext11),
                NodeId.Sext11,
                edge(NodeId.Sext11, NodeId.Addr2Mux),
                NodeId.Addr2Mux,
                edge(NodeId.Addr2Mux, NodeId.MarAdder),
                edge(NodeId.PC, NodeId.Addr1Mux),
                NodeId.Addr1Mux,
                edge(NodeId.Addr1Mux, NodeId.MarAdder),
                NodeId.MarAdder,
                edge(NodeId.MarAdder, NodeId.PCMux),
                NodeId.PCMux,
                edge(NodeId.PCMux, NodeId.PC),
                NodeId.PC,
                edge(NodeId.SignalLdPC, NodeId.PC),
            ]
        ]
    },
    "JSRR": {
        "label": "JSRR",
        "pseudocode": pseudocode`
            ${["R7 = PC", 0]}
            ${["PC = BaseR;", 0]}
        `,
        "sequence": [
            [   
                //CC1: R7 <- PC
                edge(NodeId.PC, NodeId.GatePC),
                NodeId.GatePC,
                edge(NodeId.GatePC, NodeId.Bus),
                NodeId.Bus,
                edge(NodeId.SignalDR_R7, NodeId.DrMux),
                NodeId.DrMux,
                edge(NodeId.Bus, NodeId.RegFile),
                edge(NodeId.SignalRF_DR, NodeId.RegFile),
                edge(NodeId.SignalLdReg, NodeId.RegFile),
                NodeId.RegFile,

                //CC1: PC <- BaseR
                edge(NodeId.SignalSR1_IR8, NodeId.SR1Mux),
                NodeId.SR1Mux,
                edge(NodeId.SignalRF_SR1, NodeId.RegFile),
                edge(NodeId.RegFile, NodeId.Addr1Mux),
                NodeId.Addr1Mux,
                edge(NodeId.Addr1Mux, NodeId.MarAdder),

                //TODO: Add 00 wire ADDR2MUX
                NodeId.Addr2Mux,
                edge(NodeId.Addr2Mux, NodeId.MarAdder),
                NodeId.MarAdder,
                edge(NodeId.MarAdder, NodeId.PCMux),
                NodeId.PCMux,
                edge(NodeId.PCMux, NodeId.PC),
                NodeId.PC,
                edge(NodeId.PC, NodeId.SignalLdPC),
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
                //CC1:MAR <- IR (ZEXT8)
                edge(NodeId.IR, NodeId.Zext8),
                NodeId.Zext8,
                edge(NodeId.Zext8, NodeId.MarMux),
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
                //CC3: PC <- MDR
                edge(NodeId.MDR, NodeId.GateMdr),
                NodeId.GateMdr,
                edge(NodeId.GateMdr, NodeId.Bus),
                NodeId.Bus,
                edge(NodeId.Bus, NodeId.PCMux),
                NodeId.PCMux,
                edge(NodeId.SignalLdPC, NodeId.PC),
                edge(NodeId.PCMux, NodeId.PC),
                NodeId.PC
            ]
        ]
    }
}
export default sequences;