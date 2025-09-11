import type { Component } from "vue";
import type { Node, NodeProps } from '@vue-flow/core';

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