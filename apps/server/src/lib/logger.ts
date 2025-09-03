// logger.ts
export function log(message: string, meta?: any) {
  console.log(`[LOG] ${message}`, meta || '');
}
