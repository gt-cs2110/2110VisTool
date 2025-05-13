export type VerticalOrientation = "up" | "down";
export type HorizontalOrientation = "left" | "right";
export type Orientation = VerticalOrientation | HorizontalOrientation;

/**
 * Given a function which generates points, draw it to fit within the specified bounding box
 * and rotate it to match the orientation.
 * @param draw The function to generate the points.
 *     This creates the points on the main-cross axes, where "main" represents the axis parallel to the input/output ports,
 *     and "cross" represents the axis perpendicular to the input/output ports.
 * 
 *     Alternatively, you can think of it as a function which draws the component facing right.
 * @param orientation The orientation to draw the component.
 * @param width The width (x-axis length) of the bounding box where the component should be drawn.
 * @param height The height (y-axis length) of the bounding box where the component should be drawn.
 * @returns the new points in the x-y coordinate system.
 */
export function drawOriented(
    draw: (mainAxis: number, crossAxis: number) => readonly (readonly [main: number, cross: number])[],
    orientation: Orientation,
    width: number,
    height: number
): [x: number, y: number][] {
    const vertical = orientation === "up" || orientation === "down";
    const flip = orientation === "up" || orientation === "left";
    const [mainAxis, crossAxis] = vertical ? [height, width] : [width, height];

    return draw(mainAxis, crossAxis)
        .map(([m, c]) => {
            // If we need to flip, then we need to invert the main axis coordinate.
            if (flip) m = mainAxis - m;
            // If vertical, [main axis, cross axis] is [y, x],
            // If horizontal, [main axis, cross axis] is [x, y].
            return vertical ? [c, m] : [m, c];
        });
}