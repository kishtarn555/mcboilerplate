export type BlockStateValue =  [true] | [false, true] | [false] | [false, true] // Booleans
    | number[] | string[]
    | {
        min:number,
        max:number
    }

export class BlockState {
    identifier: string
} 


