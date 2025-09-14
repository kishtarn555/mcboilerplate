import { PathContentPair } from "../project/project";

export class ExtensionProject {
    // Must match the export of the extension
    name: string;
    code: string;
    
    files: ()=> Generator<PathContentPair>;


}