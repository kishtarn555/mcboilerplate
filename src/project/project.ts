import { MinecraftBlock } from "../block/interface";
import { TranslatableEntity } from "../language/entity";

import { BehaviourPackDefinition, CustomModule, ProjectDefinition, ResourcePackDefinition, ServerModule } from "../types/types";

type PathContentPair = {
    relativePath:string,
    content: string
}
export class ProjectManager {
    namespace: string;
    blocks: MinecraftBlock[]
    definition: ProjectDefinition
    translations: TranslatableEntity[]
    constructor(namespace: string, definition: ProjectDefinition) {
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

    private getBehaviourPack(): BehaviourPackDefinition {
        if (
            this.definition.behaviour.version == null && this.definition.version == null
        ) {
            throw new Error("No version found in definition");
        }
        if (
            this.definition.behaviour.min_engine_version == null && this.definition.min_engine_version == null
        ) {
            throw new Error("No min_engine_version found in definition");
        }
        const version = this.definition.behaviour.version ?? this.definition.version;
        const dependencies: (ServerModule | CustomModule )[] = [
            {
                "module_name": "@minecraft/server",
                "version": "2.1.0"
            }
        ];
        if (this.definition.behaviourDependsOnResource) {
            dependencies.push({
                    uuid: this.definition.resource.uuid,
			        version: this.definition.resource.version ?? this.definition.version
            });
        }
        return {
            format_version: 2,
            header: {
                name: this.definition.behaviour.name,
                description: this.definition.behaviour.description,
                uuid: this.definition.behaviour.uuid,
                version: version,                
                min_engine_version: this.definition.behaviour.min_engine_version ?? this.definition.min_engine_version
            },
            dependencies: dependencies,
            modules: [
                {
                    type: "script",
                    language: "javascript",
                    description: "Script resources",
                    entry: "scripts/main.js",
                    version: version,
                    uuid: this.definition.behaviour.script_uuid
                },
                {
                    type: "data",
                    uuid: this.definition.behaviour.data_uuid,
                    version: version
                }            
            ]
        }
    }

    private getResourcePack(): ResourcePackDefinition {
        if (
            this.definition.resource.version == null && this.definition.version == null
        ) {
            throw new Error("No version found in definition");
        }
        if (
            this.definition.resource.min_engine_version == null && this.definition.min_engine_version == null
        ) {
            throw new Error("No min_engine_version found in definition");
        }
        const version = this.definition.resource.version ?? this.definition.version;
        return {
            format_version: 2,
            header: {
                name: this.definition.resource.name,
                description: this.definition.resource.description,
                uuid: this.definition.resource.uuid,
                version: version,                
                min_engine_version: this.definition.resource.min_engine_version ?? this.definition.min_engine_version
            },
            modules: [
                {
                    type: "resources",                    
                    version: version,
                    uuid: this.definition.resource.resource_uuid
                }
            ]
        }
    }

    private generateManifests(): PathContentPair[] {
        const behaviourPackDefinition = this.getBehaviourPack();
        const resourcePackDefinition = this.getResourcePack();
        return [
            {
                relativePath: "behaviourpack/manifest.json",
                content: JSON.stringify(this.solveTranslationKeys(behaviourPackDefinition), null, 2)
            },
            {
                relativePath: "resourcepack/manifest.json",
                content: JSON.stringify(this.solveTranslationKeys(resourcePackDefinition), null, 2)
            }
        ];
        
    }

    * generateBlocks(): Generator<PathContentPair> {
        for (const block of this.blocks) {            
            const fileName = block["minecraft:block"].description.identifier.split(":")[1];

            yield {
                content: JSON.stringify(block),
                relativePath: `behaviourpack/blocks/generated/${fileName}`
            };
            
        }
    }

    * generateBehaviourPack(): Generator<PathContentPair> {        
        yield * this.generateBlocks();
    }

    * generateFiles() : Generator<PathContentPair> {        
        yield * this.generateManifests();
        yield* this.generateBehaviourPack();
    }
}