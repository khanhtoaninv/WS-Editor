// Khai báo tối thiểu cho node:test / node:assert (không cài @types/node: không thêm thư viện).
declare module 'node:test' { export function test(name: string, fn: () => void | Promise<void>): void; }
declare module 'node:assert/strict' {
  const assert: { (v: unknown, msg?: string): void; ok(v: unknown, msg?: string): void; equal(a: unknown, b: unknown, msg?: string): void; deepEqual(a: unknown, b: unknown, msg?: string): void; match(s: string, re: RegExp, msg?: string): void; };
  export default assert;
}
declare module 'node:fs' { export function readFileSync(p: string | URL, enc: string): string; export function readdirSync(p: string | URL): string[]; export function existsSync(p: string | URL): boolean; }
declare class URL { constructor(u: string, base?: string | URL); readonly href: string; }
interface ImportMeta { readonly url: string; }
declare module 'node:fs' { export function readFileSync(p: string | URL): Uint8Array; export function writeFileSync(p: string, d: string | Uint8Array): void; export function mkdirSync(p: string, o?: { recursive?: boolean }): void; export function statSync(p: string): { isDirectory(): boolean }; }
declare const process: { argv: string[]; exitCode: number | undefined; env: Record<string, string | undefined> };
