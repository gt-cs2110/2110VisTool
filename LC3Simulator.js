// LC-3 Simulator Backend

class LC3Simulator {
    constructor() {

        this.currClockCycle = 0;

        this.instructions = {
            ADD_IMMEDIATE: false,
            ADD_REGISTER: false,
            AND_IMMEDIATE: false,
            AND_REGISTER: false,
            LD: false,
            LDI: false,
            LDR: false,
            ST: false,
            STI: false,
            STR: false,
            LEA: false,
            FETCH: false
            //may add more later (BR, JMP, TRAP, etc.)
        }

        // Microoperations and control signals
        this.controlSignals = {
            LD_MAR: false,
            LD_MDR: false,
            LD_IR: false,
            LD_PC: false,
            LD_REG: false,
            LD_CC: false,
            MEM_EN: false,
            GATE_PC: false,
            GATE_MDR: false,
            GATE_ALU: false,
            GATE_MARMUX: false
        };

        this.muxSignals = {
            ALU: 0,
            MARMUX: 0,
            PCMUX: 0,
            DRMUX: 0,
            SR1MUX: 0,
            SR2MUX: 0,
            ADDR1MUX: 0,
            ADDR2MUX: 0,
            MEM_RW: 0
        }
  
    }
  
    // Reset the entire simulator state
    reset() {
        this.controlSignals = Object.fromEntries(
            Object.keys(this.controlSignals).map(key => [key, false])
        );

        this.muxSignals = Object.fromEntries(
            Object.keys(this.muxSignals).map(key => [key, 0])
        );

        //reset instructions once we figure out how to structure it ig
    }
  
    // Fetch instruction cycle
    fetch() {
        if (this.currClockCycle == 1) {
            // Load PC into MAR
            this.controlSignals.GATE_PC = true;
            this.controlSignals.LD_MAR = true;
            // Increment PC
            this.controlSignals.LD_PC = true;
        } else if (this.currClockCycle == 2) {
            // Read memory into MDR
            this.controlSignals.GATE_MDR = true;
            this.controlSignals.MEM_EN = true;
            this.muxSignals.MEM_RW = 0;
        } else if (this.currClockCycle == 3) {
            // Load instruction register
            this.controlSignals.GATE_MDR = true;
            this.controlSignals.LD_IR = true;
        }
        
        //datapath for fetch

    }
  

    // Execute ADD instruction
    executeADD() {
 
    }
  
    // Execute AND instruction
    executeAND() {
 
    }
  
  
  }
  
  // Export for use in frontend
  export default LC3Simulator;