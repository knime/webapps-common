import type { ConsolaInstance } from "consola";

declare global {
  const consola: ConsolaInstance;

  interface Window {
    consola: ConsolaInstance;
  }
}
