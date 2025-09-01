// filepath: c:\Users\hec_m\Repos\MinecraftAddons\MCBoiler\src\main.ts
function greet(name: string): string {
    return `Hello, ${name}! Welcome to MCBoilerplate.`;
}

const playerName: string = "Steve";
console.log(greet(playerName));

export { greet };