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
    language: "javascript",
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
type ResourceModule = {
    type: "resources"
    uuid: string,
    version: [number, number, number],
}


export type ServerModule= {
    module_name:"@minecraft/server",
    version:"2.1.0"    
}
export type CustomModule = {    
    uuid:string,
    version: [number, number, number]
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
    dependencies: (ServerModule|CustomModule)[]
}
export interface ResourcePackDefinition {
    format_version: 2,
    header: {
		name: string | TranslatableEntity,
		description: string | TranslatableEntity,
		min_engine_version: [number, number, number],
		uuid: string,
		version: [number, number, number],
	},
	modules: [
		ResourceModule
	]
}


export interface ProjectDefinition {
    behaviourDependsOnResource: boolean;
    version?: [number, number, number];
    min_engine_version?: [number, number, number];
    behaviour: {
        name: string | TranslatableEntity,
        description: string | TranslatableEntity,
        uuid: string
        version?: [number, number, number],
        min_engine_version?: [number, number, number];
        script_uuid: string
        data_uuid: string
    }
    resource: {
        name: string | TranslatableEntity,
        description: string | TranslatableEntity,
        uuid: string
        version?: [number, number, number],
        min_engine_version?: [number, number, number];
        resource_uuid: string
    }
}