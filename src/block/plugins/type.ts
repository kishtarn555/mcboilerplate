import type { CustomBlockBuilder } from "../customBlockBuilder";

export type BlockPlugin = (target: CustomBlockBuilder) => any;
