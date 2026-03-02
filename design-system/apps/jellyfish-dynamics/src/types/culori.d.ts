declare module 'culori' {
  export function parseHex (hex: string): unknown
  export function oklch (color: unknown): { l: number, c: number, h: number } | null
  export function formatCss (color: unknown): string
}
