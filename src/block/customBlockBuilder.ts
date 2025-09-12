import { MOString } from "../types/types";
import { BlockComponentIdentifier, DefaultBlockComponent, MinecraftBlockComponent } from "./blockComponents";
import { BlockPermutation } from "./blockPermutation";
import { BlockState } from "./blockState";
import { MinecraftBlock } from "./interface";
import { BlockPlugin } from "./plugins/type";

/** This class is used to create blocks */
export class CustomBlockBuilder {
    identifier: string
    permutations: BlockPermutation[]
    components: Partial<MinecraftBlockComponent>;
    blockState: BlockState[]


    constructor(identifier: string) {
        this.identifier = identifier;
        this.permutations = [];
        this.blockState = [];
        this.components = {}
    }

    
    
    getBlock() :MinecraftBlock {
        const description = {
            identifier: this.identifier
        }
        return {
            format_version: "1.21.100",
            "minecraft:block": {
                description: description,
                components: this.components,
                //@ts-ignore
                permutations: this.permutations // FIXME
            },

        }

    }

    setComponent<K extends BlockComponentIdentifier>(
        key: K,
        value: DefaultBlockComponent[K]
    ): this;
    
    setComponent(key: string, value: any) {
        this.components[key] = value;
        return this;
    }

    setCustomComponent<K extends string>(
        key: K,
        value: any
    ): this;
    
    setCustomComponent(key: string, value: any) {
        this.components[key] = value;
        return this;
    }

    getComponent<K extends BlockComponentIdentifier>(
        key: K
    ): DefaultBlockComponent[K] | undefined;


    getComponent(key: string) {
        return this.components[key];
    }

    usePlugin(...plugins: BlockPlugin[]) {
        for (const plugin of plugins) {
            plugin(this);
        }
        return this;
    }

}
