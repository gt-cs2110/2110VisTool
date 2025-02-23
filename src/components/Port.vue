<!-- Text, word-wrappable and enclosed in an invisible box. -->

<script setup lang="ts">
import { computed } from 'vue';

    const { x, y, r = 10, orientation, ports, label = "", labelSize = "sm" } = defineProps<{
        /**
         * Leftmost X position of component
         */
        x: number,
        /**
         * Topmost Y position of component
         */
        y: number,
        /**
         * The radius of the port
         */
        r: number,
        /**
         * The direction of the port tail.
         */
        orientation: "up" | "down" | "left" | "right",
        ports: number | string[],
        /**
         * The label for this component.
         */
        label?: string,
        /**
         * The size of the label for this component.
         */
        labelSize?: "sm" | "md" | "lg",
    }>();

    const direction = computed(() => {
        if (orientation == "up") {
            return { dx:  0, dy: -1, vert: true  };
        } else if (orientation == "down") {
            return { dx:  0, dy: +1, vert: true  };
        } else if (orientation == "left") {
            return { dx: -1, dy:  0, vert: false };
        } else if (orientation == "right") {
            return { dx: +1, dy:  0, vert: false };
        } else {
            return { dx:  0, dy:  0, vert: false };
        }
    })
    const point2 = computed(() => ({ x: x + direction.value.dx * 3 * r, y: y + direction.value.dy * 3 * r }));
    const labelProps = computed(() => {
        const { dx, dy, vert } = direction.value;

        if (vert) {
            return {
                overflow: "center",
                x: x,
                y: y + dy * 7 * r,
            }
        } else {
            return {
                overflow: dx > 0 ? "right" : dx < 0 ? "left" : "center",
                x: x + dx * r,
                y: y - 4 * r,
            }
        }
    })

    const portNames = computed(() => {
        if (typeof ports === "number") {
            const bits = (ports - 1).toString(2).length;
            return Array.from({ length: ports }).map((_, i) => i.toString(2).padStart(bits, '0'));
        } else {
            const bits = ports.length.toString(2).length;
            return ports.map((s, i) => `${i.toString(2).padStart(bits, '0')}: ${s}`);
        }
    })
</script>

<template>
    <g class="diagram-port">
        <TextBox v-bind="labelProps" :width="0" :height="0" :size="labelSize" over="background">
            {{ label }}
        </TextBox>
        <TextBox :x="point2.x" :y="point2.y + direction.dy * r" :width="0" :height="0" :size="labelSize" over="background" :overflow="labelProps.overflow">
            {{ direction.vert ? portNames.join('\xA0\xA0') : portNames.join('\n') }}
        </TextBox>
        <circle :cx="x" :cy="y" :r="r" />
        <line :x1="x" :y1="y" :x2="point2.x" :y2="point2.y" />
    </g>
</template>