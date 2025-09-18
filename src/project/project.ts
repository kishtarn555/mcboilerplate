import { CustomBlockBuilder } from "../block/customBlockBuilder";
import { MinecraftBlock } from "../block/interface";
import { TranslatableEntity } from "../language/entity";

import { BehaviourPackDefinition, CustomModule, ProjectDefinition, ResourcePackDefinition, ServerModule } from "../types/types";

export type PathContentPair = {
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

    addBlock(block: MinecraftBlock | CustomBlockBuilder) {
        let resolved: MinecraftBlock;
        if (block instanceof CustomBlockBuilder) {
            resolved = block.getBlock();
            // Call side artifacts the block might want to generate such as translations
            block.NotifyBlockRegister(this);
        } else {
            resolved = block;
        }
        this.blocks.push(resolved);
    }

    addTranslation(translation:TranslatableEntity) {
        this.translations.push(translation);
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

    

    private * generateBlocks(): Generator<PathContentPair> {
        for (const block of this.blocks) {            
            const fileName = block["minecraft:block"].description.identifier.split(":")[1];

            yield {
                content: JSON.stringify(block),
                relativePath: `behaviourpack/blocks/generated/${fileName}.json`
            };
            
        }
    }

    private * generateBehaviourPack(): Generator<PathContentPair> {        
        yield * this.generateBlocks();
    }

    private * generateLangFiles(): Generator<PathContentPair> {
        const languages: Set<string>  = new Set()
        for (const translation of this.translations) {
            for (const key in translation.translations) {
                languages.add(key);
            }
        }

        for (const language of languages) {
            const path = `resourcepack/texts/${language}.lang`;
            const content = [];
             for (const translation of this.translations) {
                if (language in translation.translations) {
                    content.push(`${translation.translationKey}=${translation.translations[language]}`)
                }
            }
            if (content.length === 0) {
                continue;
            }
            yield {
                content: content.join("\n"),
                relativePath: path
            };
        }
    }

    private * generateResourcePack(): Generator<PathContentPair> {
        yield * this.generateLangFiles();
    }

    * generateFiles() : Generator<PathContentPair> {        
        yield * this.generateManifests();
        yield* this.generateBehaviourPack();
        yield* this.generateResourcePack();
    }
}