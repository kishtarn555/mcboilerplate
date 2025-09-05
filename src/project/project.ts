class ProjectManager {
    namespace: string;

    constructor(namespace: string) {
        this.namespace = namespace;
    }

    solveIdentifier(identifier:string): string {
        if (identifier.startsWith(`${this.namespace}:`)) {
            return identifier;
        }
        return `${this.namespace}:${identifier}`;
    }
}