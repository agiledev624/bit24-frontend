export function sleep<T extends any>(ms: number): Promise<T> {
  return new Promise(resolve => setTimeout(resolve, ms))
}