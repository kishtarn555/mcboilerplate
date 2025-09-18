import { TranslatableEntity } from "../../language/entity";
import { BlockPlugin } from "./type";

export const namedBlock = (name: string | TranslatableEntity) :BlockPlugin => {
    return (target)=> {
        target.setComponent("minecraft:display_name", typeof name === "string"? name: name.translationKey);
        if (typeof name !== "string") {
            target.AddBlockRegisterObserver((
                _, target
            ) => target.addTranslation(name));
        }
    };
};