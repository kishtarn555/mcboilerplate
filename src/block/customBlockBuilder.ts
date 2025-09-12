import { MOString } from "../types/types";
import { MinecraftBlockComponent } from "./blockComponents";
import { BlockPermutation } from "./blockPermutation";
import { BlockState } from "./blockState";
import { MinecraftBlock } from "./interface";




/** This class is used to create blocks */
export class CustomBlockBuilder {
    identifier: string
    permutations: BlockPermutation[]
    components: MinecraftBlockComponent[]
    blockState: BlockState[]


    constructor(identifier: string) {
        this.identifier = identifier;
        this.permutations = [];
        this.blockState = [];
        this.components = []
    }

    
    
    getBlock() :MinecraftBlock {
        const description = {
            identifier: this.identifier
        }
        return {
            format_version: "1.21.100",
            "minecraft:block": {
                description: description,
                //@ts-expect-error
                components: {}, // FIXME
                //@ts-ignore
                permutations: this.permutations // FIXME
            },

        }

    }
}
