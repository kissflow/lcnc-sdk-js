export * from "./client";
export * from "./formatter";
export * from "./validation";


export const isObject = (value: any) => value !== null && typeof value === 'object'