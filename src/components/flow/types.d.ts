import type { Component } from "vue";
import type { Node, NodeProps, HandleType } from '@vue-flow/core';

import type ALUNode from "./ALUNode.vue";
import type LogicNode from "./LogicNode.vue";
import type MuxNode from "./MuxNode.vue";
import type TriStateNode from "./TriStateNode.vue";
import type ExtenderNode from "./ExtenderNode.vue";
import type BusNode from "./BusNode.vue";

type NodeTypeOf<Type extends string, C> = C extends Component<NodeProps<infer P>>
    ? Node<P, any, Type>
    : never;

export type LC3Node =
    | NodeTypeOf<"alu", typeof ALUNode>
    | NodeTypeOf<"logic", typeof LogicNode>
    | NodeTypeOf<"mux", typeof MuxNode>
    | NodeTypeOf<"tristate", typeof TriStateNode>
    | NodeTypeOf<"bus", typeof BusNode>;

/**
 * A list of all special properties used for positioning + identifying handles
 * in LC3 nodes.
 */
export interface HandleProperties {
    /**
     * ID of the handle
     */
    id?: string,
    /**
     * Which side this handle is placed on
     */
    side: Position,
    /**
     * Whether the handle is an input (source) or an output (target)
     */
    handle: HandleType,
    /**
     * CSS value which details how far along the node edge the handle is from the top or left edge.
     * If not specified, this is assumed to be halfway along the node edge.
     */
    distance?: string,
    /**
     * CSS value which details how far into the node the handle should be.
     * If not specified, this is assumed to be along the edge.
     */
    depth?: string
}