import { TranslatableEntity } from "../language/entity";

export type MOString = string;

export interface MinecraftObjectable<T> {
    /**
     * Converts the object to a Minecraft-compatible format.
     * @returns A minecraft object that can be passed to JSON and understood by Minecraft.
     */
    toMinecraftObject: () => T;
}

export interface BehaviourPackDefinition {
    format_version: 2,
    header: {
        name: string,
        description: string | TranslatableEntity,
        min_engine_version: [number, number, number],
        uuid:string,
        version: [string, string, string]
    },
    modules: [],
    dependencies: {
        module_name:string,
        version:string
    }[]
}