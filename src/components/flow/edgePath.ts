// Derived from Vue Flow src/components/Edges/utils/smoothstep.ts
// https://github.com/bcakmakoglu/vue-flow/blob/80c2b52d8f404ce4889a3172e16411c24a104ae7/packages/core/src/components/Edges/utils/smoothstep.ts#L6

import { type XYPosition } from '@vue-flow/core'

type EdgePathParams = [path: string, labelX: number, labelY: number, offsetX: number, offsetY: number];

function distance(a: XYPosition, b: XYPosition) {
    return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2)
}

function getBend(a: XYPosition, b: XYPosition, c: XYPosition, size: number): string {
    const bendSize = Math.min(distance(a, b) / 2, distance(b, c) / 2, size)
    const { x, y } = b

    // no bend
    if ((a.x === x && x === c.x) || (a.y === y && y === c.y)) {
        return `L${x} ${y}`
    }

    // first segment is horizontal
    if (a.y === y) {
        const xDir = a.x < c.x ? -1 : 1
        const yDir = a.y < c.y ? 1 : -1
        return `L ${x + bendSize * xDir},${y}Q ${x},${y} ${x},${y + bendSize * yDir}`
    }

    const xDir = a.x < c.x ? 1 : -1
    const yDir = a.y < c.y ? -1 : 1
    return `L ${x},${y + bendSize * yDir}Q ${x},${y} ${x + bendSize * xDir},${y}`
}

export function getManualPath(params: {
    source: XYPosition,
    intermediate?: XYPosition[]
    target: XYPosition,
    borderRadius?: number
}): EdgePathParams {
    const borderRadius = params.borderRadius ?? 5;
    
    const points = [params.source, ...(params.intermediate ?? []), params.target];
    const path = points.reduce((res, p, i) => {
        let segment;

        if (i > 0 && i < points.length - 1) {
            segment = getBend(points[i - 1], p, points[i + 1], borderRadius);
        } else {
            segment = `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`;
        }

        return res + segment;
    }, '');

    return [path, 0, 0, 0, 0];
}