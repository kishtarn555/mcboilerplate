import { MinecraftBlock } from "../block/customBlock";
import { TranslatableEntity } from "../language/entity";

import { BehaviourPackDefinition } from "../types/types";

type PathContentPair = {
    relativePath:string,
    content: string
}
export class ProjectManager {
    namespace: string;
    blocks: MinecraftBlock[]
    definition: BehaviourPackDefinition
    translations: TranslatableEntity[]
    constructor(namespace: string, definition: BehaviourPackDefinition) {
        this.namespace = namespace;
        this.blocks = [];
        this.translations = [];
        this.definition = definition;
    }

    addBlock(block: MinecraftBlock) {
        this.blocks.push(block);
    }

    private solveTranslationKeys(target: any): any {
        if (Array.isArray(target)) {
            return target.map(item => this.solveTranslationKeys(item));
        }

        if (target && typeof target === "object") {
            // If this is directly a Translatable
            if ("translationKey" in target) {
                const translatable = target as TranslatableEntity;
                return translatable.translationKey;
            }

            // Otherwise, recurse through children
            const result: Record<string, any> = {};
            for (const [key, value] of Object.entries(target)) {
                result[key] = this.solveTranslationKeys(value);
            }
            return result;
        }

        // primitive value, leave as is
        return target;
    }

    generateManifest(): PathContentPair {
        return {
            relativePath: "behaviourpack/manifest.json",
            content: JSON.stringify(this.solveTranslationKeys(this.definition), null, 2)
        };
        
    }

    * generateBehaviourPack(): Generator<PathContentPair> {        
        // write manifest
        yield this.generateManifest();
    }

    * generateFiles() : Generator<PathContentPair> {        
        yield* this.generateBehaviourPack();
    }
}