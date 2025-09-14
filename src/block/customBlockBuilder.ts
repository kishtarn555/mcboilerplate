import { MOString } from "../types/types";
import { BlockComponentIdentifier, DefaultBlockComponent, MinecraftBlockComponent } from "./blockComponents";
import { BlockState, BlockStateValue } from "./blockState";
import { BlockPermutation, BlockTraitIdentifier, MinecraftBlock, MinecraftBlockStates, MinecraftBlockTraits } from "./interface";
import { BlockPlugin } from "./plugins/type";

/** This class is used to create blocks */
export class CustomBlockBuilder {
    identifier: string
    permutations: BlockPermutation[]
    components: Partial<MinecraftBlockComponent>;
    blockState: MinecraftBlockStates
    traits: Partial<MinecraftBlockTraits>


    constructor(identifier: string) {
        this.identifier = identifier;
        this.permutations = [];
        this.blockState = {};
        this.traits = {}
        this.components = {}
    }

    
    
    getBlock() :MinecraftBlock {
        const description = {
            identifier: this.identifier,
            traits: this.traits,
            states: this.blockState
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

    setTrait<K extends BlockTraitIdentifier>(
        key: K,
        value: MinecraftBlockTraits[K]
    ): this;
    
    setTrait(key: string, value: any) {
        this.traits[key] = value;
        return this;
    }

    getTrait<K extends BlockTraitIdentifier>(
        key: K
    ): MinecraftBlockTraits[K] | undefined;


    getTrait(key: string) {
        return this.traits[key];
    }

    setState(
        key: string,
        value: BlockStateValue
    ): this;
    
    setState(key: string, value: BlockStateValue) {
        this.blockState[key] = value;
        return this;
    }

    
    getState(
        key: string
    ): BlockStateValue | undefined;


    getState(key: string) {
        return this.blockState[key];
    }
    

}
