import { MinecraftBlockComponent } from "./types/blockComponents";

type MOString = string;

export interface MinecraftObjectable<T> {
    /**
     * Converts the object to a Minecraft-compatible format.
     * @returns A minecraft object that can be passed to JSON and understood by Minecraft.
     */
    toMinecraftObject: () => T;
}



type MinecraftBlockStates = {
    [key: string]: string | number | boolean
};

type MinecraftBlockTraits = {
    "minecraft:placement_direction"?: {
        enabled_states: (
            "minecraft:cardinal_direction" |
            "minecraft:facing_direction"
        )[];
        y_rotation_offset: number; // Number between 0 and 360
    },
    "minecraft:placement_position": {
        enabled_states: (
            "minecraft:block_face" |
            "minecraft:vertical_half"
        )[];
    }
}

export type MinecraftBlock = {
    format_version: "1.21.100",
    "minecraft:block": {
        description: {
            identifier: string,
            menu_category?: {
                category: string,
                group: string,
                is_hidden_in_commands: boolean
            },
            states?: MinecraftBlockStates,
            traits?: MinecraftBlockTraits,
        }
        components?: MinecraftBlockComponent 
        permutations?: {
            condition: MOString
            components: MinecraftBlockComponent
        }[]
    },

}
