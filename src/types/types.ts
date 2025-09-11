import { TranslatableEntity } from "../language/entity";

export type MOString = string;

export interface MinecraftObjectable<T> {
    /**
     * Converts the object to a Minecraft-compatible format.
     * @returns A minecraft object that can be passed to JSON and understood by Minecraft.
     */
    toMinecraftObject: () => T;
}

type ScriptModule = {
    description: string,
    language: string,
    type: "script"
    uuid: string,
    version: [number, number, number],
    entry: string
}
type DataModule = {
    type: "data"
    uuid: string,
    version: [number, number, number],
}
export interface BehaviourPackDefinition {
    format_version: 2,
    header: {
        name: string | TranslatableEntity,
        description: string | TranslatableEntity,
        min_engine_version: [number, number, number],
        uuid:string,
        version: [number, number, number]
    },
    modules: (ScriptModule | DataModule)[],
    dependencies: {
        module_name:string,
        version:string
    }[]
}