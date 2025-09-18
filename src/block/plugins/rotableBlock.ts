import { BlockPermutation } from "../interface";
import { BlockPlugin } from "./type";


type RotationOptions = {
    basedOn: "player_location" 
     mode: "cardinal" | "direction"
} | 
{    
    basedOn: "block_face"    
};


const rotations: {[key:string] :[number, number, number]} = {
    'north':    [0, 0, 0] ,
    'east':     [0, 270, 0],
    'south':    [0, 180, 0],
    'west':     [0, 90, 0],
    'up':       [270, 0, 0],
    'down':     [90, 0, 0],

} ;

export const rotatableBlocks = (rotationOptions: RotationOptions ) :BlockPlugin => {
    return (target)=> {
        if (rotationOptions.basedOn === "player_location") {
            const mode = rotationOptions.mode === "cardinal" ? "minecraft:cardinal_direction" : "minecraft:facing_direction";
            target.setTrait(
                "minecraft:placement_direction",
                {
                    enabled_states: [mode] ,
                    y_rotation_offset: 180
                }
            );

            const dirs =  rotationOptions.mode === "cardinal" ? (["north", "east", "west", "south"] as const) : (["north", "east", "west", "south", "up", "down"] as const)
            
            if (target.permutations.length === 0) {
                for (const dir of dirs) {
                    target.permutations.push({
                        condition: `q.block_state('${mode}') == '${dir}'` ,
                        components: {
                            "minecraft:transformation": {
                                rotation: rotations[dir]
                            }
                        }
                    })
                }    
            } else {
                target.permutations = target.permutations.flatMap(
                    perm => {
                        
                        return dirs.map(dir=>  ({
                            condition: `(${perm.condition}) && q.block_state('${mode}') == '${dir}'`,                            
                            components: {
                                ...perm.components,
                                "minecraft:transformation": {
                                    ...perm.components["minecraft:transformation"],
                                    rotation: rotations[dir]
                                }
                            }
                        }) as BlockPermutation  )
                    }
                )
            }
        }
        

    };
};

