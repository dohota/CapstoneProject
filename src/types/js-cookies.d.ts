declare module 'js-cookies' {
    export function get(name: string): string | undefined;
    export function set(name: string, value: string, options?: { expires?: number | Date; path?: string }): void;
    export function remove(name: string, options?: { path?: string }): void;
    
}
