import { MOString } from "../types/types";
/** Defines a block Permutation object */
export abstract class BlockPermutation {
    abstract getQuery(): MOString;
}