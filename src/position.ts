const OUTER_LABEL_GAP = 20;
export const computeLabelProps = (position: "up" | "down" | "left" | "right", x: number, y: number, width: number, height: number) => {
    if (position == "up") {
        return {
            x: x + width / 2,
            y: y - OUTER_LABEL_GAP,
            width: 0,
            height: 0,
            over: "background",
            overflow: "center"
        };
    } else if (position == "down") {
        return {
            x: x + width / 2,
            y: y + height + OUTER_LABEL_GAP,
            width: 0,
            height: 0,
            over: "background",
            overflow: "center"
        };
    } else if (position == "left") {
        return {
            x: x - OUTER_LABEL_GAP,
            y: y + height / 2,
            width: 0,
            height: 0,
            over: "background",
            overflow: "left"
        };
    } else if (position == "right") {
        return {
            x: x + width + OUTER_LABEL_GAP,
            y: y + height / 2,
            width: 0,
            height: 0,
            over: "background",
            overflow: "right"
        };
    } else {
        return position satisfies never;
    }
};