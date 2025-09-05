import { MinecraftBlock } from "../block/customBlock";
import { TranslatableEntity } from "../language/entity";
import fs from "fs"
import { BehaviourPackDefinition } from "../types/types";
export class ProjectManager {
    namespace: string;
    blocks: MinecraftBlock[]
    translations: TranslatableEntity[]
    definition: BehaviourPackDefinition
    constructor(namespace: string, definition: BehaviourPackDefinition) {
        this.namespace = namespace;
        this.blocks = [];
        this.translations = [];
        this.definition = definition;
    }

    addBlock(block: MinecraftBlock) {
        this.blocks.push(block);
    }

    private solveIdentifier(identifier:string): string {
        if (identifier.startsWith(`${this.namespace}:`)) {
            return identifier;
        }
        return `${this.namespace}:${identifier}`;
    }

    generate(path: string) {


    }
}