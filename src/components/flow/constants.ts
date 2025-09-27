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
    height: 3 * GRID_GAP_SIZE,
}

/**
 * Dimensions of an ALU/adder.
 */
export const ALU_DIMS = {
    width:  9 * GRID_GAP_SIZE,
    height: DEFAULT_NODE_DIMS.height,
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
 * Dimensions of a generic node.
 * 
 * For logic, this is the width/height of the rectangle.
 * For muxes, the width is the long side 
 *     and the height is the short side.
 */
export const LABEL_DIMS = {
    width:  4 * GRID_GAP_SIZE,
    height: 2 * GRID_GAP_SIZE,
}

/**
 * Dimensions of the PC [+1] adder logic.
 */
export const PC_ADDER_DIMS = {
    width:  2 * GRID_GAP_SIZE,
    height: 2 * GRID_GAP_SIZE
}

/**
 * Dimensions of sign extenders.
 */
export const SEXT_NODE_DIMS = {
    width: 7 * GRID_GAP_SIZE,
    height: 2 * GRID_GAP_SIZE,
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
    width: 6 * GRID_GAP_SIZE,
    height: 2 * GRID_GAP_SIZE
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
    height: 9.5 * GRID_GAP_SIZE
}

/**
 * Dimensions for memory.
 */
export const MEMORY_DIMS = {
    width: 8 * GRID_GAP_SIZE,
    height: 5 * GRID_GAP_SIZE
}