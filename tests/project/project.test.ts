import { ProjectManager } from "../../src/project/project";
import { BehaviourPackDefinition } from "../../src/types/types";

describe("ProjectManager", () => {
  it("generates manifest with solved translation keys", () => {
    const def: BehaviourPackDefinition = {
      format_version: 2,
      header: {
        name: {
          translationKey: "package.name",
          translations: {
            en_US: "MyCoolPacakge"
          }
        },
        description: {
          translationKey: "package.description",
          translations: {
            en_US: "Lol",

          } 
        },
        min_engine_version: [
          1, 20, 100
        ],
        uuid: "1a1bfebd-d37b-435f-bb2e-6a368049799f",
        version: [1, 0,0]
      },
      dependencies:[],
      modules:[]
    };

    const pm = new ProjectManager("mynamespace", def);
    const manifest = pm.generateManifest();

    expect(manifest.relativePath).toBe("behaviourpack/manifest.json");
    console.log(manifest.content)
  });
});