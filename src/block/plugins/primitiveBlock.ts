import { MCB_MaterialInstance } from "../blockComponents";
import { BlockPlugin } from "./type";

export const primitiveBlock = (texture: string | MCB_MaterialInstance) :BlockPlugin => {
    return (target)=> {
        target.setComponent("minecraft:geometry", "minecraft:geometry.full_block");
        if (typeof texture === "string") {
            target.setComponent(
                "minecraft:material_instances", 
                {
                    "*": {
                        texture
                    }
                }
            );
        } else {            
            target.setComponent(
                "minecraft:material_instances",
                texture
            );
        }
    };
};