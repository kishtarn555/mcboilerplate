import { TranslatableEntity } from "../language/entity";
import { MOString } from "../types/types";


type LocalizedString = string;

/** A box-shaped component */
type MBC_Box = {
    size: [number, number, number],
    origin: [number, number, number]
}
/** Crafting table */
type MBC_CraftingTable = {
    crafting_tags: string[],
    table_name: LocalizedString
}
/** Crafting table */
type MCB_DestructibleByExplosion = {
    explosion_resistance: number
}

type MCB_Geometry = {
    bone_visibility?: {[key:string]: boolean | MOString}
    culling?: string
    identifier: string,
    uv_lock?: boolean
}

export type MCB_MaterialInstance = {
    [key: "*"|"north"|"south"|"west"|"east"|string]: {
        texture: string,
        ambient_occlusion?: number
        face_dimming?: boolean
        isotropic?: boolean
        render_method?: "opaque" | "double_sided" | "blend" | "alpha_test" | "alpha_test_single_sided" | "blend_to_opaque" | "alpha_test_to_opaque" | "alpha_test_single_sided_to_opaque"
    } | string
}

type MCB_Transformation = {
    rotation?: [number, number, number],
    rotation_pivot?: [number, number],
    scale?: [number, number],
    scale_pivot?: [number, number],
    translation?: [number, number],
}

type MCB_MapColor = {
    color: string
    tint_method?:string
}

export type DefaultBlockComponent = {
    "minecraft:collision_box": MBC_Box | boolean
    "minecraft:selection_box": MBC_Box | boolean
    "minecraft:crafting_table": MBC_CraftingTable
    "minecraft:destructible_by_explosion": MCB_DestructibleByExplosion | boolean
    "minecraft:display_name": string | TranslatableEntity,
    "minecraft:geometry": MCB_Geometry | string
    "minecraft:material_instances": MCB_MaterialInstance
    "minecraft:transformation": MCB_Transformation
    "minecraft:map_color": MCB_MapColor | string

};


export type BlockComponentIdentifier = keyof DefaultBlockComponent;


export type MinecraftBlockComponent = DefaultBlockComponent & {
    [key in string as key extends BlockComponentIdentifier ? never : key]: any
};
