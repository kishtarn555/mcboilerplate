import { BlockPlugin } from "./type";

export const primitiveBlock = (texture: string) :BlockPlugin => {
    return (target)=> {
        target.setComponent("minecraft:geometry", "minecraft:geometry.full_block");
        target.setComponent(
            "minecraft:material_instances", 
            {
                "*": {
                    texture
                }
            }
        );
    };
};