import { MOString } from "../types/types";
import { MinecraftBlockComponent } from "./blockComponents";
import { BlockStateValue } from "./blockState"

type MinecraftBlockStates = {
    [key: string]: BlockStateValue
}

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

/** Defines the expected structure of a Minecraft Block JSON */
export interface MinecraftBlock {
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